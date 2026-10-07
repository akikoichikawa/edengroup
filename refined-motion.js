(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!('IntersectionObserver' in window)||!Element.prototype.animate||reduced.matches)return;
 const animations=new Set();
 const selectors=['.about-statement','.about-facts .fact','.section-head','.business-card .num','.business-card .jp','.business-card p','.events-content>div','.bom-gallery-heading','.bom-movie','.news-feature-copy>*','.group-company','.profile-panel dl>div','.ceo-message>*','.vision-inner>*','.footer-column','.winner','.sponsor-tier','.card','.entry-panel'];
 const targets=[...new Set(selectors.flatMap(s=>[...document.querySelectorAll(s)]))];
 targets.forEach((el,i)=>el.dataset.motionDetailDelay=String((Array.from(el.parentElement.children).indexOf(el)%4)*85));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
   if(!isIntersecting)return;observer.unobserve(target);if(reduced.matches)return;
   const a=target.animate([{opacity:.18,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:1050,delay:Number(target.dataset.motionDetailDelay||0),easing:'cubic-bezier(.2,.65,.2,1)',fill:'backwards'});
   animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a));
  });
 },{threshold:.08});targets.forEach(el=>observer.observe(el));
 document.querySelectorAll('.bom-gallery-heading,.section-top,.business-head').forEach(el=>{
  const line=document.createElement('span');line.className='motion-detail-line';line.setAttribute('aria-hidden','true');
  el.parentElement.insertBefore(line,el.nextSibling);line.style.marginBottom='32px';
  const o=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-detail-active');o.unobserve(e.target)}}),{threshold:.1});o.observe(line.parentElement);
 });
 const images=[...document.querySelectorAll('.news-picture img,.statement>img,.hero-photo')];
 const visible=new Set();const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target)),{rootMargin:'60px'});images.forEach(el=>io.observe(el));
 let frame=0;function draw(){frame=0;if(reduced.matches||document.hidden)return;const max=innerWidth<700?8:18;visible.forEach(el=>{const r=el.parentElement.getBoundingClientRect();const y=Math.max(-max,Math.min(max,(innerHeight*.5-r.top-r.height*.5)*.025));el.style.translate=`0 ${y.toFixed(1)}px`;el.style.scale='1.04';});}
 function schedule(){if(!frame)frame=requestAnimationFrame(draw)}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 reduced.addEventListener('change',()=>{if(reduced.matches){animations.forEach(a=>a.cancel());images.forEach(el=>{el.style.removeProperty('translate');el.style.removeProperty('scale')});observer.disconnect();}else schedule();});
 document.addEventListener('visibilitychange',()=>{animations.forEach(a=>document.hidden?a.pause():a.play());if(!document.hidden)schedule();});schedule();
})();
