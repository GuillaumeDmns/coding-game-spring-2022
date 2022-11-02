import Entity from "../objects/Entity";
import ThreatFor from "../objects/ThreatFor";

export const sortEntityByThreatAndDistance = (
  a: Entity,
  b: Entity,
  myBaseX: number,
  myBaseY: number,
): number => {
  if (a.nearBase !== b.nearBase) {
    return a.nearBase === a.MY_BASE ? -1 : 1;
  }
  if (a.threatFor === b.threatFor) {
    return a.getDistanceFrom(myBaseX, myBaseY) - b.getDistanceFrom(myBaseX, myBaseY);
  }
  return a.threatFor === a.MY_BASE ? -1 : 1;
};
