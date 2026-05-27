// 好选 APP — 核心逻辑

var currentTab = 'home';
var friendsRendered = false;
var profileRendered = false;
var map = null;

// ==================== 工具函数 ====================
function $(id) { return document.getElementById(id); }

// ==================== 页面渲染 ====================
function renderHome() {
  var feed = $('feedList');
  var chips = $('categoryChips');

  // 分类 Chips
  APP_DATA.categories.forEach(function(c) {
    var el = document.createElement('span');
    el.className = 'chip' + (c.key === 'all' ? ' active' : '');
    el.textContent = (c.icon ? c.icon + ' ' : '') + c.label;
    el.onclick = function() {
      chips.querySelectorAll('.chip').forEach(function(x) { x.classList.remove('active'); });
      el.classList.add('active');
    };
    chips.appendChild(el);
  });

  // 活动卡片
  APP_DATA.activities.forEach(function(a) {
    var avatars = a.avatars.map(function(c) {
      return '<img class="mini-avatar" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle fill=\'' + c + '\' cx=\'20\' cy=\'20\' r=\'20\'/%3E%3C/svg%3E">';
    }).join('');

    var card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML =
      '<div class="card-img" style="background:' + a.bg + ';">' +
        '<span class="card-emoji">' + a.emoji + '</span>' +
        '<span class="img-tag">' + a.status + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-title">' + a.title + '</div>' +
        '<div class="card-meta"><span>📅 ' + a.date + '</span><span>📍 ' + a.location + '</span><span>💰 ' + a.price + '</span></div>' +
      '</div>' +
      '<div class="card-footer">' +
        '<span>' + avatars + '<span class="join-count">' + a.joined + '/' + a.total + '人</span></span>' +
        '<span class="tag ' + a.tagClass + '">' + a.tag + '</span>' +
      '</div>';
    card.onclick = function() { alert('📌 ' + a.title + '\n\n📍 ' + a.location + '\n📅 ' + a.date + '\n💰 ' + a.price + '\n👥 ' + a.joined + '/' + a.total + '人'); };
    feed.appendChild(card);
  });
}

function renderFriends() {
  var online = $('onlineStrip');
  APP_DATA.onlineFriends.forEach(function(f) {
    online.innerHTML +=
      '<div class="online-dot-item">' +
        '<img class="od-avatar" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 60 60\'%3E%3Ccircle fill=\'' + f.color + '\' cx=\'30\' cy=\'30\' r=\'30\'/%3E%3C/svg%3E">' +
        '<span class="od-name">' + f.name + '</span>' +
      '</div>';
  });

  var list = $('friendList');
  APP_DATA.friends.forEach(function(f) {
    list.innerHTML +=
      '<div class="friend-item">' +
        '<div class="fi-avatar">' +
          '<img class="fi-avatar-img" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 48 48\'%3E%3Ccircle fill=\'' + f.color + '\' cx=\'24\' cy=\'24\' r=\'24\'/%3E%3C/svg%3E">' +
          (f.online ? '<div class="online-dot"></div>' : '') +
        '</div>' +
        '<div class="fi-info">' +
          '<div class="fi-name">' + f.name + ' <span class="tag ' + f.tagClass + '">' + f.tag + '</span></div>' +
          '<div class="fi-bio">' + f.bio + '</div>' +
        '</div>' +
        '<button class="fi-action">约TA</button>' +
      '</div>';
  });
}

function renderProfile() {
  var menu = $('menuSection');
  APP_DATA.menuGroups.forEach(function(g) {
    var group = document.createElement('div');
    group.className = 'menu-group';
    g.forEach(function(m) {
      group.innerHTML +=
        '<div class="menu-item">' +
          '<div class="mi-icon" style="background:' + m.bg + ';">' + m.icon + '</div>' +
          '<span class="mi-text">' + m.text + '</span>' +
          (m.badge ? '<span class="mi-badge">' + m.badge + '</span>' : '') +
          '<span class="mi-arrow">›</span>' +
        '</div>';
    });
    menu.appendChild(group);
  });
}

// ==================== Tab 导航 ====================
function switchTab(tab) {
  currentTab = tab;
  ['home','map','friends','profile','splash'].forEach(function(t) {
    $('screen-'+t).classList.remove('active');
  });
  $('screen-'+tab).classList.add('active');

  // 更新 Tab 选中态
  document.querySelectorAll('.tab-item').forEach(function(el, i) {
    el.classList.toggle('active', ['home','map','friends','profile'].indexOf(tab) === i);
  });

  // 首次渲染
  if (tab === 'friends' && !friendsRendered) { renderFriends(); friendsRendered = true; }
  if (tab === 'profile' && !profileRendered) { renderProfile(); profileRendered = true; }
  if (tab === 'map' && map) { setTimeout(function() { map.invalidateSize(); }, 300); }
}

// ==================== 地图 ====================
function initMap() {
  map = L.map('map-container', { zoomControl: true, attributionControl: false })
    .setView([30.274, 120.155], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  APP_DATA.mapPins.forEach(function(p) {
    var icon = L.divIcon({
      html: '<div style="width:32px;height:32px;background:' + p.color + ';border-radius:50%50%50%0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.2);border:3px solid #FFF;"></div>',
      iconSize: [32, 32], iconAnchor: [16, 32]
    });
    L.marker([p.lat, p.lng], { icon: icon }).addTo(map)
      .bindPopup('<b>' + p.label + '</b><br>' + p.detail + '<br><a href="javascript:void(0)" onclick="alert(\'📌 '+p.label+'\n\n'+p.detail+'\')">查看详情 →</a>')
      .on('click', function() { map.flyTo([p.lat, p.lng], 16, { duration: 0.8 }); });
  });

  renderMapInfo();
}

function renderMapInfo() {
  var card = $('mapInfoCard');
  APP_DATA.activities.forEach(function(a, i) {
    card.innerHTML +=
      '<div class="map-activity-row" onclick="alert(\'📌 ' + a.title + '\')">' +
        '<div class="ma-icon" style="background:' + a.bg + ';">' + a.emoji + '</div>' +
        '<div class="ma-info"><div class="ma-title">' + a.title.substring(0, 12) + '...</div><div class="ma-meta">' + a.date + ' · ' + a.joined + '/' + a.total + '人</div></div>' +
        '<div class="ma-dist">' + (1.2 + i * 1.3).toFixed(1) + 'km</div>' +
      '</div>';
  });
}

function locateMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15);
        L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map).bindPopup('📍 我的位置').openPopup();
      },
      function() { alert('定位失败，请允许位置权限'); }
    );
  } else { alert('浏览器不支持定位'); }
}

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', function() {
  renderHome();

  $('splash-screen').querySelector('.btn-primary').onclick = function() {
    $('splash-screen').classList.remove('active');
    $('screen-home').classList.add('active');
  };

  // Tab 点击
  document.querySelectorAll('.tab-item').forEach(function(el) {
    el.onclick = function() {
      var tab = el.getAttribute('data-tab');
      if (tab) switchTab(tab);
    };
  });

  // 首次切到地图时初始化
  var mapInited = false;
  var origSwitch = switchTab;
  switchTab = function(tab) {
    origSwitch(tab);
    if (tab === 'map' && !mapInited) { initMap(); mapInited = true; }
  };
});
