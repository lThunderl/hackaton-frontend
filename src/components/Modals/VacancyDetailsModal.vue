<script setup>
import { ref, computed, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import CandidateCard from '../Cards/CandidateCard.vue';
import companyService from '@/components/service/companyService';
import vacancyService from '@/components/service/vacancyService';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  vacancy: {
    type: Object,
    required: true
  },
  candidates: {
    type: Array,
    default: () => []
  },
  canEdit: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'vacancy-deleted']);

const router = useRouter();
const company = ref(null);
const deleteConfirmVisible = ref(false);
const isDeleting = ref(false);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

onMounted(async () => {
  const companyId = props.vacancy.company_id || props.vacancy.companyId;
  if (companyId) {
    try {
      company.value = await companyService.getCompanyById(companyId);
    } catch (error) {
      console.error('Ошибка при загрузке информации о компании:', error);
    }
  }
});

const handleClose = () => {
  emit('close');
};

const editVacancy = async () => {
  try {
    const fullVacancy = await vacancyService.getVacancyById(props.vacancy.id);

    router.push({
      name: 'EditVacancy',
      params: {id: props.vacancy.id},
      state: { vacancy: fullVacancy || props.vacancy }
    });
    handleClose();
  } catch (error) {
    console.error('Ошибка при подготовке к редактированию вакансии:', error);
    ElMessage.error('Не удалось открыть страницу редактирования. Пожалуйста, попробуйте снова.');
  }
};

const confirmDelete = () => {
  deleteConfirmVisible.value = true;
};

const deleteVacancy = async () => {
  isDeleting.value = true;
  try {
    await vacancyService.deleteVacancy(props.vacancy?.id);
    ElMessage.success('Вакансия успешно удалена');
    deleteConfirmVisible.value = false;
    emit('vacancy-deleted', props.vacancy?.id);
    handleClose();
  } catch (error) {
    console.error('Ошибка при удалении вакансии:', error);
    ElMessage.error('Не удалось удалить вакансию');
  } finally {
    isDeleting.value = false;
  }
};

const formattedCompetencies = computed(() => {
  if (props.vacancy?.vacancy_competencies && props.vacancy.vacancy_competencies.length > 0) {
    return props.vacancy.vacancy_competencies.map(comp => ({
      id: comp.competence_id,
      name: comp.name || getCompetenceName(comp.competence_id),
      level: comp.level
    }));
  }

  if (props.vacancy.competenciesData && props.vacancy.competenciesData.length > 0) {
    return props.vacancy.competenciesData;
  }

  if (Array.isArray(props.vacancy.requirements)) {
    return props.vacancy.requirements.map(req => ({name: req}));
  }

  if (props.vacancy?.competencies && typeof props.vacancy.competencies === 'object' && !Array.isArray(props.vacancy.competencies)) {
    return Object.entries(props.vacancy.competencies).map(([id, level]) => ({
      id: parseInt(id),
      name: getCompetenceName(parseInt(id)),
      level: level
    }));
  }

  if (Array.isArray(props.vacancy?.competencies)) {
    return props.vacancy?.competencies.map(comp => ({name: comp}));
  }

  return [];
});

const convertLevelToCategory = (level) => {
  if (level >= 8) return 3; // высокий
  if (level >= 6) return 2; // средний
  if (level >= 3) return 1; // низкий
  return 0; // не отображать
};

const shouldDisplayLevel = (level) => {
  return level >= 3;
};

const getCompetenceName = (id) => {
  return `${id}`;
};

const competencyLevels = ['Начальный', 'Средний', 'Продвинутый'];
</script>

<template>
  <div class="vacancy-details-dialog">
    <el-dialog
        v-model="dialogVisible"
        :title="vacancy.name || vacancy.title"
        width="80%"
        center
        @close="handleClose"
        class="vacancy-details-dialog"
    >
      <div class="vacancy-details">
        <div class="vacancy-info">
          <h3>Описание вакансии</h3>
          <p class="vacancy-description">{{ vacancy.description }}</p>

          <div class="vacancy-meta">
            <div class="meta-item" v-if="vacancy.location">
              <h4>Локация:</h4>
              <p>
                {{ vacancy.location.city }},
                {{ vacancy.location.region }},
                {{ vacancy.location.country }}
              </p>
            </div>

            <div class="meta-item" v-if="company">
              <h4>Компания:</h4>
              <p>{{ company.name }}</p>
              <p v-if="company.description">{{ company.description }}</p>
              <p v-if="company.website">
                <a :href="company.website" target="_blank">{{ company.website }}</a>
              </p>
            </div>

            <div class="meta-item" v-if="vacancy.url">
              <h4>Ссылка на вакансию:</h4>
              <p><a :href="vacancy.url" target="_blank">{{ vacancy.url }}</a></p>
            </div>
          </div>

          <div class="competencies-section">
            <h4>Требуемые компетенции:</h4>
            <div class="competencies-list">
              <template v-if="formattedCompetencies.length > 0">
                <div v-for="comp in formattedCompetencies" :key="comp.id || comp.name" class="competency-item">
                  <el-tooltip
                      v-if="comp.level && shouldDisplayLevel(comp.level)"
                      :content="'Уровень: ' + competencyLevels[convertLevelToCategory(comp.level) - 1] + ', ' + comp.level"
                      placement="top"
                  >
                    <el-tag type="success" class="competency-tag">
                      {{ comp.name }}
                      <span class="level-indicator">{{ convertLevelToCategory(comp.level) }}</span>
                    </el-tag>
                  </el-tooltip>

                  <el-tag v-else type="success" class="competency-tag">
                    {{ comp.name }}
                  </el-tag>
                </div>
              </template>
              <p v-else>Компетенции не указаны</p>
            </div>
          </div>
        </div>

        <div class="candidates-section">
          <h3>Подходящие кандидаты ({{ candidates.length }})</h3>
          <div class="candidates-list" v-if="candidates.length > 0">
            <CandidateCard
                v-for="candidate in candidates"
                :key="candidate.id"
                :candidate="candidate"
            />
          </div>
          <p v-else>Кандидаты на эту вакансию не найдены.</p>
        </div>
      </div>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Закрыть</el-button>
        <el-button type="primary" @click="editVacancy" v-if="canEdit">
          Редактировать вакансию
        </el-button>
        <el-button type="danger" @click="confirmDelete" v-if="canEdit">
          Удалить вакансию
        </el-button>
      </span>
      </template>
    </el-dialog>

    <!-- Диалог подтверждения удаления -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="Подтверждение удаления"
      width="30%"
      center
    >
      <span>Вы уверены, что хотите удалить вакансию "{{ vacancy.name || vacancy.title }}"?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">Отмена</el-button>
          <el-button type="danger" @click="deleteVacancy" :loading="isDeleting">Удалить</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.el-dialog) {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  margin-top: 5vh !important;
}

:deep(.el-dialog__body) {
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  padding-right: 15px;
}

.vacancy-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacancy-info h3,
.candidates-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.vacancy-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}

.meta-item {
  flex: 1;
  min-width: 200px;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
}

.meta-item h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #606266;
}

.meta-item p {
  margin: 5px 0;
}

.vacancy-description {
  white-space: pre-wrap;
}

.competencies-section {
  margin-top: 20px;
}

.competencies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.competency-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.level-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  font-size: 12px;
  margin-left: 3px;
}

.candidates-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 15px;
  max-height: 50%;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

a {
  color: #409eff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>