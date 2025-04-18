<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import AddCompetencyModal from "@/components/Modals/AddCompetencyModal.vue";
import vacancyService from "@/components/service/vacancyService";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  vacancyId: {
    type: String,
    required: true
  },
  availableCompetencies: {
    type: Array,
    default: () => []
  },
  selectedCompetencies: {
    type: Array,
    default: () => []
  },
  competencyLevels: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'update:modelValue',
  'competencies-updated',
  'competency-created'
]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const localSelectedCompetencies = ref([...props.selectedCompetencies]);
const localCompetencyLevels = ref({...props.competencyLevels});
const competencyModalVisible = ref(false);
const isSaving = ref(false);

const convertLevelToBackendValue = (level) => {
  const numLevel = Number(level);

  switch (numLevel) {
    case 1: // Начальный (3-6)
      return 4.5;
    case 2: // Средний (6-8)
      return 7.0;
    case 3: // Продвинутый (8-10)
      return 9.0;
    default:
      return 4.5;
  }
};

const convertLevelFromBackendValue = (level) => {
  if (level >= 8) return 3; // продвинутый
  if (level >= 6) return 2; // средний
  if (level >= 3) return 1; // начальный
  return 1;
};

watch(() => props.selectedCompetencies, (newVal) => {
  localSelectedCompetencies.value = [...newVal];
}, { deep: true });

watch(() => props.competencyLevels, (newVal) => {
  localCompetencyLevels.value = {...newVal};
}, { deep: true });

watch(() => dialogVisible.value, (isVisible) => {
  if (isVisible) {
    const convertedLevels = {};
    for (const [competenceId, level] of Object.entries(props.competencyLevels)) {
      convertedLevels[competenceId] = convertLevelFromBackendValue(level);
    }
    localCompetencyLevels.value = convertedLevels;
  }
}, { immediate: true });

const handleClose = () => {
  dialogVisible.value = false;
};

const openCompetencyModal = () => {
  competencyModalVisible.value = true;
};

const handleCompetencyCreated = (competency) => {
  if (!competency || !competency.id) return;

  emit('competency-created', competency);

  localSelectedCompetencies.value.push(competency.id.toString());
  localCompetencyLevels.value[competency.id.toString()] = 1;
};

const onCompetenciesChange = (value) => {
  try {
    if (!Array.isArray(value)) {
      value = [];
    }

    value = value.map(id => id.toString());

    value.forEach(competenceId => {
      if (competenceId && !localCompetencyLevels.value[competenceId]) {
        localCompetencyLevels.value[competenceId] = 1;
      }
    });

    Object.keys(localCompetencyLevels.value).forEach(competenceId => {
      if (!value.includes(competenceId)) {
        delete localCompetencyLevels.value[competenceId];
      }
    });

    localSelectedCompetencies.value = value;
  } catch (error) {
    console.error('Ошибка при изменении компетенций:', error);
  }
};

const handleCompetencyLevelChange = (competenceId, level) => {
  try {
    if (competenceId) {
      localCompetencyLevels.value[competenceId.toString()] = level;
    }
  } catch (error) {
    console.error('Ошибка при изменении уровня компетенции:', error);
  }
};

const getCompetenceName = (competenceId) => {
  try {
    if (!competenceId || !props.availableCompetencies) return '';

    const competence = props.availableCompetencies.find(c => c && c.id.toString() === competenceId.toString());
    return competence ? competence.name : '';
  } catch (error) {
    console.error('Ошибка при получении имени компетенции:', error);
    return '';
  }
};

const formatCompetencyLevel = (val) => {
  const levels = ['Начальный', 'Средний', 'Продвинутый'];
  return levels[val - 1] || 'Начальный';
};

const saveCompetencies = async () => {
  isSaving.value = true;
  try {
    const competenciesData = localSelectedCompetencies.value.map(competenceId => {
      const uiLevel = localCompetencyLevels.value[competenceId];
      const backendLevel = convertLevelToBackendValue(uiLevel);

      return {
        competence_id: competenceId,
        level: backendLevel
      };
    });

    console.log('Отправляем компетенции на сервер:', competenciesData);

    const updatedVacancy = await vacancyService.updateVacancyCompetencies(
        props.vacancyId,
        competenciesData
    );

    const updatedLevels = {};
    for (const [competenceId, level] of Object.entries(localCompetencyLevels.value)) {
      updatedLevels[competenceId] = convertLevelToBackendValue(level);
    }

    emit('competencies-updated', {
      selectedCompetencies: localSelectedCompetencies.value,
      competencyLevels: updatedLevels,
      updatedVacancy
    });

    ElMessage.success('Компетенции успешно обновлены');
    handleClose();
  } catch (error) {
    console.error('Ошибка при сохранении компетенций:', error);
    ElMessage.error(`Не удалось обновить компетенции: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <el-dialog
      v-model="dialogVisible"
      title="Редактирование компетенций"
      width="90%"
      :before-close="handleClose"
  >
    <div class="competencies-container">
      <div class="competencies-header">
        <el-select
            v-model="localSelectedCompetencies"
            multiple
            placeholder="Выберите компетенции"
            @change="onCompetenciesChange"
            style="flex-grow: 1;"
            clearable
            value-key="id"
        >
          <el-option
              v-for="competence in availableCompetencies"
              :key="competence.id"
              :label="competence.name"
              :value="competence.id.toString()"
          />
        </el-select>
        <el-button @click="openCompetencyModal" type="primary" size="small">
          Добавить новую компетенцию
        </el-button>
      </div>

      <div v-if="localSelectedCompetencies && localSelectedCompetencies.length > 0" class="competency-levels">
        <p>Уровни компетенций:</p>
        <div v-for="competenceId in localSelectedCompetencies" :key="competenceId" class="competence-level">
          <span>{{ getCompetenceName(competenceId) }}:</span>
          <el-slider
              v-model="localCompetencyLevels[competenceId]"
              :min="1"
              :max="3"
              :step="1"
              show-stops
              show-tooltip
              :format-tooltip="formatCompetencyLevel"
              @change="(value) => handleCompetencyLevelChange(competenceId, value)"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Отмена</el-button>
        <el-button type="primary" @click="saveCompetencies" :loading="isSaving">
          Сохранить
        </el-button>
      </div>
    </template>

    <!-- Модальное окно для создания компетенции -->
    <AddCompetencyModal
        v-model="competencyModalVisible"
        @competency-created="handleCompetencyCreated"
    />
  </el-dialog>
</template>

<style scoped>
.competencies-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.competencies-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.competency-levels {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.competence-level {
  display: flex;
  align-items: center;
  gap: 10px;
}

.competence-level span {
  min-width: 150px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>