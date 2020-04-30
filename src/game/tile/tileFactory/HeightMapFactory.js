import { getColorIndicesForCoord } from "../../../util/imageUtils";

class HeightMapFactory {
  set(position, chunkSize, binaryChunk) {
    this.position = position;
    this.chunkSize = chunkSize;
    this.binaryChunk = binaryChunk;
  }

  getHeight(position) {
    /*
    if (this.position.x === 496 && this.position.y === -512) {
      if (position.x === 10 && position.y === 10) {
        return 0.5;
      }

      if (position.x === 10 && position.y === 11) {
        return 1.0;
      }

      if (position.x === 9 && position.y === 10) {
        return 0.5;
      }

      return 0;
    }

    if (this.position.x === 512 && this.position.y === -512) {
      if (position.x === 9 && position.y === 10) {
        return 0.5;
      }

      if (position.x === 8 && position.y === 8) {
        return 0.5;
      }

      if (position.x === 10 && position.y === 9) {
        return 0.5;
      }

      if (
        position.y < 3 ||
        position.y > 8 ||
        position.x < 3 ||
        position.x > 8
      ) {
        return 0;
      }

      if ([5].includes(position.x)) {
        return 1;
      }

      if ([5].includes(position.y)) {
        return 1;
      }

      return 0;
    }

    return 0;
  */

    return this.binaryChunk.getHeight(position);
  }
}

export const createHeightMap = (position, chunkSize, binaryChunk) => {
  let minHeight = null;
  let maxHeight = null;

  for (let x = -1; x <= chunkSize; x++) {
    for (let y = -1; y <= chunkSize; y++) {
      const tileSetPosition = { x: x + 1, y: y + 1 };

      let height = binaryChunk.getHeight(tileSetPosition);
      if (height < minHeight || minHeight === null) {
        minHeight = height;
      }

      if (height > maxHeight || maxHeight === null) {
        maxHeight = height;
      }
    }
  }

  const extra = 2;
  const heightData = new Uint8ClampedArray(
    (chunkSize + extra) * (chunkSize + extra) * 4
  );

  for (let x = -1; x <= chunkSize; x++) {
    for (let y = -1; y <= chunkSize; y++) {
      const tileSetPosition = { x: x + 1, y: y + 1 };

      const absoluteHeight = binaryChunk.getHeight(tileSetPosition);
      const [r, g, b, a] = getColorIndicesForCoord(
        tileSetPosition.x + extra / 2 - 1,
        tileSetPosition.y + extra / 2 - 1,
        chunkSize + extra
      );

      const height = absoluteHeight - minHeight;

      let colorHeight = ((255 * 3) / (chunkSize + 2)) * height;

      heightData[r] = colorHeight > 255 ? 255 : colorHeight;
      colorHeight = colorHeight >= 255 ? colorHeight - 255 : 0;
      heightData[g] = colorHeight > 255 ? 255 : colorHeight;
      colorHeight = colorHeight >= 255 ? colorHeight - 255 : 0;
      heightData[b] = colorHeight;
      heightData[a] = 1.0;
    }
  }

  return heightData;
};

export default HeightMapFactory;
