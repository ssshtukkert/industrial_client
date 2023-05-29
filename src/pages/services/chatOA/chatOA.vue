<template>
  <q-page class="q-pa-md example-column-row-width text-white text-h6" style="background-color: rgb(60, 60, 60);">
    <div class="column" style="height: 92vh">
      <div class="col" style="padding: 10px;">
        <q-scroll-area ref="chat" visible :delay="0" style="scroll max-width: 100%; height: 100%;"
          :vertical-thumb-style="{ right: '2px', borderRadius: '0px', background: 'grey', width: '15px', opacity: 1 }"
          :horizontal-thumb-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', height: '15px', opacity: 1 }"
          :vertical-bar-style="{ right: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, width: '15px' }"
          :horizontal-bar-style="{ bottom: '2px', borderRadius: '0px', background: 'grey', opacity: 0.3, height: '15px' }">
          {{ result }}
          <div class="q-pa-lg row">
            <div style="width: 100%;">
              <q-chat-message v-for="element in messages" :key="element" :text="element.message" :sent="element.send"
                text-color="white" bg-color="grey-8">
                <template v-slot:name>{{ element.sender }}</template>
                <div v-for="mes in element.message" :key="mes">
                  {{ mes }}
                  <span v-for="btn in element.buttons[element.message.indexOf(mes)]" :key="btn">
                    <q-btn v-if="btn" class="q-ma-sm" color="teal" :label="btn.label" @click="btn.func()" />
                  </span>
                </div>
              </q-chat-message>
            </div>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-1" style="padding: 10px;">
        <div class="row items-center">
          <div class="col">
            <q-input type="input" dark class="text-h6" v-model="inputQuery" clearable outlined label="Введите запрос"
              lazy-rules :rules="validationName" @keydown.enter.prevent="sendChat" @clear="() => {
                  inputQuery = '';
                }" />
          </div>
          <div style="padding: 10px;">
            <q-btn :disable="inputQuery" color="teal" icon="send" @click="sendChat" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  inject,
  onMounted,
} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import {
  defaultStructure,
  options,
} from '../productoptions/structuresDefault.js';

