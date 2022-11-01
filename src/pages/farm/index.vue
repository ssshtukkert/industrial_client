<template>
  <div class="bg-black" style="padding: 15px; max-width: 600px;">
    <VueCanvas :script="script" style="margin: 10px;" />
  </div>
  <div class="q-pa-sm q-gutter-sm">
    <q-btn stack color="teal">
      <div>Жалюзи</div>
      <q-icon center size="5em" name="reorder" />
      <q-tooltip>
        Жалюзи
      </q-tooltip>
    </q-btn>
    <q-btn stack color="teal">
      <div>Фильтр</div>
      <q-icon center size="5em" name="view_week" />
      <q-tooltip>
        Фильтр
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import VueCanvas from './canvas';

export default {
  name: 'App',
  components: {
    VueCanvas,
  },
  setup() {
    const canvasWidth = 500;
    const canvasHeight = 320;
    const script = function (p5) {
      p5.setup = () => {
        const canvas = p5.createCanvas(canvasWidth, canvasHeight);
        canvas.parent('vue-canvas');
        p5.textSize(20);
        p5.frameRate(40);
      };
      p5.draw = () => {
        p5.background('black');
        p5.fill('white');
        p5.text(Math.floor(p5.frameRate()), 100, 50);
        p5.stroke('green');
        p5.line(0, 0, p5.mouseX, p5.mouseY);
        p5.noFill();
        for (let ix = 0; ix < 6; ix += 1) {
          for (let iy = 0; iy < 5; iy += 1) {
            p5.stroke('yellow');
            p5.rect(ix * 64, iy * 64, 62, 62);
          }
        }
      };
      p5.mousePressed = (value) => {
        if (value.button === 0) {
          console.log(1);
        }
      };
    };
    return {
      script,
    };
  },
};
</script>
