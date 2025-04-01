<script>
import CandidateCard from './CandidateCard.vue';

export default {
  name: 'VacancyCard',
  components: {
    CandidateCard,
  },
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
      <div class="candidates">
        <h4>Подходящие кандидаты:</h4>
        <CandidateCard
            v-for="candidate in candidates"
            :key="candidate.id"
            :candidate="candidate"
        />
        <slot name="actions"></slot>
        <p v-if="candidates.length === 0">Кандидаты на эту вакансию не найдены.</p>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.vacancy-card {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

h3 {
  margin-top: 0;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

.candidates {
  margin-top: 15px;
}

.tag {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem
}
</style>
