<script>
import DragAndDrop from './DragAndDrop.vue';

export default {
  components: { DragAndDrop },
}

</script>

<template>
    <DragAndDrop />
  </template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

html{
  overflow-x: hidden;
  font-family: "Montserrat";
  font-size: calc(0.1em + 0.7vw + 0.7vh)
}

.background{
  display: flex;
  flex-direction: column;
}

body{
  display: block;
}
</style>
  

