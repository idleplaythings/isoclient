import TileFactory from "./TileFactory";
import TileBinaryChunk from "../TileBinaryChunk";
import ndarray from "ndarray";

const tileFactory = new TileFactory(16);

const create = (event) => {
  const { position, chunkSize, data, index, binaryChunkPosition } = event.data;

  const binaryChunk = new TileBinaryChunk(
    ndarray(new Uint8Array(data), [1026, 1026, 4])
  );

  binaryChunk.zoomToChunk(position, chunkSize);
  const constructedData = tileFactory.create(
    position,
    chunkSize,
    binaryChunk,
    binaryChunkPosition
  );
  binaryChunk.resetZoom();

  self.postMessage({ data: constructedData, position, index });
};

self.addEventListener("message", create);
