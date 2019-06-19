let dragged;
let selectedEl;
let database = firebase.database();

function saveSelected(el) {
  let posicion = el.id.replace('target', '');
  let motivator = el.querySelector('img').alt;
  let f = new Date();
  movingMotivators[motivator] = posicion;
  database.ref('users/' + uid).set({
    username: displayName,
    email: email,
    profile_picture: photoURL,
    data: movingMotivators,
    date: f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear()
  });
}

function dragstart(event) {
  dragged = event.target;
  event.target.style.opacity = .5;
}

function dragend(event) {
  event.target.style.opacity = '';
  saveSelected(event.target.parentElement);
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

function stopEvents() {
  event.preventDefault();
  event.stopPropagation();
}

function deSelectAllImages(el) {
  document.querySelectorAll('.sourcezone img[id^="source"]').forEach((ele) => {
    ele.className = '';
    ele.parentElement.querySelector('div').className = 'invisible';
  });
  document.querySelectorAll('.dropzone img[id^="source"]').forEach((ele) => {
    ele.className = '';
  });
  selectedEl = null;
}

function styleLupa(className) {
  if (selectedEl.parentElement.querySelector('div')) {
    selectedEl.parentElement.querySelector('div').className = className;
  }
}

function chooseSelectedElementClass(el) {
  if (el.className === 'selected') {
    el.className = '';
  } else {
    if (selectedEl !== el && el.id.match(/^source/)) {
      selectedEl = el;
      el.className = 'selected';
      styleLupa('vermas');
    }
  }
}

function isSelected(el) {
  if (el.className === 'selected') {
    el.className = '';
    styleLupa('invisible');
    selectedEl = null;
  } else {
    deSelectAllImages();
    chooseSelectedElementClass(el);
  }
}

function selectedSource(event) {
  stopEvents();
  let el = event.target;
  if (el.parentElement.className === 'sourcezone') {
    if (el.alt === '+') {
      selectedEl.parentElement.querySelector('div').className = 'invisible';
    } else {
      isSelected(el);
    }
  } else {
    isSelected(el)
  }
}

function selectedTarget(event) {
  event.preventDefault();
  let el = event.target;
  if (selectedEl) {
    styleLupa('invisible');
    if (selectedEl !== el) {
      el.appendChild(selectedEl);
      saveSelected(el);
      selectedEl.className = '';
      selectedEl = null;
    }
  }
}

function zoomTarget(event) {
  stopEvents();
  let el = event.target;
  el.parentElement.parentElement.querySelector('img[id^="source"]').className = 'gigante';
}

function mobileOption() {
  const aSource = document.querySelectorAll('div[class="sourcezone"] img');
  document.querySelectorAll('div[class="sourcezone"] img').forEach((ele) => {
    ele.addEventListener('click', selectedSource, false);
  });
  document.querySelectorAll('div[class="dropzone"]').forEach((ele) => {
    ele.addEventListener('click', selectedTarget, false);
  });
  document.querySelectorAll('div > img + div > img').forEach((ele) => {
    ele.addEventListener('click', zoomTarget, false);
  });
}

function resetValues() {
  database.ref('users/' + uid).set(null);
  location.href = location.href;
}

function load() {
  desktopOption();
  mobileOption();
  document.getElementById('reset-button').addEventListener('click', resetValues);
}

document.addEventListener('DOMContentLoaded', load, false);