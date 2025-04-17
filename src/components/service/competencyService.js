import {ref} from 'vue';
// import { mockCompetencies } from '@/utils/mockData';

const BASE_URL = 'http://localhost:8080/competence';

const competencies = ref([]);

const competencyService = {
  // Получить все компетенции
  async getAllCompetencies(filterParams = {}) {
    // Создаем строку запроса на основе параметров фильтра
    const queryString = Object.keys(filterParams)
        .map(key => `${key}=${filterParams[key]}`)
        .join('&');

    let url = `${BASE_URL}/all`;
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ошибка получения компетенций: ${response.status}`);
    }

    competencies.value = await response.json(); // кэшируем данные
    return competencies.value;
  },

  // Получить компетенцию по ID
  async getCompetencyById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Ошибка получения компетенции: ${response.status}`);
    }

    return await response.json();
  },

  // Создать новую компетенцию
  async createCompetency(competencyData) {
    const response = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(competencyData)
    });

    if (!response.ok) {
      throw new Error(`Ошибка создания компетенции: ${response.status}`);
    }

    const newCompetency = await response.json();
    competencies.value.push(newCompetency);
    return newCompetency;
  },

  // Обновить существующую компетенцию
  async updateCompetency(id, competencyData) {
    const response = await fetch(`${BASE_URL}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(competencyData)
    });

    if (!response.ok) {
      throw new Error(`Ошибка обновления компетенции: ${response.status}`);
    }

    const updatedCompetency = await response.json();

    const index = competencies.value.findIndex(c => c.id === id);
    if (index !== -1) {
      competencies.value[index] = updatedCompetency;
    }

    return updatedCompetency;
  },

  // Удалить компетенцию
  async deleteCompetency(id) {
    const response = await fetch(`${BASE_URL}/delete/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Ошибка удаления компетенции: ${response.status}`);
    }

    // Удаляем из локального массива
    const index = competencies.value.findIndex(c => c.id === id);
    if (index !== -1) {
      competencies.value.splice(index, 1);
    }

    return;
  }
};

export default competencyService;