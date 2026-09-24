const menuButton=document.querySelector('.hamburger');const mobileNav=document.querySelector('.mobile-nav');
if(menuButton){menuButton.addEventListener('click',()=>mobileNav.classList.toggle('open'));document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')))}

/* ================= APP SECTION LOGIC ================= */
(function(){
const MENU_KEY = 'sharaly_menu_items_real_v1';
const ORDERS_KEY = 'sharaly_orders';

const DEFAULT_MENU = [
  {id:'m1',name:'Paneer Tikka',cat:'Starters',veg:true,price:6.50,desc:'Char-grilled cottage cheese marinated in smoky spices.',img:'https://b.zmtcdn.com/data/pictures/2/22561902/177168533023adb45a-6677-474b-8575-fdb1a833c6ec.jpg'},
  {id:'m2',name:'Chicken 65',cat:'Starters',veg:false,price:7.20,desc:'Crispy fried chicken tossed in a spicy South Indian glaze.',img:'https://images.unsplash.com/photo-1644677859366-89905db969a4?auto=format&fit=crop&w=900&q=85'},
  {id:'m3',name:'Corn Fritters',cat:'Starters',veg:true,price:5.00,desc:'Golden fried corn and herb fritters with mint chutney.',img:'https://d2ugbn5gb88fyp.cloudfront.net/1962269/0_0.png'},
  {id:'m4',name:'Butter Chicken',cat:'Mains',veg:false,price:11.90,desc:'Slow-cooked chicken in a rich tomato-butter gravy.',img:'https://b.zmtcdn.com/data/pictures/chains/0/22115140/17549842370f36a874-aa84-4459-a46a-35641e00f7ce.JPEG'},
  {id:'m5',name:'Paneer Butter Masala',cat:'Mains',veg:true,price:10.50,desc:'Cottage cheese cubes in a creamy tomato cashew sauce.',img:'https://b.zmtcdn.com/data/pictures/2/22561902/177168533023adb45a-6677-474b-8575-fdb1a833c6ec.jpg'},
  {id:'m6',name:'Veg Biryani',cat:'Mains',veg:true,price:9.80,desc:'Fragrant basmati rice layered with spiced vegetables.',img:'https://images.unsplash.com/photo-1644677859366-89905db969a4?auto=format&fit=crop&w=900&q=85'},
  {id:'m7',name:'Mutton Biryani',cat:'Mains',veg:false,price:13.50,desc:'Slow-cooked mutton and basmati rice, Sharaly style.',img:'https://d2ugbn5gb88fyp.cloudfront.net/1962269/0_0.png'},
  {id:'m8',name:'Garlic Naan',cat:'Mains',veg:true,price:3.20,desc:'Soft tandoor-baked flatbread with roasted garlic.',img:'https://b.zmtcdn.com/data/pictures/chains/0/22115140/17549842370f36a874-aa84-4459-a46a-35641e00f7ce.JPEG'},
  {id:'m9',name:'Gulab Jamun',cat:'Desserts',veg:true,price:4.00,desc:'Warm milk dumplings soaked in rose-cardamom syrup.',img:'https://images.unsplash.com/photo-1631206753348-db44968fd440?auto=format&fit=crop&w=900&q=85'},
  {id:'m10',name:'Falooda',cat:'Desserts',veg:true,price:5.50,desc:'Layered rose milk with vermicelli, jelly and ice cream.',img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85'},
  {id:'m11',name:'Masala Chai',cat:'Drinks',veg:true,price:2.50,desc:'Spiced Indian tea brewed with milk.',img:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85'},
  {id:'m12',name:'Fresh Lime Soda',cat:'Drinks',veg:true,price:3.00,desc:'Sparkling lime with a pinch of salt or sugar.',img:'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85'},
];

function loadMenu(){
  let m = localStorage.getItem(MENU_KEY);
  if(!m){ localStorage.setItem(MENU_KEY, JSON.stringify(DEFAULT_MENU)); return DEFAULT_MENU.slice(); }
  try{ return JSON.parse(m); }catch(e){ return DEFAULT_MENU.slice(); }
}
function loadOrders(){
  let o = localStorage.getItem(ORDERS_KEY);
  try{ return o ? JSON.parse(o) : []; }catch(e){ return []; }
}
function saveOrders(orders){ localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }

let MENU = loadMenu();
let ORDERS = loadOrders();
let cart = {};
let currentType = 'Dine-in';
let activeCategory = 'All';
let orderCounter = ORDERS.length ? Math.max(...ORDERS.map(o=>o.num)) : 100;

function switchTab(tab){
  document.querySelectorAll('.app-tab-btn').forEach(b=> b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.app-page').forEach(p=> p.classList.remove('active'));
  const target = document.getElementById('apppage-'+tab);
  if(target) target.classList.add('active');
  if(tab==='kitchen') renderKitchen();
  if(tab==='insights') renderInsights();
  if(tab==='orders') renderRecentOrders();
}

document.querySelectorAll('.app-tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> switchTab(btn.dataset.tab));
});

/* feature cards in menu-strip -> scroll + open tab */
document.querySelectorAll('.feature-click').forEach(card=>{
  card.addEventListener('click', ()=>{
    const tab = card.dataset.tab;
    switchTab(tab);
    document.getElementById('app').scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ===================== DIGITAL MENU ===================== */
function renderCategories(){
  const row = document.getElementById('catRow');
  if(!row) return;
  const cats = ['All', ...new Set(MENU.map(m=>m.cat))];
  row.innerHTML = cats.map(c=>`<button class="app-cat-btn ${c===activeCategory?'active':''}" data-cat="${c}">${c}</button>`).join('');
  row.querySelectorAll('.app-cat-btn').forEach(b=>{
    b.addEventListener('click', ()=>{ activeCategory=b.dataset.cat; renderCategories(); renderMenuGrid(); });
  });
}
function renderMenuGrid(){
  const searchEl = document.getElementById('menuSearch');
  const grid = document.getElementById('menuGrid');
  if(!grid) return;
  const q = searchEl.value.trim().toLowerCase();
  let items = MENU.filter(m=> activeCategory==='All' || m.cat===activeCategory);
  if(q) items = items.filter(m=> m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
  if(!items.length){ grid.innerHTML = '<div class="app-no-results">No dishes match your search.</div>'; return; }
  grid.innerHTML = items.map(m=>`
    <div class="app-menu-card">
      <div class="app-food-image"><img src="${m.img}" alt="${m.name}" loading="lazy"></div>
      <div class="amc-top">
        <div><div class="app-cat-tag">${m.cat}</div><h5>${m.name}</h5></div>
        <div class="app-veg ${m.veg?'':'non'}"></div>
      </div>
      <p>${m.desc}</p>
      <div class="app-mc-bottom">
        <span class="app-price">$${m.price.toFixed(2)}</span>
        <button class="app-add-btn" data-id="${m.id}">+ Add</button>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.app-add-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      addToCart(b.dataset.id);
      b.textContent = 'Added ✓'; b.classList.add('added');
      setTimeout(()=>{ b.textContent='+ Add'; b.classList.remove('added'); }, 900);
    });
  });
}
const menuSearchEl = document.getElementById('menuSearch');
if(menuSearchEl) menuSearchEl.addEventListener('input', renderMenuGrid);

/* ===================== SMART ORDERS ===================== */
document.querySelectorAll('.app-type-btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.app-type-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    currentType = b.dataset.type;
    document.getElementById('tableInputWrap').classList.toggle('show', currentType==='Dine-in');
    renderCart();
  });
});

function renderPickList(){
  const list = document.getElementById('pickList');
  if(!list) return;
  list.innerHTML = MENU.map(m=>`
    <div class="app-pick-row">
      <div><b>${m.name}</b><span>${m.cat} · $${m.price.toFixed(2)}</span></div>
      <button data-id="${m.id}">+</button>
    </div>`).join('');
  list.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> addToCart(b.dataset.id)));
}

function addToCart(id){ cart[id] = (cart[id]||0) + 1; renderCart(); }
function changeQty(id, delta){
  cart[id] = (cart[id]||0) + delta;
  if(cart[id]<=0) delete cart[id];
  renderCart();
}
function renderCart(){
  const wrap = document.getElementById('cartLines');
  if(!wrap) return;
  const ids = Object.keys(cart);
  const tableNumberEl = document.getElementById('tableNumber');
  document.getElementById('cartMeta').textContent = currentType + (currentType==='Dine-in' && tableNumberEl.value ? ' · Table '+tableNumberEl.value : '');
  if(!ids.length){
    wrap.innerHTML = '<div class="app-cart-empty">No items yet — add something from the menu.</div>';
    document.getElementById('cartTotal').textContent = '$0.00';
    document.getElementById('placeOrderBtn').disabled = true;
    return;
  }
  let total = 0;
  wrap.innerHTML = ids.map(id=>{
    const m = MENU.find(x=>x.id===id);
    const qty = cart[id];
    total += m.price*qty;
    return `<div class="app-cart-line">
      <span>${m.name}</span>
      <span class="qty"><button data-id="${id}" data-d="-1">−</button>${qty}<button data-id="${id}" data-d="1">+</button></span>
    </div>`;
  }).join('');
  wrap.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> changeQty(b.dataset.id, parseInt(b.dataset.d))));
  document.getElementById('cartTotal').textContent = '$'+total.toFixed(2);
  document.getElementById('placeOrderBtn').disabled = false;
}
const tableNumberInput = document.getElementById('tableNumber');
if(tableNumberInput) tableNumberInput.addEventListener('input', renderCart);

const placeBtn = document.getElementById('placeOrderBtn');
if(placeBtn) placeBtn.addEventListener('click', ()=>{
  const ids = Object.keys(cart);
  if(!ids.length) return;
  orderCounter++;
  const items = ids.map(id=>{
    const m = MENU.find(x=>x.id===id);
    return {id, name:m.name, price:m.price, qty:cart[id]};
  });
  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  const order = {
    num: orderCounter, id: 'SH-'+orderCounter, type: currentType,
    table: currentType==='Dine-in' ? (document.getElementById('tableNumber').value||'-') : null,
    items, total, status: 'new', time: new Date().toISOString()
  };
  ORDERS.unshift(order);
  saveOrders(ORDERS);
  cart = {};
  document.getElementById('tableNumber').value='';
  renderCart();
  renderRecentOrders();
  showToast('Order '+order.id+' placed!');
});

function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 1800);
}

function renderRecentOrders(){
  const wrap = document.getElementById('recentOrdersList');
  if(!wrap) return;
  if(!ORDERS.length){ wrap.innerHTML = '<div class="app-empty-note">No orders placed yet.</div>'; return; }
  wrap.innerHTML = ORDERS.slice(0,8).map(o=>`
    <div class="app-order-row">
      <div>
        <div class="aoid">${o.id} <span class="aotype">· ${o.type}${o.table?' · Table '+o.table:''}</span></div>
        <div class="aoitems">${o.items.map(i=>i.qty+'× '+i.name).join(', ')}</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        <b>$${o.total.toFixed(2)}</b>
        <span class="app-status-chip app-status-${o.status}">${statusLabel(o.status)}</span>
      </div>
    </div>`).join('');
}
function statusLabel(s){ return {new:'New', preparing:'Preparing', ready:'Ready', completed:'Completed'}[s] || s; }

/* ===================== KITCHEN FLOW ===================== */
const FLOW = ['new','preparing','ready','completed'];
const FLOW_LABEL = {new:'Start Preparing', preparing:'Mark Ready', ready:'Mark Served'};

function renderKitchen(){
  FLOW.forEach(status=>{
    const col = document.getElementById('col-'+status);
    if(!col) return;
    const list = ORDERS.filter(o=>o.status===status);
    document.getElementById('cnt-'+status).textContent = list.length;
    if(!list.length){ col.innerHTML = '<div class="app-kempty">Nothing here</div>'; return; }
    col.innerHTML = list.map(o=>`
      <div class="app-kcard">
        <div class="akid">${o.id}</div>
        <div class="akotype">${o.type}${o.table?' · Table '+o.table:''}</div>
        <ul>${o.items.map(i=>`<li>${i.qty}× ${i.name}</li>`).join('')}</ul>
        <div class="app-kcard-actions">
          ${status!=='completed' ? `<button class="afwd" data-id="${o.id}">${FLOW_LABEL[status]}</button>` : `<span style="font-size:11px;color:#999;padding:6px 0">Done ✓</span>`}
        </div>
      </div>`).join('');
  });
  document.querySelectorAll('.app-kcard-actions .afwd').forEach(b=>{
    b.addEventListener('click', ()=>{
      const o = ORDERS.find(x=>x.id===b.dataset.id);
      const idx = FLOW.indexOf(o.status);
      o.status = FLOW[idx+1];
      saveOrders(ORDERS);
      renderKitchen();
      renderRecentOrders();
    });
  });
}

/* ===================== BUSINESS INSIGHTS ===================== */
function renderInsights(){
  if(!document.getElementById('statRevenue')) return;
  const totalRevenue = ORDERS.reduce((s,o)=>s+o.total,0);
  const totalOrders = ORDERS.length;
  const totalItems = ORDERS.reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0);

  document.getElementById('statRevenue').textContent = '$'+totalRevenue.toFixed(2);
  document.getElementById('statOrders').textContent = totalOrders;
  document.getElementById('statAvg').textContent = '$'+(totalOrders? (totalRevenue/totalOrders):0).toFixed(2);
  document.getElementById('statItems').textContent = totalItems;

  const chart = document.getElementById('barsChart');
  const last7 = ORDERS.slice(0,7).slice().reverse();
  if(!last7.length){
    chart.innerHTML = '<div class="app-empty-note" style="width:100%">No orders yet — place an order to see the chart.</div>';
  } else {
    const max = Math.max(...last7.map(o=>o.total), 1);
    chart.innerHTML = last7.map(o=>`
      <div class="abcol"><div class="abfill" style="height:${Math.max((o.total/max)*100,4)}%"></div><div class="ablabel">${o.id.replace('SH-','#')}</div></div>`).join('');
  }

  const itemMap = {};
  ORDERS.forEach(o=> o.items.forEach(i=>{ itemMap[i.name] = (itemMap[i.name]||0) + i.qty; }));
  const topWrap = document.getElementById('topItems');
  const sorted = Object.entries(itemMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  topWrap.innerHTML = sorted.length ? sorted.map((e,idx)=>`
    <div class="app-top-item-row"><span><span class="app-rank">${idx+1}</span>${e[0]}</span><b>${e[1]} sold</b></div>`).join('')
    : '<div class="app-empty-note">No sales yet.</div>';

  const typeWrap = document.getElementById('typeSplit');
  const types = ['Dine-in','Takeaway','Delivery'];
  const counts = types.map(t=> ORDERS.filter(o=>o.type===t).length);
  const maxC = Math.max(...counts, 1);
  typeWrap.innerHTML = totalOrders ? types.map((t,i)=>`
    <div><div class="app-split-row"><span>${t}</span><span>${counts[i]} orders</span></div>
    <div class="app-split-bar"><div class="app-split-fill" style="width:${(counts[i]/maxC)*100}%"></div></div></div>`).join('')
    : '<div class="app-empty-note">No orders yet.</div>';
}

const resetBtnEl = document.getElementById('resetBtn');
if(resetBtnEl) resetBtnEl.addEventListener('click', ()=>{
  if(!confirm('Clear all demo orders? This cannot be undone.')) return;
  ORDERS = [];
  saveOrders(ORDERS);
  orderCounter = 100;
  renderRecentOrders(); renderKitchen(); renderInsights();
});

/* ===================== INIT ===================== */
renderCategories();
renderMenuGrid();
renderPickList();
renderCart();
renderRecentOrders();
renderKitchen();
renderInsights();
})();
