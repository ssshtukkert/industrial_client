/* eslint-disable */

export function upload(
  added,
  newElemFan,
  airUpBorder, air, air90, alarm, arrow, bf, calendar, coolerFreon, cooler, fanIm, filter, heaterElectric, heater, humdityMeas, humdity, onOff, pressure, recupP, recupR, recup, speed, temperature, valveAnalog, valve,
  layer,
  fan,
  button,
  newElemButton,
  text,
  newElemText,
) {
    added.structure.forEach(element => {
      if (element.type == "icon") {
        function setImage(name, image){
          if ((element.imageTop).split(".")[0] == name && (element.imageTop != '')) {
            newElemFan.value.children[1].setAttrs({
              image: image.value,
              height: element.h*32,
              width: element.w*32
            });
            newElemFan.value.children[0].setAttrs({
              height: element.h*32,
              width: element.w*32
            });
          }
          if (element.imageTop == '' && element.imageBottom.split(".")[0] == 'air') {
            newElemFan.value.children[1].setAttrs({
              image: air.value,
              width: element.w*32
            });
            newElemFan.value.children[0].setAttrs({
              opacity: 0.1,
              width:element.w*32
            });
          }
        }

        let finalX = parseInt(element.x)*32 + 230;
        let finalY = parseInt(element.y)*32 + 20;

        fan.addNewFan(
          "",
          element.id,
          finalX,
          finalY,
          element.type
        );

        setImage("air_up_border", airUpBorder);
        setImage("air", air);
        setImage("air90", air90);
        setImage("alarm", alarm);
        setImage("arrow", arrow);
        setImage("bf", bf);
        setImage("calendar", calendar);
        setImage("cooler_freon", coolerFreon);
        setImage("cooler", cooler);
        setImage("fan", fanIm);
        setImage("filter", filter);
        setImage("heater_electric", heaterElectric);
        setImage("heater", heater);
        setImage("humdity_meas", humdityMeas);
        setImage("humdity", humdity);
        setImage("on-off", onOff);
        setImage("pressure", pressure);
        setImage("recupP", recupP);
        setImage("recup", recup);
        setImage("recupR", recupR);
        setImage("speed", speed);
        setImage("temperature", temperature);
        setImage("valve_analog", valveAnalog);
        setImage("valve", valve);

      layer.value.add(newElemFan.value);
      }



      if (element.type == "button") {
        let finalX = parseInt(element.x)*32 + 230;
        let finalY = parseInt(element.y)*32 + 20;
        button.addNewButton(
          element.id,
          element.type,
          finalX,
          finalY,
          element.name,
          element.w*32,
          10,
          element.tags
        );
        layer.value.add(newElemButton.value);

        newElemButton.value.children[0].setAttrs({
          width: newElemButton.value.children[1].getTextWidth() + 20,
        })
      }



      if (element.type == "input"){
        let finalX = parseInt(element.x)*32 + 230;
        let finalY = parseInt(element.y)*32 + 20;
        text.addNewText(
          element.id,
          element.type,
          finalX,
          finalY,
          element.name,
          element.w*32,
          10,
          element.tags
        );

        layer.value.add(newElemText.value);
        newElemText.value.children[0].setAttrs({
          width: newElemText.value.children[1].getTextWidth() + 20,
        })
      }
    });




  }

