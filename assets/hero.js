(function(){
  // fondo en loop del hero: un <video> compartido cuyo <source> se cambia por unidad.
  // Recién se muestra (fade-in) si el archivo de ESA unidad carga bien; si falta o tira error,
  // esa pestaña se queda en el degradé animado de abajo, sin romper nada.
  var heroVideo = document.getElementById('heroVideo');
  var heroVideoSource = document.getElementById('heroVideoSource');
  var currentVideoSrc = heroVideoSource ? heroVideoSource.getAttribute('src') : null;
  if (heroVideo) {
    heroVideo.addEventListener('canplay', function(){ heroVideo.classList.add('is-ready'); });
    heroVideo.addEventListener('error', function(){ heroVideo.classList.remove('is-ready'); }, true);
  }
  // En pantalla angosta el hero es casi vertical y object-fit:cover recorta tanto un video
  // 16:9 que la escena se pierde (en Servicios Sociales quedaban sólo manos y medio rostro).
  // Para esa unidad hay una versión reencuadrada en vertical; si no existe variante mobile
  // para una unidad, se usa el archivo normal.
  var MOBILE_VARIANTS = { 'assets/hero-loop-social.mp4': 'assets/hero-loop-social-mobile.mp4' };
  function pickVideo(src){
    if (!src) return src;
    var narrow = window.matchMedia('(max-width: 640px)').matches;
    return (narrow && MOBILE_VARIANTS[src]) ? MOBILE_VARIANTS[src] : src;
  }

  function setHeroVideo(rawSrc){
    var src = pickVideo(rawSrc);
    if (!heroVideo || !heroVideoSource || !src || src === currentVideoSrc) return;
    currentVideoSrc = src;
    heroVideo.classList.remove('is-ready');
    heroVideoSource.setAttribute('src', src);
    heroVideo.load();
    heroVideo.play().catch(function(){});
  }

  // selector interactivo de unidades (hero) — cada una con su propio video de fondo
  var UNITS = {
    memorial: {
      eyebrow: 'Memorial y Salas — nueva propuesta',
      title: 'Presente pleno. <em>Futuro cuidado.</em>',
      lead: 'Con vistas abiertas al parque, ofrecemos espacios solemnes y cálidos para que las familias puedan despedir y rendir homenaje a sus seres queridos con la dignidad que merecen.',
      waText: 'Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Memorial%20y%20Salas',
      video: 'assets/hero-loop-memorial.mp4',
      fcIcon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z" stroke="#fff" stroke-width="1.6"/></svg>',
      fcStat: '+50 años', fcSub: 'acompañando familias en Jujuy'
    },
    sepelios: {
      eyebrow: 'Sepelios — desde hace 50 años',
      title: 'Atención fúnebre <em>humana</em>.',
      lead: 'Contenida y profesional, con planes adaptados a cada necesidad. Anticiparse es la mejor forma de atravesar los momentos difíciles con tranquilidad.',
      waText: 'Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sepelios',
      video: 'assets/hero-loop-sepelios.mp4',
      fcIcon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v8M8 12h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="1.6"/></svg>',
      fcStat: 'Guardia 24 hs.', fcSub: 'todos los días del año'
    },
    social: {
      eyebrow: 'Servicios sociales — red de beneficios',
      title: 'Acompañar el <em>día a día</em>.',
      lead: 'Descuentos en farmacias, becas estudiantiles y un sistema de cobertura en salud que respalda a cada familia cuando lo necesita.',
      waText: 'Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Servicios%20Sociales',
      video: 'assets/hero-loop-social.mp4',
      fcIcon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
      fcStat: '75%', fcSub: 'no planifica el futuro — por eso acompañamos antes'
    }
  };

  var hero = document.querySelector('.hero');
  var tabs = document.querySelectorAll('.switch-tab[data-unit]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyUnit(key){
    var u = UNITS[key];
    hero.setAttribute('data-active', key);
    document.getElementById('heroEyebrow').textContent = u.eyebrow;
    document.getElementById('heroTitle').innerHTML = u.title;
    document.getElementById('heroLead').textContent = u.lead;
    document.getElementById('heroWaBtn').href = 'https://wa.me/5493884300930?text=' + u.waText;
    document.getElementById('heroFcIcon').innerHTML = u.fcIcon;
    document.getElementById('heroFcStat').textContent = u.fcStat;
    document.getElementById('heroFcSub').textContent = u.fcSub;
    setHeroVideo(u.video);
    tabs.forEach(function(t){
      var active = t.getAttribute('data-unit') === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var key = tab.getAttribute('data-unit');
      if (hero.getAttribute('data-active') === key) return;
      if (!reduceMotion && document.startViewTransition) {
        document.startViewTransition(function(){ applyUnit(key); });
      } else {
        applyUnit(key);
      }
    });
  });
})();
