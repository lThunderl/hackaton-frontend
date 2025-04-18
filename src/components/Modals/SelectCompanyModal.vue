<script setup>
import { computed, ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  companies: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'company-selected', 'company-created', 'company-deleted']);

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const loading = ref(false);
const searchQuery = ref('');
const deleteConfirmVisible = ref(false);
const companyToDelete = ref(null);

const filteredCompanies = computed(() => {
  if (!searchQuery.value) {
    return props.companies;
  }

  const query = searchQuery.value.toLowerCase();
  return props.companies.filter(company =>
      company.name.toLowerCase().includes(query) ||
      (company.description && company.description.toLowerCase().includes(query))
  );
});

const handleClose = () => {
  emit('update:modelValue', false);
  searchQuery.value = '';
};

const selectCompany = (company) => {
  emit('company-selected', company);
};

const openAddCompanyModal = () => {
  handleClose();
  emit('company-created');
};

const confirmDelete = (company) => {
  companyToDelete.value = company;
  deleteConfirmVisible.value = true;
};

const deleteCompany = async () => {
  if (companyToDelete.value) {
    loading.value = true;
    try {
      emit('company-deleted', companyToDelete.value.id);
      ElMessage({
        type: 'success',
        message: `Компания "${companyToDelete.value.name}" успешно удалена`
      });
    } catch (error) {
      ElMessage({
        type: 'error',
        message: `Ошибка при удалении компании: ${error.message}`
      });
    } finally {
      loading.value = false;
      deleteConfirmVisible.value = false;
      companyToDelete.value = null;
    }
  }
};
</script>

<template>
  <el-dialog
      v-model="isVisible"
      title="Выбор компании"
      @close="handleClose"
      width="60%"
  >
    <div class="search-container">
      <el-input
          v-model="searchQuery"
          placeholder="Поиск компании..."
          prefix-icon="el-icon-search"
          clearable
      />
    </div>

    <div class="company-list">
      <el-table
          :data="filteredCompanies"
          style="width: 100%"
          height="400"
          @row-click="selectCompany"
          v-loading="loading"
      >
        <el-table-column prop="name" label="Название компании" />
        <el-table-column label="Действия" width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click.stop="selectCompany(row)">
                Выбрать
              </el-button>
              <el-button type="danger" size="small" @click.stop="confirmDelete(row)">
                Удалить
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" @click="openAddCompanyModal">Создать новую компанию</el-button>
        <el-button @click="handleClose">Отмена</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Диалог подтверждения удаления -->
  <el-dialog
      v-model="deleteConfirmVisible"
      title="Подтверждение удаления"
      width="30%"
  >
    <span>Вы уверены, что хотите удалить компанию "{{ companyToDelete?.name }}"?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">Отмена</el-button>
        <el-button type="danger" @click="deleteCompany">Удалить</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.search-container {
  margin-bottom: 15px;
}

.company-list {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>