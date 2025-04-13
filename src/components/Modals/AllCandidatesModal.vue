<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  vacancyId: {
    type: Number,
    required: true,
  },
  candidates: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close'); // Emit-им событие 'close' для закрытия модального окна
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>Кандидаты на вакансию</h2>
        <el-button type="danger" plain
                   @click="closeModal">Закрыть
        </el-button>
      </div>
      <div class="modal-body">
        <el-table :data="candidates" style="height: 100%; overflow-x: auto">
            <el-table-column prop="name" label="ФИО"/>
            <el-table-column prop="skills" label="Компетенции"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Убедитесь, что модальное окно поверх всего */
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  height: 80%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-body {
  height: 80%;
  display: flex; /* Добавляем flex-контейнер */
  flex-direction: column;
}
</style>