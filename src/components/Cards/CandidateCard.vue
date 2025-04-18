<script>
export default {
  name: 'CandidateCard',
  props: {
    candidate: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <div v-if="candidate" class="candidate-card">
    <strong>{{ candidate.name }}</strong>
    <p>Компетенции: {{ candidate.skills.join(', ') }}</p>
  </div>
</template>

<style scoped>
.candidate-card {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 3px;
}
</style>
