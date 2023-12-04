/* eslint-disable */
import { Layer } from "konva/lib/Layer";
import { changeJSON } from "./JSONchange";

export function imagePicker(type1, inters, added, airUpBorder, air, air90, alarm, arrow, bf, calendar, coolerFreon,cooler, fanIm, filter, heaterElectric, heater, humdityMeas, humdity, onOff, pressure, recupP, recupR, recupR1, speed, temperature, valveAnalog, valve, layer){
  function attrsSetter(type, image, tag){
    if (type1 == type){
      inters.children[1].setAttrs({
        image: image.value,
        imgChosen: tag,
      });
      inters.parent.children[1].setAttrs({
        imgChosen: tag,
      });
      layer.value.draw()
      changeJSON(inters, added);
  }
  }

  attrsSetter('Воздуховод(верх.)', airUpBorder, 'air-up');
  attrsSetter('Воздуховод', air, 'air');
  attrsSetter('Воздуховод (верт.)', air90, 'air-vert');
  attrsSetter('Авария', alarm, 'alarm');
  attrsSetter('Стрелка', arrow, 'arrow');
  attrsSetter('Бактер.фильтр', bf, 'bf');
  attrsSetter('Календарь', calendar, 'calend');
  attrsSetter('Фреон.охладитель', coolerFreon, 'freon-cooler');
  attrsSetter('Охладитель', cooler, 'cooler');
  attrsSetter('Вентилятор', fanIm, 'fan');
  attrsSetter('Фильтр', filter, 'filter');
  attrsSetter('Эл.нагреватель', heaterElectric, 'el-heater');
  attrsSetter('Нагреватель', heater, 'heater');
  attrsSetter('Измер.влажности', humdityMeas, 'hum-meas');
  attrsSetter('Влажность', humdity, 'humdity');
  attrsSetter('Вкл-выкл', onOff, 'on-off');
  attrsSetter('Давление', pressure, 'press');
  attrsSetter('Рекуп.пластинч.', recupP, 'recupP');
  attrsSetter('Рекуп.роторный', recupR, 'recupR');
  attrsSetter('Скорость', speed, 'speed');
  attrsSetter('Температура', temperature, 'temp');
  attrsSetter('Задвижка(аналог.)', valveAnalog, 'valve-analog');
  attrsSetter('Задвижка', valve, 'valve');

}
