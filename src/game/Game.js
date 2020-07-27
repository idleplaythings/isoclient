import GameScene from "./GameScene";
import GameCamera from "./GameCamera";
import { TileRenderer } from "./tile";
import TileLibrary from "./tile/TileLibrary/TileLibrary";
//import DemoWorldBuilder from "./demo/DemoWorldBuilder";
import CoornidateConverter from "./util/CoordinateConverter";
import GameCursor from "./GameCursor";
import MobileLibrary from "./mobile/MobileLibrary";
import GameServerConnection from "../gameServer/GameServerConnection";
import InteractionService from "./InteractionService";
import MobileActionService from "./mobile/mobileActions/MobileActionService";

class Game {
  constructor(dispatch, userId) {
    this.groundChunkSize = 16;

    this.uiStateDispatch = dispatch;
    this.userId = userId;

    this.camera = new GameCamera(this.uiStateDispatch);
    this.gameScene = new GameScene(this.camera);
    this.tileLibrary = new TileLibrary();

    this.gameServerConnector = new GameServerConnection(
      this,
      this.userId,
      this.uiStateDispatch
    );

    this.coordinateConverter = new CoornidateConverter(
      this.gameScene,
      this.camera,
      this.groundChunkSize
    );

    this.mobileLibrary = new MobileLibrary(
      this.userId,
      this.gameScene,
      this.tileLibrary,
      this.gameServerConnector
    );

    this.tileRenderer = new TileRenderer(
      this.gameScene,
      this.camera,
      this.tileLibrary,
      this.groundChunkSize
    );

    this.mobileActionService = new MobileActionService(
      this.mobileLibrary,
      this.tileLibrary,
      this.gameServerConnector
    );

    this.interactionService = new InteractionService(
      this.tileLibrary,
      this.mobileLibrary,
      this.coordinateConverter,
      this.uiStateDispatch,
      this.mobileActionService
    );
    this.gameServerConnector.connect();

    this.gameCursor = new GameCursor(this.gameScene);

    //new DemoWorldBuilder(this.tileLibrary).create();

    this.lastSend = null;
    this.messageRandom = Math.random();

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

    /*
    if (this.lastSend === null || now - this.lastSend > 10000) {
      this.gameServerConnector.sendMessage(`hi ${this.messageRandom}`);
      this.lastSend = now;
    }
    */

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

  onMouseUp(position, button) {
    if (button === 2) {
      this.interactionService.rightClick(position);
    } else {
      this.interactionService.leftClick(position);
    }
  }
}

export default Game;
