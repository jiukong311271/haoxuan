// ==================== 好选 — AI 匹配引擎 ====================
// 参考 miniprogram-1 engine.js + 五维度标签体系
// Gemini API 自然语言 → 五维度标签解析

var ENGINE = {

  // ---- 核心：五维度匹配 ----
  matchGroup: function(selectedFriends, contextInput) {
    var self = this;
    contextInput = contextInput || '';

    // Step 1: 汇总所有参与人的硬约束 (dim1)
    var allForbiddens = [];
    selectedFriends.forEach(function(f) {
      allForbiddens = allForbiddens.concat(f.dim1 || []);
    });
    if (USER_PROFILE.dim1_constraints) {
      allForbiddens = allForbiddens.concat(USER_PROFILE.dim1_constraints);
    }

    // Step 2: 硬过滤
    var results = VENUES.filter(function(venue) {
      var tags = venue.tags;
      // 海鲜过敏 + 店里有海鲜 → 淘汰
      if (allForbiddens.indexOf('ALLERGY_SEAFOOD') !== -1 && tags.is_seafood) return false;
      // 不欢迎宠物 + 店不欢迎宠物 → 淘汰
      if (allForbiddens.indexOf('NOT_PET_FRIENDLY') !== -1 && !tags.pet_friendly) return false;
      // 预算超限 → 淘汰
      var maxBudget = 0;
      selectedFriends.forEach(function(f) {
        if (f.dim4 && f.dim4.budget_max > maxBudget) maxBudget = f.dim4.budget_max;
      });
      if (USER_PROFILE.dim4_economics && USER_PROFILE.dim4_economics.budget_max > maxBudget) {
        maxBudget = USER_PROFILE.dim4_economics.budget_max;
      }
      if (maxBudget > 0 && tags.budget_per_pax > maxBudget) return false;
      return true;
    });

    // Step 3: 软打分
    results = results.map(function(venue) {
      var score = 0, reasons = [];
      selectedFriends.forEach(function(f) {
        // dim2: 偏好匹配
        (f.dim2 || []).forEach(function(p) {
          if (p === 'ACTIVITY_BOARDGAME' && venue.tags.activity === 'boardgame') { score += 15; reasons.push(f.name + '喜欢桌游'); }
          if (p === 'ACTIVITY_KTV' && venue.tags.activity === 'ktv') { score += 15; reasons.push(f.name + '喜欢K歌'); }
          if (p === 'VIBE_QUIET' && venue.tags.quiet_level === 'quiet') { score += 10; reasons.push(f.name + '喜欢安静'); }
          if (p === 'TASTE_LIGHT' && venue.tags.cuisine !== 'sichuan') { score += 5; }
          if (p === 'CUISINE_JAPANESE' && venue.tags.cuisine === 'japanese') { score += 15; }
          if (p === 'CUISINE_SICHUAN' && venue.tags.cuisine === 'sichuan') { score += 15; }
        });
        // dim3: 场景匹配
        (f.dim3 || []).forEach(function(c) {
          if (c === 'PET_FRIENDLY_DOG' && venue.tags.pet_friendly) { score += 12; reasons.push(f.name + '可带宠物'); }
          if (c === 'VIBE_LIVELY' && venue.tags.quiet_level === 'loud') { score += 10; }
          if (c === 'VIBE_ROMANTIC' && venue.tags.quiet_level === 'quiet') { score += 8; }
          if (c === 'LARGE_TABLE' && venue.tags.has_large_table) { score += 10; reasons.push('有大桌'); }
        });
        // dim4: 经济效率
        if (f.dim4 && f.dim4.tags) {
          f.dim4.tags.forEach(function(t) {
            if (t === 'NEAR_SUBWAY' && venue.tags.near_subway) { score += 8; reasons.push('近地铁'); }
            if (t === 'PARKING_EASY' && venue.tags.parking_easy) { score += 8; reasons.push('好停车'); }
          });
        }
      });
      // dim5: 情感/时序
      if (contextInput.indexOf('换一家') !== -1 && venue.name.indexOf('老马') !== -1) score -= 50;
      if (contextInput.indexOf('尝鲜') !== -1) score += 5;

      return {
        id: venue.id, name: venue.name, emoji: venue.emoji,
        type: venue.type, dist: venue.dist, price: venue.price,
        lat: venue.lat, lng: venue.lng, bg: venue.bg,
        tagLabels: venue.tagLabels,
        score: score,
        matchPercent: Math.min(99, 50 + score),
        reason: reasons.length > 0 ? reasons.slice(0, 3).join('、') : '综合评分最高',
        isMatch: score > 0
      };
    });

    return results.sort(function(a, b) { return b.score - a.score; });
  },

  // ---- Gemini API：自然语言 → 五维度标签 ----
  parseIntent: function(userInput, callback) {
    var GEMINI_KEY = 'AIzaSyAV9Jta5x-RCk2oJ-g0CX0v9q62060xidM';
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_KEY;
    var prompt = '你是偏好分析引擎。从以下标签库匹配用户意图。输出纯JSON(不要markdown代码块):\n' +
      '标签库: dim1(硬约束):ALLERGY_SEAFOOD,ALLERGY_PEANUT,LACTOSE_INTOLERANT,HALAL,VEGAN,WHEELCHAIR_ACCESS,SMOKE_FREE\n' +
      'dim2(偏好):CUISINE_SICHUAN,CUISINE_JAPANESE,CATEGORY_CAFE,CATEGORY_BAR,TASTE_SPICY_HIGH,TASTE_LIGHT,ACTIVITY_BOARDGAME,ACTIVITY_KTV,ACTIVITY_OUTDOOR\n' +
      'dim3(场景):NEED_PRIVATE_ROOM,LARGE_TABLE,VIBE_QUIET,VIBE_LIVELY,PET_FRIENDLY_DOG,KIDS_FRIENDLY\n' +
      'dim4(经济):BUDGET_PER_PAX_MAX,NEAR_SUBWAY,PARKING_EASY,OPEN_LATE_NIGHT\n' +
      'dim5(情感):NO_RECENT_VISIT,NO_SAME_CATEGORY,SEEK_NOVELTY,FEELING_SICK,NEED_RELAX\n' +
      '返回:{"dim1":[],"dim2":[],"dim3":[],"dim4":{"tags":[]},"dim5":[]}\n' +
      '用户输入:"' + userInput + '"';

    wx = (typeof wx !== 'undefined' ? wx : null);
    if (wx && wx.request) {
      // 小程序环境
      wx.request({ url: url, method: 'POST', data: {contents:[{parts:[{text:prompt}]}]},
        success: function(res) { callback(null, res.data); },
        fail: function(e) { callback(e); }
      });
    } else {
      // Web环境
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }).then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(e) { callback(e); });
    }
  },

  // ---- 解析 Gemini 返回结果 ----
  parseGeminiResult: function(data) {
    try {
      var text = data.candidates[0].content.parts[0].text;
      text = text.replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    } catch(e) {
      return null;
    }
  },

  // ---- 单人选址（无需选朋友） ----
  soloMatch: function(contextInput) {
    // 把自己的偏好转成"朋友"格式
    var meAsFriend = [{
      name: '我',
      dim1: USER_PROFILE.dim1_constraints || [],
      dim2: USER_PROFILE.dim2_preferences || [],
      dim3: USER_PROFILE.dim3_context || [],
      dim4: USER_PROFILE.dim4_economics || {},
      dim5: USER_PROFILE.dim5_emotional || []
    }];
    return this.matchGroup(meAsFriend, contextInput);
  }
};
