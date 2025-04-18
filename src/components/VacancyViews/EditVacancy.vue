<script setup>
import {onMounted, reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import AddCompanyModal from "@/components/Modals/AddCompanyModal.vue";
import SelectCompanyModal from "@/components/Modals/SelectCompanyModal.vue";
import AddCompetencyModal from "@/components/Modals/AddCompetencyModal.vue";
import EditCompetenciesModal from "@/components/Modals/EditCompetenciesModal.vue";
import competencyService from "@/components/service/competencyService";
import companyService from "@/components/service/companyService";
import vacancyService from "@/components/service/vacancyService";

const router = useRouter();
const route = useRoute();
const ruleFormRef = ref(null);

const companies = ref([]);
const availableCompetencies = ref([]);
const selectedCompetencies = ref([]);
const competencyLevels = ref({});
const selectedCompany = ref(null);
const isSelectCompanyModalOpen = ref(false);
const companyModalVisible = ref(false);
const competencyModalVisible = ref(false);
const editCompetenciesModalVisible = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const notFound = ref(false);

const vacancyId = route.params.id;

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
    { required: true, message: 'Пожалуйста, введите название должности', trigger: 'blur' },
    { min: 3, max: 100, message: 'Длина должна быть от 3 до 100 символов', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'Пожалуйста, введите описание вакансии', trigger: 'blur' },
    { min: 10, message: 'Описание должно содержать минимум 10 символов', trigger: 'blur' }
  ],
  url: [
    { required: true, message: 'Пожалуйста, укажите ссылку на вакансию', trigger: 'blur' },
    {
      pattern: linkRule,
      message: 'Пожалуйста, введите корректный URL',
      trigger: 'blur'
    }
  ],
  'location.country': [
    { required: true, message: 'Пожалуйста, укажите страну', trigger: 'blur' }
  ],
  'location.region': [
    { required: true, message: 'Пожалуйста, укажите регион', trigger: 'blur' }
  ],
  'location.city': [
    { required: true, message: 'Пожалуйста, укажите город', trigger: 'blur' }
  ],
  company_id: [
    { required: true, message: 'Пожалуйста, выберите компанию', trigger: 'change' }
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

onMounted(async () => {
  isLoading.value = true;
  try {
    availableCompetencies.value = await competencyService.getAllCompetencies();
    console.log('Загружены доступные компетенции:', availableCompetencies.value);

    await loadCompanies();

    let vacancy = null;

    if (history.state && history.state.vacancy) {
      vacancy = history.state.vacancy;
      console.log('Вакансия получена из истории:', vacancy);
    }
    else if (route.params && route.params.state && route.params.state.vacancy) {
      vacancy = route.params.state.vacancy;
      console.log('Вакансия получена из параметров маршрута:', vacancy);
    }
    else {
      console.log('Запрашиваем вакансию с сервера по ID:', vacancyId);
      vacancy = await vacancyService.getVacancyById(vacancyId);
    }

    if (!vacancy) {
      console.error('Вакансия не найдена');
      notFound.value = true;
      return;
    }

    console.log('Загруженная вакансия:', vacancy);

    ruleForm.name = vacancy.name || vacancy.title;
    ruleForm.description = vacancy.description;
    ruleForm.url = vacancy.url;
    ruleForm.location = vacancy.location || { country: '', region: '', city: '' };
    ruleForm.company_id = vacancy.company_id || vacancy.companyId;

    if (ruleForm.company_id) {
      selectedCompany.value = companies.value.find(c => c.id === ruleForm.company_id);
    }

    selectedCompetencies.value = [];
    competencyLevels.value = {};

    if (vacancy.vacancy_competencies && vacancy.vacancy_competencies.length > 0) {
      console.log('Обрабатываем vacancy_competencies:', vacancy.vacancy_competencies);
      vacancy.vacancy_competencies.forEach(comp => {
        const competenceId = comp.competence_id.toString();
        if (availableCompetencies.value.some(c => c.id.toString() === competenceId)) {
          selectedCompetencies.value.push(competenceId);
          const level = parseInt(comp.level) || 1;
          competencyLevels.value[competenceId] = level;
          console.log(`Компетенция ${competenceId}: уровень ${level}`);
        } else {
          if (comp.name) {
            availableCompetencies.value.push({
              id: competenceId,
              name: comp.name
            });
            console.log(`Добавлена отсутствующая компетенция: ${comp.name} (ID: ${competenceId})`);
            selectedCompetencies.value.push(competenceId);
            competencyLevels.value[competenceId] = parseInt(comp.level) || 1;
          }
        }
      });
    } else if (vacancy.competencies && typeof vacancy.competencies === 'object' && !Array.isArray(vacancy.competencies)) {
      console.log('Обрабатываем competencies объект:', vacancy.competencies);
      Object.entries(vacancy.competencies).forEach(([id, level]) => {
        const competenceId = id.toString();
        if (availableCompetencies.value.some(c => c.id.toString() === competenceId)) {
          selectedCompetencies.value.push(competenceId);
          competencyLevels.value[competenceId] = parseInt(level) || 1;
        }
      });
    } else if (vacancy.competenciesData && vacancy.competenciesData.length > 0) {
      console.log('Обрабатываем competenciesData:', vacancy.competenciesData);
      vacancy.competenciesData.forEach(comp => {
        if (comp.id) {
          const competenceId = comp.id.toString();
          if (availableCompetencies.value.some(c => c.id.toString() === competenceId)) {
            selectedCompetencies.value.push(competenceId);
            competencyLevels.value[competenceId] = parseInt(comp.level) || 1;
          }
        }
      });
    }

    console.log('Выбранные компетенции после обработки:', selectedCompetencies.value);
    console.log('Уровни компетенций после обработки:', competencyLevels.value);
    updateVacancyCompetencies();
  } catch (error) {
    console.error('Ошибка при загрузке данных', error);
    ElMessage.error('Не удалось загрузить необходимые данные. Пожалуйста, попробуйте позже.');
    notFound.value = true;
  } finally {
    isLoading.value = false;
  }
});

const loadCompanies = async () => {
  try {
    companies.value = await companyService.getAllCompanies();
  } catch (error) {
    console.error('Ошибка при загрузке компаний', error);
    ElMessage.error('Не удалось загрузить список компаний');
  }
};


const openEditCompetenciesModal = () => {
  editCompetenciesModalVisible.value = true;
};

const convertLevelToCategory = (level) => {
  if (level >= 8) return 3; // высокий
  if (level >= 6) return 2; // средний
  if (level >= 3) return 1; // низкий
  return 0; // не отображать
};

const handleCompetencyCreated = async (competency) => {
  if (!competency || !competency.id) return;

  availableCompetencies.value.push(competency);
  selectedCompetencies.value.push(competency.id.toString());
  competencyLevels.value[competency.id.toString()] = 1; // Начальный уровень для новой компетенции
  updateVacancyCompetencies();
};

const handleCompetenciesUpdated = (data) => {
  selectedCompetencies.value = [...data.selectedCompetencies];
  competencyLevels.value = {...data.competencyLevels};
  updateVacancyCompetencies();
  ElMessage.success('Компетенции успешно обновлены');
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
        .filter(([competence_id]) => selectedCompetencies.value.includes(competence_id))
        .map(([competence_id, level]) => ({
          competence_id: competence_id,
          level: level
        }));

    console.log('Обновленные компетенции вакансии:', ruleForm.vacancy_competencies);
  } catch (error) {
    console.error('Ошибка при обновлении компетенций:', error);
    ruleForm.vacancy_competencies = [];
  }
};

