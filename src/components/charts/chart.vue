<template>
  <q-card class="bg-white q-pa-none full-width">
    <q-card-section>
      <div class="text-h6 text-black text-center">{{ name }}</div>
    </q-card-section>
    <q-card-section>
      <canvas :id="barChartId"></canvas>
    </q-card-section>
  </q-card>
</template>

<script>
import Chart from 'chart.js';
import { defineComponent } from 'vue';

export default defineComponent({

  props: {
    barChartId: {
      type: String,
      default: 'chart-bar',
    },
    name: {
      type: String,
      default: 'График по умолчанию',
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
      default: 10,
    },
    typeChart: {
      type: String,
      default: 'line',
    },
    // label: {
    //   type: String,
    //   default: 'Неизвестный параметр',
    // },
  },
  mounted() {
    this.myChart = this.createChart(this.barChartId, this.typeChart);
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
              label: 'Неизвестный параметр',
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
            scales: {
              y: {
                min: 50,
                max: 100,
              },
            },
          },
          legend: {
            display: true,
          },
          title: {
            display: false,
          },
        },
      });
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
    },
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
