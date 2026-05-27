// 数据层 — 修改这里即可更新所有内容，也可替换为 fetch('/api/xxx') 调用
var APP_DATA = {

  categories: [
    { key:'all',   icon:'',   label:'全部' },
    { key:'sport',  icon:'🏃', label:'运动' },
    { key:'food',   icon:'🍜', label:'美食' },
    { key:'game',   icon:'🎮', label:'游戏' },
    { key:'photo',  icon:'📷', label:'拍照' },
    { key:'travel', icon:'✈️', label:'旅行' },
    { key:'music',  icon:'🎵', label:'音乐' },
    { key:'study',  icon:'📚', label:'学习' }
  ],

  activities: [
    {
      id:1, emoji:'🏸', bg:'linear-gradient(135deg,#FFF0E0,#FFE0D0)',
      status:'🔥 热招中', title:'周末羽毛球局！3缺1，新手友好~',
      date:'周六 14:00', location:'西湖文体中心', price:'AA制',
      avatars:['%23FFB74D','%234FC3F7','%23AED581'], joined:3, total:4,
      tag:'运动', tagClass:'tag-primary', lat:30.274, lng:120.129
    },
    {
      id:2, emoji:'🍲', bg:'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
      status:'🆕 新发布', title:'周五晚火锅局！来城西的小伙伴一起~',
      date:'周五 19:00', location:'城西银泰', price:'AA制',
      avatars:['%23E57373','%23BA68C8'], joined:2, total:6,
      tag:'美食', tagClass:'tag-accent', lat:30.281, lng:120.112
    },
    {
      id:3, emoji:'🎨', bg:'linear-gradient(135deg,#EDE7F6,#D1C4E9)',
      status:'⭐ 精选', title:'周末油画体验课，零基础也能画出好作品',
      date:'周日 10:00', location:'滨江创意园', price:'¥68/人',
      avatars:['%23FFD54F','%234DD0E1','%23F06292','%23A5D6A7'], joined:4, total:8,
      tag:'文艺', tagClass:'tag-accent', lat:30.209, lng:120.212
    }
  ],

  onlineFriends: [
    { name:'小明', color:'%23FFB74D' }, { name:'小红', color:'%234FC3F7' },
    { name:'大壮', color:'%23AED581' }, { name:'小美', color:'%23E57373' },
    { name:'阿杰', color:'%23BA68C8' }, { name:'小鹿', color:'%234DD0E1' }
  ],

  friends: [
    { name:'小明', color:'%23FFB74D', online:true,  tag:'羽毛球', tagClass:'tag-primary', bio:'周末一起打球的小伙伴~' },
    { name:'小红', color:'%234FC3F7', online:false, tag:'美食',   tagClass:'tag-accent',  bio:'探店达人，寻找美食搭子' },
    { name:'大壮', color:'%23AED581', online:true,  tag:'健身',   tagClass:'tag-primary', bio:'健身房常驻，找力量训练搭子' },
    { name:'小美', color:'%23E57373', online:false, tag:'拍照',   tagClass:'tag-accent',  bio:'摄影爱好者，周末约拍' },
    { name:'阿杰', color:'%23BA68C8', online:true,  tag:'桌游',   tagClass:'tag-primary', bio:'狼人杀/剧本杀重度玩家' }
  ],

  menuGroups: [
    [
      { id:'activities', icon:'📋', text:'我的活动', bg:'#FFF0E0' },
      { id:'bookings',   icon:'📅', text:'我的预约', bg:'#E8F5E9' },
      { id:'bookmarks',  icon:'⭐', text:'我的收藏', bg:'#EDE7F6' }
    ],
    [
      { id:'achievements', icon:'🏅', text:'我的成就', bg:'#E3F2FD' },
      { id:'messages',     icon:'💬', text:'消息中心', bg:'#FFF3E0', badge:'5' }
    ],
    [
      { id:'settings', icon:'⚙️', text:'设置',     bg:'#F5F5F5' },
      { id:'help',     icon:'❓', text:'帮助与反馈', bg:'#F5F5F5' }
    ]
  ],

  mapPins: [
    { lat:30.274, lng:120.129, label:'🏸 羽毛球周末局', detail:'周六 14:00 · 西湖文体中心 · 3/4人', color:'#FF6B6B' },
    { lat:30.281, lng:120.112, label:'🍜 火锅美食打卡', detail:'周五 19:00 · 城西银泰 · 2/6人', color:'#7C3AED' },
    { lat:30.255, lng:120.140, label:'🎮 狼人杀桌游',   detail:'周六 15:00 · 滨江 · 5/8人',     color:'#FF6B6B' },
    { lat:30.290, lng:120.170, label:'📷 周末约拍',     detail:'周日 14:00 · 西湖边 · 2/4人',   color:'#10B981' },
    { lat:30.240, lng:120.180, label:'🏃 夜跑团',       detail:'每晚 20:00 · 西溪湿地 · 8/20人', color:'#FF6B6B' }
  ]
};
