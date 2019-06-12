let dragged;
let selectedEl;

function dragstart(event) {
  dragged = event.target;
  event.target.style.opacity = .5;
}

function dragend(event) {
  event.target.style.opacity = '';
}

function dragover(event) {
  event.preventDefault(); // prevent default to allow drop
}

function dragenter(event) {
  if (event.target.className === 'dropzone') {
    event.target.style.background = 'purple';
  }
}

function dragleave(event) {
  if (event.target.className === 'dropzone') {
    event.target.style.background = '';
  }
}

function drop(event) {
  event.preventDefault();
  if (event.target.className === 'dropzone') {
    event.target.style.background = '';
    dragged.className = '';
    selectedEl = null;
    dragged.parentNode.removeChild(dragged);
    event.target.appendChild(dragged);
  }
}

function desktopOption() {
  const DaDZone = document.getElementById('draganddropzone');
  /* events fired on the draggable target */
  DaDZone.addEventListener('dragstart', dragstart, false);
  DaDZone.addEventListener('dragend', dragend, false);
  /* events fired on the drop targets */
  DaDZone.addEventListener('dragover', dragover, false);
  DaDZone.addEventListener('dragenter', dragenter, false);
  DaDZone.addEventListener('dragleave', dragleave, false);
  DaDZone.addEventListener('drop', drop, false);
}

function selectedSource(event) {
  let el = event.target;
  document.querySelectorAll('div img').forEach((ele) => { 
    ele.className = '';
  });
  if (el.className === 'selected') {
    el.className = '';
  } else {
    if (selectedEl !== el) {
      selectedEl = el;
      el.className = 'selected';
    } else {
      selectedEl = null;
    }
  }
}

function selectedTarget(event) {
  let el = event.target;
  if (selectedEl) {
    el.appendChild(selectedEl);
    selectedEl.className = '';
    selectedEl = null;
  }
}

function mobileOption() {
  const aSource = document.querySelectorAll('div[class="sourcezone"] img');
  document.querySelectorAll('div[class="sourcezone"] img').forEach((ele) => {
    ele.addEventListener('click', selectedSource, false);
  });
  document.querySelectorAll('div[class="dropzone"]').forEach((ele) => {
    ele.addEventListener('click', selectedTarget, false);
  });
}

function load() {
  desktopOption();
  mobileOption();
}

document.addEventListener('DOMContentLoaded', load, false);




