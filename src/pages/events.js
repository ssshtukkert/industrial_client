export default function addEvents(grid, id) {
  const g = (id !== undefined ? `grid${id} ` : '');

  grid.on('added removed change', (event, items) => {
    let str = '';
    items.forEach((item) => { str += ` (${item.x},${item.y} ${item.w}x${item.h})`; });
    console.log(`${g + event.type} ${items.length} items (x,y w h):${str}`);
  })
    .on('enable', () => {
      console.log(`${g}enable`);
    })
    .on('disable', () => {
      console.log(`${g}disable`);
    })
    .on('dragstart', (event, el) => {
      const n = el.gridstackNode;
      console.log(n);
      const x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
      const y = el.getAttribute('gs-y');
      console.log(`${g}dragstart ${n.content || ''} pos: (${n.x},${n.y}) = (${x},${y})`);
    })
    .on('drag', () => {
      // console.log(g + 'drag ' + (n.content || '') + ' pos: (' + n.x + ',' + n.y + ') = (' + x + ',' + y + ')');
    })
    .on('dragstop', (event, el) => {
      const n = el.gridstackNode;
      const x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
      const y = el.getAttribute('gs-y');
      console.log(`${g}dragstop ${n.content || ''} pos: (${n.x},${n.y}) = (${x},${y})`);
    })
    .on('dropped', (event, previousNode, newNode) => {
      if (previousNode) {
        console.log(`${g}dropped - Removed widget from grid:`, previousNode);
      }
      if (newNode) {
        console.log(`${g}dropped - Added widget in grid:`, newNode);
      }
    })
    .on('resizestart', (event, el) => {
      const n = el.gridstackNode;
      const rec = el.getBoundingClientRect();
      console.log(`${g} resizestart ${n.content || ''} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
    })
    .on('resize', (event, el) => {
      const n = el.gridstackNode;
      const rec = el.getBoundingClientRect();
      console.log(`${g} resize ${n.content || ''} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
    })
    .on('resizestop', (event, el) => {
      const n = el.gridstackNode;
      const rec = el.getBoundingClientRect();
      console.log(`${g} resizestop ${n.content || ''} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
    });
}
