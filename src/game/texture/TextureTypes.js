const groundBrush = { start: 1, amount: 4 };

const groundBrush_slopeS = { start: 112, amount: 1 };
const groundBrush_slopeE = { start: 113, amount: 1 };
const groundBrush_slopeSE = { start: 114, amount: 1 };
const groundBrush_slopeNW = { start: 115, amount: 1 };
const groundBrush_slopeN = { start: 116, amount: 1 };
const groundBrush_slopeW = { start: 117, amount: 1 };

const mask_slopeS_bottom = { start: 128, amount: 1 };
const mask_slopeS_top = { start: 129, amount: 1 };
const mask_slopeSE_bottom = { start: 130, amount: 1 };
const mask_slopeSE_top = { start: 131, amount: 1 };
const mask_slopeE_top = { start: 132, amount: 1 };
const mask_slopeE_bottom = { start: 133, amount: 1 };
const mask_slopeNW_inverted_top = { start: 134, amount: 1 };
const mask_slopeNW_top = { start: 135, amount: 1 };
const mask_slopeN_bottom = { start: 136, amount: 1 };
const mask_slopeW_bottom = { start: 137, amount: 1 };
const mask_slopeNE_bottom = { start: 138, amount: 1 };
const mask_slopeSW_bottom = { start: 139, amount: 1 };
const mask_slopeSEInverted_bottom = { start: 140, amount: 1 };
const mask_slopeSWInverted_bottom = { start: 141, amount: 1 };
const mask_slopeNWInverted_bottom = { start: 142, amount: 1 };
const mask_slopeNEInverted_bottom = { start: 143, amount: 1 };

const groundBrushCoast = { start: 32, amount: 4 };

const darkGrass = { start: 64, amount: 4 };
const grass = { start: 68, amount: 4 };
const mud = { start: 72, amount: 4 };
const oceanFloor = { start: 76, amount: 4 };

const rocks = { start: 231, amount: 5 };
const bushes = { start: 236, amount: 1 };

const shadow_box = { start: 16, amount: 1 };
const highlight_box = { start: 17, amount: 1 };
const strong_highlight_low_shadow_box = { start: 18, amount: 1 };
const weak_highlight_strong_highlight_diagonal = { start: 19, amount: 1 };
const shadow_box_stonger = { start: 20, amount: 1 };
const highlight_box_stonger = { start: 21, amount: 1 };
const shadow_low_high_diagonal = { start: 22, amount: 1 };
const shadow_high_low_diagonal = { start: 23, amount: 1 };
const low_highlight_strong_shadow = { start: 24, amount: 1 };
const strong_shadow_low_highlight = { start: 25, amount: 1 };
const weak_shadow_strong_highlight = { start: 26, amount: 1 };
const strong_highlight_weak_highlight_diagonal = { start: 27, amount: 1 };
const shadow_NEInverted = { start: 28, amount: 1 };
const shadow_N = { start: 29, amount: 1 };
const shadow_W = { start: 30, amount: 1 };
const shadow_NWInvereted = { start: 31, amount: 1 };

const grounBrushTile = { start: 52, amount: 1 };
const groundTexture = { start: 80, amount: 1 };

const grassClutter = { start: 245, amount: 7 };
const twigClutter = { start: 240, amount: 4 };
const mushroomClutter = { start: 252, amount: 4 };

const weedsFront = { start: 224, amount: 4 };
const weedsBack = { start: 228, amount: 3 };

const largeFoliage = { start: 256, amount: 4 };

export {
  groundBrush,
  darkGrass,
  grass,
  grassClutter,
  twigClutter,
  mushroomClutter,
  rocks,
  shadow_box,
  highlight_box,
  strong_highlight_low_shadow_box,
  weak_highlight_strong_highlight_diagonal,
  shadow_box_stonger,
  highlight_box_stonger,
  shadow_low_high_diagonal,
  shadow_high_low_diagonal,
  low_highlight_strong_shadow,
  strong_shadow_low_highlight,
  weak_shadow_strong_highlight,
  strong_highlight_weak_highlight_diagonal,
  shadow_NEInverted,
  grounBrushTile,
  groundTexture,
  water,
  groundBrushCoast,
  groundBrush_slopeS,
  groundBrush_slopeE,
  groundBrush_slopeSE,
  groundBrush_slopeNW,
  groundBrush_slopeN,
  groundBrush_slopeW,
  mask_slopeS_bottom,
  mask_slopeS_top,
  mask_slopeSE_bottom,
  mask_slopeSE_top,
  mask_slopeE_top,
  mask_slopeE_bottom,
  mask_slopeNW_inverted_top,
  mask_slopeNW_top,
  mask_slopeN_bottom,
  mask_slopeW_bottom,
  mask_slopeNE_bottom,
  mask_slopeSW_bottom,
  mask_slopeSEInverted_bottom,
  mask_slopeSWInverted_bottom,
  mask_slopeNWInverted_bottom,
  mask_slopeNEInverted_bottom,
  shadow_N,
  shadow_W,
  shadow_NWInvereted,
  weedsFront,
  weedsBack,
  bushes,
  mud,
  oceanFloor,
  largeFoliage
};
