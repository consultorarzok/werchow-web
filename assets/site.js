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
