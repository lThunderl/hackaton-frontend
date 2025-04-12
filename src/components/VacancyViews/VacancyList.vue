<template>
  <div class="vacancy-list">
    <div class="head">
      <h2>Вакансии и рекомендуемые кандидаты</h2>
      <el-button type="primary" @click="goToCreateVacancy">
        Добавить вакансию
      </el-button>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="3" animated />
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="vacancies && vacancies.length > 0">
      <VacancyCard
        v-for="vacancy in vacancies"
        :key="vacancy.id"
        :vacancy="vacancy"
        :candidates="getLimitedCandidates(vacancy.id)"
        @click="showVacancyDetails(vacancy)"
      >
        <template v-slot:actions>
          <el-button
            type="primary"
            plain
            v-if="getSuitableCandidates(vacancy.id).length > 3"
            @click="showAllCandidates(vacancy.id)"
          >
            Показать всех кандидатов
          </el-button>
        </template>
      </VacancyCard>
    </div>
    
    <div v-else class="empty-state">
      <el-empty description="Вакансии не найдены" />
    </div>

    <!-- Модальное окно для отображения всех кандидатов -->
    <AllCandidatesModal
      v-if="isCandidatesModalOpen"
      :vacancyId="selectedVacancyId"
      :candidates="getSuitableCandidates(selectedVacancyId)"
      @close="closeCandidatesModal"
    />
    
    <!-- Модальное окно для отображения деталей вакансии -->
    <VacancyDetailsModal
      v-if="isVacancyDetailsModalOpen"
      v-model="isVacancyDetailsModalOpen"
      :vacancy="selectedVacancy"
      :candidates="getSuitableCandidates(selectedVacancy?.id)"
      @close="closeVacancyDetailsModal"
    />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import VacancyCard from '../Cards/VacancyCard.vue';
import AllCandidatesModal from '../Modals/AllCandidatesModal.vue';
import VacancyDetailsModal from '../Modals/VacancyDetailsModal.vue';
import vacancyService from "@/components/service/vacancyService";

const router = useRouter();

// Состояние данных
const vacancies = ref([]);
const candidatesMap = ref({});
const isLoading = ref(true);

// Состояние для модального окна кандидатов
const selectedVacancyId = ref(null);
const isCandidatesModalOpen = ref(false);

// Состояние для модального окна деталей вакансии
const selectedVacancy = ref(null);
const isVacancyDetailsModalOpen = ref(false);

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    // Загружаем вакансии
    vacancies.value = await vacancyService.getAllVacancies();

    // Загружаем кандидатов для каждой вакансии
    for (const vacancy of vacancies.value) {
      candidatesMap.value[vacancy.id] = await vacancyService.getCandidatesByVacancyId(vacancy.id);
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  } finally {
    isLoading.value = false;
  }
});

// Методы для навигации
const goToCreateVacancy = () => {
  router.push({ name: 'CreateVacancy' });
};

// Методы для работы с кандидатами
const getSuitableCandidates = (vacancyId) => {
  return candidatesMap.value[vacancyId] || [];
};

const getLimitedCandidates = (vacancyId) => {
  const candidates = getSuitableCandidates(vacancyId);
  return candidates.slice(0, 3);
};

// Методы для работы с модальным окном кандидатов
const showAllCandidates = (vacancyId) => {
  selectedVacancyId.value = vacancyId;
  isCandidatesModalOpen.value = true;
};

const closeCandidatesModal = () => {
  isCandidatesModalOpen.value = false;
  selectedVacancyId.value = null;
};

// Методы для работы с модальным окном деталей вакансии
const showVacancyDetails = (vacancy) => {
  selectedVacancy.value = vacancy;
  isVacancyDetailsModalOpen.value = true;
};

const closeVacancyDetailsModal = () => {
  isVacancyDetailsModalOpen.value = false;
  selectedVacancy.value = null;
};
</script>

<style scoped>
.vacancy-list {
  padding: 20px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  margin-top: 40px;
  text-align: center;
}
</style>