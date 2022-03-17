<template>
        <div class="flex justify-between no-wrap">
            <div class=" ">
                <img class="q-mt-xs" src="~components/Header/logo.svg">
            </div>
            <div class="">
            </div>
            <div class="flex ">
            <!-- <Menu/> -->
            </div>
            <div class="">
                <img class="tri" src="~components/Header/triangle.svg">
            </div>
        </div>
</template>

<script>
// import Menu from '../Menu/menu.vue';

export default {
  name: 'Header',
  components: {
    // Menu,
  },

};
</script>

<style>
.tri{
    position: absolute;
    right: 0;
    margin-top: 0;
    padding-top:0;
}

</style>
