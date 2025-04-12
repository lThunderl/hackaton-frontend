<script>
import {
  dragOver,
  drop,
  openFileDialog,
  onFileSelected,
  removeFile,
  uploadFiles,
  handleTextUpload,
  handleFiles,
} from '../../service/candidate.service.js';

export default {
    data() {
        return {
            files: [],
            uploading: false,
            error: null,
            text: '',
            first_name: '',
            second_name: '',
            isHovered: false,
            uploadText: 'Перетащите сюда ваше резюме',
        }
    },
  methods: {
    onDragOver(e){
      dragOver.call(this, e)},
    onDrop(e){
      drop.call(this, e)},
    openFileDialog,
    onFileSelected,
    removeFile,
    uploadFiles() {
      uploadFiles(this.files, this.first_name, this.second_name, this.uploading, this.error, this);
    },
    handleTextUpload() {
      handleTextUpload(this.text, this.first_name, this.second_name, this);
    },
    handleFiles(fileList) {
      handleFiles(fileList, this.files, this);
    },
  }
};
</script>

<template>
  <h2 style="padding: 20px">Ваши данные:</h2>
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; flex-direction: row; width: 100%; padding: 0; justify-content: space-between;">
      <form @submit.prevent="handleTextUpload" style="width: 25%">
      <div class="userName" >
      <el-input class="inputInfo" placeholder="Имя" v-model="first_name" required />
      <el-input class="inputInfo" placeholder="Фамилия" v-model="second_name" required />
      <el-input class="inputInfo" placeholder="Почта" v-model="second_name" required />
      <el-input class="inputInfo" placeholder="Телефон" v-model="second_name" required />
      </div>
  </form>
   <form method="post" enctype="multipart/form-data" style="width: 85%">
    <div id="dropZone" class="dropZone" 
    @dragover.prevent="onDragOver, this.uploadText = 'Отпустите файл'"
    @drop.prevent="onDrop"
    @drop="this.uploadText='Перетащите сюда ваше резюме'"
    @dragleave="this.uploadText='Перетащите сюда ваше резюме'"
    >
    <div  v-if="files.length !== 0" class="filesDiv">
      <ul>
          <img src="../../assets/docx.png" v-if="files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" class="imgDocx">
          <img src="../../assets/doc.png" v-if="files[0].type == 'application/msword'" class="imgDoc">
          <img src="../../assets/pdf.png" v-if="files[0].type == 'application/pdf'" class="imgPdf">
          <li v-for="(file, index) in files" :key="index" class="file">
            {{ file.name }} 
          </li>
          <el-button type="danger" plain @click="removeFile(index)">Удалить</el-button>
        </ul>
    </div>
    <div v-else> {{ uploadText }}</div>
  </div>
  </form>
</div>
  <div class="chooseFileDiv">
        <div class="chooseFileButtonSetting">
        <p class="otherOption">Либо выберите файл вручную</p>
        <label htmlFor="chooseFile">
          <el-button type="info" plain @click="openFileDialog" >Выбрать файл</el-button>
        </label>
        <input id="inputTypeFile" class="chooseFile" type="file" ref="fileInput" @change="onFileSelected" accept=".pdf,.docx, .doc" />
      </div>
      <div class="choosenFile">
        <p>Выбранные файлы: </p>
        <ul>
          <li v-for="(file, index) in files" :key="index">
            {{ file.name }} 

          </li>
          <el-button style="margin-bottom: 20px; margin-top: 20px;" @click="removeFile(index)" type="danger" plain  v-if="files.length !== 0">Удалить</el-button>
        </ul>
      </div>
      <el-button plain @click="uploadFiles" :disabled="!files.length" class="upload" type="success">Загрузить 
      </el-button>
      </div>
      <div class="typeSkills">
        <textarea type="text" class="textSkills" value="" v-model="text" id="textSkills" placeholder="Введите сюда свои навыки, если отсутствует резюме"></textarea>
        <el-button class="upload" @click="handleTextUpload" type="success" plain style="margin-top: 30px; margin-bottom: 40px;" :disabled="!text.trim()">Сохранить ответ</el-button>
    </div>
  </div>
</template>
<style scoped>
.inputInfo{
  margin-top: 10px;
}
.otherOption{
  position: relative
}
ul{
  margin: 0; padding: 0;
}
.choosenFile{
  display: flex;
  flex-direction: column;
}
.imgPdf{
  height: calc(5em + 1vh + 1vw);
  width: calc(5em + 1vh + 1vw);
  position: relative;
}
.imgDoc{
  height: calc(5em + 1vh + 1vw);
  width: calc(5em + 1vh + 1vw);
}
.imgDocx{
  height: calc(5em + 1vh + 1vw);
  width: calc(5em + 1vh + 1vw);
}
.filesDiv{
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
}
.isHovered{
  background-color: black
}
  .typeSkills{
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    align-items: center;
    top: 60px;
  }

  .textSkills{
    width: 95%;
    height: calc(25em + 1vw + 1vh);
    font-size: calc(0.2em + 0.5vw + 0.5vh);
    font-family: 'Montserrat';
    border-radius: 20px;
    box-shadow: 2px 2px 2px 2px gray;
  }
.dropZone{
    box-shadow: 2px 2px 2px 2px gray;
    margin-left: 65px;
    width: 90%;
    background-color: white;
    height: calc(25em + 1vw + 1vh);
    position: relative;
    text-align:center;
    display:flex;
    justify-content: center;
    align-items:center;
    border-radius: 20px;
  }
.userName{
  width: 100%;
  margin-left: 20px;
  top: 50%;
  transform: translate(0%, 50%);
}
li{
  list-style-type: none;
}
  .chooseFile{
    color: transparent;
    position: relative;
    z-index: 100;
    display: none
}

  .chooseFileDiv{
    top: 20px;
    color: black;
    position: relative;
    text-align: center;
  }
</style>