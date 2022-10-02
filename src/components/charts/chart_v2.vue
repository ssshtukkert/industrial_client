<template>
  <q-card class="bg-white full-width" style="padding: 5px;">
    <q-card-section class="bg-secondary text-white" >
      <div :class="classTitle+' text-left'">{{ name }}</div>
    </q-card-section>
    <q-card-section align="center">
      <div class="row" v-show="vis">
        <div class="col-6">
          <q-badge color="teal">
            <div class="text-h6">{{ v }}</div>
          </q-badge>
        </div>
        <div class="col-6" v-show="s != ''">
          <q-badge color="teal">
            <div class="text-h6">{{ s }}</div>
          </q-badge>
        </div>
      </div>
      <canvas :id="chartId" v-show="vis"></canvas>
      <q-inner-loading :showing="!vis" color="teal"
          label-class="text-teal" label-style="font-size: 1.1em" />
    </q-card-section>
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
      default: 30,
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
      default: 50,
    },
    step: {
      type: Number,
      default: 10,
    },
    parameter: {
      type: String,
      default: 'Неизвестный параметр',
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
            bodyFontSize: 14,
            scales: {
              y: {
                min: 50,
                max: 100,
              },
            },
          },
          scales: {
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
                },
                offset: true,
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
              radius: 2,
            },
          },
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
    // добавление данных в массив параметра ПРОВЕРЕНО
    pushValues(values, timeline) {
      if (this.myChart.data.labels.length > this.countMax) {
        this.deleteFirst();
      }
      for (let i = 0; i < values.length; i += 1) {
        const { value } = values[i];
        this.myChart.data.datasets[i].data.push(value);
      }
      this.myChart.data.labels.push(timeline);
      this.myChart.update();
      if (!this.getVisible()) {
        this.setVisible(true);
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
