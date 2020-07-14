export const impulse = async(context) => {
  var pulse = 0;
  return ({n}) => {
    pulse = (n === 0 ? 1 : 0);
    return pulse;
  }
}


export const dust = async(context, density) => {
  var pulse;

  return () => {
    if(Math.random() < density){
      pulse = Math.random();
      return pulse;
    }else {
      return 0;
    }
  }
}
