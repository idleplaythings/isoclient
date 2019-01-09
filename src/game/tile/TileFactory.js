import Tile from "./Tile";

class TileFactory {
  getSECorner(position, surfaceBrush, surfaceTexture, groundTexture = 80) {
    return new Tile(position, surfaceBrush, surfaceTexture, 52, groundTexture);
  }

  getRandomGround(position) {
    return new Tile(
      position,
      Math.floor(Math.random() * 4) + 0,
      this.getSurfacetexture()
    );
  }

  getSurfacetexture() {
    if (Math.random() > 0.9) {
      return Math.floor(Math.random() * 4) + 64;
    }
    return Math.floor(Math.random() * 4) + 66;
  }
}

export default TileFactory;
