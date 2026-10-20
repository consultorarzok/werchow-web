(function(){
  // toggle de tema claro/oscuro, independiente del sistema, persistido
  var themeBtn = document.getElementById('themeToggle');
  function currentTheme(){ return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  themeBtn.addEventListener('click', function(){
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('werchow-theme', next); }catch(e){}
    themeBtn.setAttribute('aria-label', next === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  });

  // menú mobile
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ links.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
  });

  // barra de progreso de lectura
  var bar = document.getElementById('progressBar');
  function onScroll(){
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = (isFinite(scrolled) ? scrolled : 0) + '%';
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Revelado suave al entrar en pantalla.
  // El estado inicial lo puso el script del <head> (html.js-reveal); acá sólo se
  // observa y se va marcando cada bloque. Los hermanos de una misma grilla entran
  // escalonados para que la fila no aparezca de golpe.
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.setAttribute('data-reveal-ready', '');

    var STEP = 90, MAX_STEPS = 4;
    var seen = new Map();
    revealables.forEach(function(el){
      var parent = el.parentNode;
      var i = seen.get(parent) || 0;
      seen.set(parent, i + 1);
      if (i > 0) el.style.setProperty('--reveal-delay', Math.min(i, MAX_STEPS) * STEP + 'ms');
    });

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);   // una sola vez: al volver a subir no vuelve a animar
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function(el){ io.observe(el); });
  }
})();

// Pausa de las cintas que se mueven solas (frases de Inicio, carrusel de Homenajes) — WCAG 2.2.2.
// Usa una clase propia (is-user-paused) para que otras pausas, como la del diálogo de Homenajes,
// no deshagan la decisión de la persona. Con "reducir movimiento" las cintas ya están quietas
// y el botón no se muestra (CSS).
(function(){
  document.querySelectorAll('[data-motion-toggle]').forEach(function(btn){
    var target = document.getElementById(btn.getAttribute('data-motion-toggle'));
    if (!target) return;
    btn.addEventListener('click', function(){
      var paused = target.classList.toggle('is-user-paused');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', btn.getAttribute(paused ? 'data-label-play' : 'data-label-pause'));
    });
  });
})();

// Contadores: los números marcados con data-count suben desde 0 al valor real
// cuando entran en pantalla. El HTML ya trae el valor final (sin JS, o con
// movimiento reducido, se ve igual); acá sólo se anima y se reserva el ancho para
// que el texto de al lado no se corra.
(function(){
  var els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function easeOut(t){ return 1 - Math.pow(1 - t, 3); }

  function setup(el){
    var m = el.textContent.trim().match(/^(\D*)(\d+(?:,\d+)?)(.*)$/);
    if (!m) return null;
    var dec = m[2].indexOf(',') > -1 ? m[2].split(',')[1].length : 0;
    var c = { el: el, pre: m[1], suf: m[3], dec: dec, end: parseFloat(m[2].replace(',', '.')), final: el.textContent };
    el.style.display = 'inline-block';
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    el.style.fontVariantNumeric = 'tabular-nums';
    el.textContent = c.pre + (0).toFixed(dec).replace('.', ',') + c.suf;
    return c;
  }

  function run(c){
    var t0 = null, DUR = 1400;
    function step(ts){
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / DUR, 1);
      c.el.textContent = p < 1
        ? c.pre + (c.end * easeOut(p)).toFixed(c.dec).replace('.', ',') + c.suf
        : c.final;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var items = [];
  els.forEach(function(el){ var c = setup(el); if (c) items.push(c); });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var c = items.filter(function(i){ return i.el === e.target; })[0];
      if (c) run(c);
    });
  }, { threshold: 0.6 });
  items.forEach(function(c){ io.observe(c.el); });
})();
