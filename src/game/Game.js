import GameScene from "./GameScene";
import World from "./World";
import GameCamera from "./GameCamera";
import { TileRenderer, TileLibrary } from "./tile";

class Game {
  constructor() {
    this.camera = new GameCamera();
    this.gameScene = new GameScene(this.camera);
    this.tileLibrary = new TileLibrary();
    this.tileRenderer = new TileRenderer(
      this.gameScene,
      this.camera,
      this.tileLibrary
    );
    this.world = new World(this.tileLibrary);
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
    this.tileRenderer.render();
    this.camera.render(delta);
    requestAnimationFrame(this.gameloop.bind(this));
  }
}

export default Game;
