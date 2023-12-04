/* eslint-disable */
export function addShadow(foundObj){
  if (foundObj){
    foundObj.setAttrs({
      shadowColor: "gray",
      shadowBlur: 4,
      shadowOffset: { x: 0.1, y: 0.1 },
      shadowOpacity: 0.8,
    })
}
}
export function deleteShadow(foundObj){
  if (foundObj){
    foundObj.setAttrs({
      shadowColor: "null",
      shadowBlur: 0,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0,
    })
}
}

let coordObj

export function createBorder(foundObj, clicked){
  if (foundObj.x() > 200) {
    foundObj.children[0].setAttrs({
      stroke: "black",
      strokeWidth: 3,
      lineJoin: -5
    });
    coordObj = {
      x: foundObj.x(),
      y: foundObj.y(),
      number: foundObj.attrs.number,
      image: foundObj.children[1].attrs.imgChosen
    };
  }
  return coordObj
}
