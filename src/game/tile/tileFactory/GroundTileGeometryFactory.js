import { Face3, Vector3, Vector2, Geometry } from "three";

const FACE_VERTICES = [
  [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0.5, y: -0.5 }],
  [{ x: 0, y: 0 }, { x: 0.5, y: -0.5 }, { x: 1, y: 0 }],
  [{ x: 0.5, y: -0.5 }, { x: 1, y: -1 }, { x: 1, y: 0 }],
  [{ x: 0.5, y: -0.5 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
];

class GroundTileGeometryFactory {
  constructor(size) {
    this.geometry = null;
    this.croppedGeometry = null;
    this.size = (size + 2) * 2;
    this.create();
  }

  calculateHeightData(heightMapFactory) {
    this.geometry.vertices.forEach((vertex) => {
      vertex.z = 0;
    });

    this.geometry.vertices.forEach((vertex) => {
      const listPosition = this.fromPositionToListPosition(vertex);
      const tileSetPosition = {
        x: Math.floor(listPosition.x / 2),
        y: Math.floor(listPosition.y / 2),
      };

      if (listPosition.x % 2 === 1 && listPosition.y % 2 === 1) {
        vertex.z = heightMapFactory.getHeight(tileSetPosition);
        //console.log(vertex.z);
      }
    });

    let touchedIndices = [];

    this.geometry.vertices.forEach((vertex) => {
      const lp = this.fromPositionToListPosition(vertex);

      if (lp.x % 2 === 1 && lp.y % 2 === 1) {
        [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: 1, y: 0 },
          { x: -1, y: 0 },
        ].forEach((offset) =>
          this.setAdjacentHeight(vertex, offset, touchedIndices)
        );
      }
    });

    this.geometry.vertices.forEach((vertex) => {
      const lp = this.fromPositionToListPosition(vertex);

      if (lp.x % 2 === 0 && lp.y % 2 === 0) {
        this.setCornerHeight(vertex);
      }
    });

    touchedIndices = [];

    this.geometry.vertices.forEach((vertex) => {
      const lp = this.fromPositionToListPosition(vertex);

      if (lp.x % 2 === 1 && lp.y % 2 === 1) {
        [
          { x: 0.5, y: -0.5 },
          { x: 0.5, y: 0.5 },
          { x: -0.5, y: -0.5 },
          { x: -0.5, y: 0.5 },
        ].forEach((offset) =>
          this.setInnerHeight(vertex, offset, touchedIndices)
        );
      }
    });

    return this.crop(this.geometry.clone()).vertices;
  }

  setInnerHeight(centerVertex, offset, touchedIndices) {
    const adjacentOffsets = [
      { x: 0.5, y: -0.5 },
      { x: 0.5, y: 0.5 },
      { x: -0.5, y: -0.5 },
      { x: -0.5, y: 0.5 },
    ];

    const currentIndex = this.getVerticleIndexForCoord(
      centerVertex.clone().add(offset)
    );

    if (touchedIndices.includes(currentIndex)) {
      throw new Error("This should not happen");
    }

    const currentVertex = this.geometry.vertices[currentIndex];

    const heights = adjacentOffsets
      .map((adjacentOffset) => {
        const adjacentVertex = this.geometry.vertices[
          this.getVerticleIndexForCoord(
            currentVertex.clone().add(adjacentOffset)
          )
        ];

        return adjacentVertex ? adjacentVertex.z : null;
      })
      .filter((height) => height !== null);

    currentVertex.z = heights.reduce((a, h) => a + h, 0) / heights.length;
  }

  setCornerHeight(currentVertex) {
    const adjacentOffsets = [
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: -1, y: 1 },
    ];

    const heights = adjacentOffsets
      .map((adjacentOffset) => {
        const adjacentVertex = this.geometry.vertices[
          this.getVerticleIndexForCoord(
            currentVertex.clone().add(adjacentOffset)
          )
        ];

        return adjacentVertex ? adjacentVertex.z : null;
      })
      .filter((height) => height !== null);

    currentVertex.z = heights.reduce((a, h) => a + h, 0) / heights.length;
  }

  setAdjacentHeight(centerVertex, offset, touhcedIndices) {
    const currentIndex = this.getVerticleIndexForCoord(
      centerVertex.clone().add(offset)
    );

    if (touhcedIndices.includes(currentIndex)) {
      return;
    }

    const currentVertex = this.geometry.vertices[currentIndex];

    const adjacentVertex = this.geometry.vertices[
      this.getVerticleIndexForCoord(currentVertex.clone().add(offset))
    ];

    if (!adjacentVertex) {
      currentVertex.z = centerVertex.z;
    } else {
      currentVertex.z = (adjacentVertex.z + centerVertex.z) / 2;
    }
    touhcedIndices.push(currentIndex);
  }

  create() {
    if (this.croppedGeometry) {
      return this.croppedGeometry.clone();
    }

    const data = {
      vertices: [],
      faces: [],
      uvs: [],
    };

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.buildTile({ x, y }, data);
      }
    }

    this.geometry = new Geometry();
    this.geometry.vertices = data.vertices;
    this.geometry.faces = data.faces;
    this.geometry.faceVertexUvs = [data.uvs];

    this.croppedGeometry = this.crop(this.geometry.clone());
    return this.croppedGeometry.clone();
  }

  crop(geometry) {
    const droppedFaceIndices = [];

    geometry.faces.forEach((face, index) => {
      if (
        [face.a, face.b, face.c].some((verticeIndex) => {
          const vertice = geometry.vertices[verticeIndex];
          const listPosition = this.fromPositionToListPosition(vertice);
          //console.log(vertice, listPosition);
          if (
            listPosition.x < 2 ||
            listPosition.x > this.size - 2 ||
            listPosition.y < 2 ||
            listPosition.y > this.size - 2
          ) {
            return true;
          }
          return false;
        })
      ) {
        droppedFaceIndices.push(index);
      }
    });

    geometry.faces = geometry.faces.filter(
      (_, i) => !droppedFaceIndices.includes(i)
    );

    geometry.faceVertexUvs[0] = geometry.faceVertexUvs[0].filter(
      (_, i) => !droppedFaceIndices.includes(i)
    );

    geometry.scale(0.5, 0.5, 1.0);
    return geometry;
  }

  buildTile(facePosition, data) {
    FACE_VERTICES.forEach((positions) =>
      this.buildFace(positions, facePosition, data)
    );
  }

  buildFace(positions, facePosition, data) {
    const [v1, v2, v3] = positions.map((position) => {
      const geometryPosition = this.createPosition(position, facePosition);
      return {
        i: this.setVerticleIndexForCoord(geometryPosition, data),
        position: geometryPosition,
      };
    });

    data.faces.push(new Face3(v1.i, v2.i, v3.i, new Vector3(0, 0, 1)));

    data.uvs.push([
      this.calculateUv(v1),
      this.calculateUv(v2),
      this.calculateUv(v3),
    ]);
  }

  calculateUv(v) {
    let pos = this.fromPositionToListPosition(v.position);

    pos = {
      x: pos.x - 2,
      y: pos.y - 2,
    };

    /*
    return vec2(
      vUv.x * (1.0 - groundTileSize * 2.0) + groundTileSize,
      vUv.y * (1.0 - groundTileSize * 2.0) + groundTileSize
    );
    */

    const uv = new Vector2(
      pos.x / (this.size - 4),
      1 - pos.y / (this.size - 4)
    );

    //console.log(pos.x, pos.y);
    return uv;
  }

  createPosition(position, facePosition) {
    return new Vector3(
      position.x + facePosition.x - this.size / 2,
      position.y - facePosition.y + this.size / 2,
      0
    );
  }

  fromPositionToListPosition(position) {
    return {
      x: position.x + this.size / 2,
      y: (position.y - this.size / 2) * -1,
    };
  }

  fromListPositionToPosition(position) {
    return new Vector3(
      position.x - this.size / 2,
      (position.y + this.size / 2) * -1,
      0
    );
  }

  getVerticleIndexForCoord(position) {
    const listPosition = this.fromPositionToListPosition(position);

    let index = null;

    if (listPosition.x % 1 > 0 || listPosition.y % 1 > 0) {
      const startIndex = (this.size + 1) * (this.size + 1);
      index = this.getIndexForCoord(listPosition, this.size) + startIndex;
    } else {
      index = this.getIndexForCoord(listPosition, this.size + 1);
    }

    return index;
  }

  setVerticleIndexForCoord(position, data) {
    let index = this.getVerticleIndexForCoord(position);
    data.vertices[index] = position;

    return index;
  }

  getIndexForCoord = (pos, width) => {
    const index = Math.floor(pos.y) * width + Math.floor(pos.x);
    return index;
  };
}

export default GroundTileGeometryFactory;
