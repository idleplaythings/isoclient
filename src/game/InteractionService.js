import StructureFactory from "../model/structure/StructureFactory";
import { UiStateMessages } from "../ui/UiState";
import MoveToMobileAction from "./mobile/mobileActions/MoveToMobileAction";

class InteractionService {
  constructor(
    tileLibrary,
    mobileLibrary,
    coordinateConverter,
    uiStateDispatch,
    mobileActionService
  ) {
    this.mobileLibrary = mobileLibrary;
    this.coordinateConverter = coordinateConverter;
    this.tileLibrary = tileLibrary;
    this.uiStateDispatch = uiStateDispatch;
    this.mobileActionService = mobileActionService;

    this.structureFactory = new StructureFactory();
  }

  async rightClick(position) {
    const worldPostion = this.coordinateConverter.fromViewPortToGame(position);
    this.uiStateDispatch({ type: UiStateMessages.CLOSE_CONTEXT_MENU });

    console.log(position, worldPostion);
    const { prop, entities } = await this.tileLibrary.findEntity(
      worldPostion.tile
    );

    let menuItems = [];

    if (prop) {
      const propInstance = this.structureFactory.deserialize([prop]);
      menuItems = [
        ...menuItems,
        ...propInstance.getMenuItems(
          this.mobileActionService,
          worldPostion.tile,
          propInstance
        ),
      ];
    }

    if (menuItems.length > 0) {
      this.uiStateDispatch({
        type: UiStateMessages.OPEN_CONTEXT_MENU,
        payload: {
          position,
          menuItems,
        },
      });
    }
  }

  async leftClick(position) {
    const worldPostion = this.coordinateConverter.fromViewPortToGame(position);
    this.uiStateDispatch({ type: UiStateMessages.CLOSE_CONTEXT_MENU });
    if (worldPostion.mobiles.length > 0) {
      this.mobileLibrary.clickMobile(worldPostion.mobiles[0]);
    } else {
      this.mobileActionService.addActionToSelectedMobiles(
        new MoveToMobileAction(worldPostion.tile)
      );
    }
  }
}

export default InteractionService;
