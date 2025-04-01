<script>
export default {
  data() {
    return {
      files: [],
      uploading: false,
      error: null,
      text: '',
    };
  },
  computed:{
    validFileType(){
      if (!this.file) return true;
      
      const allowedTypes = ['.docx', '.pdf'];
      const fileExtensions = '.' + this.file.name.split('.').pop().toLowerCase();
      return allowedTypes.includes(fileExtensions);
    },  
  },
  methods:
  {
    async handleTextUpload() {
      let data = {
        text: this.text,
      }
      if (!this.text.trim()) {
        return;
      }
      fetch("http://localhost:3000/uploads", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log(response.json())
      })
    },
    inputSave(){
      localStorage.setItem('value', document.querySelector('textarea.textSkills').value);
    },
    dragOver(e){
      e.preventDefault();
    },
    drop(e){
      e.preventDefault();
      this.handleFiles(e.dataTransfer.files);
    },
    openFileDialog(){
      this.$refs.fileInput.click();
    },
    onFileSelected(e){
      this.handleFiles(e.target.files);
      e.target.value = null
    },
    handleFiles(fileList){
      const newFiles = Array.from(fileList);
      this.files = [...this.files, ...newFiles];
    },
    removeFile(index){
      this.files.splice(index, 1)
    },
    async uploadFiles(){
      this.files.forEach((file) => {
        if(!file.validFileType) return;
      })
      if (this.files.length === 0) return;

      this.uploading = true;
      this.error = null;

      const formData = new FormData();
      this.files.forEach((file) => {
          formData.append('files', file);
    })
      fetch('http://localhost:3000/uploads', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        .then(response => {
        console.log("response", response)
      })
      })
    }
  },
  }
</script>
<script setup>
import { onMounted } from 'vue';

onMounted(() =>{
    if(localStorage.getItem('value') != null){
      document.querySelector('textarea.textSkills').value = localStorage.getItem('value');
    }
    })
</script>

<template>
  <div class="background">
    <div class="bubble"> </div>
    <div class="pagesButtons">
        <button class="pageButton"> </button>
        <button class="pageButton"> </button>
    </div>
 
      <form method="post" enctype="multipart/form-data">
        <div id="dropZone" class="dropZone" 
        @dragover.prevent="dragOver"
        @drop.prevent="drop"
        >
          Перетащите сюда ваше резюме
      </div>
      </form>
      <div class="chooseFileDiv">
        <div class="chooseFileButtonSetting">
        <p class="otherOption">Либо выберите файл вручную</p>
        <label htmlFor="chooseFile">
          <button class="chooseFileButton" @click="openFileDialog()">Выбрать файл</button>
        </label>
        <input id="inputTypeFile" class="chooseFile" type="file" ref="fileInput" @change="onFileSelected" accept=".pdf,.docx" />
      </div>
        <p>Выбранные файлы: </p>
        <ul>
          <li v-for="(file, index) in files" :key="index">
            {{ file.name }} 
            <button @click="removeFile(index)" class="upload">Удалить</button>
          </li>
        </ul>
              
      <button @click="uploadFiles" :disabled="!files.length" class="upload">Загрузить 
      </button>
      </div>


      <div class="typeSkills">
        <textarea type="text" class="textSkills" value="" v-model="text" id="textSkills" placeholder="Введите сюда свои навыки, если отсутствует резюме"></textarea>
        <button class="upload" @click="handleTextUpload()" type="submit" style="margin-top: 30px; margin-bottom: 40px;" :disabled="!text.trim()">Сохранить ответ</button>
    </div>
  </div>


  </template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  html{
    overflow-x: hidden;
    font-family: "Montserrat";
    font-size: calc(0.3em + 1vw)
  }
button{
  font-size: calc(0.1em + 1vw);
}

li{
  list-style-type: none;
}

.background{
  display: flex;
  flex-direction: column;
}

body{
  display: block;
  background-color: #2e2d2d;
}
.bubble{
  background-color: rgb(156, 156, 156);
  position: absolute;
  width: calc(50em + 5vw);
  height: calc(50em + 5vw);
  border-radius: 50%;
  left: calc(10em + 50vw);
  bottom: calc(10em + 20vw);
  z-index: -1;  
}
.pages{
  width: 20%;
  height: 30px;
}
.pageButton{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 10px;
  margin-top: 10px;
}

.chooseFile{
    color: transparent;
    position: relative;
    z-index: 100;

}
  .chooseFile::-webkit-file-upload-button{
    background-color: white;
    color: #2e2d2d;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.5s;
    font-family: 'Montserrat';
    font-size: calc(0.3em + 1vw);
    transform: translate(45%);
  }
  .chooseFileButton::-webkit-file-upload-button:hover{
    background-color: #727171d8;
    color: white;
  }

.chooseFileButton{
    background-color: white;
    color: #2e2d2d;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.5s;
    font-family: 'Montserrat';
    transform: translate(50%);
    display: none;
  }
  .chooseFileButton:hover{
    background-color: #727171d8;
    color: white;
  }
  .chooseFileDiv{
    color: white;
    position: relative;
    text-align: center;
    top: 100px;
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
  .typeSkills{
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    align-items: center;
    top: calc(7em + 1vw)
  }

  .textSkills{
    width: 60%;
    height: calc(25em + 2vw);
    font-size: calc(0.1em + 0.8vw);
    font-family: 'Montserrat';
    border-radius: 20px;
  }

  .hover{
    width: 80%;
    height: 100%;
    background-color: black
  }
  .dropZone{
    width: 60%;
    background-color: white;
    height: calc(25em + 2vw);
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

  .pageButton{
  width: calc(1em + 1vw);
  height: calc(1em + 1vw);
  border-radius: 50%;
  margin-left: 10px;
  margin-top: 10px;
}
.pagesButtons{
    width: 20%;
    height: 20px;
}
</style>
  

