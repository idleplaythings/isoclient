import TileFactory from "./TileFactory";
import TileBinaryChunk from "../TileBinaryChunk";
import ndarray from "ndarray";

const tileFactory = new TileFactory();

const create = event => {
  const { position, chunkSize, data, index } = event.data;

  const binaryChunk = new TileBinaryChunk(
    ndarray(new Uint8Array(data), [1026, 1026, 4])
  );

  binaryChunk.zoomToChunk(position, chunkSize, 2);
  const heights = tileFactory.createHeightInformation(chunkSize, binaryChunk);
  binaryChunk.resetZoom();

  binaryChunk.zoomToChunk(position, chunkSize);
  const tiles = tileFactory.create(position, chunkSize, binaryChunk);
  binaryChunk.resetZoom();

  self.postMessage({ tiles: tiles, position, index, heights });
};

self.addEventListener("message", create);
