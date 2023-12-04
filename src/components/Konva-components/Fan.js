/* eslint-disable */
import { ref, onMounted } from 'vue';
export const newElemFan = ref({});

function isContains(array, check, prop) {
  return array.find((element) => element[prop] === check);
}
function getUniquieCNT(array, prefix, prop) {
  let cnt = 0;
  while (isContains(array, `${prefix}${cnt}`, prop)) {
    cnt += 1;
  }
  return cnt;
}

export class Fan extends Konva.Image {
  constructor(config, type, number, draggable, id) {
    super(config);
    this.type = type;
    this.number = number;
    this.id = id;
    this.draggable = draggable;
  }

  addNewFan(image, number, x, y){
    newElemFan.value = new Konva.Group({
      x: x,
      y: y,
      width: 64,
      height: 64,
      draggable: true, // было draggable
      type: 'icon',
      id: number,
      tags: [],
      isNew: false,
      number: '',
    })
    const bkgRect = ref(
      new Konva.Rect({
        x: 0,
        y: 0,
        fill: "#9c9c9c",
        opacity: 0.5,
        width: 64,
        height: 64,
        align: "center",
        verticalAlign: "middle",
        type: 'icon'
      })
    );
    const fanImg = ref(
      new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        width: 64,
        height: 64,
        type: 'icon',
        imgChosen: 'fan'
      })
    );


    newElemFan.value.add(bkgRect.value, fanImg.value);

  }


  deleteCreatedFan(){
    newElemFan.value.on('mouseout', () => {
      if (newElemFan.value.x() == 88){
        newElemFan.value.remove()
      }
    })
  }
}
