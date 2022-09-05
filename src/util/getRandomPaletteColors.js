var randomHexColor = function () {
  var color = "#",
    i = 5;
  do {
    color += "0123456789abcdef".substr(Math.random() * 16, 1);
  } while (i--);
  return color;
};

function getRandomPaletteColors() {
  return [
    randomHexColor(),
    randomHexColor(),
    randomHexColor(),
    randomHexColor(),
    randomHexColor(),
  ];
}

export default getRandomPaletteColors;
