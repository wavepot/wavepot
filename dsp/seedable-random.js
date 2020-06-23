var seed = new Date().getTime();

function random() {
  return Math.abs(1 - (2 * ( seed++ / .8765111159592828 ) ) % 2)
}

random.seed = function(newSeed) {
	seed = newSeed;
}

export default random;
