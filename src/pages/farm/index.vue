<template>
  <q-page class="text-h6 text-white" style="background-color: rgb(60, 60, 60);">
    <VueCanvas :script="script" />
    {{ frames }}
  </q-page>
</template>

<script>
import {
  ref,
} from 'vue';
import VueCanvas from './canvas';

export default {
  name: 'App',
  components: {
    VueCanvas,
  },
  setup() {
    const canvasWidth = ref(500);
    const canvasHeight = ref(320);
    const frames = ref(0);
    const script = function (p5) {
      p5.setup = () => {
        const canvas = p5.createCanvas(canvasWidth.value, canvasHeight.value);
        canvas.parent('vue-canvas');
        p5.textSize(20);
        p5.frameRate(40);
      };
      p5.draw = () => {
        p5.background('black');
        p5.fill('white');
        frames.value = Math.floor(p5.frameRate());
        p5.text(frames.value, 100, 50);
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
      canvasWidth,
      frames,
    };
  },
};
</script>
