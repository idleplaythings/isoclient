import {
  MOBILE_SPAWNED,
  MOBILE_DESPAWNED,
  MOVE_REQUEST,
  MOBILE_MOVE,
  MOBILE_MOVE_FAILED,
  MOBILE_MOVE_REQUEST_FAILED,
  WORK_PROP_REQUEST,
} from "../model/message.mjs";
import { UiStateMessages } from "../ui/UiState";

class GameServerConnection {
  constructor(game, userId, uiStateDispatch) {
    this.userId = userId;
    this.game = game;
    this.uiStateDispatch = uiStateDispatch;
    this.webSocket = null;
    this.open = false;
    this.connection = null;
    this.connectionResolve = null;
  }

  async deactivate() {
    const connection = await this.connection;
    connection.close();
  }

  connect(timeout = 0) {
    this.open = true;
    this.connection = new Promise((resolve) => {
      setTimeout(() => {
        this.webSocket = new WebSocket(`ws://localhost:4000/${this.userId}`);
        console.log("connecting websocket");
        this.connectionResolve = resolve;
        this.webSocket.onerror = this.onError.bind(this);
        this.webSocket.onmessage = this.onMessage.bind(this);
        this.webSocket.onclose = this.onClose.bind(this);
        this.webSocket.onopen = this.onOpen.bind(this);
      }, timeout);
    });
  }

  async sendMessage(message) {
    const connection = await this.connection;
    console.log("sending", message);
    connection.send(JSON.stringify({ message }));
  }

  async sendMoveRequest(mobile, position) {
    const payload = [mobile.id];
    if (position) {
      payload.push(position.x, position.y, position.z);
    }

    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: MOVE_REQUEST,
        payload,
      })
    );
  }

  async sendWorkPropRequest(mobile, position, propTypeId) {
    console.log("request to harvest", position, propTypeId);

    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: WORK_PROP_REQUEST,
        payload: [mobile.id, position.x, position.y, position.z, propTypeId],
      })
    );
  }

  async disconnect() {
    this.open = false;
    (await this.connection).close();
  }

  onOpen() {
    this.uiStateDispatch({
      type: UiStateMessages.SET_NETWORK_STATUS,
      payload: { error: undefined },
    });

    console.log("opened websocket");
    this.connectionResolve(this.webSocket);
  }

  onError(error) {
    this.uiStateDispatch({
      type: UiStateMessages.SET_NETWORK_STATUS,
      payload: { error: "error" },
    });
    console.log("error", error);
  }

  onClose(event) {
    if (event.reason === "duplicate") {
      this.open = false;
      this.uiStateDispatch({
        type: UiStateMessages.SET_NETWORK_STATUS,
        payload: { error: "duplicate", callback: this.connect.bind(this) },
      });
    }

    if (this.open) {
      console.log("close websocket");
      this.connect(2000);
    }
  }

  onMessage({ data }) {
    const { type, payload } = JSON.parse(data);
    //console.log("message received", data);

    switch (type) {
      case MOBILE_SPAWNED:
        this.game.mobileLibrary.mobileSpawned(payload);
        break;

      case MOBILE_DESPAWNED:
        this.game.mobileLibrary.mobileDespawned(payload);
        break;

      case MOBILE_MOVE:
        this.game.mobileLibrary.mobileMove(payload);
        break;

      case MOBILE_MOVE_FAILED:
        this.game.mobileLibrary.mobileMoveFailed(payload);
        break;

      case MOBILE_MOVE_REQUEST_FAILED:
        this.game.mobileLibrary.mobileMoveRequestFailed(payload);
        break;

      default:
        throw new Error(`Unrecognized websocket message type: '${type}'`);
    }
  }
}

export default GameServerConnection;
