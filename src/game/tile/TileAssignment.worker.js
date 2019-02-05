const create = event => {
  const { tiles, size, containerCount } = event.data;
  let tileIndex = 0;

  const lists = [];

  for (let container = 0; container < containerCount; container++) {
    const offsets = [];
    const opacitys = [];
    const texture1Numbers = [];
    const texture2Numbers = [];
    const types = [];

    for (let i = 0; i < size; i++) {
        const tile = tiles[tileIndex];

        if (!tile) {
            offsets.push(0, 0, 0.5);
            opacitys.push(0);
            texture1Numbers.push(-1, -1, -1, -1);
            texture2Numbers.push(-1, -1, -1, -1);
            types.push(0, 1, 0);
        } else {
            offsets.push(tile[0], tile[1], tile[2]);
            opacitys.push(1);
            texture1Numbers.push(tile[3], tile[4], tile[5], tile[6]);
            texture2Numbers.push(tile[7], tile[8], tile[9], tile[10]);
            types.push(tile[11], tile[12], tile[13]);
        }

        tileIndex++;
    }

    lists.push([
        new Float32Array(opacitys),
        new Float32Array(offsets),
        new Float32Array(texture1Numbers),
        new Float32Array(texture2Numbers),
        new Float32Array(types),
    ]);
    


    };

  self.postMessage({lists});
};

self.addEventListener("message", create);
