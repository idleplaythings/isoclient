class MobileAction {
  constructor() {
    this.executing = false;
    this.cancelled = false;
    this.done = false;
    this.mobile = null;
  }

  cloneFor(mobile) {
    const action = this.clone();
    action.setMobile(mobile);
    return action;
  }

  clone(newAction) {
    newAction.populate(
      this.mobileLibrary,
      this.tileLibrary,
      this.gameServerConnector
    );

    return newAction;
  }

  setDone() {
    this.done = true;
    if (this.mobile) {
      this.mobile.actionDone();
    }
  }

  setMobile(mobile) {
    this.mobile = mobile;
  }

  cancel() {
    if (this.cancelled) {
      return;
    }

    this.cancelled = true;
    if (this.mobile) {
      this.mobile.actionCancelled();
    }
  }

  populate(mobileLibrary, tileLibrary, gameServerConnector) {
    this.mobileLibrary = mobileLibrary;
    this.tileLibrary = tileLibrary;
    this.gameServerConnector = gameServerConnector;
  }

  execute() {}
}

export default MobileAction;
