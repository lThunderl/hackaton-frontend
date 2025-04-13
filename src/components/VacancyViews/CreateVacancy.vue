<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import AddCompanyModal from "@/components/Modals/AddCompanyModal.vue";
import SelectCompanyModal from "@/components/Modals/SelectCompanyModal.vue";
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
const isLoading = ref(false);

// Форма с данными вакансии
const ruleForm = reactive({
  title: '',
  description: '',
  url: '',
  location: {
    country: '',
    region: '',
    city: ''
  },
  companyId: null,
  competencies: []
});

const linkRule = /^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w .-]*)*\/?$/

// Правила валидации
const rules = reactive({
  title: [
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
  companyId: [
    { required: true, message: 'Пожалуйста, выберите компанию', trigger: 'change' }
  ],
  competencies: [
    { required: true, message: 'Пожалуйста, выберите компетенции', trigger: 'change' }
  ]
});

onMounted(async () => {
  isLoading.value = true;
  try {
    availableCompetencies.value = await competencyService.getAllCompetencies();

    await loadCompanies();
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
  } catch (error) {
    console.error('Ошибка при загрузке компаний', error);
    ElMessage.error('Не удалось загрузить список компаний');
  }
};

const openSelectCompanyModal = () => {
  isSelectCompanyModalOpen.value = true;
};

const closeSelectCompanyModal = () => {
  isSelectCompanyModalOpen.value = false;
};

const handleCompanySelected = (company) => {
  selectedCompany.value = company;
  ruleForm.companyId = company.id;
  closeSelectCompanyModal();
};

const openCompanyModal = () => {
  companyModalVisible.value = true;
};

const handleCompanyCreated = async (company) => {
  companies.value.push(company);
  handleCompanySelected(company);
  ElMessage.success(`Компания "${company.name}" успешно создана и выбрана`);
};

// Обработка удаления компании
const handleCompanyDeleted = async (companyId) => {
  try {
    await companyService.deleteCompany(companyId);

    if (selectedCompany.value && selectedCompany.value.id === companyId) {
      selectedCompany.value = null;
      ruleForm.companyId = null;
    }

    await loadCompanies();
  } catch (error) {
    console.error('Ошибка при удалении компании:', error);
    ElMessage.error(`Не удалось удалить компанию: ${error.message}`);
  }
};

const onCompetenciesChange = (value) => {
  selectedCompetencies.value = value;

  value.forEach(competenceId => {
    if (!competencyLevels.value[competenceId]) {
      competencyLevels.value[competenceId] = 1;
    }
  });

  Object.keys(competencyLevels.value).forEach(competenceId => {
    if (!value.includes(parseInt(competenceId))) {
      delete competencyLevels.value[competenceId];
    }
  });

  ruleForm.competencies = value;
};

const getCompetenceName = (competenceId) => {
  const competence = availableCompetencies.value.find(c => c.id === competenceId);
  return competence ? competence.name : '';
};

const formatCompetencyLevel = (val) => {
  const levels = ['Начальный', 'Средний', 'Продвинутый'];
  return levels[val - 1];
};

// Отправка формы
const submitForm = async (formEl) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        const vacancyData = {
          title: ruleForm.title,
          description: ruleForm.description,
          url: ruleForm.url,
          location: ruleForm.location,
          companyId: ruleForm.companyId,
          competencies: competencyLevels.value
        };

        await vacancyService.createVacancy(vacancyData);
        ElMessage.success('Вакансия успешно создана!');
        console.log('Объект создан')
        console.log(vacancyData)
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
        <el-form-item label="Название должности" prop="title">
          <el-input v-model="ruleForm.title"/>
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
        <el-form-item label="Компания" prop="companyId">
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
        <el-form-item label="Компетенции" prop="competencies">
          <el-select
              v-model="selectedCompetencies"
              multiple
              placeholder="Выберите компетенции"
              @change="onCompetenciesChange"
          >
            <el-option
                v-for="competence in availableCompetencies"
                :key="competence.id"
                :label="competence.name"
                :value="competence.id"
            />
          </el-select>

          <div v-if="selectedCompetencies.length > 0" class="competency-levels">
            <p>Уровни компетенций:</p>
            <div v-for="competenceId in selectedCompetencies" :key="competenceId" class="competence-level">
              <span>{{ getCompetenceName(competenceId) }}:</span>
              <el-slider
                  v-model="competencyLevels[competenceId]"
                  :min="1"
                  :max="3"
                  show-tooltip
                  :format-tooltip="formatCompetencyLevel"
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