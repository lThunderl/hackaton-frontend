<script>

export default {
  name: 'VacancyCard',
  props: {
    vacancy: {
      type: Object,
      required: true,
    },
    candidates: {
      type: Array,
      required: true,
    },
  },
};
</script>

<template>
  <el-card shadow="hover" class="vacancy-card">
    <div>
      <h3>{{ vacancy.title }}</h3>
      <p>{{ vacancy.description }}</p>
      <h4>Компетенции:</h4>
      <div class="tag">
        <el-tag v-for="req in vacancy.requirements" :key="req" type="success">{{ req }}</el-tag>
      </div>
    </div>
  </el-card>

</template>

<style scoped>
.vacancy-card {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  width: 30%
}

h3 {
  margin-top: 0;
}

ul {
  list-style-type: none;
  padding-left: 20px;
}

.tag {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem
}
</style>
