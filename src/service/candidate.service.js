import { ElMessage } from "element-plus";

const PORT = 8000;
const HOST = process.env.VUE_APP_BACKEND_HOST || "localhost";

const IP = `${HOST}:${PORT}`;

const BASE_URL = `http://${IP}/resume`;

export function dragOver(e) {
    e.preventDefault();
  }
  
  export function drop(e) {
    e.preventDefault();
    this.handleFiles(e.dataTransfer.files);
  }
  
  export function openFileDialog() {
    this.$refs.fileInput.click();
  }
  
  export function onFileSelected(e) {
    this.handleFiles(e.target.files);
    e.target.value = null;
  }
  
  export function handleFiles(fileList, files, componentContext) {
    const newFiles = Array.from(fileList);
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
      ];

      const validFiles = newFiles.filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          alert(`Файл "${file.name}" не поддерживается.  Разрешены только .pdf, .docx и .doc файлы.`);
          return false;
        }
        return true;
      });
      if(validFiles.length > 0){
    componentContext.files = [...files, ...newFiles];
    if(fileList.length > 0){
    componentContext.files = [fileList[0]];
    }
}}
  export function removeFile(index) {
    this.files.splice(index, 1);
  }

  export async function uploadChecked(id, skills, emails, urls, phoneNumbers, uploading, error) {
    if (id == 0 || emails.length == 0 || phoneNumbers == 0){
      alert("Введите нехватающие данные")
    }
    uploading = true;
      // eslint-disable-next-line
    error = null;
    
    const user_info = {
      'id' : id,
      'resume_competencies': skills,
      'emails': emails,
      'urls': urls,
      'phones': phoneNumbers
    }

    try {
      const response = await fetch(`${BASE_URL}/confirm`, {
        method: "PUT",
        body: JSON.stringify(user_info),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      uploading = false;
      const data = response.json()
      return data

    } catch (error) {
      uploading = false;
      return console.error('Error uploading files:', error);
    } finally {
      uploading = false;
    }
  }

  // eslint-disable-next-line
  export function test(){
    const data = {
      phoneNumbers: ['+78512432', '+7532534635'],
      emails: ['12312@mail.ru', 'asv@mail.ru'],
      skills: ['Промпт-инжиниринг', 'Процесс, стадии и методологии разработки решений на основе', 'Промпт-инжиниринг'],
      urls: ['https://MyProject.ru', 'https://github/MyProject.com']
      
    }
    return data
  }

  export function testVacancyGet(){
    const data = {
      learn_skills: ['Методы машинного обучения', 'Методы оптимизации', 'Информационный поиск']
    }
    return data
  }
  export async function vacancyGet(){
    try{
      const response = await fetch(`http://${IP}/vacancy/all`)
      
      const data = response.JSON()
      console.log(data)
    }
    catch(e){
      console.log("GetError")
    }
  }
  // export async function uploadChecked(phoneNumber, email, urls, skills, uploading, error){
  //   uploading = true
  //   error = null
  //   try {}
  // }
  export async function uploadFiles(files, first_name, last_name, uploading, error,  componentContext,) {
    if (first_name && last_name != '') {
      files.forEach((file) => {
        if (!file.validFileType) return;
      });
      if (files.length === 0) return;
  
      const file = files[0]

      componentContext.uploading = true;
        // eslint-disable-next-line
      error = null;
      
      const user_info = {
        'first_name': first_name,
        'last_name': last_name
      }

      const formData = new FormData();

      formData.append('file', file);
      formData.append('user_info', JSON.stringify(user_info));
      
      console.log(user_info)

      try {
        const response = await fetch(`${BASE_URL}/read`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = response.json()

        return data

      } catch (error) {
        return ElMessage('Ошибка отправки данных');
        
      } finally {
        componentContext.uploading = false;
      }
    } 

    else {
      ElMessage('Сначала необходимо заполнить поля: "Имя" и "Фамилия"');
  }
}