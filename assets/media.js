(function(){
  // Video de la banda verde de Sepelio (Inicio y página Sepelios): sólo aparece si
  // assets/sepelio-loop.mp4 existe y carga; si no, queda el degradé verde de marca.
  var v = document.getElementById('sepelioVideo');
  if (v) {
    v.addEventListener('canplay', function(){ v.classList.add('is-ready'); });
    v.addEventListener('error', function(){ v.classList.remove('is-ready'); }, true);
  }

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
