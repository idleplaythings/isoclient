import GameScene from "./GameScene";
import GameCamera from "./GameCamera";
import { TileRenderer } from "./tile";
import TileLibrary from "./tile/TileLibrary/TileLibrary";
import DemoWorldBuilder from "./demo/DemoWorldBuilder";
import CoornidateConverter from "./util/CoordinateConverter";
import GameCursor from "./GameCursor";
import MobileLibrary from "./mobile/MobileLibrary";
import ControllableMobile from "./mobile/ControllableMobile";
import GameServerConnection from "../gameServer/GameServerConnection";

class Game {
  constructor() {
    this.groundChunkSize = 16;
    this.camera = new GameCamera();
    this.gameScene = new GameScene(this.camera);
    this.tileLibrary = new TileLibrary();
    //this.world = new World(this.tileLibrary);

    this.coordinateConverter = new CoornidateConverter(
      this.gameScene,
      this.camera,
      this.groundChunkSize
    );

    this.mobileLibrary = new MobileLibrary(this.gameScene, this.tileLibrary);

    this.tileRenderer = new TileRenderer(
      this.gameScene,
      this.camera,
      this.tileLibrary,
      this.groundChunkSize
    );

    this.gameServerConnector = new GameServerConnection();
    this.gameServerConnector.connect();

    this.gameCursor = new GameCursor(this.gameScene);

    //new DemoWorldBuilder(this.tileLibrary).create();

    this.lastSend = null;
    this.messageRandom = Math.random();

    const character = new ControllableMobile(this.gameScene);
    character.setPositionAndGamePosition({ x: 510, y: 512, z: 2 });
    this.mobileLibrary.add(character);

    this.lastRenderTime = null;
    this.gameloop();
  }

  initRender(element) {
    this.gameScene.init(element);
  }

  onResize() {
    this.gameScene.onResize();
    this.camera.onResize();
  }

  gameloop() {
    const now = Date.now();
    const delta = this.lastRenderTime !== null ? now - this.lastRenderTime : 0;
    this.lastRenderTime = now;

    const payload = {
      now,
      delta,
    };

    if (this.lastSend === null || now - this.lastSend > 10000) {
      this.gameServerConnector.sendMessage(`hi ${this.messageRandom}`);
      this.lastSend = now;
    }

    //this.world.render();
    this.tileRenderer.render(payload);
    this.mobileLibrary.render(payload);
    this.camera.render(delta);
    this.gameScene.render();
    requestAnimationFrame(this.gameloop.bind(this));
  }

  onMouseMove(position) {
    const worldPostion = this.coordinateConverter.fromViewPortToGame(position);
    this.gameCursor.onMouseMove(worldPostion);
    if (worldPostion.mobiles.length > 0) {
      this.mobileLibrary.mouseOverMobile(worldPostion.mobiles[0]);
    }
  }

  onMouseUp(position) {
    const worldPostion = this.coordinateConverter.fromViewPortToGame(position);

    if (worldPostion.mobiles.length > 0) {
      this.mobileLibrary.clickMobile(worldPostion.mobiles[0]);
    } else {
      this.mobileLibrary.clickTile(worldPostion.tile);
    }
  }
}

export default Game;
