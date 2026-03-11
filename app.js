'use strict';

// ===== ExpressionController =====
const ExpressionController = (() => {
  const EXPRESSIONS = ['normal', 'happy', 'surprised', 'thinking', 'shy'];
  const LABELS = {
    normal:    '',
    happy:     '😄',
    surprised: '😲',
    thinking:  '🤔',
    shy:       '😊',
  };

  let currentIndex = 0;
  let tempTimer = null;
  const character = document.getElementById('character');
  const label = document.getElementById('expr-label');

  function setExpression(name) {
    EXPRESSIONS.forEach(e => character.classList.remove(`expr-${e}`));
    character.classList.add(`expr-${name}`);
    label.textContent = LABELS[name] ?? '';
    currentIndex = EXPRESSIONS.indexOf(name);
    if (currentIndex === -1) currentIndex = 0;
  }

  function next() {
    currentIndex = (currentIndex + 1) % EXPRESSIONS.length;
    setExpression(EXPRESSIONS[currentIndex]);
  }

  return { setExpression, next };
})();


// ===== DragController =====
const DragController = (() => {
  const el = document.getElementById('character');
  let startX, startY, offsetX, offsetY;
  let isDragging = false;
  let hasMoved = false;
  let moved = false;
  const DRAG_THRESHOLD = 5;

  function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

  function onPointerDown(e) {
    e.preventDefault();
    isDragging = true;
    hasMoved = false;
    moved = false;

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    startX = e.clientX;
    startY = e.clientY;

    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.sqrt(dx * dx + dy * dy) >= DRAG_THRESHOLD) {
      if (!moved) {
        moved = true;
        el.classList.add('is-dragging');
      }
      hasMoved = true;

      const newLeft = clamp(e.clientX - offsetX, 0, window.innerWidth - 160);
      const newTop  = clamp(e.clientY - offsetY, 0, window.innerHeight - 160);
      el.style.left = newLeft + 'px';
      el.style.top  = newTop  + 'px';
    }
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    el.classList.remove('is-dragging');

    if (!hasMoved) {
      ExpressionController.next();
    }
  }

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup',   onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
})();
