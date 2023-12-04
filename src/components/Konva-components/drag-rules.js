/* eslint-disable */
import { changeJSON } from '../../components/Konva-components/JSONchange';
export function correctPosition(foundObj, xBorder, isButtonClicked, layerScale, xLimit, yLimit, yBorder, added, ){
  if (isButtonClicked){
  let xOffset = (foundObj.x() - 230) / layerScale;
  let yOffset = (foundObj.y() - 20) / layerScale;
  if (
    foundObj.x() < 230 ||
    foundObj.x() > xBorder + foundObj.width() / 2 ||
    foundObj.y() < 20 ||
    foundObj.y() > yBorder + foundObj.height() / 2
  ) {
    changeJSON(foundObj, added, xBorder, yBorder);
    foundObj.remove();
  }
  if (
    Math.floor(xOffset) != xOffset ||
    Math.floor(yOffset) != yOffset
  ) {
    let newXOffset = Math.floor(xOffset);
    let newYoffset = Math.floor(yOffset);
    foundObj.setAttrs({
      x:
        foundObj.x() >= xLimit && foundObj.x() <= canvasRightX
          ? xLimit
          : 230 + 32 * newXOffset,
      y:
        foundObj.y() > yLimit && foundObj.y() <= canvasBottomY
          ? yLimit
          : 20 + 32 * newYoffset,
    });
  }
  console.log(added)
  changeJSON(foundObj, added, xBorder, yBorder)
}
}



