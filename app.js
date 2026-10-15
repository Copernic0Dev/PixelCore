(function(){
const $=(s,r=document)=>r.querySelector(s),C=window.PIXELCORE_CONFIG||{};
const hd=$('.site');
const onScroll=()=>hd.classList.toggle('scrolled',scrollY>10);onScroll();addEventListener('scroll',onScroll,{passive:true});
const mb=$('#menuBtn'),nv=$('#nav');
mb.addEventListener('click',()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
nv.addEventListener('click',e=>{if(e.target.matches('a')){nv.classList.remove('open');mb.setAttribute('aria-expanded',false)}});
addEventListener('keydown',e=>{if(e.key==='Escape'){nv.classList.remove('open');mb.setAttribute('aria-expanded',false)}});
/* canais oficiais */
const ch=[];
if(C.whatsapp)ch.push(['WhatsApp','https://wa.me/'+C.whatsapp]);
if(C.email)ch.push(['E-mail','mailto:'+C.email]);
if(C.instagram)ch.push(['Instagram',C.instagram]);
document.querySelectorAll('[data-canais]').forEach(el=>{
  el.innerHTML=ch.length?ch.map(c=>`<li><a href="${c[1]}" rel="noopener">${c[0]}</a></li>`).join(''):'<li class="muted">Canais oficiais a informar.</li>';
});
/* formulário de contato */
const f=$('#form');
if(f){
  const st=$('#status');
  const say=(t,ok)=>{st.textContent=t;st.className='show'+(ok?' ok':'')};
  const rules={nome:v=>v.trim().length>=2||'Informe seu nome.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||'Informe um e-mail válido, como nome@exemplo.com.',msg:v=>v.trim().length>=10||'Escreva pelo menos 10 caracteres.'};
  const check=k=>{const i=f[k],r=rules[k](i.value),box=i.closest('.field');box.classList.toggle('bad',r!==true);$('.err',box).textContent=r===true?'':r;return r===true};
  Object.keys(rules).forEach(k=>f[k].addEventListener('blur',()=>check(k)));
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const okAll=Object.keys(rules).map(check).every(Boolean);
    if(!okAll){f.querySelector('.bad input,.bad textarea').focus();return}
    const d={nome:f.nome.value,email:f.email.value,mensagem:f.msg.value};
    if(C.formEndpoint){
      try{const r=await fetch(C.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)});
        if(!r.ok)throw 0;f.reset();say('Mensagem enviada. Responderemos pelo e-mail informado.',true)}
      catch{say('Não foi possível enviar agora. Tente novamente em instantes.')}
    }else if(C.whatsapp){
      open('https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent(`Olá, sou ${d.nome} (${d.email}). ${d.mensagem}`),'_blank','noopener');
    }else say('O envio ainda não está configurado neste site. Sua mensagem não foi enviada.');
  });
}
/* catálogo */
const grid=$('#grid');
if(grid){
  const P=window.PRODUTOS,q=$('#q'),cs=$('#cat'),so=$('#sort'),dlg=$('#dlg');
  const cats=[...new Set(P.map(p=>p.cat))];
  cs.innerHTML='<option value="">Todas as categorias</option>'+cats.map(c=>`<option>${c}</option>`).join('');
  const hasPrice=P.some(p=>p.preco!=null);
  so.innerHTML='<option value="nome">Nome (A–Z)</option>'+(hasPrice?'<option value="pa">Menor preço</option><option value="pd">Maior preço</option>':'');
  const u=new URLSearchParams(location.search).get('cat');if(u&&cats.includes(u))cs.value=u;
  const n=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const IC={"Computadores e setups":'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',"Componentes":'<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',"Periféricos":'<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',"Consoles e acessórios":'<path d="M6 8h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.2 2L15 14H9l-1.8 2A3 3 0 0 1 2 14v-2a4 4 0 0 1 4-4z"/><path d="M8 11v2M7 12h2M16 11h.01M18 13h.01"/>',"Gift cards":'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 12h18M12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0"/>'};
const pic=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="#C9A15A" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:34%">${IC[p.cat]||''}</svg>`+(p.img?`<img src="${p.img}" alt="${p.nome}" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#0B1F3A">`:'');
  const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const render=()=>{
    let l=P.filter(p=>(!cs.value||p.cat===cs.value)&&n(p.nome+' '+p.cat).includes(n(q.value.trim())));
    const s=so.value;l.sort((a,b)=>s==='pa'?(a.preco??1e12)-(b.preco??1e12):s==='pd'?(b.preco??-1)-(a.preco??-1):a.nome.localeCompare(b.nome,'pt'));
    grid.innerHTML=l.length?l.map(p=>`<article class="card"><div class="ph" style="display:grid;place-items:center">${pic(p)}<span class="tag">Demonstração</span></div><div class="body"><small>${p.cat}</small><h3>${p.nome}</h3><p class="price">${p.preco!=null?brl(p.preco):'Preço a confirmar'}</p><button class="btn ghost" data-id="${p.id}">Ver detalhes</button></div></article>`).join(''):
    '<div class="empty" style="grid-column:1/-1"><p>Nenhum produto encontrado. Limpe a busca ou escolha outra categoria.</p><button class="btn" id="clr">Limpar filtros</button></div>';
    $('#count').textContent=l.length+(l.length===1?' produto':' produtos');
  };
  [q,cs,so].forEach(e=>e.addEventListener('input',render));
  grid.addEventListener('click',e=>{
    if(e.target.id==='clr'){q.value='';cs.value='';render();return}
    const b=e.target.closest('[data-id]');if(!b)return;
    const p=P.find(x=>x.id==b.dataset.id);
    $('#dt').textContent=p.nome;$('#dc').textContent=p.cat;
    $('#dp').textContent=(p.preco!=null?brl(p.preco)+' (valor de exemplo). ':'')+'Item de demonstração. Descrição, especificações e disponibilidade ainda não foram informadas.';dlg.showModal();
  });
  $('#dx').addEventListener('click',()=>dlg.close());
  if(location.hash==='#busca')q.focus();
  render();
}
})();
