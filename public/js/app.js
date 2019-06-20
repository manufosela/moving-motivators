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

function styleLupa(className, el) {
  if (el.parentElement.querySelector('div')) {
    el.parentElement.querySelector('div').className = className;
  }
}

function deselected(el) {
  el.className = '';
  styleLupa('invisible', el);
  selectedEl = null;
}

function chooseSelectedElementClass(el) {
  if (el.className === 'selected') {
    el.className = '';
  } else {
    if (selectedEl !== el && el.id.match(/^source/)) {
      selectedEl = el;
      el.className = 'selected';
      styleLupa('vermas', selectedEl);
    }
  }
}

function isSelected(el) {
  if (el.className === 'selected') {
    deselected(el);
  } else {
    deSelectAllImages();
    chooseSelectedElementClass(el);
  }
}

function swapElements(el1, el2) {
  let t1 = el1.parentElement;
  let t2 = el2.parentElement;
  t1.removeChild(el1);
  t2.removeChild(el2);
  t1.insertAdjacentElement('afterbegin', el2)
  t2.insertAdjacentElement('afterbegin', el1);
}

function selectedSource(event) {
  stopEvents();
  let el = event.target;
  if (el.parentElement.className === 'sourcezone') {
    if (el.alt === '+') {
      styleLupa('invisible', selectedEl);
    } else {
      isSelected(el);
    }
  } else if (el.id.match(/^source/) && selectedEl && selectedEl !== el ) {
    swapElements(el, selectedEl);
    deselected(el);
  } else {
    isSelected(el)
  }
  
}

function selectedTarget(event) {
  event.preventDefault();
  let el = event.target;
  if (selectedEl) {
    styleLupa('invisible', selectedEl);
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