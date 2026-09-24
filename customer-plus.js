
(function(){
  const KEY='sharaly_customer_plus_v1';
  const state=JSON.parse(localStorage.getItem(KEY)||'{"favourites":[],"points":120,"reviews":[]}');
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));

  const foods=[
    {id:'m1',name:'Paneer Tikka',cat:'Starters',price:6.5,veg:true,popular:true,img:'https://b.zmtcdn.com/data/pictures/2/22561902/177168533023adb45a-6677-474b-8575-fdb1a833c6ec.jpg'},
    {id:'m2',name:'Chicken 65',cat:'Starters',price:7.2,veg:false,popular:true,img:'https://images.unsplash.com/photo-1644677859366-89905db969a4?auto=format&fit=crop&w=900&q=85'},
    {id:'m4',name:'Butter Chicken',cat:'Mains',price:11.9,veg:false,popular:true,img:'https://b.zmtcdn.com/data/pictures/chains/0/22115140/17549842370f36a874-aa84-4459-a46a-35641e00f7ce.JPEG'},
    {id:'m5',name:'Paneer Butter Masala',cat:'Mains',price:10.5,veg:true,popular:false,img:'https://b.zmtcdn.com/data/pictures/2/22561902/177168533023adb45a-6677-474b-8575-fdb1a833c6ec.jpg'},
    {id:'m7',name:'Mutton Biryani',cat:'Mains',price:13.5,veg:false,popular:true,img:'https://d2ugbn5gb88fyp.cloudfront.net/1962269/0_0.png'},
    {id:'m9',name:'Gulab Jamun',cat:'Desserts',price:4,veg:true,popular:false,img:'https://images.unsplash.com/photo-1631206753348-db44968fd440?auto=format&fit=crop&w=900&q=85'},
    {id:'m10',name:'Falooda',cat:'Desserts',price:5.5,veg:true,popular:true,img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85'},
    {id:'m12',name:'Fresh Lime Soda',cat:'Drinks',price:3,veg:true,popular:false,img:'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85'}
  ];

  let activeFilter='all';
  let trackStep=2;

  function renderFoods(){
    const q=(document.getElementById('hubSearch')?.value||'').toLowerCase().trim();
    const grid=document.getElementById('hubFoodGrid'); if(!grid)return;
    const list=foods.filter(f=>{
      const match=!q || `${f.name} ${f.cat}`.toLowerCase().includes(q);
      const filter=activeFilter==='all'||(activeFilter==='veg'&&f.veg)||(activeFilter==='popular'&&f.popular)||(activeFilter==='offers'&&['m2','m7','m10'].includes(f.id));
      return match&&filter;
    });
    grid.innerHTML=list.map(f=>`<div class="hub-food"><img src="${f.img}" alt="${f.name}"><div class="hub-food-body"><b>${f.name}</b><span>${f.cat} · $${f.price.toFixed(2)} ${f.veg?'· Veg':''}</span><div class="hub-food-actions"><button class="heart" data-fav="${f.id}">${state.favourites.includes(f.id)?'♥':'♡'}</button><button data-add="${f.id}">Add +</button></div></div></div>`).join('');
    grid.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>toggleFav(b.dataset.fav));
    grid.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{alert(foods.find(x=>x.id===b.dataset.add).name+' added to your Sharaly cart.');});
  }
  function toggleFav(id){
    const i=state.favourites.indexOf(id);
    if(i>=0)state.favourites.splice(i,1); else state.favourites.push(id);
    save(); renderFoods(); renderFavs();
  }
  function renderFavs(){
    const list=document.getElementById('favList'), count=document.getElementById('favCount');
    if(!list)return;
    count.textContent=`${state.favourites.length} saved`;
    list.innerHTML=state.favourites.length?state.favourites.map(id=>{const f=foods.find(x=>x.id===id);return `<div class="mini-fav"><span>${f.name}</span><b>$${f.price.toFixed(2)}</b></div>`}).join(''):'<span class="empty-hub">No favourites yet.</span>';
  }
  document.querySelectorAll('.hub-tag').forEach(b=>b.onclick=()=>{document.querySelectorAll('.hub-tag').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.filter;renderFoods()});
  document.getElementById('hubSearch')?.addEventListener('input',renderFoods);
  document.getElementById('clearHubSearch')?.addEventListener('click',()=>{document.getElementById('hubSearch').value='';renderFoods()});

  document.getElementById('hubPoints').textContent=state.points;
  document.getElementById('redeemBtn')?.addEventListener('click',()=>{
    const m=document.getElementById('redeemMsg');
    if(state.points>=100){state.points-=100;save();document.getElementById('hubPoints').textContent=state.points;m.textContent='Reward redeemed — $5 demo discount added.'}
    else m.textContent='You need 100 points to redeem this reward.';
  });

  document.getElementById('applyCoupon')?.addEventListener('click',()=>{
    const v=document.getElementById('couponInput').value.trim().toUpperCase();
    document.getElementById('couponMsg').textContent=v==='SHARALY10'?'Coupon applied: 10% demo discount.':'Invalid coupon. Try SHARALY10.';
  });

  document.getElementById('nextTrack')?.addEventListener('click',()=>{
    trackStep=Math.min(trackStep+1,4);
    const spans=document.querySelectorAll('.track-line span');
    spans.forEach((s,i)=>{s.className=i<trackStep-1?'done':i===trackStep-1?'current':''});
    document.getElementById('trackOrderId').textContent=trackStep===4?'SH-104 ✓':'SH-104';
  });

  document.getElementById('scheduleBtn')?.addEventListener('click',()=>{
    const d=document.getElementById('scheduleDate').value,t=document.getElementById('scheduleTime').value;
    document.getElementById('scheduleMsg').textContent=(d&&t)?`Scheduled for ${d} at ${t}.`:'Please choose a date and time.';
  });

  document.getElementById('reorderBtn')?.addEventListener('click',()=>{
    state.points+=25;save();document.getElementById('hubPoints').textContent=state.points;
    document.getElementById('reorderMsg').textContent='Previous items added to the demo cart. +25 loyalty points.';
  });

  document.getElementById('calcDelivery')?.addEventListener('click',()=>{
    const km=Math.max(0,Number(document.getElementById('distanceInput').value)||0);
    const fee=km<=2?2:2+(km-2)*0.6;
    document.getElementById('deliveryFee').textContent='$'+fee.toFixed(2);
  });

  document.getElementById('reviewBtn')?.addEventListener('click',()=>{
    const name=(document.getElementById('reviewName').value||'Guest').trim();
    const text=(document.getElementById('reviewText').value||'Great experience!').trim();
    const rating=document.getElementById('reviewRating').value;
    state.reviews.unshift({name,text,rating});state.reviews=state.reviews.slice(0,4);save();renderReviews();
    document.getElementById('reviewText').value='';
  });
  function renderReviews(){
    const box=document.getElementById('reviewList');if(!box)return;
    box.innerHTML=state.reviews.length?state.reviews.map(r=>`<div class="review-item"><b>${r.name}</b><span>${'★'.repeat(Number(r.rating))}</span><div>${r.text}</div></div>`).join(''):'<div class="review-item"><b>Priya</b><span>★★★★★</span><div>Fast ordering and a clean menu experience.</div></div>';
  }

  renderFoods();renderFavs();renderReviews();save();
})();


