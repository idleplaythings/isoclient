const groundBrush = { start: 1, amount: 4 };
const darkGrass = { start: 64, amount: 4 };
const grass = { start: 68, amount: 4 };

const rocks = { start: 231, amount: 5 };

const water = { start: 64, amount: 1 };

const shadowBottomLeftToUpperRight = { start: 16, amount: 1 };
const shadowUpperLeftToBottomRight = { start: 17, amount: 1 };
const shadowBottomLeftToUpperRightSmall = { start: 18, amount: 1 };
const shadowUpperLeftToBottomRightSmall = { start: 19, amount: 1 };
const shadowNE = { start: 20, amount: 1 };
const shadowSW = { start: 21, amount: 1 };
const shadowSWInverted = { start: 22, amount: 1 };
const shadowNEInverted = { start: 23, amount: 1 };
const shadowSELight = { start: 24, amount: 1 };
const shadowSEShadow = { start: 25, amount: 1 };
const shadowSEInvertedLight = { start: 26, amount: 1 };
const shadowSEInvertedShadow = { start: 27, amount: 1 };
const shadowNWLight = { start: 28, amount: 1 };
const shadowNW = { start: 29, amount: 1 };
const shadowNWInvertedLight = { start: 30, amount: 1 };
const shadowNWInvertedShadow = { start: 31, amount: 1 };

const grounBrushTile = { start: 52, amount: 1 };
const groundTexture = { start: 80, amount: 1 };

const grassClutter = { start: 245, amount: 7 };
const twigClutter = { start: 240, amount: 4 };
const mushroomClutter = { start: 252, amount: 4 };

export {
  groundBrush,
  darkGrass,
  grass,
  grassClutter,
  twigClutter,
  mushroomClutter,
  rocks,
  shadowBottomLeftToUpperRight,
  shadowUpperLeftToBottomRight,
  shadowBottomLeftToUpperRightSmall,
  shadowUpperLeftToBottomRightSmall,
  shadowNE,
  shadowSW,
  shadowSWInverted,
  shadowNEInverted,
  shadowSELight,
  shadowSEShadow,
  shadowNWLight,
  shadowNW,
  shadowSEInvertedLight,
  shadowSEInvertedShadow,
  shadowNWInvertedLight,
  shadowNWInvertedShadow,
  grounBrushTile,
  groundTexture
};
