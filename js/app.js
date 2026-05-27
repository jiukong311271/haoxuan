// 好选 APP v2 — AMap + 五维度匹配引擎
var currentTab='home',friendsRendered=false,profileRendered=false,map=null,amapLoaded=false;

function $(id){return document.getElementById(id)}

// ==================== 首页渲染 ====================
function renderHome(){
  var feed=$('feedList'),chips=$('categoryChips');
  CATEGORIES.forEach(function(c){
    var el=document.createElement('span');
    el.className='chip'+(c.key==='all'?' active':'');
    el.textContent=(c.icon?c.icon+' ':'')+c.label;
    el.onclick=function(){chips.querySelectorAll('.chip').forEach(function(x){x.classList.remove('active')});el.classList.add('active');};
    chips.appendChild(el);
  });
  VENUES.forEach(function(v){
    var card=document.createElement('div');card.className='activity-card';
    card.innerHTML='<div class="card-img" style="background:'+v.bg+';">'+
      '<span class="card-emoji">'+v.emoji+'</span>'+
      '<span class="img-tag" style="display:flex;gap:4px;">'+(v.tagLabels||[]).slice(0,3).map(function(t){return '<span style="background:rgba(255,255,255,.3);padding:2px 6px;border-radius:6px;font-size:10px;">'+t+'</span>'}).join('')+'</span>'+
      '</div><div class="card-body"><div class="card-title">'+v.name+'</div>'+
      '<div class="card-meta"><span>📍 '+v.dist+'</span><span>💰 '+v.price+'</span><span>🏷 '+v.type+'</span></div></div>';
    card.onclick=function(){ENGINE.soloMatch('').slice(0,1).forEach(function(r){alert('🎯 AI匹配结果\n\n🏆 '+r.name+'\n📍 '+r.dist+' · '+r.price+'\n💡 '+r.reason+'\n📊 匹配度 '+r.matchPercent+'%');});};
    feed.appendChild(card);
  });
}

// ==================== 朋友页 ====================
function renderFriends(){
  var online=$('onlineStrip');
  FRIENDS.forEach(function(f){
    online.innerHTML+='<div class="online-dot-item"><img class="od-avatar" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 60 60\'%3E%3Ccircle fill=\''+f.avatar+'\' cx=\'30\' cy=\'30\' r=\'30\'/%3E%3C/svg%3E"><span class="od-name">'+f.name+'</span></div>';
  });
  var list=$('friendList');
  FRIENDS.forEach(function(f){
    list.innerHTML+='<div class="friend-item"><div class="fi-avatar"><img class="fi-avatar-img" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 48 48\'%3E%3Ccircle fill=\''+f.avatar+'\' cx=\'24\' cy=\'24\' r=\'24\'/%3E%3C/svg%3E">'+(f.online?'<div class="online-dot"></div>':'')+'</div><div class="fi-info"><div class="fi-name">'+f.name+' <span class="tag '+f.tagClass+'">'+f.tag+'</span></div><div class="fi-bio">'+f.bio+'</div></div><button class="fi-action" onclick="quickMatch(\''+f.id+'\')">约TA</button></div>';
  });
}

function quickMatch(fid){
  var f=FRIENDS.find(function(x){return x.id===fid});
  if(!f)return;
  var r=ENGINE.matchGroup([f],'').slice(0,3);
  var msg=r.map(function(x){return x.emoji+' '+x.name+' ('+x.matchPercent+'%)\n'+x.reason}).join('\n\n');
  alert('🤝 和 '+f.name+' 的匹配结果\n\n'+msg);
}

// ==================== 我的页 ====================
function renderProfile(){
  var menu=$('menuSection');
  MENU_GROUPS.forEach(function(g){
    var group=document.createElement('div');group.className='menu-group';
    g.forEach(function(m){
      group.innerHTML+='<div class="menu-item"><div class="mi-icon" style="background:'+m.bg+';">'+m.icon+'</div><span class="mi-text">'+m.text+'</span>'+(m.badge?'<span class="mi-badge">'+m.badge+'</span>':'')+'<span class="mi-arrow">›</span></div>';
    });
    menu.appendChild(group);
  });
}

// ==================== AI对话框 ====================
function showAIInput(){
  var input=prompt('🤖 告诉AI你的需求（自然语言）：\n\n例如："想吃川菜，要包厢，最好能带狗"\n或："换一家，火锅吃腻了"');
  if(!input)return;
  var results=$('aiResults');results.innerHTML='<div style="padding:12px;text-align:center;color:#888;">🤖 AI思考中...</div>';
  ENGINE.parseIntent(input,function(err,data){
    if(err){results.innerHTML='<div style="padding:12px;color:#c0392b;">网络异常，请稍后重试</div>';return;}
    var intent=ENGINE.parseGeminiResult(data);
    if(!intent){results.innerHTML='<div style="padding:12px;color:#c0392b;">AI解析失败，请换个说法试试</div>';return;}
    // 用解析出的意图做匹配
    var tempFriend={name:'AI推荐',dim1:intent.dim1||[],dim2:intent.dim2||[],dim3:intent.dim3||[],dim4:intent.dim4||{},dim5:intent.dim5||[]};
    var matches=ENGINE.matchGroup([tempFriend],input);
    results.innerHTML='<div class="section-title">🤖 AI 理解你的需求</div>';
    var tags=[].concat(intent.dim1||[],intent.dim2||[],intent.dim3||[],intent.dim5||[]);
    results.innerHTML+='<div class="chips" style="padding:0 24px 8px;">'+tags.slice(0,6).map(function(t){return '<span class="chip active">'+t+'</span>'}).join('')+'</div>';
    results.innerHTML+='<div class="section-title" style="padding:0 24px;">匹配结果</div>';
    matches.slice(0,3).forEach(function(r){
      results.innerHTML+='<div class="map-activity-row" style="padding:12px 24px;" onclick="alert(\'🏆 '+r.name+'\\n📍 '+r.dist+' · '+r.price+'\\n💡 '+r.reason+'\\n📊 '+r.matchPercent+'%\')"><div class="ma-icon" style="background:'+r.bg+';">'+r.emoji+'</div><div class="ma-info"><div class="ma-title">'+r.name+' <span class="tag tag-primary">'+r.matchPercent+'%</span></div><div class="ma-meta">'+r.dist+' · '+r.price+' · '+r.reason+'</div></div><div class="ma-dist">'+r.matchPercent+'%</div></div>';
    });
  });
}

