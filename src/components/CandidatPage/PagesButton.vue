<script>
export default{
  data() {
    return {
      pages: 2,
    }
  }
}

</script>
<template>
    <button class="pageButton"> </button>
</template>
<style scoped>
.pageButton{
  width: calc(0.5em + 0.5vw);
  height: calc(0.5em + 0.5vw);
  border-radius: 50%;
  margin-left: 10px;
  margin-top: 10px;
}
button{
  font-size: calc(0.1em + 1vw);
}
</style>