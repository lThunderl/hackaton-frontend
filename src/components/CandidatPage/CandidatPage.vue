<script>
export default {
  components: { DragAndDrop },
}
</script>
<script setup>
import DragAndDrop from './DragAndDrop.vue';

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
.bubble{
  background-color: rgb(156, 156, 156);
  position: absolute;
  width: calc(50em + 5vw);
  height: calc(50em + 5vw);
  border-radius: 50%;
  left: calc(10em + 50vw);
  bottom: calc(10em + 20vw);
  z-index: -1;  
}

.pagesButtons{
    width: 20%;
    height: 20px;
}

</style>
  

