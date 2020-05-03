import GameScene from "./GameScene";
import GameCamera from "./GameCamera";
import { TileRenderer } from "./tile";
import TileLibrary from "./tile/TileLibrary/TileLibrary";
import DemoWorldBuilder from "./demo/DemoWorldBuilder";

class Game {
  constructor() {
    this.camera = new GameCamera();
    this.gameScene = new GameScene(this.camera);
    this.tileLibrary = new TileLibrary();
    //this.world = new World(this.tileLibrary);

    this.tileRenderer = new TileRenderer(
      this.gameScene,
      this.camera,
      this.tileLibrary
    );

    new DemoWorldBuilder(this.tileLibrary).create();

    this.lastRenderTime = null;
    this.gameloop();
  }

  initRender(element) {
    this.gameScene.init(element);
  }

  gameloop() {
    const now = Date.now();
    const delta = this.lastRenderTime !== null ? now - this.lastRenderTime : 0;
    this.lastRenderTime = now;

    //this.world.render();
    this.tileRenderer.render({ now, delta });
    this.camera.render(delta);
    this.gameScene.render();
    requestAnimationFrame(this.gameloop.bind(this));
  }

  onMouseMove(position) {}
}

export default Game;
