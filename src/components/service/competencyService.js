import { ref } from 'vue';
import { mockCompetencies } from '@/utils/mockData';

// Локальное хранилище компетенций
const competencies = ref([...mockCompetencies]);

const competencyService = {
  // Получить все компетенции
  getAllCompetencies() {
    return Promise.resolve([...competencies.value]);
  },

  // Получить компетенцию по ID
  getCompetencyById(id) {
    const competency = competencies.value.find(c => c.id === id);
    return Promise.resolve(competency || null);
  },

  // Создать новую компетенцию
  createCompetency(competencyData) {
    const newId = Math.max(0, ...competencies.value.map(c => c.id)) + 1;
    const newCompetency = {
      id: newId,
      ...competencyData
    };
    
    competencies.value.push(newCompetency);
    return Promise.resolve(newCompetency);
  },

  // Обновить существующую компетенцию
  updateCompetency(id, competencyData) {
    const index = competencies.value.findIndex(c => c.id === id);
    if (index !== -1) {
      competencies.value[index] = { ...competencies.value[index], ...competencyData };
      return Promise.resolve(competencies.value[index]);
    }
    return Promise.reject(new Error('Компетенция не найдена'));
  },

  // Удалить компетенцию
  deleteCompetency(id) {
    const index = competencies.value.findIndex(c => c.id === id);
    if (index !== -1) {
      const deletedCompetency = competencies.value.splice(index, 1)[0];
      return Promise.resolve(deletedCompetency);
    }
    return Promise.reject(new Error('Компетенция не найдена'));
  }
};

export default competencyService;