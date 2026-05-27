// ==================== 好选 — 五维度数据层 ====================

// ---- 用户偏好档案 (从五维度标签生成) ----
var USER_PROFILE = {
  name: '小李',
  dim1_constraints: ['ALLERGY_SEAFOOD'],
  dim2_preferences: ['CUISINE_SICHUAN','TASTE_SPICY_HIGH'],
  dim3_context: ['VIBE_QUIET','PET_FRIENDLY_DOG'],
  dim4_economics: { budget_max: 150, tags: ['NEAR_SUBWAY','PARKING_EASY'] },
  dim5_emotional: ['SEEK_NOVELTY']
};

// ---- 朋友数据 (每人自带五维度标签) ----
var FRIENDS = [
  { id:'f1',name:'小果',avatar:'%23FFB74D',online:true,
    dim1:['NOT_PET_FRIENDLY'], dim2:['ACTIVITY_BOARDGAME'], dim3:['PET_FRIENDLY_DOG'],
    dim4:{budget_max:100}, dim5:[], bio:'周末桌游搭子', tag:'桌游', tagClass:'tag-primary' },
  { id:'f2',name:'小林',avatar:'%234FC3F7',online:true,
    dim1:['ALLERGY_SEAFOOD'], dim2:['VIBE_QUIET','TASTE_LIGHT'], dim3:[],
    dim4:{budget_max:80,tags:['NEAR_SUBWAY']}, dim5:[], bio:'探店达人，美食搭子', tag:'美食', tagClass:'tag-accent' },
  { id:'f3',name:'大壮',avatar:'%23AED581',online:false,
    dim1:[], dim2:['CUISINE_JAPANESE','TASTE_SPICY_HIGH'], dim3:['VIBE_LIVELY'],
    dim4:{budget_max:200}, dim5:['SEEK_NOVELTY'], bio:'健身房常驻', tag:'健身', tagClass:'tag-primary' },
  { id:'f4',name:'小美',avatar:'%23E57373',online:false,
    dim1:['LACTOSE_INTOLERANT'], dim2:['CATEGORY_CAFE','TASTE_SWEET'], dim3:['VIBE_ROMANTIC'],
    dim4:{budget_max:120}, dim5:[], bio:'摄影爱好者，周末约拍', tag:'拍照', tagClass:'tag-accent' },
  { id:'f5',name:'阿杰',avatar:'%23BA68C8',online:true,
    dim1:[], dim2:['ACTIVITY_BOARDGAME','ACTIVITY_KTV'], dim3:['LARGE_TABLE'],
    dim4:{budget_max:150,tags:['PARKING_EASY']}, dim5:['NO_RECENT_VISIT'], bio:'狼人杀重度玩家', tag:'桌游', tagClass:'tag-primary' }
];

// ---- 商家数据库 (标签驱动匹配) ----
var VENUES = [
  { id:'v1',name:'喵喵桌游复合餐吧',emoji:'🎲',type:'混合空间',dist:'1.2km',price:'¥80',
    lat:30.274,lng:120.129, bg:'linear-gradient(135deg,#FFF0E0,#FFE0D0)',
    tags:{is_seafood:false,pet_friendly:true,quiet_level:'quiet',activity:'boardgame',cuisine:'western',
      has_private_room:true,has_large_table:true,near_subway:true,parking_easy:false,open_late:true,budget_per_pax:80},
    tagLabels:['桌游','宠物友好','安静','包厢'] },
  { id:'v2',name:'老马热辣火锅',emoji:'🍲',type:'餐饮',dist:'2.5km',price:'¥120',
    lat:30.281,lng:120.112, bg:'linear-gradient(135deg,#FFE8E8,#FFD0D0)',
    tags:{is_seafood:true,pet_friendly:false,quiet_level:'loud',activity:'dinner',cuisine:'sichuan',
      has_private_room:false,has_large_table:true,near_subway:false,parking_easy:true,open_late:true,budget_per_pax:120},
    tagLabels:['川菜','重辣','大桌','停车'] },
  { id:'v3',name:'绿洲 Oasis Bistro',emoji:'🌿',type:'轻食',dist:'0.8km',price:'¥85',
    lat:30.256,lng:120.140, bg:'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
    tags:{is_seafood:false,pet_friendly:true,quiet_level:'quiet',activity:'cafe',cuisine:'western',
      has_private_room:false,has_large_table:false,near_subway:true,parking_easy:true,open_late:false,budget_per_pax:85},
    tagLabels:['轻食','安静','地铁','宠物友好'] },
  { id:'v4',name:'山舍咖啡',emoji:'☕',type:'咖啡馆',dist:'1.0km',price:'¥68',
    lat:30.269,lng:120.118, bg:'linear-gradient(135deg,#EDE7F6,#D1C4E9)',
    tags:{is_seafood:false,pet_friendly:true,quiet_level:'quiet',activity:'cafe',cuisine:'cafe',
      has_private_room:true,has_large_table:false,near_subway:true,parking_easy:false,open_late:false,budget_per_pax:68},
    tagLabels:['咖啡','安静','包厢','宠物友好'] },
  { id:'v5',name:'湖畔日料亭',emoji:'🍣',type:'日料',dist:'3.8km',price:'¥180',
    lat:30.290,lng:120.170, bg:'linear-gradient(135deg,#FFF8E1,#FFE0B2)',
    tags:{is_seafood:true,pet_friendly:false,quiet_level:'quiet',activity:'dinner',cuisine:'japanese',
      has_private_room:true,has_large_table:false,near_subway:false,parking_easy:true,open_late:false,budget_per_pax:180},
    tagLabels:['日料','安静','包厢','高端'] }
];

// ---- 旧版兼容数据 ----
var CATEGORIES = [
  {key:'all',icon:'',label:'全部'},{key:'sport',icon:'🏃',label:'运动'},{key:'food',icon:'🍜',label:'美食'},
  {key:'game',icon:'🎮',label:'游戏'},{key:'photo',icon:'📷',label:'拍照'},{key:'travel',icon:'✈️',label:'旅行'}
];
var MENU_GROUPS = [
  [{id:'activities',icon:'📋',text:'我的活动',bg:'#FFF0E0'},{id:'bookings',icon:'📅',text:'我的预约',bg:'#E8F5E9'},{id:'bookmarks',icon:'⭐',text:'我的收藏',bg:'#EDE7F6'}],
  [{id:'achievements',icon:'🏅',text:'我的成就',bg:'#E3F2FD'},{id:'messages',icon:'💬',text:'消息中心',bg:'#FFF3E0',badge:'5'}],
  [{id:'settings',icon:'⚙️',text:'设置',bg:'#F5F5F5'},{id:'help',icon:'❓',text:'帮助与反馈',bg:'#F5F5F5'}]
];
var MAP_PINS = [
  {lat:30.274,lng:120.129,label:'🎲 喵喵桌游',detail:'1.2km·¥80·宠物友好',color:'#FF6B6B'},
  {lat:30.281,lng:120.112,label:'🍲 老马火锅',detail:'2.5km·¥120·川菜重辣',color:'#7C3AED'},
  {lat:30.256,lng:120.140,label:'🌿 绿洲Bistro',detail:'0.8km·¥85·安静轻食',color:'#10B981'},
  {lat:30.269,lng:120.118,label:'☕ 山舍咖啡',detail:'1.0km·¥68·安静包厢',color:'#FF6B6B'},
  {lat:30.290,lng:120.170,label:'🍣 湖畔日料',detail:'3.8km·¥180·高端日料',color:'#F59E0B'}
];
