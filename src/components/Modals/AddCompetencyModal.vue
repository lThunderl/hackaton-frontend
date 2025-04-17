<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import competencyService from '@/components/service/competencyService';

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'competency-created']);

const formRef = ref(null);
const isSubmitting = ref(false);

const competencyForm = ref({
  name: '',
  id: ''
});

const rules = {
  name: [
    { required: true, message: 'Пожалуйста, введите название компетенции', trigger: 'blur' },
    { min: 2, message: 'Название должно содержать минимум 2 символа', trigger: 'blur' }
  ],
  id: [
    { required: true, message: 'Пожалуйста, введите id компетенции', trigger: 'blur' },
  ]
};

const resetForm = () => {
  competencyForm.value = {
    name: '',
    id: ''
  };
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const closeModal = () => {
  emit('update:modelValue', false);
};

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      try {
        const newCompetency = await competencyService.createCompetency(competencyForm.value);
        ElMessage.success(`Компетенция "${newCompetency.name}" успешно создана`);
        emit('competency-created', newCompetency);
        closeModal();
      } catch (error) {
        console.error('Ошибка при создании компетенции:', error);
        ElMessage.error(`Не удалось создать компетенцию: ${error.message || 'Неизвестная ошибка'}`);
      } finally {
        isSubmitting.value = false;
      }
    } else {
      ElMessage.warning('Пожалуйста, заполните форму корректно');
    }
  });
};
</script>

<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Добавление новой компетенции"
      width="30%"
      :close-on-click-modal="false"
      @closed="resetForm"
  >
    <el-form
        :model="competencyForm"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        status-icon
    >
      <el-form-item label="Название" prop="name">
        <el-input v-model="competencyForm.name" placeholder="Введите название компетенции" />
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input v-model="competencyForm.id" placeholder="Введите ID компетенции" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeModal">Отмена</el-button>
        <el-button type="primary" @click="submitForm" :loading="isSubmitting">
          Создать
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>