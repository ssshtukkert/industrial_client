/* eslint-disable */
import { ref, onMounted } from 'vue';
export const newElemButton = ref({});

export class Button extends Konva.Group {
  constructor(config, number, draggable, id) {
    super(config);
    this.number = number;
    this.id = id;
    this.draggable = draggable;

    const bkgRect = new Konva.Rect({
      x: 0,
      y: 0,
      fill: "white",
      opacity: 0.8,
      width: 128,
      height: 32,
      align: "center",
      verticalAlign: "middle",
      type: 'button',
    })
    const btnText = new Konva.Text({
        x: 32,
        y: 10,
        text: "Кнопка",
        fontStyle: "bold italic",
        fontSize: 16,
        fill: "black",
        opacity: 0.75,
        type: 'button'
      });

    this.add(bkgRect, btnText)
  }

  addNewButton(number, type, x, y, text, width, offset, tags){

    const bkgRect = ref(
      new Konva.Rect({
        x: 0,
        y: 0,
        fill: "white",
        opacity: 0.8,
        width: width,
        height: 32,
        align: "center",
        verticalAlign: "middle",
        type: type
      })
    );
    const btnText = ref(
      new Konva.Text({
        x: offset,
        y: 10,
        text: text,
        fontStyle: "bold italic",
        fontSize: 16,
        fill: "black",
        opacity: 0.75,
        type: type,
        verticalAlign: "middle",
        align: "center"
      }, number)
    );

    newElemButton.value = new Konva.Group({
      x: x,
      y: y,
      width: 96,
      height: 32,
      opacity: 0.9,
      borderColor: "black",
      borderSize: "2px",
      draggable: true,
      type: type,
      number: number,
      tags: tags,
  });

    newElemButton.value.add(bkgRect.value, btnText.value)
  }
  deleteCreatedButton(){
    newElemButton.value.on('mouseout', () => {
      console.log(newElemButton.value.x())
      if (newElemButton.value.x() == 56){
        newElemButton.value.remove()
      }

    })
  }
}
