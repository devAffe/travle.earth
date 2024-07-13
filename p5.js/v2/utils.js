function rng(max) {
  return Math.floor(Math.random() * max);
}

function removeValue(value, array) {
  array.splice(array.indexOf(value), 1);
}

//EXPORT
window.rng = rng;
window.removeValue = removeValue;
