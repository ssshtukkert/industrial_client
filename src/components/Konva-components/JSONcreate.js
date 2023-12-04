/* eslint-disable */
import { changeJSON } from "./JSONchange";
function isContains(array, check, prop) {
  return array.find((element) => element[prop] === check);
}
function getUniquieCNT(array, prefix, prop) {
  let cnt = 0;
  while (isContains(array, `${prefix}${cnt}`, prop)) {
    cnt += 1;
  }
  return cnt;
}

export function addToJSON (isDragEnd, isNew, foundObj, added){
  if (!isDragEnd.value) {
  if (isNew) {
    console.log(foundObj.value.attrs)
    if (foundObj.value.attrs.type == "icon"){
      added.push({
      x: String((foundObj.value.x() - 230)/32),
      y: String((foundObj.value.y() - 20)/32),
      number: foundObj.value.attrs.number,
      type: foundObj.value.attrs.type,
      image: foundObj.value.children[1].attrs.imgChosen,
      draggable: foundObj.value.attrs.draggable,
      id: `el${getUniquieCNT(added, 'el', 'id')}`,
    });
    }
    if (foundObj.value.attrs.type == "input" || foundObj.value.attrs.type == "button" ){
      added.push({
        x: String((foundObj.value.x() - 230)/32),
        y: String((foundObj.value.y() - 20)/32),
      number: foundObj.value.attrs.number,
      type: foundObj.value.attrs.type,
      text: foundObj.value.children[1].attrs.text,
      width: foundObj.value.children[0].attrs.width,
      offset: foundObj.value.children[1].attrs.x,
      draggable: foundObj.value.attrs.draggable,
      tags: [],
      id: `el${getUniquieCNT(added, 'el', 'id')}`,
    });
    }

  }
  else {
    console.log('fffffffffffffffffff')
    let obj = added.find((obj) => obj.number === foundObj.value.attrs.number);
    if (obj){
      obj.x = foundObj.value.x();
      obj.y = foundObj.value.y();
      console.log(added)
    }
  }

}
}



