import GameScene from "./GameScene";
import World from "./World";
import { TileService } from "./tile";

class Game {
  constructor() {
    this.gameScene = new GameScene();
    this.world = new World(new TileService(this.gameScene));
    this.gameloop();
  }

  initRender(element) {
    this.gameScene.init(element);
  }

  gameloop() {
    this.gameScene.render();
    this.world.render();
    requestAnimationFrame(this.gameloop.bind(this));
  }
}

export default Game;