export default defineComponent({
  name: 'ChatOA',
  setup() {
    const router = useRouter();
    document.title = 'Бот отдела автоматики';
    const inputQuery = ref('');
    const result = ref('');
    const messages = ref([]);
    const chat = ref(null);
    let bufferMessage = '';
    const {
      host,
      getObject,
    } = inject('store');
    const rgbToHex = (r, g, b) => `#${[r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }).join('')}`;
    function contains(text, valueText) {
      return (text && valueText) ? text.indexOf(valueText) !== -1 : false;
    }
    function split(text, char) {
      return (text) ? text.split(char || ' ') : [];
    }
    function getTextContainsFromArray(array, valueText) {
      let res = '';
      array.forEach((element) => {
        if (contains(element, valueText)) {
          res = element;
        }
      });
      return res;
    }
    function getNumber(text) {
      return Number.parseFloat(text.replaceAll(',', '.'));
    }
    function number(text) {
      return Number.isNaN(Number(text.replaceAll(',', '.')));
    }
    function getTextContainsFromText(text, valueText) {
      return getTextContainsFromArray(split(text), valueText);
    }
    // функции для извлечения
    const TYPE_INFLOW = 0;
    const TYPE_INFLOW_OUTFLOW = 1;
    const VOLTAGE_380 = 0;
    const VOLTAGE_220 = 1;
    const TYPE_ASYNC = 0;
    const TYPE_EC = 1;
    const BLOCK_SERIES = 0;
    const BLOCK_PURPOUSE = 1;
    const BLOCK_TYPE_MANUAL = 2;
    const BLOCK_CONTROLLER = 3;
    const BLOCK_FANS = 4;
    const BLOCK_EXPANDE = 5;
    const BLOCK_OPTIONS = 6;
    const MARK_COUNTER = 'x';
    const MARK_RESERVE = 'R';
    const MARK_EC = 'EC';
    const MARK_SPECIAL = 'S';
    const MARK_OPTIONS_FAN = 'V';
    const MARK_OPTIONS_EHEAT = 'E';
    const MARK_OPTIONS_WHEAT = 'W';
    const MARK_OPTIONS_PHASE_TYPE = 'e';
    const ERROR_BLOCK_PURPOUSE = 'блок "Назначение"';
    const ERROR_BLOCK_FANS = 'блок "Вентиляторы"';
    const ERROR_BLOCK_EXPAND = 'блок "Доп. оборудование"';
    function setBufferMessage(mes) {
      bufferMessage = mes.replaceAll('х', 'x');
    }
    function getBufferMessage() {
      return bufferMessage;
    }
    function addMessage(message, send, sender, buttons) {
      let newLine = false;
      if (messages.value.length > 0) {
        const mes = messages.value[messages.value.length - 1];
        if (mes.sender === sender) {
          mes.message.push(message);
          mes.buttons.push(buttons || null);
          newLine = true;
        }
      }
      if (!newLine) {
        messages.value.push({
          message: [message],
          send,
          sender,
          buttons: [buttons] || [null],
        });
      }
      chat.value.setScrollPosition('vertical', chat.value.getScroll().verticalSize, 1000);
    }
    function getBlocks() {
      return split(getTextContainsFromText(getBufferMessage(), 'ABU'), '-');
    }
    function getBlock(block) {
      let res = '';
      if (block >= 0) {
        const array = getBlocks();
        if (array) {
          if (array.length > block) {
            res = array[block];
          }
        }
      }
      return res;
    }
    function getLastIndexBlock() {
      // if (blocks[indexLast] === MARK_RESERVE || contains(blocks[indexLast], MARK_SPECIAL)) {
      //   indexLast -= 1;
      // }
      console.log(BLOCK_OPTIONS, MARK_SPECIAL);
      return getBlocks().length - 1;
    }
    // function getLastBlock() {
    //   const blocks = getBlocks();
    //   return blocks[getOptionsIndex()];
    // }
    function isPowerInChar(text) {
      if (number(text)) {
        throw new Error();
      }
    }
    function controlPowerMark(text) {
      text = text.replaceAll(',', '.');
      if (contains(text, MARK_OPTIONS_PHASE_TYPE)) {
        const textPower = split(text, MARK_OPTIONS_PHASE_TYPE)[0];
        if (contains(textPower, MARK_EC)) {
          const textPowerEC = split(textPower, MARK_EC)[1];
          isPowerInChar(textPowerEC);
          return {
            power: getNumber(textPowerEC), voltage: VOLTAGE_220, type: TYPE_EC,
          };
        }
        isPowerInChar(textPower);
        return {
          power: getNumber(textPower), voltage: VOLTAGE_220, type: TYPE_ASYNC,
        };
      }
      if (contains(text, MARK_EC)) {
        const textPowerEC = split(text, MARK_EC)[1];
        isPowerInChar(textPowerEC);
        return {
          power: getNumber(textPowerEC), voltage: VOLTAGE_380, type: TYPE_EC,
        };
      }
      isPowerInChar(text);
      return {
        power: getNumber(text), voltage: VOLTAGE_380, type: TYPE_ASYNC,
      };
    }
    async function getExpandOptions() {
      function getStagesForTohElectic(power, voltage) {
        let p = power.toString();
        p = p.replaceAll('.', ',');
        let res = null;
        if (voltage === VOLTAGE_380) {
          res = getObject(options.power380Heater, 'label', p);
        } if (voltage === VOLTAGE_220) {
          res = getObject(options.power220Heater, 'label', p);
        }
        if (!res) {
          throw new Error();
        } else {
          return res.stages;
        }
      }
      try {
        // if (getLastIndexBlock() === BLOCK_OPTIONS) {
        //   console.log(1);
        // } else
        const array = [];
        if (getLastIndexBlock() === BLOCK_EXPANDE) {
          for (let index = BLOCK_EXPANDE; index <= getLastIndexBlock(); index += 1) {
            const block = getBlock(index);
            if (contains(block, '/') && !contains(block, MARK_OPTIONS_EHEAT)) {
              const powerAndStage = split(block, '/');
              const powerObj = controlPowerMark(powerAndStage[0]);
              isPowerInChar(powerAndStage[1]);
              const manualStage = getNumber(powerAndStage[1]);
              const stages = getStagesForTohElectic(powerObj.power, powerObj.voltageId);
              if (stages.length !== manualStage) {
                throw new Error();
              }
              array.push(`эл. нагреватель: ${powerObj.power} кВт, ${manualStage}ст ${powerObj.voltage}, ступени:
              ${stages}`);
            } else if (contains(block, MARK_OPTIONS_EHEAT)) {
              const powerAndStage = split(split(block, MARK_OPTIONS_EHEAT)[1], '/');
              console.log(options);
              const powerObj = controlPowerMark(powerAndStage[0]);
              isPowerInChar(powerAndStage[1]);
              const manualStage = getNumber(powerAndStage[1]);
              const stages = getStagesForTohElectic(powerObj.power, powerObj.voltageId);
              if (stages.length !== manualStage) {
                throw new Error();
              }
              array.push(`доп. эл. нагреватель: ${powerObj.power} кВт, ${manualStage}ст ${powerObj.voltage}, ступени:
              ${stages}`);
            } else if (contains(block, MARK_OPTIONS_WHEAT)) {
              console.log('доп водяной нагреватель');
            } else if (contains(block, MARK_OPTIONS_FAN)) {
              const powerObj = controlPowerMark(split(block, MARK_OPTIONS_FAN)[1]);
              array.push(`вентилятор: ${powerObj.power} кВт`);
            } else {
              array.push(`прочее: ${block}`);
            }
          }
        }

        return array;
      } catch (e) {
        const er = new Error(ERROR_BLOCK_EXPAND);
        er.name = 'Ошибка';
        throw er;
      }
    }
    // возвращает массив опций
    // function getOptions() {
    //   return split(getLastIndexBlock(), '/');
    // }
    // возвращает блоки вентиляторов
    async function getFans(elementsMark) {
      // здесь написана обработка которая парсит строку и возвращает массив с фиксированной длиной равной 6 элементам
      // 0 - вент притока
      // 1 - вент притока доп.
      // 2 - вент притока резервный
      // 3 - вент вытяжки
      // 4 - вент вытяжки доп
      // 5 - вент вытяжки рез.
      try {
        const fans = [null, null, null, null, null, null];
        const arrayFansText = split(elementsMark[BLOCK_FANS], '/');
        if (elementsMark[BLOCK_FANS].length === 0) {
          throw new Error(ERROR_BLOCK_FANS);
        }
        let index = 0;
        arrayFansText.forEach((element) => {
          if (contains(element, MARK_COUNTER)) {
            const arrayFansCountText = split(element, MARK_COUNTER);
            const powerObj = controlPowerMark(arrayFansCountText[0]);
            fans[index] = powerObj;
            fans[index + 1] = powerObj;
          } else if (contains(element, MARK_RESERVE)) {
            const arrayFansReserveText = split(element, MARK_RESERVE);
            const powerObj = controlPowerMark(arrayFansReserveText[0]);
            fans[index] = powerObj;
            fans[index + 2] = powerObj;
          } else {
            const powerObj = controlPowerMark(element);
            fans[index] = powerObj;
          }
          index += 3;
        });
        return fans;
      } catch (e) {
        throw new Error(ERROR_BLOCK_FANS);
      }
    }
    // возвращает тип системы
    async function getType(purpouse) {
      // 0 -приточная
      // 1 -приточно-вытяжная
      if (purpouse.length === 0) {
        throw new Error(ERROR_BLOCK_PURPOUSE);
      }
      switch (purpouse) {
        case 'VW' || 'VE' || 'SE' || 'PE' || 'RE' || 'SW' || 'VV' || 'VE' || 'PW' || 'PV' || 'SV': return TYPE_INFLOW_OUTFLOW;
        default: return TYPE_INFLOW;
      }
    }

    async function queryRaw() {
      let resultQuery = '';
      const mes = [];
      const structure = {};
      const blockNameQuery = getTextContainsFromText(getBufferMessage(), 'ABU');
      console.log(`Номенклатура: ${blockNameQuery}`);
      console.log(`Серия: ${getBlock(BLOCK_SERIES)}`);
      console.log(`Назначение: ${getBlock(BLOCK_PURPOUSE)}`);
      console.log(`Тип управления: ${getBlock(BLOCK_TYPE_MANUAL)}`);
      console.log(`Контроллер: ${getBlock(BLOCK_CONTROLLER)}`);

      await getType(getBlock(BLOCK_PURPOUSE)).then((res) => {
        structure.type = res;
      }).catch((e) => {
        throw e;
      });
      // процедура парсит строку вентиляторов и ложит данные в специальный
      // объект structure, где хранятся временные данные
      await getFans(split(getTextContainsFromText(getBufferMessage(), 'ABU'), '-')).then((res) => {
        structure.fans = {};
        for (let index = 0; index < res.length; index += 1) {
          const fan = res[index];
          if (fan !== null) {
            const obj = {
              power: res[index].power,
              voltage: res[index].voltage,
              type: res[index].type,
            };
            switch (index) {
              case 0:
                structure.fans.pv1 = obj;
                break;
              case 1:
                structure.fans.pv2 = obj;
                break;
              case 2:
                structure.fans.pv1r = obj;
                break;
              case 3:
                if (structure.type === TYPE_INFLOW_OUTFLOW) {
                  structure.fans.vv1 = obj;
                } else {
                  throw new Error('вытяжной вентилятор не может быть предусмотрен');
                }
                break;
              case 4:
                if (structure.type === TYPE_INFLOW_OUTFLOW) {
                  structure.fans.vv2 = obj;
                } else {
                  throw new Error('дополнительный вытяжной вентилятор не может быть предусмотрен');
                }
                break;
              case 5:
                if (structure.type === TYPE_INFLOW_OUTFLOW) {
                  structure.fans.vv1r = obj;
                } else {
                  throw new Error('резервный вытяжной вентилятор не может быть предусмотрен');
                }
                break;
              default: break;
            }
          }
        }
        if (structure.type === TYPE_INFLOW_OUTFLOW) {
          throw new Error('щиты для приточно-вытяжных систем временно недоступны для подбора');
          // if (!Object.prototype.hasOwnProperty.call(structure.fans, 'vv1')) {
          //   throw new Error(ERROR_BLOCK_FANS);
          // }
        }
        console.log(structure);
      }).catch((e) => {
        throw e;
      });
      await getExpandOptions(getBlock(BLOCK_PURPOUSE)).then((res) => {
        res.forEach((element) => {
          mes.push(`Доп. оборудование: ${element}`);
        });
      }).catch((e) => {
        throw e;
      });
      structure.options = [];
      // getOptions().forEach((element) => {
      //   structure.options.push(element);
      //   mes.push(`Опция: ${element}`);
      // });

      resultQuery = mes;
      return { structure, messages: resultQuery };
    }
    function calculate() {
      const queryStructure = JSON.parse(JSON.stringify(defaultStructure));
      function getEntryRef(el, refer, refId) {
        const object = getObject(queryStructure.elements, 'el', el);
        if (object[refer]) {
          return getObject(object[refer], 'name', refId);
        }
        return null;
      }
      function changeEntryRef(el, refer, refId, field, value) {
        // console.log(el, refer, refId, field, value);
        const objRefer = getEntryRef(el, refer, refId);
        if (objRefer) {
          objRefer[field] = value;
        }
      }

      queryRaw().then((res) => {
        const query = {};
        axios.get(`${host}/services_get/productoption/Fan`)
          .then((dataFans) => {
            const fans = dataFans.data.sort((a, b) => (a.power < b.power ? -1 : 1));
            // положить данные по вентилятору в структуру
            function putFanDataInStructure(el, power, voltage, type) {
              // включить вентилятор в работу
              getObject(queryStructure.elements, 'el', el).enable = true;
              // положить значение мощности
              changeEntryRef(el, 'inputs', `power_${el}`, 'value', power);
              // положить значение напряжения
              changeEntryRef(el, 'references', `voltage_${el}`, 'valueId', Number(voltage));
              // положить тип вентилятора
              changeEntryRef(el, 'references', `type_${el}`, 'valueId', Number(type));
              // положить флаг регулятор скорости
              changeEntryRef(el, 'switches', `speedmanual_${el}`, 'value', (res.structure.options.indexOf('UV') !== -1));
              // процедура присваивания номинального тока
              // извлекаем данные по максимальному и минимальному току из справочника вентиляторы
              for (let index = 0; index < fans.length; index += 1) {
                const fan = fans[index];
                // если мощность текущего вентилятора больше указанной
                // при этом тип вентилятора и напряжение тоже должны совпадать
                if (fan.power >= power && (fan.voltage === (voltage === 0) ? 380 : 220) && fan.type === type) {
                  changeEntryRef(el, 'inputs', `current_${el}`, 'value', fan.currentMax);
                  break;
                }
              }
            }

            // АЛГОРИТМ ФОРМИРОВАНИЯ ПАКЕТА СТРУКТУРЫ
            queryStructure.type = res.structure.type;

            // процедура ложит вентиляторы в структуру запроса что бы выполнить расчёт на backend
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in res.structure.fans) {
              putFanDataInStructure(key, res.structure.fans[key].power, res.structure.fans[key].voltage, res.structure.fans[key].type);
            }

            console.log(queryStructure);
            // отправка структуры на расчёт
            query.structure = JSON.stringify(queryStructure);
            axios.post(`${host}/api/v1/services_system_calc`, query).then((response) => {
              // добавить сообщения
              for (let index = 0; index < res.messages.length; index += 1) {
                const element = res.messages[index];
                addMessage(element, false, 'ChatOA');
              }
              addMessage('Подбор прошел успешно', false, 'ChatOA');
              // показать список комплектующих
              for (let index = 0; index < response.data.structure.block_manual.assemblyList.length; index += 1) {
                const element = response.data.structure.block_manual.assemblyList[index];
                addMessage(`${index + 1}) ${element.name} (${element.count})`, false, 'ChatOA');
              }
              addMessage(`Номенклатура после обработки: ${response.data.structure.block_manual.mark}`, false, 'ChatOA');
              console.log(response.data.structure);
            });
          });
      }).catch((e) => {
        addMessage(e, false, 'ChatOA');
      });
    }
    function sendChat() {
      if (inputQuery.value.length === 0) {
        return;
      }
      setBufferMessage(inputQuery.value);
      addMessage(getBufferMessage(), true, 'User');
      inputQuery.value = '';
      if (getBufferMessage()) {
        if (getBufferMessage() === 'подбери щит' || getBufferMessage() === 'Подбери щит') {
          addMessage('Сам подбирай', false, 'ChatOA');
        } else {
          axios
            .get(`${host}/services/genprice/Calculation`).then((responseA) => {
              let embedded = false;
              for (let index = 0; index < responseA.data.length; index += 1) {
                const element = responseA.data[index];
                const blockNameQuery = getTextContainsFromText(getBufferMessage(), 'ABU');
                if (contains(element.name, blockNameQuery)) {
                  embedded = true;
                  addMessage(`Нашёл в базе расчёток похожий щит: ${element.name}`, false, 'ChatOA', [
                    {
                      label: 'Перейти к расчёту',
                      func: () => {
                        router.push(`/services/genprice/calculations/${element.id}`);
                      },
                    },
                  ]);
                }
              }

              if (!embedded) {
                calculate();
              } else {
                addMessage(`Подобрать по указанному названию ${getBufferMessage()}?`, false, 'ChatOA', [
                  {
                    label: 'Да',
                    func: () => {
                      addMessage('Да', true, 'User');
                      calculate();
                    },
                  },
                ]);
              }
            });
        }
      }
    }
    onMounted(() => {
      // inputQuery.value = 'ABUm-W-1-ZM-2,2-E0,5e/1x3-UV-S152931';
      inputQuery.value = 'ABU-W-1-ZM-EC2-W-OF';
      addMessage('Привет, я бот помощник отдела автоматики, отправь сюда номенклатуру нужного тебе щита управления и я попробую тебе помочь', false, 'ChatOA');
    });
    return {
      inputQuery,
      result,
      sendChat,
      messages,
      chat,
      rgbToHex,
    };
  },
});
</script>
