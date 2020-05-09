class MobileLibrary {
  constructor(gameScene, tileLibrary) {
    this.gameScene = gameScene;
    this.tileLibrary = tileLibrary;

    this.selectedMobiles = [];

    this.mobiles = [];
  }

  mouseOverMobile(mobile) {}

  unselectMobiles() {
    this.selectedMobiles.forEach((mobile) => mobile.setSelected(false));
    this.selectedMobiles = [];
  }

  clickMobile(mobile) {
    if (mobile.isSelectable()) {
      this.unselectMobiles();

      this.selectedMobiles.push(mobile);
      mobile.setSelected();
    }
  }

  clickTile(tile) {
    console.log("click tile", tile);
    this.selectedMobiles.forEach(async (mobile) => {
      const path = await this.tileLibrary.findPath(
        mobile.getGamePositionOrNextMovementPosition(),
        tile
      );

      mobile.setMovementPath(path);
    });
  }

  getMobileAtPosition(tilePosition) {}

  add(mobile) {
    this.mobiles.push(mobile);
  }

  render(payload) {
    this.mobiles.forEach((mobile) => {
      mobile.render(payload);
    });
  }
}

export default MobileLibrary;
