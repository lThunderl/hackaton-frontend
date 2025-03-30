<template>
  <div class="gradient">
    <div class="bubble"> </div>
      <div class="Section">
        <button class="buttonSec"> </button>
        <button class="buttonSec"> </button>
        <button class="buttonSec"> </button>
      </div>
      <form method="post" enctype="multipart/form-data" class="dropForm">
        <div id="dropZone" class="dropZone">
          Перетащите сюда ваше резюме
        </div>
      </form>
      <div class="ResumeDiv">
        <p class="otherOpt">Либо выберите файл вручную</p>
        <label htmlFor="Del">
          <button class="Style">Выбрать файл</button>
        </label>
        <input class="Del" type="file" @change="handleFileUpload" accept=".pdf,.docx" />
        <p v-if="filename">Выбран файл: {{ filename }}</p>
        <p v-else>Файл не выбран</p>
        <button @click="uploadFile" :disabled="!file" class="upload">Загрузить</button>
        <p v-if="uploadStatus">{{ uploadStatus }}</p>
      </div>
      <div class="textDiv">
        <textarea type="text" class="text" value="" placeholder="Введите сюда свои навыки, если отсутствует резюме"></textarea>
        <button class="save" @click="inputSave()" type="submit">Сохранить ответ в localStorage</button>
    </div>
  </div>

  </template>

  <style>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  html{
    overflow-x: hidden;
    font-family: "Montserrat";

  }
  .gradient {
    z-index: -100;
    position: absolute;
    height: 100%;
    width: 100%; 
    bottom: 0px;
    left: 0px;
    background: linear-gradient(149deg, rgb(48, 48, 48) 0%, rgb(70, 70, 70) 42%, rgb(26, 26, 26) 72%, rgb(0, 0, 0) 100%);
    animation: gradient 20s infinite linear;
    background-size: 400%;
}

@keyframes gradient {
    0% {
        background-position: 80% 0%;
    }
    50% {
        background-position: 20% 100%;
    }
    100% {
        background-position: 80% 0%;
    }
}
.bubble{
  background-color: rgb(156, 156, 156);
  position: absolute;
  width: 1000px;
  height: 1000px;
  border-radius: 50%;
  left: 60%;
  bottom: 40%;
  z-index: -1;  
}

  .buttonSec{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 10px;
    margin-top: 10px;
  }
  .Del{
    color: transparent;
    transform: translate(36%);
  }

  .Style{
    background-color: white;
    color: #2e2d2d;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.5s;
    font-family: 'Montserrat'
  }
  .Style:hover{
    background-color: #727171d8;
    color: white;
  }
  .Del{
    display:none;
  }
  .ResumeDiv{
    color: white;
    position: relative;
    top: 25%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%)
  }
  .upload{
    background-color: white;
    color: #2e2d2d;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.5s;
    font-family: 'Montserrat';
  }
  .upload:hover{
    background-color: #727171d8;
    color: white;
  }
  .upload:disabled{
    background-color: grey;
    color: #2e2d2d;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-family: 'Montserrat';
    cursor: default;
  }
  .textDiv{
    text-align: center;
    top: 100%; 
    position: relative;
  }
  .save{
    width: 50%;
  }
  .text{
    width: 50%;
    height: 200px;
  }

  .hover{
    width: 80%;
    height: 100%;
    background-color: black
  }
  .dropZone{
    position:relative; 
    width: 60%;
    background-color: white;
    height: 100%;
    position: relative;
    top: 70px;
    left: 50%;
    transform: translate(-50%);
    text-align:center;
    display:flex;
    justify-content: center;
    align-items:center;
    border-radius: 20px;
  }
  .dropForm{
    height: 40%;
  }
</style>
  
<script>
export default {
  data() {
    return {
      file: null,
      filename: '',
      uploadStatus: '',
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.filename = this.file.name;
    },
    uploadFile() {
      if (!this.file) {
        return;
      }

      this.uploadStatus = 'Загрузка...';

      // Создайте FormData объект для отправки файла
      const formData = new FormData();
      formData.append('file', this.file);

      // Отправьте запрос на сервер (замените '/api/upload' на ваш реальный URL)
      fetch('/api/upload', { // **ВАЖНО:** Замените этот URL!
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // Или response.text(), в зависимости от ответа сервера
          } else {
            throw new Error('Ошибка загрузки: ' + response.status);
          }
        })
        .then(data => {
          // Обработайте успешный ответ от сервера
          console.log('Успешно загружено:', data);
          this.uploadStatus = 'Файл успешно загружен!';
        })
        .catch(error => {
          // Обработайте ошибку
          console.error('Ошибка:', error);
          this.uploadStatus = 'Ошибка загрузки: ' + error.message;
        });
    },
  },
};
</script>

<script setup>
  import { onMounted } from 'vue';

 
  document.addEventListener("DOMContentLoaded", () =>{
    const dropZone = document.getElementById("dropZone");
    console.log(dropZone)
    if (dropZone) {
    let hoverClassName = 'hover';

    dropZone.addEventListener("dragenter", function(e) {
        e.preventDefault();
        dropZone.classList.add(hoverClassName);
    });
  
    dropZone.addEventListener("dragover", function(e) {
        e.preventDefault();
        dropZone.classList.add(hoverClassName);
    });
  
    dropZone.addEventListener("dragleave", function(e) {
        e.preventDefault();
        dropZone.classList.remove(hoverClassName);
    });
  
    dropZone.addEventListener("drop", function(e) {
        e.preventDefault();
        dropZone.classList.remove(hoverClassName);

        const files = Array.from(e.dataTransfer.files);
        console.log(files);
        // TODO что-то делает с файлами...
    });
}
})


    onMounted(() =>{
    if(localStorage.getItem('value') != null){
      document.querySelector('textarea.text').value = localStorage.getItem('value');
      console.log(localStorage.getItem('value'))}
    })

  </script>