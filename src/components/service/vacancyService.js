import competencyService from './competencyService';


const PORT = 8000;
const HOST = process.env.VUE_APP_BACKEND_HOST || "localhost";

const IP = `${HOST}:${PORT}`;

const BASE_URL = `http://${IP}/vacancy`;


const vacancyService = {
  // Получить все вакансии
  async getAllVacancies() {
    try {
      const response = await fetch(`${BASE_URL}/all`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const vacancies = await response.json();

      const competencies = await competencyService.getAllCompetencies();
      return vacancies.map(vacancy => this.formatVacancyCompetencies(vacancy, competencies));
    } catch (error) {
      console.error("Ошибка при получении вакансий:", error);
      throw error;
    }
  },

  // Получить вакансию по ID
  async getVacancyById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Ошибка при получении вакансии с id ${id}: ${response.status} ${response.statusText}`);
      }
      const vacancy = await response.json();

      const competencies = await competencyService.getAllCompetencies();
      return this.formatVacancyCompetencies(vacancy, competencies);
    } catch (error) {
      console.error(`Ошибка при получении вакансии с id ${id}:`, error);
      throw error;
    }
  },

  async createVacancy(vacancyData) {
    try {
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacancyData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при создании вакансии: ${response.status} ${response.statusText}`);
      }

      const newVacancy = await response.json();
      return newVacancy;
    } catch (error) {
      console.error("Ошибка при создании вакансии:", error);
      throw error;
    }
  },

  async updateVacancy(id, vacancyData) {
    try {
      const response = await fetch(`${BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacancyData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при обновлении вакансии: ${response.status} ${response.statusText}`);
      }

      const updatedVacancy = await response.json();
      return updatedVacancy;
    } catch (error) {
      console.error(`Ошибка при обновлении вакансии с id ${id}:`, error);
      throw error;
    }
  },

  async updateVacancyCompetencies(id, competenciesData) {
    try {
      console.log(`Отправка компетенций на сервер: ${JSON.stringify(competenciesData)}`);
      const response = await fetch(`${BASE_URL}/update/competence/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competenciesData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при обновлении компетенций вакансии: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const updatedVacancy = await response.json();
      return updatedVacancy;
    } catch (error) {
      console.error(`Ошибка при обновлении компетенций вакансии с id ${id}:`, error);
      throw error;
    }
  },

  async deleteVacancy(id) {
    try {
      const response = await fetch(`${BASE_URL}/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Ошибка при удалении вакансии: ${response.status} ${response.statusText}`);
      }
      return response.status;
    } catch (error) {
      console.error(`Ошибка при удалении вакансии с id ${id}:`, error);
      throw error;
    }
  },

  formatVacancyCompetencies(vacancy, competencies) {
    if (vacancy.competencies && typeof vacancy.competencies === 'object' && !Array.isArray(vacancy.competencies)) {
      const formattedCompetencies = [];
      for (const [competencyId, level] of Object.entries(vacancy.competencies)) {
        const competency = competencies.find(c => c.id === parseInt(competencyId));
        if (competency) {
          formattedCompetencies.push({
            id: competency.id,
            name: competency.name,
            level: level,
          });
        }
      }
      return {
        ...vacancy,
        competenciesData: formattedCompetencies,
      };
    }
    return vacancy;
  },
};

export default vacancyService;