
module.exports = function(target, obj) {
  if (!obj) obj = target;
  for (var k in obj) {
    var val = obj[k];
    var _k = '_' + k;
    target[_k] = val;
    target[k] = Setter(_k);
  }
  return target;
};

function Setter(_k){
  return function(val){
    this[_k] = val;
    return this;
  };
}
