let dragged;
let selectedEl;
const database = firebase.database();
let refBBDD;

function readData(refBBDDReceived) {
  refBBDD = refBBDDReceived;
  const database = firebase.database();
  database.ref(`${refBBDD}/${uid}`).once('value').then(function(snapshot) {
    // document.querySelector('.layer-login').removeChild = errormsg;
    const data = snapshot.val();
    if (data) {
      movingMotivators = data.data;
      Object.keys(movingMotivators).forEach((el) => {
        const mmv = document.querySelector('img[alt="' + el + '"]');
        const target = document.querySelector('div[id=target' + movingMotivators[el] + ']');
        target.appendChild(mmv);
      });
    }
  }).catch(function(error) {
    hideApp();
    console.log(error);
    errormsg.className = 'user';
    errormsg.innerText = 'Ocurrio un error en la aplicación. Mánu es un pakete.';
    document.querySelector('.layer-login').appendChild(errormsg);
  });
}

function showBubbleFieldMsg(bubble, el) {
  bubble.classList.remove('invisible');
  const offset = 40;
  const pos = el.getClientRects();
  const bubbleTop = pos[0].top + scrollY + 200;
  bubble.style.opacity = 1;
  bubble.style.top = bubbleTop + 'px';
  bubble.style.left = (pos[0].left + 40) + 'px';
  let opacity = 1;
  let idInterval = setInterval(() => {
    const val = parseInt(bubble.style.top) - 2;
    if (val < bubbleTop - offset) {
      clearInterval(idInterval);
      bubble.classList.add('invisible');
    }
    opacity -= 0.01;
    bubble.style.opacity = opacity;
    bubble.style.top = val + 'px';
  }, 50);
}

function saveSelected(el) {
  const bubble = document.querySelector('#bubbleSaved');
  showBubbleFieldMsg(bubble, el);
  let posicion = el.id.replace('target', '');
  let motivator = el.querySelector('img').alt;
  let f = new Date();
  movingMotivators[motivator] = posicion;
  database.ref(`${refBBDD}/${uid}`).set({
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
  t1.insertAdjacentElement('afterbegin', el2);
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
  } else if (el.id.match(/^source/) && selectedEl && selectedEl !== el) {
    let copyselected = selectedEl;
    deselected(el);
    deselected(copyselected);
    swapElements(el, copyselected);
  } else {
    isSelected(el);
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
  database.ref(`${refBBDD}/${uid}`).set(null);
  location.href = location.href;
}

function load() {
  desktopOption();
  mobileOption();
  document.getElementById('reset-button').addEventListener('click', resetValues);
}

document.addEventListener('DOMContentLoaded', load, false);