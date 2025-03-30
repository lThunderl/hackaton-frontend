<script>
import {mockVacancies, mockCandidates} from '@/utils/mockData';

import VacancyCard from '../Cards/VacancyCard.vue';
import AllCandidatesModal from '../Modals/AllCandidatesModal.vue';

export default {
  name: 'VacancyList',
  components: {
    VacancyCard,
    AllCandidatesModal,
  },
  data() {
    return {
      vacancies: mockVacancies,
      candidates: mockCandidates,
      selectedVacancyId: null, // ID вакансии для отображения кандидатов в модальном окне
      isModalOpen: false,
    };
  },
  methods: {
    getSuitableCandidates(vacancyId) {
      return this.candidates.filter(candidate => candidate.vacancyId === vacancyId);
    },
    getLimitedCandidates(vacancyId) {
      const suitableCandidates = this.getSuitableCandidates(vacancyId);
      return suitableCandidates.slice(0, 3); // Возвращаем только первые 3 кандидата
    },
    showAllCandidates(vacancyId) {
      this.selectedVacancyId = vacancyId;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedVacancyId = null;
    },
  },
};
</script>

<template>
  <div class="vacancy-list">
    <h2>Вакансии и рекомендуемые кандидаты</h2>
    <VacancyCard
        v-for="vacancy in vacancies"
        :key="vacancy.id"
        :vacancy="vacancy"
        :candidates="getLimitedCandidates(vacancy.id)"
    >
      <template v-slot:actions>
        <el-button type="primary" plain
                   v-if="getSuitableCandidates(vacancy.id).length > 3"
                   @click="showAllCandidates(vacancy.id)">Показать всех кандидатов
        </el-button>
      </template>
    </VacancyCard>

    <AllCandidatesModal
        v-if="isModalOpen"
        :vacancyId="selectedVacancyId"
        :candidates="getSuitableCandidates(selectedVacancyId)"
        @close="closeModal"
    />
  </div>
</template>

<style scoped>
.vacancy-list {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}
</style>
