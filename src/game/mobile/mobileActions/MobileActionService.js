class MobileActionService {
  constructor(mobileLibrary, tileLibrary, gameServerConnector) {
    this.mobileLibrary = mobileLibrary;
    this.tileLibrary = tileLibrary;
    this.gameServerConnector = gameServerConnector;
  }

  addActionToSelectedMobiles(action) {
    action.populate(
      this.mobileLibrary,
      this.tileLibrary,
      this.gameServerConnector
    );

    this.mobileLibrary.selectedMobiles.forEach((mobile) => {
      mobile.cancelActionQueue();
      const mobileAction = action.cloneFor(mobile);
      mobile.addAction(mobileAction);
      mobile.executeAction();
    });
  }

  queueActionToSelectedMobiles(action) {
    action.populate(
      this.mobileLibrary,
      this.tileLibrary,
      this.gameServerConnector
    );
    action.queue();
  }
}

export default MobileActionService;
