/* eslint-disable */
export function modeChanger(toolbar, fan, text, button, toolbarTitle, btnGrid, layerGrid, layer, isActive, isButtonClicked){
  if (!isActive.value){
    toolbar.value.hide();
    fan.hide();
    text.hide();
    button.hide();
    toolbarTitle.value.hide();
    btnGrid.hide();
    layerGrid.hide();
    layer.value.find('Group').forEach((group) => {
      group.setAttrs({
        draggable: false,
        listening: false
      })
      if ((group.x() < 230) && (group.attrs.extraClass != "original")){
        group.remove()
      }
    })
    isButtonClicked = true;
    layer.value.draw()

  }
  else{
    toolbar.value.show();
    fan.show();
    text.show();
    button.show();
    toolbarTitle.value.show();
    btnGrid.show();
    layerGrid.show();
    layer.value.find('Group').forEach((group) => {
      group.setAttrs({
        draggable: true,
        listening: true
      })
    })
    isButtonClicked = true;
    layer.value.draw();

  }
  return isButtonClicked
}
