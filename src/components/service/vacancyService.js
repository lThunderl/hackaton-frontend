import { ref } from 'vue';
import { mockVacancies, mockCandidates } from '@/utils/mockData';
import competencyService from './competencyService';

// Локальное хранилище вакансий
const vacancies = ref([...mockVacancies]);

const vacancyService = {
  // Получить все вакансии
  async getAllVacancies() {
    // Получаем все компетенции для преобразования ID в названия
    const competencies = await competencyService.getAllCompetencies();
    
    return Promise.resolve(vacancies.value.map(vacancy => {
      // Если у вакансии есть компетенции в формате объекта с ID и уровнем
      if (vacancy.competencies && typeof vacancy.competencies === 'object' && !Array.isArray(vacancy.competencies)) {
        const formattedCompetencies = [];
        
        // Преобразуем объект компетенций в массив объектов с названием и уровнем
        for (const [competencyId, level] of Object.entries(vacancy.competencies)) {
          const competency = competencies.find(c => c.id === parseInt(competencyId));
          if (competency) {
            formattedCompetencies.push({
              id: competency.id,
              name: competency.name,
              level: level
            });
          }
        }
        
        return {
          ...vacancy,
          competenciesData: formattedCompetencies // Добавляем новое поле с данными компетенций
        };
      }
      
      // Если компетенции представлены как массив строк (как в исходных мок-данных)
      return vacancy;
    }));
  },

  // Получить вакансию по ID
  async getVacancyById(id) {
    const vacancy = vacancies.value.find(v => v.id === id);
    if (!vacancy) return null;
    
    // Получаем все компетенции для преобразования ID в названия
    const competencies = await competencyService.getAllCompetencies();
    
    // Если у вакансии есть компетенции в формате объекта с ID и уровнем
    if (vacancy.competencies && typeof vacancy.competencies === 'object' && !Array.isArray(vacancy.competencies)) {
      const formattedCompetencies = [];
      
      for (const [competencyId, level] of Object.entries(vacancy.competencies)) {
        const competency = competencies.find(c => c.id === parseInt(competencyId));
        if (competency) {
          formattedCompetencies.push({
            id: competency.id,
            name: competency.name,
            level: level
          });
        }
      }
      
      return {
        ...vacancy,
        competenciesData: formattedCompetencies
      };
    }
    
    return vacancy;
  },

  // Создать новую вакансию
  createVacancy(vacancyData) {
    const newId = Math.max(0, ...vacancies.value.map(v => v.id)) + 1;
    const newVacancy = {
      id: newId,
      ...vacancyData
    };
    
    vacancies.value.push(newVacancy);
    return Promise.resolve(newVacancy);
  },

  // Обновить существующую вакансию
  updateVacancy(id, vacancyData) {
    const index = vacancies.value.findIndex(v => v.id === id);
    if (index !== -1) {
      vacancies.value[index] = { ...vacancies.value[index], ...vacancyData };
      return Promise.resolve(vacancies.value[index]);
    }
    return Promise.reject(new Error('Вакансия не найдена'));
  },

  // Удалить вакансию
  deleteVacancy(id) {
    const index = vacancies.value.findIndex(v => v.id === id);
    if (index !== -1) {
      const deletedVacancy = vacancies.value.splice(index, 1)[0];
      return Promise.resolve(deletedVacancy);
    }
    return Promise.reject(new Error('Вакансия не найдена'));
  },

  // Получить кандидатов по ID вакансии
  getCandidatesByVacancyId(vacancyId) {
    const candidates = mockCandidates.filter(candidate => candidate.vacancyId === vacancyId);
    return Promise.resolve(candidates);
  }
};

export default vacancyService;