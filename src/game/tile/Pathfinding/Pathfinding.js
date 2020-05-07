import Graph from "./Graph";
import { astar } from "./AStar";

export const findPath = (start, end, tileBinaryChunks, dynamicEntityCache) => {
  const graph = new Graph(tileBinaryChunks, dynamicEntityCache);
  return astar.search(graph, start, end);
};
