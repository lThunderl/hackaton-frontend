import requests
from bs4 import BeautifulSoup

def parse_hh_vacancies(pages=1):
    regions = ["https://hh.ru/search/vacancy?text=&area=1&hhtmFrom=main&hhtmFromLabel=vacancy_search_line&customDomain=1", "https://spb.hh.ru/search/vacancy?text=&area=2&hhtmFrom=main&hhtmFromLabel=vacancy_search_line&customDomain=1", "https://vladivostok.hh.ru/search/vacancy?text=&area=22&hhtmFrom=main&hhtmFromLabel=vacancy_search_line&customDomain=1", "https://volgograd.hh.ru/search/vacancy?text=&area=24&hhtmFrom=main&hhtmFromLabel=vacancy_search_line&customDomain=1", "https://voronezh.hh.ru/search/vacancy?text=&area=26&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://ekaterinburg.hh.ru/search/vacancy?text=&area=3&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://kazan.hh.ru/search/vacancy?text=&area=88&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://kaluga.hh.ru/search/vacancy?text=&area=43&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://krasnodar.hh.ru/search/vacancy?text=&area=53&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://krasnoyarsk.hh.ru/search/vacancy?text=&area=54&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://nn.hh.ru/search/vacancy?text=&area=66&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://novosibirsk.hh.ru/search/vacancy?text=&area=4&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://rostov.hh.ru/search/vacancy?text=&area=76&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://samara.hh.ru/search/vacancy?text=&area=78&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://saratov.hh.ru/search/vacancy?text=&area=79&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://sochi.hh.ru/search/vacancy?text=&area=237&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://ufa.hh.ru/search/vacancy?text=&area=99&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://yaroslavl.hh.ru/search/vacancy?text=&area=112&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3", "https://tyumen.hh.ru/search/vacancy?text=&area=95&customDomain=1&page=39&searchSessionId=53991938-1cbf-4767-9eef-a9bc952322c3"]
    regionss = ["Москва", "Санкт-Петербург", "Владивосток", "Волгоград", "Воронеж", "Екатеринбург", "Казань", "Калуга", "Краснодар", "Красноярск", "Нижний Новгород", "Новосибирск", "Ростов-на-Дону", "Самара", "Саратов", "Сочи", "Уфа", "Ярославль"]
    
    for region in regions:
        base_url = "https://tyumen.hh.ru/search/vacancy?text=frontend&area=95&hhtmFrom=main&hhtmFromLabel=vacancy_search_line"
        vacancy_elements = []
        vacancy_salary = []
        vacancy_exp = []
        search_line = []

        for page in range(pages):
            params = {
                "page": page,
            }
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            try:
                response = requests.get(base_url, params=params, headers=headers)
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(f"Ошибка при запросе страницы {page+1}: {e}")
                continue
            

            soup = BeautifulSoup(response.content, "html.parser")

            vacancy_elements = soup.find_all("span", class_="magritte-text_typography-title-4-semibold___vUqki_3-0-31")
            vacancy_salary = soup.find_all("span", class_="magritte-text_typography-label-1-regular___pi3R-_3-0-31")
            vacancy_exp = soup.find_all("div", class_="magritte-tag__label___YHV-o_3-1-10")
            
            links = []

            for link in soup.find_all('a', class_="magritte-link___b4rEM_5-0-8 magritte-link_mode_primary___l6una_5-0-8 magritte-link_style_neutral___iqoW0_5-0-8 magritte-link_enable-visited___Biyib_5-0-8"):
                print (link.get('href'))
                links.append(link.get('href'))
                break

            for vacancy, salary, exp in zip(vacancy_elements, vacancy_salary, vacancy_exp):
                print (f"Вакансия: {vacancy.get_text()}")
                if (salary.get_text().find("месяц") == -1):
                    print("ЗП не указано")
                else: 
                    print(f"ЗП: {salary.get_text()}")
                if (exp.get_text().find("опыт") and exp.get_text().find("Опыт") == -1):
                    print("Не указан опыт")
                else:
                    print(f"Опыт: {exp.get_text()}")
    return links


def parse_skills_vacancy(links):
        headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }

        for link in links:

            base_url = f"{link}"
            response = requests.get(base_url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            skills = soup.find_all('ul', 'vacancy-skill-list--JsTYRZ5o6dsoavK7')
            for skill in skills:
                print(skill.get_text())      
        return skills

if __name__ == '__main__':
    vacancies = parse_hh_vacancies(pages=2)
    parse_skills_vacancy(vacancies)
    for vacancie in vacancies:
        vacancie = {"vacancie: f{vacancie}"}
   
