<template>
  <q-card flat square style="background-color: rgb(60, 60, 60);">
    <canvas v-show="!load" id="canvas" ref="chart">
    </canvas>
    <q-inner-loading :showing="load" color="white" label-class="text-white" label-style="font-size: 1.1em" />
  </q-card>
</template>

<script>
import { Chart } from 'chart.js';
import { Simplify } from 'curvereduce';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    legend: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const chart = ref(null);
    const ch = ref(null);
    const load = ref(true);
    onMounted(() => {
      // eslint-disable-next-line no-new
      ch.value = new Chart( // инициализируем плагин
        chart.value, // первым параметром передаем элемент canvas по селектору
        // вторым параметром передаем настройки в виде объекта
        {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                borderColor: 'white',
                label: props.title,
                tension: 0.4,
                cubicInterpolationMode: 'monotone',
                data: [],
              },
            ],
          },
          options: {
            tooltips: {
              enabled: true,
              mode: 'index',
              intersect: false,
              position: 'nearest',
              bodyFontSize: 15,
              titleFontSize: 15,
              animation: false,
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  bounds: 'data',
                  distribution: 'series',
                  ticks: {
                    maxRotation: 0,
                    fontSize: 12,
                    fontColor: 'white',
                    autoSkip: true,
                    autoSkipPadding: 64,
                  },
                  gridLines: {
                    color: 'grey',
                    offsetGridLines: false,
                  },
                  time: {
                    unit: 'second',
                    stepSize: 1,
                    displayFormats: {
                      second: 'HH:mm:ss',
                    },
                    tooltipFormat: 'HH:mm:ss YYYY-MM-DD',
                  },
                },
              ],
              yAxes: [
                {
                  bounds: 'ticks',
                  ticks: {
                    fontColor: 'white',
                    autoSkip: true,
                    autoSkipPadding: 20,
                    fontSize: 14,
                    // suggestedMin: 0,
                    // suggestedMax: 50,
                  },
                  gridLines: {
                    color: 'grey-4',
                  },
                  offset: true,
                  labelOffset: 1,
                },
              ],
            },
            legend: {
              display: props.legend,
              labels: {
                fontColor: 'white',
              },
            },
            title: {
              display: false,
            },
            elements: {
              point: {
                radius: 1,
              },
            },
            parsing: false,
            normalized: true,
            animation: false,
          },
        },
      );
    });
    function pushValues(dataPoint) {
      ch.value.config.data.datasets[0].data.push(dataPoint.valueY);
      ch.value.config.data.labels.push(dataPoint.valueX);
      ch.value.update();
    }
    function pushValuesArray(arrayPoints) {
      ch.value.config.data.datasets[0].data.length = 0;
      ch.value.config.data.labels.length = 0;
      function add(vx, vy) {
        try {
          ch.value.config.data.datasets[0].data.push(vy.toFixed(2));
          ch.value.config.data.labels.push(vx);
        } catch (err) {
          console.log('Ошибка при добавлении точки данных');
        }
      }

      const points = [];
      arrayPoints.forEach((point) => {
        points.push({ y: point.valueY, x: 0, time: point.valueX });
      });
      // Math.floor(ch.value.width / 50)
      const simplified2 = Simplify(points, 0.1);
      // const simplified2 = SimplifyTo(points, 20);
      simplified2.forEach((p) => {
        add(p.time, p.y);
      });

      ch.value.update();
    }
    function getDataURL() {
      const canvas = document.getElementById('canvas');
      return canvas.toDataURL();
    }
    function setLoad(val) {
      load.value = val;
    }
    return {
      chart,
      ch,
      load,
      setLoad,
      pushValues,
      pushValuesArray,
      getDataURL,
    };
  },
});
</script>
