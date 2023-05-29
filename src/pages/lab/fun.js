import axios from 'axios';
import store from '../../store/index.js';

// универсальная функция потоковой загрузки графиков
function loadChartsFromData(chartsArray, datatable, parts, cnt, thenfunc) {
  chartsArray.forEach((element) => {
    for (let i = 0; i < element.value.myChart.data.datasets.length; i += 1) {
      element.value.myChart.data.datasets[i].data.length = 0;
    }
    element.value.myChart.data.labels.length = 0;
    element.value.setVisible(false);
  });
  axios
    .get(`${store.host}/app/database/${datatable}/${cnt}`).then((responseM) => {
      let currentChart = 0;
      const arrayValue = [];
      const arrayTime = [];
      for (let iC = 0; iC < chartsArray.length; iC += 1) {
        arrayValue.push([]);
        arrayTime.push([]);
        parts[iC].parameters.forEach(() => {
          arrayValue[iC].push([]);
        });
      }
      for (let index = responseM.data.length - 1; index >= 0; index -= 1) {
        for (let iC = 0; iC < chartsArray.length; iC += 1) {
          for (let iA = 0; iA < parts[iC].parameters.length; iA += 1) {
            arrayValue[iC][iA].push(responseM.data[index][parts[iC].parameters[iA]]);
          }
          arrayTime[iC].push(responseM.data[index].createdAt);
        }
      }
      function loadchart() {
        if (chartsArray[currentChart].value) {
          for (let iA = 0; iA < parts[currentChart].parameters.length; iA += 1) {
            chartsArray[currentChart].value.myChart.data.datasets[iA].data = arrayValue[currentChart][iA];
          }
          chartsArray[currentChart].value.myChart.data.labels = arrayTime[currentChart];
          // chartsArray[currentChart].value.setValue(Number(chartsArray[currentChart].value.myChart.data.datasets[0].data.slice(-1)).toFixed(2));
          // if (chartsArray[currentChart].value.myChart.data.datasets[1]) {
          //   const set = Number(chartsArray[currentChart].value.myChart.data.datasets[1].data.slice(-1)).toFixed(2);
          //   chartsArray[currentChart].value.setSetpoint(set || '');
          // }
          chartsArray[currentChart].value.setName(parts[currentChart].label);
          chartsArray[currentChart].value.setVisible(true);
          chartsArray[currentChart].value.update();

          if (currentChart === chartsArray.length - 1) {
            if (thenfunc) {
              setImmediate(thenfunc);
            }
          } else {
            setImmediate(loadchart);
          }
          currentChart += 1;
        }
      }
      setImmediate(loadchart);
    });
}
// функция гибкого обновления графика
function updateChart_v4(chart, values, value, setpoint, time) {
  if (chart.value) {
    chart.value.pushValues(values, time, true, true);
    if (setpoint) {
      chart.value.setSetpoint(Number(setpoint).toFixed(2));
    } else {
      chart.value.setSetpoint('');
    }
    if (value) {
      chart.value.setValue(Number(value).toFixed(2));
    } else {
      chart.value.setValue('');
    }
    chart.value.update();
  }
}
function convertToBinary(number) {
  let num = number;
  let binary = (num % 2).toString();
  for (; num > 1;) {
    num = parseInt(num / 2, 10);
    binary = (num % 2) + (binary);
  }
  return binary;
}
const color = 'rgb(97, 138, 199)';
export {
  loadChartsFromData,
  updateChart_v4,
  convertToBinary,
  color,
};
