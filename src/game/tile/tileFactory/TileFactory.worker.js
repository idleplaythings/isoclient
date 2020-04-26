import TileFactory from "./TileFactory";
import TileBinaryChunk from "../TileBinaryChunk";
import ndarray from "ndarray";

const tileFactory = new TileFactory();

const create = (event) => {
  const { position, chunkSize, data, index } = event.data;

  const binaryChunk = new TileBinaryChunk(
    ndarray(new Uint8Array(data), [1026, 1026, 4])
  );

  binaryChunk.zoomToChunk(position, chunkSize);
  const [propData, heightData] = tileFactory.create(
    position,
    chunkSize,
    binaryChunk
  );
  binaryChunk.resetZoom();

  self.postMessage({ propData, heightData, position, index });
};

self.addEventListener("message", create);
