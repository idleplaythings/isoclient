import TileBinaryChunk from "../TileBinaryChunk";
import ndarray from "ndarray";
import DynamicEntitiesCache from "./DynamicEntitiesCache";
import { findPath } from "../Pathfinding/Pathfinding";

const dynamicEntityCache = new DynamicEntitiesCache();

const create = (event) => {
  const { start, end, chunks, dynamicEntities } = event.data;

  const binaryChunks = chunks.map((data) =>
    new TileBinaryChunk().deserialize(data)
  );
  dynamicEntityCache.setEntities(dynamicEntities);

  //const startTime = performance.now();
  const path = findPath(start, end, binaryChunks, dynamicEntityCache);
  //const totalTime = performance.now() - startTime;
  //console.log("pathfinding took", totalTime);

  self.postMessage({ path: path });
};

self.addEventListener("message", create);
