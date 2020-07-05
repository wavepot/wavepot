export const white = async(context) => {

  return () => {
    return ((Math.random() * 2) - 1);
  }
}


export const brown = async (context) => {
  var lastOut = 0.0;
  var result = 0.0;
  var white = 0.0;

  return () => {
    white = Math.random() * 2 - 1;
    result = (lastOut + (0.02 * white)) / 1.02;
    lastOut = result;
    result *= 3.5;
    return result;
  }
}


export const pink = async(context) => {
  var b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  var white = 0.0;
  var result = 0.0;

  return () => {
    white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    result = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    result *= 0.11;

    return result;
  }
}
