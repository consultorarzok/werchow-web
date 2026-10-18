(function(){
  // Video de la banda verde de Sepelio (Inicio y página Sepelios): sólo aparece si
  // assets/sepelio-loop.mp4 existe y carga; si no, queda el degradé verde de marca.
  var v = document.getElementById('sepelioVideo');
  if (v) {
    v.addEventListener('canplay', function(){ v.classList.add('is-ready'); });
    v.addEventListener('error', function(){ v.classList.remove('is-ready'); }, true);
  }

  // Botón de pausa de los fondos en movimiento (video + degradé que "respira").
  // Con "reducir movimiento" activado en el dispositivo, el video arranca pausado y
  // sólo se reproduce si la persona lo pide. Si el video no existe y el movimiento
  // ya está reducido, no hay nada que pausar y el botón queda oculto.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-media-toggle]').forEach(function(btn){
    var section = btn.closest('section');
    var video = section && section.querySelector('video');
    function setPaused(paused){
      section.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? 'Reproducir el video de fondo' : 'Pausar el video de fondo');
      if (!video) return;
      // Sin esto, el autoplay del <video> lo vuelve a arrancar cuando el hero cambia de unidad.
      video.autoplay = !paused;
      if (paused) video.pause();
      else video.play().catch(function(){});
    }
    btn.addEventListener('click', function(){ setPaused(!section.classList.contains('is-paused')); });
    if (reduceMotion) {
      setPaused(true);
      if (video) video.addEventListener('loadedmetadata', function(){ btn.hidden = false; });
    } else {
      btn.hidden = false;
    }
  });

  // Recuadros de foto con data-img (tarjetas de beneficios, foto de la sala): si el archivo
  // existe, reemplaza al degradé con ícono; si no, el recuadro queda como está.
  document.querySelectorAll('[data-img]').forEach(function(el){
    var src = el.getAttribute('data-img');
    var img = new Image();
    img.onload = function(){
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add('has-img');
    };
    img.src = src;
  });
})();
