import ControllablePlayerMobile from "./ControllablePlayerMobile";
import UncontrollablePlayerMobile from "./UncontrollablePlayerMobile";

class MobileLibrary {
  constructor(userId, gameScene, tileLibrary, gameServerConnector) {
    this.userId = userId;
    this.gameScene = gameScene;
    this.tileLibrary = tileLibrary;
    this.gameServerConnector = gameServerConnector;

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
        mobile.getPositionOrNextMovementPosition(),
        tile
      );

      mobile.setMovementPath(path);
    });
  }

  getMobileAtPosition(tilePosition) {}

  mobileDespawned(mobileId) {
    this.mobiles = this.mobiles.filter((m) => {
      if (m.id === mobileId) {
        m.destroy();
        return false;
      }

      return true;
    });
  }

  mobileSpawned(payload) {
    console.log(this.userId);
    let mobile = null;

    if (payload.userId === this.userId) {
      mobile = new ControllablePlayerMobile(this.gameScene, this).deserialize(
        payload
      );
    } else {
      mobile = new UncontrollablePlayerMobile(this.gameScene).deserialize(
        payload
      );
    }

    this.mobiles = this.mobiles.filter((m) => m.id !== mobile.id);

    this.add(mobile);
  }

  add(mobile) {
    mobile = [].concat(mobile);
    this.mobiles.push(...mobile);
  }

  render(payload) {
    this.mobiles.forEach((mobile) => {
      mobile.render(payload);
    });
  }

  requestMove(mobile, position) {
    this.gameServerConnector.sendMoveRequest(mobile, position);
  }
}

export default MobileLibrary;
