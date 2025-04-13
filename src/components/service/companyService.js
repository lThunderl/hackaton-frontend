import { ref } from 'vue';

// Имитация данных компаний
const mockCompanies = [
  { id: 1, name: 'Google', description: 'Технологический гигант' },
  { id: 2, name: 'Microsoft', description: 'Разработка программного обеспечения' },
  { id: 3, name: 'Amazon', description: 'Электронная коммерция и облачные сервисы' },
];

// Локальное хранилище компаний
const companies = ref([...mockCompanies]);

const companyService = {
  // Получить все компании
  getAllCompanies() {
    return Promise.resolve([...companies.value]);
  },

  // Поиск компаний по названию или описанию
  searchCompanies(query) {
    if (!query) {
      return this.getAllCompanies();
    }

    const searchQuery = query.toLowerCase();
    const result = companies.value.filter(company =>
      company.name.toLowerCase().includes(searchQuery) ||
      (company.description && company.description.toLowerCase().includes(searchQuery))
    );
    return Promise.resolve(result);
  },

  // Получить компанию по ID
  getCompanyById(id) {
    const company = companies.value.find(c => c.id === id);
    return Promise.resolve(company || null);
  },

  // Создать новую компанию
  createCompany(companyData) {
    const newId = Math.max(0, ...companies.value.map(c => c.id)) + 1;
    const newCompany = {
      id: newId,
      ...companyData
    };

    companies.value.push(newCompany);
    return Promise.resolve(newCompany);
  },

  // Обновить существующую компанию
  updateCompany(id, companyData) {
    const index = companies.value.findIndex(c => c.id === id);
    if (index !== -1) {
      companies.value[index] = { ...companies.value[index], ...companyData };
      return Promise.resolve(companies.value[index]);
    }
    return Promise.reject(new Error('Компания не найдена'));
  },

  // Удалить компанию
  deleteCompany(id) {
    const index = companies.value.findIndex(c => c.id === id);
    if (index !== -1) {
      const deletedCompany = companies.value.splice(index, 1)[0];
      return Promise.resolve(deletedCompany);
    }
    return Promise.reject(new Error('Компания не найдена'));
  }
};

export default companyService;