import ControllableMobile from "./ControllableMobile";
import ClientMobile from "./ClientMobile";

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

  mobileMoveRequestFailed([mobileId, position]) {
    const mobile = this.mobiles.find((m) => m.id === mobileId);

    if (!mobile) {
      return;
    }

    mobile.movementRequestFailed(position);
  }

  mobileMoveFailed([mobileId, position]) {
    const mobile = this.mobiles.find((m) => m.id === mobileId);

    if (!mobile) {
      return;
    }

    mobile.movementFailed(position);
  }

  mobileMove([mobileId, position, time]) {
    let mobile = this.mobiles.find((m) => m.id === mobileId);

    if (!mobile) {
      mobile = new ClientMobile(this.gameScene).deserialize({
        id: mobileId,
        position,
      });
      this.add(mobile);
    }

    mobile.setNextMovement(position, time);
  }

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
    let mobile = null;

    if (payload.userId === this.userId) {
      mobile = new ControllableMobile(this.gameScene, this).deserialize(
        payload
      );
    } else {
      mobile = new ClientMobile(this.gameScene).deserialize(payload);
    }

    this.mobiles = this.mobiles.filter((m) => {
      if (m.id === mobile.id) {
        m.destroy();
        return false;
      }

      return true;
    });

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