// ==================== Tab 导航 ====================
function switchTab(tab){
  currentTab=tab;
  ['home','map','friends','profile'].forEach(function(t){
    var s=$('screen-'+t); if(s)s.classList.remove('active');
  });
  var splash=$('splash-screen'); if(splash)splash.classList.remove('active');
  var target=$('screen-'+tab); if(target)target.classList.add('active');
  document.querySelectorAll('.tab-item').forEach(function(el,i){
    el.classList.toggle('active',['home','map','friends','profile'].indexOf(tab)===i);
  });
  if(tab==='friends'&&!friendsRendered){renderFriends();friendsRendered=true;}
  if(tab==='profile'&&!profileRendered){renderProfile();profileRendered=true;}
  if(tab==='map'){setTimeout(function(){initMap();},300);}
}

// ==================== 地图（高德优先，Leaflet兜底） ====================
var mapRetry=0;
function initMap(){
  if(map)return;
  var el=$('map-container'); if(!el)return;

  // 高德地图可用
  if(typeof AMap!=='undefined'){
    try{
      map=new AMap.Map('map-container',{zoom:13,center:[120.155,30.274],viewMode:'2D'});
      map.setDefaultCursor('pointer');
      MAP_PINS.forEach(function(p){
        var content='<div style="padding:4px 8px;background:#fff;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:12px;white-space:nowrap;border-left:3px solid '+p.color+';">'+p.label+'</div>';
        var marker=new AMap.Marker({position:[p.lng,p.lat],content:content,offset:new AMap.Pixel(0,-20)});
        marker.on('click',function(){map.setZoomAndCenter(16,[p.lng,p.lat]);});
        marker.setMap(map);
      });
      renderMapInfo();
      return;
    }catch(e){console.log('AMap error:',e);}
  }

  // 重试高德（最多等3秒）
  if(mapRetry<6){mapRetry++;setTimeout(initMap,500);return;}

  // 高德不可用，加载Leaflet兜底
  if(typeof L==='undefined'){
    var css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    var js=document.createElement('script');js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload=initLeafletMap;document.head.appendChild(css);document.head.appendChild(js);
  }else{initLeafletMap();}
}

function initLeafletMap(){
  if(map)return;
  var el=$('map-container');el.innerHTML='';
  map=L.map(el,{zoomControl:true,attributionControl:false}).setView([30.274,120.155],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  MAP_PINS.forEach(function(p){
    var icon=L.divIcon({html:'<div style="width:32px;height:32px;background:'+p.color+';border-radius:50%50%50%0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.2);border:3px solid #FFF;"></div>',iconSize:[32,32],iconAnchor:[16,32]});
    L.marker([p.lat,p.lng],{icon:icon}).addTo(map).bindPopup('<b>'+p.label+'</b><br>'+p.detail).on('click',function(){map.flyTo([p.lat,p.lng],16,{duration:0.8});});
  });
  renderMapInfo();
}

function renderMapInfo(){
  var card=$('mapInfoCard');
  VENUES.forEach(function(v,i){
    card.innerHTML+='<div class="map-activity-row" onclick="alert(\'🏆 '+v.name+'\\n📍 '+v.dist+' · '+v.price+'\\n🏷 '+v.tagLabels.join(\' · \')+'\')"><div class="ma-icon" style="background:'+v.bg+';">'+v.emoji+'</div><div class="ma-info"><div class="ma-title">'+v.name+'</div><div class="ma-meta">'+v.dist+' · '+v.price+'</div></div><div class="ma-dist">'+(1.2+i*1.3).toFixed(1)+'km</div></div>';
  });
}

function locateMe(){
  if(map){map.plugin('AMap.Geolocation',function(){var geo=new AMap.Geolocation();geo.getCurrentPosition(function(s,r){if(s==='complete')map.setCenter([r.position.lng,r.position.lat]);});});}
}

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded',function(){
  renderHome();
  $('splash-screen').querySelector('.btn-primary').onclick=function(){
    $('splash-screen').classList.remove('active');
    $('screen-home').classList.add('active');
  };
  document.querySelectorAll('.tab-item').forEach(function(el){
    el.onclick=function(){var tab=el.getAttribute('data-tab');if(tab)switchTab(tab);};
  });
  // 首页AI输入条
  var homeScreen=$('screen-home');
  var aiBar=document.createElement('div');
  aiBar.className='ai-input-bar';
  aiBar.innerHTML='<span>🤖 AI智能匹配</span><span style="font-size:12px;color:#aaa;">告诉我你的需求...</span>';
  aiBar.onclick=showAIInput;
  aiBar.style.cssText='margin:0 24px 12px;padding:12px 18px;background:#fff;border-radius:16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.06);border:1.5px dashed #ddd;';
  var feedList=$('feedList');
  homeScreen.insertBefore(aiBar,feedList);
  // AI结果容器
  var aiResults=document.createElement('div');aiResults.id='aiResults';
  aiResults.style.cssText='margin-bottom:12px;';
  homeScreen.insertBefore(aiResults,feedList);
});
