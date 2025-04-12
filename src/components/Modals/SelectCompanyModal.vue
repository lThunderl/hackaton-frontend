<!-- SelectCompanyModal.vue -->
<template>
  <el-dialog
    v-model="isVisible"
    title="Выбор компании"
    @close="handleClose"
    width="60%"
  >
    <div class="company-list">
      <el-table
        :data="companies"
        style="width: 100%"
        height="400"
        @row-click="selectCompany"
      >
        <el-table-column prop="name" label="Название компании" />
        <el-table-column label="Действия" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click.stop="selectCompany(row)">
              Выбрать
            </el-button>
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
</template>

<script>
import {computed} from 'vue';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    companies: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['update:model-value', 'company-selected', 'company-created'],
  
  setup(props, { emit }) {
    const isVisible = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:model-value', value)
    });

    const handleClose = () => {
      emit('update:model-value', false);
    };

    const selectCompany = (company) => {
      emit('company-selected', company);
    };

    const openAddCompanyModal = () => {
      handleClose();
      emit('company-created'); // Это сигнализирует родительскому компоненту открыть модальное окно создания компании
    };

    return {
      isVisible,
      handleClose,
      selectCompany,
      openAddCompanyModal
    };
  }
};
</script>

<style scoped>
.company-list {
  margin-bottom: 20px;
}
</style>