const getCompetenceName = (competenceId) => {
  try {
    if (!competenceId || !availableCompetencies.value) return '';

    const competence = availableCompetencies.value.find(c => c && c.id.toString() === competenceId.toString());
    return competence ? competence.name : '';
  } catch (error) {
    console.error('Ошибка при получении имени компетенции:', error);
    return '';
  }
};

const submitForm = async (formEl) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (valid) {
      isSaving.value = true;
      try {
        updateVacancyCompetencies();

        const vacancyData = {
          name: ruleForm.name,
          description: ruleForm.description,
          url: ruleForm.url,
          location: ruleForm.location,
          company_id: ruleForm.company_id,
          vacancy_competencies: ruleForm.vacancy_competencies
        };

        console.log('Отправляем данные для обновления:', JSON.stringify(vacancyData, null, 2));

        await vacancyService.updateVacancy(vacancyId, vacancyData);
        ElMessage.success('Вакансия успешно обновлена!');
        router.push('/hr-page');
      } catch (error) {
        console.error('Ошибка при обновлении вакансии:', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          ElMessage.error('Не удалось подключиться к серверу. Пожалуйста, проверьте, запущен ли сервер и доступен ли он.');
        } else {
          ElMessage.error(`Не удалось обновить вакансию: ${error.message}`);
        }
      } finally {
        isSaving.value = false;
      }
    } else {
      ElMessage.error('Пожалуйста, заполните все обязательные поля корректно');
    }
  });
};

const cancel = () => {
  router.push('/hr-page');
};

const goBack = () => {
  router.push('/hr-page');
};
</script>

<template>
  <div class="edit-vacancy">
    <h2>Редактирование вакансии</h2>
    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    <div v-else-if="notFound" class="not-found">
      <h3>Вакансия не найдена</h3>
      <el-button @click="goBack">Вернуться назад</el-button>
    </div>
    <div v-else class="form-group">
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
          <div class="competencies-summary">
            <div v-if="selectedCompetencies.length === 0" class="no-competencies">
              Компетенции не выбраны
            </div>
            <div v-else class="competencies-list">
              <el-tag
                  v-for="competenceId in selectedCompetencies"
                  :key="competenceId"
                  class="competency-tag"
                  type="info"
              >
                {{ getCompetenceName(competenceId) }}
                (Уровень: {{ convertLevelToCategory(competencyLevels[competenceId]) }})
              </el-tag>
            </div>
            <el-button @click="openEditCompetenciesModal" type="primary">
              {{ selectedCompetencies.length > 0 ? 'Редактировать компетенции' : 'Добавить компетенции' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="isSaving">
            Сохранить изменения
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

      <!-- Модальное окно для редактирования компетенций -->
      <EditCompetenciesModal
          v-model="editCompetenciesModalVisible"
          :vacancy-id="vacancyId"
          :available-competencies="availableCompetencies"
          :selected-competencies="selectedCompetencies"
          :competency-levels="competencyLevels"
          @competencies-updated="handleCompetenciesUpdated"
          @competency-created="handleCompetencyCreated"
      />
    </div>
  </div>
</template>

<style scoped>
.edit-vacancy {
  padding: 20px;
}

.form-group {
  width: 80%;
  margin: 0 auto;
}

.loading-container {
  width: 80%;
  margin: 20px auto;
}

.not-found {
  text-align: center;
  margin: 50px auto;
}

.competencies-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.no-competencies {
  color: #909399;
  font-style: italic;
  margin-bottom: 10px;
}

.competencies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.competency-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>