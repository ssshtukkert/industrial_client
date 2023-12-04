/* eslint-disable */
export function changeJSON(inters, added, xBorder, yBorder, draggable, map, map1) { // inters - editable.value, added - configuration.structure
  console.log(added)
  function setMap(object, targetMap) {
    for (let i = 0; i < object.attrs.tags.length; i++){
      targetMap.forEach((value, key) => {
        if (object.attrs.tags[i].type == value){
          object.attrs.tags[i].type = key;
        }
      });
    }
  }
  function setMap1(object, targetMap) {
    for (let i = 0; i < object.attrs.tags.length; i++){
      targetMap.forEach((value, key) => {
        if (object.attrs.tags[i].display == value){
          object.attrs.tags[i].display = key;
        }
      });
    }

  }
  function isContains(array, check, prop) {
    return array.find((element) => element[prop] === check);
  }
if (map && map1){
  setMap(inters, map);
  setMap1(inters, map1);
  }

    if (inters.attrs.number){
      let obj = added.find((obj) => obj.id === inters.attrs.number);
      let a = added.indexOf(obj);
      let finalX = (inters.attrs.x - 230)/32;
      let finalY = (inters.attrs.y - 20)/32;


  if (obj) {
    obj.draggable = draggable;
    if (obj.type == "icon") {
        obj.x = String(finalX);
        obj.y = String(finalY);
        obj.image = inters.children[1].attrs.imgChosen;
        obj.imageTop = inters.children[1].attrs.imgChosen + ".svg"
    }

    if (obj.type == "input" || obj.type == "button") {
      obj.x = String(finalX);
      obj.y = String(finalY);
      obj.width = inters.attrs.width/32;
      obj.tags = inters.attrs.tags;
      // obj.offset = inters.children[1].attrs.x;
    }
    if (inters.attrs.x > xBorder || inters.attrs.x < 230 || inters.attrs.y > yBorder || inters.attrs.y < 20) {
      added.splice(a, 1);
    }
  }
}
}
