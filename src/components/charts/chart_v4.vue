<template>
  <q-card class="full-width full-height"
    style="background-color: rgb(60, 60, 60); padding: 5px; min-height: 200px; min-width: 120px;">
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div class="row">
        <div :class="classTitle + ' text-left'">{{ nam }}</div>
      </div>
      <div class="row">
        <div class="col-11">
          <slot name="topLabel" />
        </div>
        <div align="right" class="col-1">
          <q-btn padding="xs" color="rgb(60,60,60)" icon="search" @click="viewChart" />
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center" style="padding: 0px;">
      <div class="row" v-show="vis" style="padding: 5px;">
        <div class="col-6">
          <q-badge v-show="v != ''" style="background-color: rgb(80, 80, 80);">
            <div :class="classValue">{{ v }} {{ valueMeasure }}</div>
          </q-badge>
        </div>
        <div class="col-6" v-show="s != ''">
          <q-badge v-show="s != ''" style="background-color: rgb(80, 80, 80);">
            <div :class="classSetpoint">Уст: {{ s }} {{ valueMeasure }}</div>
          </q-badge>
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center" style="padding: 10px;">
      <canvas style="background-color: rgb(60, 60, 60);" :height="height" :id="chartId" v-show="vis"></canvas>
    </q-card-section>
    <q-inner-loading :showing="!vis" color="white" label-class="text-white" label-style="font-size: 1.1em" />
    <q-dialog v-model="view" ref="dialog" persistent @show="beforeShow" full-height full-width>
      <q-card class="text-white" style="background-color: rgb(60, 60, 60);">
        <q-bar>
          <div :class="classTitle + ' text-left'">{{ nam }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup @click="close">
            <q-tooltip class="bg-grey text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section align="center" style="padding: 15px;">
          <canvas style="background-color: rgb(60, 60, 60); height: 45vh; width: 50vw;" id="double"></canvas>
        </q-card-section>
      </q-card>
    </q-dialog>
    <slot name="bottomLabel" />
  </q-card>
</template>

<script>
import { Chart } from 'chart.js';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
    },
    value: {
      type: String,
      default: '',
    },
    setpoint: {
      type: String,
      default: '',
    },
    chartId: {
      type: String,
      default: 'chart-bar',
    },
    name: {
      type: String,
      default: '',
    },
    parameters: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    classValue: {
      type: String,
      default: 'text-h8',
    },
    classSetpoint: {
      type: String,
      default: 'text-h8',
    },
    colorDefault: {
      type: String,
      default: '#3e95cd',
    },
    countMax: {
      type: Number,
      default: 720,
    },
    typeChart: {
      type: String,
      default: 'line',
    },
    legend: {
      type: Boolean,
      default: true,
    },
    classTitle: {
      type: String,
      default: 'text-h6',
    },
    parameter: {
      type: String,
      default: 'Неизвестный параметр',
    },
    valueMeasure: {
      type: String,
      default: '',
    },
    step: {
      type: Number,
      default: 900,
    },
  },
  mounted() {
    this.myChart = this.createChart(this.chartId, this.typeChart, 12);
    this.setParameters(this.parameters);
  },
  data(props) {
    const view = ref(false);
    return {
      view,
      v: props.value,
      s: props.setpoint,
      vis: props.visible,
      nam: props.name,
    };
  },
  methods: {
    createChart(chartId, typeChart, tooltipsSize) {
      const ctx = document.getElementById(chartId);
      return new Chart(ctx, {
        type: typeChart,
        data: {
          labels: [],
          datasets: [
            {
              // набор данных используется для отрисовки нескольких графиков
              label: this.parameter,
              backgroundColor: this.backgroundColor,
              borderColor: this.colorDefault,
              data: [],
              fill: false,
              tension: 0,
            },
          ],
        },
        options: {
          tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            position: 'nearest',
            bodyFontSize: tooltipsSize + 3,
            titleFontSize: tooltipsSize + 3,
            animation: false,
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                // offset: true,
                bounds: 'data',
                distribution: 'series',
                ticks: {
                  maxRotation: 0,
                  fontSize: tooltipsSize,
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
                  stepSize: this.step,
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
                  fontSize: tooltipsSize + 2,
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
            display: this.legend,
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
          animation: false,
        },
      });
    },
    setValue(val) {
      this.v = val;
    },
    setSetpoint(val) {
      this.s = val;
    },
    setVisible(val) {
      this.vis = val;
    },
    setName(val) {
      this.nam = val;
    },
    getVisible() {
      return this.vis;
    },
    update() {
      if (this.myChartDouble && this.view) {
        this.myChartDouble.update();
      }
      this.myChart.update();
    },
    // очистка массива
    // clear() {
    //   this.myChart.data.labels = [];
    //   this.myChart.data.datasets[0].data = [];
    //   this.myChart.data.datasets[0].backgroundColor = [];
    // },
    setParametersDouble(parameters) {
      for (let i = 0; i < parameters.length; i += 1) {
        const { name, color } = parameters[i];
        const newData = {
          label: name,
          backgroundColor: color,
          borderColor: color,
          data: [],
          fill: false,
          tension: 0,
        };
        if (this.myChartDouble.data.datasets.length < i + 1) {
          this.myChartDouble.data.datasets.push(newData);
        } else {
          this.myChartDouble.data.datasets[i] = newData;
        }
      }
      this.myChartDouble.data.labels.length = 0;
      this.myChartDouble.update();
    },
    // добавление нового параметра в график ПРОВЕРЕНО
    setParameters(parameters) {
      for (let i = 0; i < parameters.length; i += 1) {
        const { name, color } = parameters[i];
        const newData = {
          label: name,
          backgroundColor: color,
          borderColor: color,
          data: [],
          fill: false,
          tension: 0,
        };
        if (this.myChart.data.datasets.length < i + 1) {
          this.myChart.data.datasets.push(newData);
        } else {
          this.myChart.data.datasets[i] = newData;
        }
      }
      this.myChart.data.labels.length = 0;
      this.myChart.update();
    },

    pushValuesDouble(values, timeline, direct, update) {
      for (let i = 0; i < values.length; i += 1) {
        if (this.myChartDouble.data.datasets[i].data.length >= this.countMax) {
          this.deleteFirstDouble();
        }
        if (direct) {
          this.myChartDouble.data.datasets[i].data.push(Number(values[i]));
        } else {
          this.myChartDouble.data.datasets[i].data.unshift(Number(values[i]));
        }
      }
      if (direct) {
        this.myChartDouble.data.labels.push(timeline);
      } else {
        this.myChartDouble.data.labels.unshift(timeline);
      }
      if (update === true) {
        this.myChartDouble.update();
      }
    },
    // добавление данных в массив параметра ПРОВЕРЕНО
    pushValues(values, timeline, direct, update) {
      for (let i = 0; i < values.length; i += 1) {
        if (this.myChart.data.datasets[i].data.length >= this.countMax) {
          this.deleteFirst();
        }
        // const { value } = values[i];
        if (direct) {
          this.myChart.data.datasets[i].data.push(Number(values[i]));
        } else {
          this.myChart.data.datasets[i].data.unshift(Number(values[i]));
        }
      }
      if (direct) {
        this.myChart.data.labels.push(timeline);
      } else {
        this.myChart.data.labels.unshift(timeline);
      }
      if (update === true) {
        this.myChart.update();
        if (!this.getVisible()) {
          this.setVisible(true);
        }
      }
      if (this.myChartDouble && this.view) {
        this.pushValuesDouble(values, timeline, direct, update);
      }
    },

    // удаление данных в массив параметра ПРОВЕРЕНО
    deleteFirst() {
      for (let i = 0; i < this.myChart.data.datasets.length; i += 1) {
        this.myChart.data.datasets[i].data.shift();
      }
      this.myChart.data.labels.shift();
    },
    deleteFirstDouble() {
      for (let i = 0; i < this.myChartDouble.data.datasets.length; i += 1) {
        this.myChartDouble.data.datasets[i].data.shift();
      }
      this.myChartDouble.data.labels.shift();
    },
    viewChart() {
      this.view = true;
    },
    close() {
      this.myChartDouble = null;
      this.view = false;
      this.update();
    },
    beforeShow() {
      this.myChartDouble = this.createChart('double', this.typeChart, 20);
      this.setParametersDouble(this.parameters);
      this.myChartDouble.data = this.myChart.data;
      this.myChartDouble.update();
    },
  },
});
</script>
