function clearEntries() {
  const entries = document.querySelectorAll('.entry');
  entries.forEach((entry, i) => {
    entry.value = '';
    localStorage.removeItem(`entry-${i}`);
  });
}

function showOverlay() {
  document.getElementById('overlay-panel').classList.remove('hidden');
  const list = document.getElementById('saved-list');
  list.innerHTML = '';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    const btn = document.createElement('button');
    btn.innerText = key;
    btn.onclick = () => loadEntry(key);
    list.appendChild(btn);
  }
}

function loadEntry(title) {
  const data = JSON.parse(localStorage.getItem(title));
  const textareas = document.querySelectorAll('.entry');
  data.forEach((val, i) => {
    if (textareas[i]) textareas[i].value = val;
  });
  closeOverlay();
}

function closeOverlay() {
  document.getElementById('overlay-panel').classList.add('hidden');
}

document.querySelectorAll('.draggable-sticker').forEach((sticker) => {
  function startCloneDrag(e) {
    e.preventDefault();

    const isTouch = e.type === 'touchstart';
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;

    const clone = sticker.cloneNode(true);
    clone.classList.add('reizable-wrapper', 'sticker-clone');
    clone.dataset.cloned = "true";
    
    const clonedImg = draggable-sticker.cloneNode(true);
    cloneWrapper.appendChild(clonedImg);

document.body.appendChild(cloneWrapper);
makeStickerDraggable(cloneWrapper);
    
    document.body.appendChild(clone);
    makeStickerDraggable(clone);
    makeStickerResizable(clone);

    // offset based on template sticker
    const rect = sticker.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    moveClone(startX, startY); // place it immediately

    function moveClone(x, y) {
      clone.style.left = `${x - offsetX}px`;
      clone.style.top = `${y - offsetY}px`;
    }

    function onMove(e) {
      const moveX = isTouch ? e.touches[0].clientX : e.clientX;
      const moveY = isTouch ? e.touches[0].clientY : e.clientY;
      moveClone(moveX, moveY);
    }

    function onEnd() {
      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
      clone.style.pointerEvents = 'auto'; // re-enable click if needed
    }

    window.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
    window.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
  }

  sticker.addEventListener('mousedown', startCloneDrag);
  sticker.addEventListener('touchstart', startCloneDrag, { passive: false });
});

function makeStickerDraggable(sticker) {
  function startMove(e) {
    e.preventDefault();

    const isTouch = e.type === 'touchstart';
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;

    const rect = sticker.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    function moveAt(x, y) {
      sticker.style.left = `${x - offsetX}px`;
      sticker.style.top = `${y - offsetY}px`;
    }

    function onMove(e) {
      const moveX = isTouch ? e.touches[0].clientX : e.clientX;
      const moveY = isTouch ? e.touches[0].clientY : e.clientY;
      moveAt(moveX, moveY);
    }

    function onEnd() {
      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
    }

    window.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
    window.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
  }

  sticker.addEventListener('mousedown', startMove);
  sticker.addEventListener('touchstart', startMove, { passive: false });
  
}

function makeStickerResizable(sticker) {
  let initialDistance = null;
  let initialWidth = sticker.offsetWidth;
  let initialHeight = sticker.offsetHeight;

  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  sticker.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (e.touches.length === 2) {
      e.preventDefault();
      initialDistance = getDistance(e.touches);
      initialWidth = sticker.offsetWidth;
      initialHeight = sticker.offsetHeight;
    }
  }, { passive: false });

  sticker.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialDistance) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance;

      sticker.style.width = `${initialWidth * scale}px`;
      sticker.style.height = `${initialHeight * scale}px`;
    }
  }, { passive: false });

  sticker.addEventListener('touchend', () => {
    initialDistance = null;
  });
}
function clearStickersOnly() {
  const stickers = document.querySelectorAll('.draggable-sticker');
  

  stickers.forEach(sticker => {
    // Only remove clones by checking for a data attribute or parent location
    if (sticker.dataset.cloned === "true") {
      sticker.remove();
    }
  });
}
