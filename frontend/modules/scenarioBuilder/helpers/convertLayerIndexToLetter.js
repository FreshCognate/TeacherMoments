export default (layerIndex) => {
  const number = layerIndex + 1;
  const numAbbr = num => num <= 0 ? '' : numAbbr(Math.floor((num - 1) / 26)) + String.fromCharCode((num - 1) % 26 + 65);
  return numAbbr(number);
}