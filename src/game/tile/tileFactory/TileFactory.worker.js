import TileFactory from "./TileFactory";
import TileBinaryChunk from "../TileBinaryChunk";
import ndarray from "ndarray";

const tileFactory = new TileFactory();

const create = event => {
  const { position, chunkSize, data, index } = event.data;

  const binaryChunk = new TileBinaryChunk(
    ndarray(new Uint8Array(data), [1026, 1026, 4])
  );

  console.log("position", position);

  binaryChunk.zoomToChunk(position, chunkSize);
  const heights = tileFactory.createHeightInformation(
    position,
    chunkSize,
    binaryChunk
  );
  const tiles = tileFactory.create(position, chunkSize, binaryChunk);
  binaryChunk.resetZoom();

  self.postMessage({ tiles: tiles, position, index, heights });
};

self.addEventListener("message", create);
