(function(){
  var dialog = document.getElementById('tributeDialog');
  var track = document.getElementById('tributeTrack');
  if (!dialog || !track) return;

  var photo = document.getElementById('tdPhoto');
  var name = document.getElementById('tdName');
  var dates = document.getElementById('tdDates');
  var message = document.getElementById('tdMessage');

  function openTribute(btn){
    photo.src = btn.dataset.photo;
    photo.alt = btn.dataset.name;
    name.textContent = btn.dataset.name;
    dates.textContent = btn.dataset.dates;
    message.textContent = btn.dataset.message;
    track.classList.add('is-paused');
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }

  track.querySelectorAll('.tribute:not([aria-hidden="true"])').forEach(function(btn){
    btn.addEventListener('click', function(){ openTribute(btn); });
  });

  dialog.querySelectorAll('[data-close]').forEach(function(b){
    b.addEventListener('click', function(){ dialog.close(); });
  });

  dialog.addEventListener('click', function(e){
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', function(){
    track.classList.remove('is-paused');
  });
})();
