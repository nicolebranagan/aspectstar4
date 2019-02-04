import SolidityType from "../constants/SolidityType";

const Solidity = {
  isSolid(solid: SolidityType, upwardMomentum: boolean): boolean {
    switch (solid) {
      case SolidityType.EMPTY:
        return false;
      case SolidityType.SOLID:
        return true;
      case SolidityType.OPEN_TOP:
        return !upwardMomentum;
      case SolidityType.DEATH:
        return false;
      default:
        throw "Not implemented / Unknown tile type";
    }
  }
};

export default Solidity;