/* ================= RESTAURANT PRO+ DEMOS ================= */
(function(){
  const $=id=>document.getElementById(id);
  const qrImg=$('tableQr'), qrInput=$('qrTableInput'), qrLabel=$('qrTableLabel');
  function makeQR(){
    const table=Math.max(1,Number(qrInput?.value)||7);
    if(qrLabel) qrLabel.textContent=String(table).padStart(2,'0');
    const url=location.href.split('#')[0]+'#menu?table='+table;
    if(qrImg) qrImg.src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(url);
    if($('qrMsg')) $('qrMsg').textContent=`QR ready for Table ${table}.`;
  }
  $('generateQr')?.addEventListener('click',makeQR);
  makeQR();

  const rDate=$('reservationDate');
  if(rDate && !rDate.value){const d=new Date();d.setDate(d.getDate()+1);rDate.value=d.toISOString().slice(0,10);}
  $('reserveBtn')?.addEventListener('click',()=>{
    const d=$('reservationDate')?.value,t=$('reservationTime')?.value,g=$('reservationGuests')?.value;
    $('reservationMsg').textContent=(d&&t)?`Table reserved for ${g} guest(s) on ${d} at ${t}. Demo booking saved.`:'Please choose a date and time.';
  });

  let payment='Cash';
  document.querySelectorAll('.pay-option').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.pay-option').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    payment=btn.dataset.pay;
    if($('payBtn')) $('payBtn').textContent='Continue with '+payment;
  }));
  $('payBtn')?.addEventListener('click',()=>{$('paymentMsg').textContent=`${payment} payment selected for the demo checkout.`;});

  $('zoneCheckBtn')?.addEventListener('click',()=>{
    const km=Math.max(0,Number($('zoneDistance')?.value)||0);
    let msg=km<=3?'Zone A — $2.00 delivery fee.':km<=7?'Zone B — $4.50 delivery fee.':km<=12?'Zone C — $7.00 delivery fee.':'Outside delivery area — pickup recommended.';
    $('zoneMsg').textContent=msg;
  });

  $('locationSelect')?.addEventListener('change',e=>{
    const v=e.target.value.split('—')[1]?.trim()||e.target.value;
    if($('locationName')) $('locationName').textContent=v+' branch';
  });

  $('staffDemoBtn')?.addEventListener('click',()=>{$('staffMsg').textContent='Team workflow opened: new orders → kitchen → ready → delivery/served.';});
  $('receiptBtn')?.addEventListener('click',()=>{
    $('receiptMsg').textContent='Receipt preview ready. Use your browser print dialog to save it as PDF.';
    window.print();
  });
})();
