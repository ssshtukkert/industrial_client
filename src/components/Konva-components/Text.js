/* eslint-disable */
import { ref, onMounted } from "vue";
export const newElemText = ref({});

export class Text extends Konva.Group {
  constructor(config, number, draggable, id) {
    super(config);
    this.number = number;
    this.id = id;
    this.draggable = draggable;

    const bkgRect = new Konva.Rect({
      x: 0,
      y: 0,
      fill: "white",
      opacity: 0.5,
      width: 128,
      height: 32,
      align: "center",
      verticalAlign: "middle",
      type: "text",
      tags: []
    });
    const btnText = new Konva.Text({
      x: 25,
      y: 10,
      text: "Подпись",
      fontStyle: "bold italic",
      fontSize: 16,
      fill: "black",
      opacity: 0.7,
      type: "text",
      verticalAlign: "middle",
    });
    this.add(bkgRect, btnText);
  }
  addNewText(number, type, x, y, text, width, offset, tags) {
    newElemText.value = new Konva.Group({
      x: x,
      y: y,
      width: 96,
      height: 32,
      type: 'input',
      draggable: true,
      number: number,
      tags: tags,
    });
    const bkgRect = ref(
      new Konva.Rect({
        x: 0,
        y: 0,
        fill: "white",
        opacity: 0.5,
        width: width,
        height: 32,
        align: "center",
        verticalAlign: "middle",
        type: 'input',
      })
    );
    const btnText = ref(
      new Konva.Text(
        {
          x: offset,
          y: 10,
          text: text,
          fontStyle: "bold italic",
          fontSize: 16,
          fill: "black",
          opacity: 0.7,
          type: 'input',
          verticalAlign: "middle",
        },
        number
      )
    );
    newElemText.value.add(bkgRect.value, btnText.value);
  }
  deleteCreatedText() {
    newElemText.value.on("mouseout", () => {
      if (newElemText.value.x() < 230) {
        newElemText.value.remove();
      }
    });
  }
}
