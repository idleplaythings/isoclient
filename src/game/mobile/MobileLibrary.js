import ControllableMobile from "./ControllableMobile";
import Mobile from "../../model/mobile/Mobile.mjs";

class MobileLibrary {
  constructor(userId, gameScene, tileLibrary) {
    this.userId = userId;
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
        mobile.getPositionOrNextMovementPosition(),
        tile
      );

      mobile.setMovementPath(path);
    });
  }

  receiveOwnedMobiles(payload) {
    const mobiles = payload.map((data) =>
      new ControllableMobile(this.gameScene).deserialize(data)
    );

    this.mobiles = this.mobiles.filter((m) =>
      mobiles.every((m2) => m2.id !== m.id)
    );

    console.log(mobiles);
    this.add(mobiles);
  }

  getMobileAtPosition(tilePosition) {}

  mobileSpawned(payload) {
    console.log(this.userId);
    let mobile = null;

    if (payload.userId === this.userId) {
      mobile = new ControllableMobile(this.gameScene).deserialize(payload);
    } else {
      return;
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
}

export default MobileLibrary;
