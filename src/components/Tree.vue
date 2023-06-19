<template>
  <div class="q-pa-sm q-gutter-sm text-h6" style="background-color: rgb(60, 60, 60);">
    <q-tree dark :nodes="data" v-model:selected="selected" v-model:expanded="expanded" node-key="label" dense
      no-selection-unset no-transition color="grey" text-color="grey" selected-color="grey" control-color="grey"
      tick-strategy="none" @update:selected="setSelect">
      <template v-slot:header-root="prop">
        <q-item dark class="fit" v-ripple>
          <div v-if="prop.node.icon">
            <q-icon :name="prop.node.icon" size="14px" class="q-mr-sm" />
          </div>
            {{ prop.node.label }}
        </q-item>
      </template>
      <template v-slot:default-header="prop">
        <q-item class="row fit items-center" v-ripple clickable :to="prop.node.to">
          <div v-if="prop.node.icon">
            <q-icon :color="selected == prop.node.label ? 'white' : 'grey'" :name="prop.node.icon" size="28px" class="q-mr-sm" />
          </div>
          <div v-if="selected == prop.node.label" class="text-weight-bold text-white">{{ prop.node.label }}</div>
          <div v-else class="text-grey">{{ prop.node.label }}</div>
        </q-item>
      </template>
    </q-tree>

  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
  props: {
    data: {
      type: Array,
    },
  },
  setup(props) {
    const selected = ref(null);
    function getNodeIsLabel(pathEl) {
      function getPartIsLabel(element, node) {
        const arr = node.split('/');
        arr.shift();
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i] === pathEl) {
            return element.label;
          }
        }
        return null;
      }
      const nodes = [];
      const temp = [];
      temp.push(props.data[0]);
      while (temp.length !== 0) {
        const current = temp[0];
        if (Object.prototype.hasOwnProperty.call(current, 'children')) {
          for (let index = 0; index < current.children.length; index += 1) {
            temp.push(current.children[index]);
          }
        }
        nodes.push(current);
        temp.shift();
      }
      for (let index = 0; index < nodes.length; index += 1) {
        const element = nodes[index];

        if (Object.prototype.hasOwnProperty.call(element, 'node')) {
          const res = getPartIsLabel(element, element.node);
          if (res != null) {
            return res;
          }
        } else if (Object.prototype.hasOwnProperty.call(element, 'to')) {
          const res = getPartIsLabel(element, element.to);
          if (res != null) {
            return res;
          }
        }
      }
      return nodes;
    }
    function expand(p, isIdPAram) {
      const arr = p.split('/');
      arr.shift();
      if (isIdPAram) {
        arr.pop();
      }
      for (let index = 0; index < arr.length; index += 1) {
        const node = getNodeIsLabel(arr[index]);
        this.expanded.push(node);
      }
      // if (isIdPAram) {
      selected.value = this.expanded[this.expanded.length - 1];
      // }
    }
    function setSelect(value) {
      const node = getNodeIsLabel(value);
      console.log(node);
    }
    return {
      expand,
      selected,
      props,
      expanded: ref([props.data[0].label]),
      setSelect,
    };
  },
});
</script>
