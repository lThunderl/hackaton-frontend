<!-- AddCompanyModal.vue (Компонент создания компании - Улучшенная версия) -->
<template>
  <el-dialog v-model="isVisible" title="Создание компании" @close="handleClose">
    <el-form :model="newCompany" :rules="rules" ref="companyForm" label-width="140px" status-icon>
      <el-form-item label="Название компании" prop="name">
        <el-input v-model.trim="newCompany.name" placeholder="Введите название компании" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Отмена</el-button>
        <el-button type="primary" @click="createCompany" :loading="isLoading">
          Создать компанию
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import companyService from '@/components/service/companyService';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  
  emits: ['update:modelValue', 'company-created'],
  
  setup(props, { emit }) {
    const isVisible = ref(props.modelValue);
    const isLoading = ref(false);
    
    const newCompany = reactive({
      name: '',
    });

    const companyForm = ref(null);

    const rules = reactive({
      name: [
        { required: true, message: 'Пожалуйста, введите название компании', trigger: 'blur' },
        { min: 2, max: 100, message: 'Длина должна быть от 2 до 100 символов', trigger: 'blur' }
      ],
    });

    // Следим за изменением props.modelValue
    watch(() => props.modelValue, (newValue) => {
      isVisible.value = newValue;
    });

    // Следим за изменением isVisible
    watch(isVisible, (newValue) => {
      if (newValue !== props.modelValue) {
        emit('update:modelValue', newValue);
      }
    });

    const handleClose = () => {
      emit('update:modelValue', false);
      resetForm();
    };

    const createCompany = () => {
      companyForm.value.validate(async (valid) => {
        if (valid) {
          isLoading.value = true;
          try {
            // Используем сервис для создания компании
            const createdCompany = await companyService.createCompany(newCompany);
            
            ElMessage.success('Компания успешно создана!');
            emit('company-created', createdCompany);
            handleClose();
          } catch (error) {
            console.error('Ошибка при создании компании:', error);
            ElMessage.error('Произошла ошибка при создании компании. Пожалуйста, попробуйте позже.');
          } finally {
            isLoading.value = false;
          }
        } else {
          ElMessage.warning('Пожалуйста, заполните все обязательные поля корректно');
        }
      });
    };

    const resetForm = () => {
      newCompany.name = '';
      
      // Сбрасываем валидацию формы, если форма уже существует
      if (companyForm.value) {
        companyForm.value.resetFields();
      }
    };

    return {
      isVisible,
      isLoading,
      newCompany,
      handleClose,
      createCompany,
      companyForm,
      rules
    };
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>