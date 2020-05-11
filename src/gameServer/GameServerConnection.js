const USERID = 1;

class GameServerConnection {
  constructor(gameId) {
    this.gameId = gameId;
    this.phaseDirector = null;
    this.webSocket = null;
    this.open = false;
    this.connection = null;
    this.connectionResolve = null;
  }

  init(phaseDirector) {
    this.phaseDirector = phaseDirector;
  }

  async deactivate() {
    const connection = await this.connection;
    connection.close();
  }

  connect(timeout = 0) {
    this.connection = new Promise((resolve) => {
      setTimeout(() => {
        this.webSocket = new WebSocket(`ws://localhost:4000/${USERID}`);
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

  async commitTurn(gameData) {
    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: "nön",
        payload: gameData.serialize(),
      })
    );
  }

  async disconnect() {
    this.open = false;
    (await this.connection).close();
  }

  onOpen() {
    console.log("opened websocket");
    this.open = true;
    this.connectionResolve(this.webSocket);
  }

  onError(error) {
    console.log("error", error);
  }

  onClose(code, message) {
    this.open = false;
    console.log("close websocket", code, message);
    /*

    if (this.open) {
      console.log("close websocket");
      this.connect(2000);
    }
    */
  }

  onMessage({ data }) {
    //const { type, payload } = JSON.parse(data);
    console.log("message received", data);

    /*
    switch (type) {
      case gameMessages.MESSAGE_GAMEDATA:
        this.phaseDirector.receiveGameData(new GameData(payload));
        break;

      case gameMessages.MESSAGE_TURN_CHANGED:
        this.phaseDirector.receiveTurnChange(
          payload.map((entry) => new GameData(entry))
        );
        break;

      case gameMessages.MESSAGE_REPLAY:
        this.phaseDirector.receiveReplay(
          payload.map((entry) => new GameData(entry))
        );
        break;
      default:
        throw new Error(`Unrecognized websocket message type: '${type}'`);
    }
    */
  }
}

export default GameServerConnection;
