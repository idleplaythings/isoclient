import GameScene from "./GameScene";
import World from "./World";
import GameCamera from "./GameCamera";
import { TileService } from "./tile";

class Game {
  constructor() {
    this.camera = new GameCamera();
    this.gameScene = new GameScene(this.camera);
    this.tileService = new TileService(this.gameScene, this.camera);
    this.world = new World(this.tileService);
    this.gameloop();

    this.lastRenderTime = null;
  }

  initRender(element) {
    this.gameScene.init(element);
  }

  gameloop() {
    const now = new Date().getTime();
    const delta = this.lastRenderTime !== null ? now - this.lastRenderTime : 0;
    this.lastRenderTime = now;

    this.gameScene.render();
    this.world.render();
    this.tileService.render();
    this.camera.render(delta);
    requestAnimationFrame(this.gameloop.bind(this));
  }
}

export default Game;
