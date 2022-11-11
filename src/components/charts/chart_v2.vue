<template>
  <q-card class="full-width" style="background-color: rgb(60, 60, 60); padding: 5px; min-height: 200px; min-width: 120px;" >
    <q-card-section class="text-white" style="background-color: rgb(80, 80, 80);">
      <div :class="classTitle+' text-left'">{{ nam }}</div>
    </q-card-section>
    <q-card-section align="center" style="padding: 0px;">
      <div class="row" v-show="vis" style="padding: 5px;">
        <div class="col-6">
          <q-badge style="background-color: rgb(80, 80, 80);">
            <div class="text-h6">{{ v }} {{ valueMeasure }}</div>
          </q-badge>
        </div>
        <div class="col-6" v-show="s != ''">
          <q-badge style="background-color: rgb(80, 80, 80);">
            <div class="text-h6">Уст: {{ s }} {{ valueMeasure }}</div>
          </q-badge>
        </div>
      </div>
      <canvas style="background-color: rgb(60, 60, 60);" :height="height" :id="chartId" v-show="vis"></canvas>
    </q-card-section>
    <q-inner-loading :showing="!vis" color="white" label-class="text-white" label-style="font-size: 1.1em"/>
  </q-card>
</template>

<script>
import Chart from 'chart.js';
import { defineComponent } from 'vue';

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
      default: 'График по умолчанию',
    },
    parameters: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
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
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 10000,
    },
    step: {
      type: Number,
      default: 5,
    },
    parameter: {
      type: String,
      default: 'Неизвестный параметр',
    },
    valueMeasure: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.myChart = this.createChart(this.chartId, this.typeChart);
    this.setParameters(this.parameters);
  },
  data(props) {
    return {
      v: props.value,
      s: props.setpoint,
      vis: props.visible,
      nam: props.name,
      ma: props.max,
      mi: props.min,
    };
  },
  methods: {
    createChart(chartId, typeChart) {
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
            mode: 'index',
            intersect: false,
            position: 'nearest',
            bodyFontSize: 10,
          },
          scales: {
            gridLines: 'red',
            xAxes: [
              {
                distribution: 'series',
                bounds: 'ticks',
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  maxRotation: 0,
                  autoSkip: true,
                  autoSkipPadding: 64,
                  fontSize: 13,
                  fontColor: 'white',
                },
                gridLines: {
                  color: 'grey',
                },
                time: {
                  unit: 'second',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  suggestedMin: this.min,
                  suggestedMax: this.max,
                  stepSize: this.step,
                  fontColor: 'white',
                },
                gridLines: {
                  color: 'grey-4',
                },
                offset: false,
              },
            ],
          },
          legend: {
            display: this.legend,
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
    setMax(value) {
      if (value < this.ma) {
        this.myChart.options.scales.yAxes[0].ticks.suggestedMax = value;
        this.myChart.options.scales.yAxes[0].ticks.max = value + 10;
      } else {
        this.myChart.options.scales.yAxes[0].ticks.suggestedMax = this.ma;
        this.myChart.options.scales.yAxes[0].ticks.max = this.ma;
      }
    },
    setStep(value) {
      this.myChart.options.scales.yAxes[0].ticks.stepSize = value;
    },
    setMin(value) {
      if (value > this.mi) {
        this.myChart.options.scales.yAxes[0].ticks.suggestedMin = value;
        this.myChart.options.scales.yAxes[0].ticks.min = value - 10;
      } else {
        this.myChart.options.scales.yAxes[0].ticks.suggestedMin = this.mi;
        this.myChart.options.scales.yAxes[0].ticks.min = this.mi;
      }
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
    getVisible() {
      return this.vis;
    },
    // очистка массива
    clear() {
      this.myChart.data.labels = [];
      this.myChart.data.datasets[0].data = [];
      this.myChart.data.datasets[0].backgroundColor = [];
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
    update() {
      this.myChart.update();
      this.setVisible(true);
    },
    // добавление данных в массив параметра ПРОВЕРЕНО
    pushValues(values, timeline, direct, update) {
      if (this.myChart.data.datasets[0].data.length >= this.countMax) {
        this.deleteFirst();
      }
      for (let i = 0; i < values.length; i += 1) {
        const { value } = values[i];
        if (direct) {
          this.myChart.data.datasets[i].data.push(Number(value));
        } else {
          this.myChart.data.datasets[i].data.unshift(Number(value));
        }
        const max = Math.max.apply(null, this.myChart.data.datasets[i].data);
        const min = Math.min.apply(null, this.myChart.data.datasets[i].data);
        this.setMax(max * 1.003);
        this.setMin(min * 1.003);
        const old_min = 0;
        const old_max = this.myChart.height;
        const new_min = min;
        const new_max = max;

        const old_range = old_max - old_min;
        const new_range = new_max - new_min;
        const converted = (((Number(value) - old_min) * new_range) / old_range) + new_min;
        this.setStep(converted);
        if (direct) {
          this.setValue(Number(value));
        } else {
          this.setValue(Number(this.myChart.data.datasets[i].data[this.myChart.data.datasets[i].data.length - 1]));
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
    },
    // удаление данных в массив параметра ПРОВЕРЕНО
    deleteFirst() {
      for (let i = 0; i < this.myChart.data.datasets.length; i += 1) {
        this.myChart.data.datasets[i].data.shift();
      }
      this.myChart.data.labels.shift();
    },
  },
});
</script>

<style>

</style>
