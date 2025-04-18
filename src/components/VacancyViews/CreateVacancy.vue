<script setup>
import {ref, reactive, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import AddCompanyModal from "@/components/Modals/AddCompanyModal.vue";
import SelectCompanyModal from "@/components/Modals/SelectCompanyModal.vue";
import AddCompetencyModal from "@/components/Modals/AddCompetencyModal.vue";
import competencyService from "@/components/service/competencyService";
import companyService from "@/components/service/companyService";
import vacancyService from "@/components/service/vacancyService";

const router = useRouter();
const ruleFormRef = ref(null);

// Состояние данных
const companies = ref([]);
const availableCompetencies = ref([]);
const selectedCompetencies = ref([]);
const competencyLevels = ref({});
const selectedCompany = ref(null);
const isSelectCompanyModalOpen = ref(false);
const companyModalVisible = ref(false);
const competencyModalVisible = ref(false);
const isLoading = ref(false);

const ruleForm = reactive({
  name: '',
  description: '',
  url: '',
  location: {
    country: '',
    region: '',
    city: ''
  },
  company_id: null,
  vacancy_competencies: []
});

const linkRule = /^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w .-]*)*\/?$/

// Правила валидации
const rules = reactive({
  name: [
    {required: true, message: 'Пожалуйста, введите название должности', trigger: 'blur'},
    {min: 3, max: 100, message: 'Длина должна быть от 3 до 100 символов', trigger: 'blur'}
  ],
  description: [
    {required: true, message: 'Пожалуйста, введите описание вакансии', trigger: 'blur'},
    {min: 10, message: 'Описание должно содержать минимум 10 символов', trigger: 'blur'}
  ],
  url: [
    {required: true, message: 'Пожалуйста, укажите ссылку на вакансию', trigger: 'blur'},
    {
      pattern: linkRule,
      message: 'Пожалуйста, введите корректный URL',
      trigger: 'blur'
    }
  ],
  'location.country': [
    {required: true, message: 'Пожалуйста, укажите страну', trigger: 'blur'}
  ],
  'location.region': [
    {required: true, message: 'Пожалуйста, укажите регион', trigger: 'blur'}
  ],
  'location.city': [
    {required: true, message: 'Пожалуйста, укажите город', trigger: 'blur'}
  ],
  company_id: [
    {required: true, message: 'Пожалуйста, выберите компанию', trigger: 'change'}
  ],
  vacancy_competencies: [
    {
      validator: (rule, value, callback) => {
        if (selectedCompetencies.value && selectedCompetencies.value.length === 0) {
          callback(new Error('Пожалуйста, выберите компетенции'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
});

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

watch(selectedCompetencies, (newVal) => {
  if (newVal && newVal.length > 0) {
    updateVacancyCompetencies();
  } else {
    ruleForm.vacancy_competencies = [];
  }
}, { deep: true });

onMounted(async () => {
  isLoading.value = true;
  try {
    availableCompetencies.value = await competencyService.getAllCompetencies();
    await loadCompanies();

    competencyLevels.value = {};
  } catch (error) {
    console.error('Ошибка при загрузке данных', error);
    ElMessage.error('Не удалось загрузить необходимые данные. Пожалуйста, попробуйте позже.');
  } finally {
    isLoading.value = false;
  }
});

const loadCompanies = async () => {
  try {
    companies.value = await companyService.getAllCompanies();
    console.log(companies);
  } catch (error) {
    console.error('Ошибка при загрузке компаний', error);
    ElMessage.error('Не удалось загрузить список компаний');
  }
};

const openCompetencyModal = () => {
  competencyModalVisible.value = true;
};

const handleCompetencyCreated = async (competency) => {
  if (!competency || !competency.id) return;

  availableCompetencies.value.push(competency);

  if (!selectedCompetencies.value) {
    selectedCompetencies.value = [];
  }

  selectedCompetencies.value.push(competency.id);

  if (!competencyLevels.value) {
    competencyLevels.value = {};
  }

  competencyLevels.value[competency.id] = 1;
  updateVacancyCompetencies();
};

const openSelectCompanyModal = () => {
  isSelectCompanyModalOpen.value = true;
};

const closeSelectCompanyModal = () => {
  isSelectCompanyModalOpen.value = false;
};

const handleCompanySelected = (company) => {
  if (!company) return;

  selectedCompany.value = company;
  ruleForm.company_id = company.id;
  closeSelectCompanyModal();
};

const openCompanyModal = () => {
  companyModalVisible.value = true;
};

const handleCompanyCreated = async (company) => {
  if (!company) return;

  companies.value.push(company);
  handleCompanySelected(company);
  ElMessage.success(`Компания "${company.name}" успешно создана и выбрана`);
};

const handleCompanyDeleted = async (companyId) => {
  if (!companyId) return;

  try {
    await companyService.deleteCompany(companyId);

    if (selectedCompany.value && selectedCompany.value.id === companyId) {
      selectedCompany.value = null;
      ruleForm.company_id = null;
    }

    await loadCompanies();
  } catch (error) {
    console.error('Ошибка при удалении компании:', error);
    ElMessage.error(`Не удалось удалить компанию: ${error.message}`);
  }
};

const updateVacancyCompetencies = () => {
  try {
    if (!competencyLevels.value || !selectedCompetencies.value) {
      ruleForm.vacancy_competencies = [];
      return;
    }

    ruleForm.vacancy_competencies = Object.entries(competencyLevels.value)
        .filter(([competence_id]) => {
          const id = parseInt(competence_id);
          return !isNaN(id) && selectedCompetencies.value.includes(id);
        })
        .map(([competence_id, level]) => {
          const uiLevel = level;
          const backendLevel = convertLevelToBackendValue(uiLevel);

          console.log(`Компетенция ${competence_id}: UI уровень ${uiLevel} -> бэкенд уровень ${backendLevel}`);

          return {
            competence_id: competence_id.toString(),
            level: backendLevel
          };
        });

    console.log('Обновленные компетенции вакансии:', JSON.stringify(ruleForm.vacancy_competencies, null, 2));
  } catch (error) {
    console.error('Ошибка при обновлении компетенций:', error);
    ruleForm.vacancy_competencies = [];
  }
};

const onCompetenciesChange = (value) => {
  try {
    if (!Array.isArray(value)) {
      value = [];
    }

    if (!competencyLevels.value) {
      competencyLevels.value = {};
    }

    value.forEach(competenceId => {
      if (competenceId && !competencyLevels.value[competenceId]) {
        competencyLevels.value[competenceId] = 1;
      }
    });

    if (competencyLevels.value) {
      Object.keys(competencyLevels.value).forEach(competenceId => {
        const id = parseInt(competenceId);
        if (!isNaN(id) && !value.includes(id)) {
          delete competencyLevels.value[competenceId];
        }
      });
    }
    selectedCompetencies.value = value;
    updateVacancyCompetencies();
  } catch (error) {
    console.error('Ошибка при изменении компетенций:', error);
  }
};

const handleCompetencyLevelChange = (competenceId, level) => {
  try {
    if (!competencyLevels.value) {
      competencyLevels.value = {};
    }

    if (competenceId) {
      competencyLevels.value[competenceId] = level;
      updateVacancyCompetencies();
    }
  } catch (error) {
    console.error('Ошибка при изменении уровня компетенции:', error);
  }
};

const getCompetenceName = (competenceId) => {
  try {
    if (!competenceId || !availableCompetencies.value) return '';

    const competence = availableCompetencies.value.find(c => c && c.id === competenceId);
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

const submitForm = async (formEl) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        updateVacancyCompetencies(); // Обновляем vacancy_competencies с конвертацией уровней
        const vacancyData = {
          name: ruleForm.name,
          description: ruleForm.description,
          url: ruleForm.url,
          location: ruleForm.location,
          company_id: ruleForm.company_id,
          vacancy_competencies: ruleForm.vacancy_competencies
        };
        console.log('Отправляем данные вакансии:', JSON.stringify(vacancyData, null, 2));

        await vacancyService.createVacancy(vacancyData);
        ElMessage.success('Вакансия успешно создана!');
        console.log('Объект создан');
        router.push('/hr-page');
      } catch (error) {
        console.error('Ошибка при создании вакансии:', error);
        ElMessage.error(`Не удалось создать вакансию: ${error.message}`);
      } finally {
        isLoading.value = false;
      }
    } else {
      ElMessage.error('Пожалуйста, заполните все обязательные поля корректно');
    }
  });
};

const cancel = () => {
  router.push('/hr-page');
};
</script>

<template>
  <div class="create-vacancy">
    <h2>Создание вакансии</h2>
    <div class="form-group">
      <el-form
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          ref="ruleFormRef"
          status-icon
      >
        <el-form-item label="Название должности" prop="name">
          <el-input v-model="ruleForm.name"/>
        </el-form-item>

        <el-form-item label="Описание" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" :rows="4"/>
        </el-form-item>

        <el-form-item label="Ссылка на вакансию" prop="url">
          <el-input v-model.trim="ruleForm.url"/>
        </el-form-item>

        <!-- Локация -->
        <el-form-item label="Страна" prop="location.country">
          <el-input v-model="ruleForm.location.country"/>
        </el-form-item>
        <el-form-item label="Регион" prop="location.region">
          <el-input v-model="ruleForm.location.region"/>
        </el-form-item>
        <el-form-item label="Город" prop="location.city">
          <el-input v-model="ruleForm.location.city"/>
        </el-form-item>

        <!-- Выбор компании -->
        <el-form-item label="Компания" prop="company_id">
          <p v-if="selectedCompany">{{ selectedCompany.name }}</p>
          <el-button @click="openSelectCompanyModal">
            {{ selectedCompany ? 'Изменить компанию' : 'Выбрать компанию' }}
          </el-button>

          <SelectCompanyModal
              :model-value="isSelectCompanyModalOpen"
              :companies="companies"
              @update:model-value="closeSelectCompanyModal"
              @company-selected="handleCompanySelected"
              @company-created="openCompanyModal"
              @company-deleted="handleCompanyDeleted"
          />
        </el-form-item>

        <!-- Компетенции -->
        <el-form-item label="Компетенции" prop="vacancy_competencies">
          <div class="competencies-header">
            <el-select
                v-model="selectedCompetencies"
                multiple
                placeholder="Выберите компетенции"
                @change="onCompetenciesChange"
                style="flex-grow: 1;"
                clearable
            >
              <el-option
                  v-for="competence in availableCompetencies"
                  :key="competence.id"
                  :label="competence.name"
                  :value="competence.id"
              />
            </el-select>
            <el-button @click="openCompetencyModal" type="primary" size="small">
              Добавить новую компетенцию
          </el-button>
    </div>

          <div v-if="selectedCompetencies && selectedCompetencies.length > 0" class="competency-levels">
            <p>Уровни компетенций:</p>
            <div v-for="competenceId in selectedCompetencies" :key="competenceId" class="competence-level">
              <span>{{ getCompetenceName(competenceId) }}:</span>
              <el-slider
                  v-model="competencyLevels[competenceId]"
                  :min="1"
                  :max="3"
                  show-tooltip
                  :format-tooltip="formatCompetencyLevel"
                  @change="(value) => handleCompetencyLevelChange(competenceId, value)"
              />
  </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="isLoading">
            Создать вакансию
          </el-button>
          <el-button @click="cancel">Отмена</el-button>
        </el-form-item>
      </el-form>

      <!-- Модальное окно для создания компании -->
      <AddCompanyModal
          v-model="companyModalVisible"
          @company-created="handleCompanyCreated"
      />

      <!-- Модальное окно для создания компетенции -->
      <AddCompetencyModal
          v-model="competencyModalVisible"
          @competency-created="handleCompetencyCreated"
      />
    </div>
  </div>
</template>

<style scoped>
.create-vacancy {
  padding: 20px;
}

.form-group {
  width: 80%;
  margin: 0 auto;
}

.competencies-header {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.competency-levels {
  width: 100%;
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f8f8f8;
}

.competence-level {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.competence-level span {
  min-width: 150px;
  font-weight: 500;
}
</style>