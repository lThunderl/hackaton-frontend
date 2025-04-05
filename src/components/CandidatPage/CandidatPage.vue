<script>
export default {
  components: { PagesButton, DragAndDrop },
}
</script>
<script setup>
import { onMounted } from 'vue';
import PagesButton from './PagesButton.vue';
import DragAndDrop from './DragAndDrop.vue';

onMounted(() =>{
    if(localStorage.getItem('value') != null){
      document.querySelector('textarea.textSkills').value = localStorage.getItem('value');
    }
    })
</script>

<template>
  <div class="background">
    <div class="bubble"> </div>
    <div class="pagesButtons" >
      <PagesButton v-for="(page, index) in pages" :key="index"/>
    </div>
    <DragAndDrop />
  </div>
  </template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  html{
    overflow-x: hidden;
    font-family: "Montserrat";
    font-size: calc(0.3em + 1vw)
  }


.background{
  display: flex;
  flex-direction: column;
}

body{
  display: block;
  background-color: #2e2d2d;
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
  

