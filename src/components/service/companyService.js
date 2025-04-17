import {ref} from 'vue';

const BASE_URL = 'http://localhost:8080/company';

const companies = ref([]);

const companyService = {
    // Получить все компании
    async getAllCompanies() {
        try {
            const response = await fetch(`${BASE_URL}/all`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            companies.value = await response.json();
            return [...companies.value];
        } catch (error) {
            console.error("Ошибка при получении компаний:", error);
            throw error;
        }
    },

    // Получить компанию по ID
    async getCompanyById(id) {
        try {
            const response = await fetch(`${BASE_URL}/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Ошибка при получении компании с ID ${id}:`, error);
            throw error;
        }
    },


    // Создать новую компанию
    async createCompany(companyData) {
        try {
            const response = await fetch(`${BASE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const newCompany = await response.json();
            companies.value.push(newCompany);
            return newCompany;
        } catch (error) {
            console.error("Ошибка при создании компании:", error);
            throw error;
        }
    },

    // Обновить существующую компанию
    async updateCompany(id, companyData) {
        try {
            const response = await fetch(`${BASE_URL}/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const updatedCompany = await response.json();

            const index = companies.value.findIndex(c => c.id === id);
            if (index !== -1) {
                companies.value[index] = updatedCompany;
            }
            return updatedCompany;
        } catch (error) {
            console.error(`Ошибка при обновлении компании с ID ${id}:`, error);
            throw error;
        }
    },

    // Удалить компанию
    async deleteCompany(id) {
        try {
            const response = await fetch(`${BASE_URL}/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Удаляем из локального списка компаний
            const index = companies.value.findIndex(c => c.id === id);
            if (index !== -1) {
                companies.value.splice(index, 1);
            }
        } catch (error) {
            console.error(`Ошибка при удалении компании с ID ${id}:`, error);
            throw error;
        }
    },
};

export default companyService;