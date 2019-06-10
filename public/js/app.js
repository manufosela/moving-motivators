let dragged;

/*
el.addEventListener("touchstart", dragstart, false);
el.addEventListener("touchend", dragend, false);
//el.addEventListener("touchcancel", handleCancel, false);
el.addEventListener("touchleave", dragleave, false);
//el.addEventListener("touchmove", handleMove, false);
*/

function drag(event) {

}

function dragstart(event) {
  dragged = event.target; // store a ref. on the dragged elem
  event.target.style.opacity = .5; // make it half transparent
}

function dragend(event) {
  event.target.style.opacity = ''; // reset the transparency
}

function dragover(event) {
  event.preventDefault(); // prevent default to allow drop
}

function dragenter(event) {
  // highlight potential drop target when the draggable element enters it
  if (event.target.className === 'dropzone') {
    event.target.style.background = 'purple';
  }
}

function dragleave(event) {
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className === 'dropzone') {
    event.target.style.background = '';
  }
}

function drop(event) {
  event.preventDefault(); // prevent default action (open as link for some elements)

  // move dragged elem to the selected drop target
  if (event.target.className === 'dropzone') {
    event.target.style.background = '';
    dragged.parentNode.removeChild(dragged);
    event.target.appendChild(dragged);
  }
}

function load() {
  const DaDZone = document.getElementById('draganddropzone');

  /* events fired on the draggable target */
  DaDZone.addEventListener('drag', drag, false);

  DaDZone.addEventListener('dragstart', dragstart, false);
  DaDZone.addEventListener('touchstart', dragstart, false);

  DaDZone.addEventListener('dragend', dragend, false);
  DaDZone.addEventListener('touchend', dragend, false);

  /* events fired on the drop targets */
  DaDZone.addEventListener('dragover', dragover, false);

  DaDZone.addEventListener('dragenter', dragenter, false);

  DaDZone.addEventListener('dragleave', dragleave, false);
  DaDZone.addEventListener('touchleave', dragleave, false);

  DaDZone.addEventListener('drop', drop, false);
}

document.addEventListener('DOMContentLoaded', load, false);