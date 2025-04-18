<script>
import {
  dragOver,
  drop,
  openFileDialog,
  onFileSelected,
  removeFile,
  uploadFiles,
  handleFiles,
  test,
  testVacancyGet
} from '../../service/candidate.service.js';

import { ref } from 'vue'
import ResumeConfirmModal from '../Modals/ResumeConfirmModal.vue';
import { ElMessage } from 'element-plus';
export default {

  components: { ResumeConfirmModal },

  setup(){
    return{
      items: ref([
        {id: 0, title: 'Определения, история развития и главные тренды ИИ', list: 2},
        {id: 1, title: 'Процесс, стадии и методологии разработки решений на основе', list: 2},
        {id: 2, title: 'Промпт-инжиниринг', list: 2},
        {id: 3, title: 'Инструменты CitizenDS', list: 2},
        {id: 4, title: 'Оценка качества работы методов ИИ', list: 2},
        {id: 5, title: 'Языки программирования и библиотеки (Python, C++)', list: 2},
        {id: 6, title: 'Этика ИИ', list: 2},
        {id: 7, title: 'Безопасность ИИ', list: 2},
        {id: 8, title: 'Цифровые двойники', list: 2},
        {id: 9, title: 'Методы машинного обучения', list: 2},
        {id: 10, title: 'Методы оптимизации', list: 2},
        {id: 11, title: 'Информационный поиск', list: 2},
        {id: 12, title: 'Рекомендательные системы', list: 2},
        {id: 13, title: 'Анализ изображений и видео', list: 2},
        {id: 14, title: 'Анализ естественного языка', list: 2},
        {id: 15, title: 'Основы глубокого обучения', list: 2},
        {id: 16, title: 'Глубокое обучения для анализа и генерации изображений, видео', list: 2},
        {id: 17, title: 'Глубокое обучение для анализа и генерации естественного языка', list: 2},
        {id: 18, title: 'Гибридные модели и PIML', list: 2},
        {id: 19, title: 'Анализ геоданных', list: 2},
        {id: 20, title: 'Массово параллельные вычисления для ускорения машинного обучения (GPU)', list: 2},
        {id: 21, title: 'Работа с распределенной кластерной системой', list: 2},
        {id: 22, title: 'Машинное обучения для больших данных', list: 2},
        {id: 23, title: 'Потоковая обработка данных (data streaming, event processing)', list: 2},
        {id: 24, title: 'SQL базы данных (Greenplum, Postgres, Oracle)', list: 2},
        {id: 25, title: 'NoSQL базы данных (Cassandra, MongoDB, ElasticSearch, Neo4J, Hbase)', list: 2},
        {id: 26, title: 'Массово параллельная обработка и анализ данных', list: 2},
        {id: 27, title: 'Hadoop, SPARK, Hive', list: 2},
        {id: 28, title: 'Шины данных (kafka)', list: 2},
        {id: 29, title: 'Качество и предобработка данных, подходы и инструменты', list: 2},
        {id: 30, title: 'Графы знаний и онтологии', list: 2},
      ]),
    }
  },

  data() {
    return {
        files: [],
        error: null,
        uploading: false,
        text: '',
        first_name: '',
        last_name: '',
        isHovered: false,
        uploadText: 'Перетащите сюда ваше резюме',
        emails: [],
        isModalActive: false,
        phoneNumbers: [],
        urls: [],
        skills: [],
    }
  },

  methods: {
    closeModal(){
      this.isModalActive = false;
    },
    onDragOver(e){
      dragOver.call(this, e)},
    onDrop(e){
      drop.call(this, e)},
    openFileDialog,
    onFileSelected,
    removeFile,
    async uploadFiles() {
      if (this.first_name == '' || this.last_name == ''){
        return ElMessage('Введите Имя и Фамилию')
      }
      else{
      const info = await uploadFiles(this.files, this.first_name, this.last_name, this.uploading, this.error, this);
      console.log(info)
      this.isModalActive = true;
      this.skills = info.skills 
      this.mails = info.emails
      this.URLS = info.urls
      this.phones = info.phones
      }
    },

    handleFiles(fileList) {
      handleFiles(fileList, this.files, this);
    },
    checkSkills(){
      this.items.forEach((item) => {
        this.skills.forEach((skill) => {
          if (item.title == skill){
            item.list = 1;
          }})
      })
    },
    test(){
      if (this.first_name == '' || this.last_name == ''){
        return ElMessage('Введите Имя и Фамилию')
      }
      else{
      const info = test();
      this.skills = info.skills;
      this.phoneNumbers = info.phoneNumbers;
      this.emails = info.emails;
      this.urls = info.urls;
      this.isModalActive = true;
      this.checkSkills();
      }
    },     

    testVacancyGet(){
      testVacancyGet()
    }
  }
    }
</script>

<template>
<h2 style="padding: 20px">Ваши данные:</h2>
<RouterLink to="/hr-page" style="margin-left: 20px;">На страницу для HR</RouterLink>
<div style="display: flex; flex-direction: column;">
  <div style="display: flex; flex-direction: row; width: 100%; padding: 0;">
    <form @submit.prevent="handleTextUpload" style="width: 25%">
    <div 
    class="user-name" >
        <input 
        class="input-info" 
        placeholder="Имя" 
        v-model="first_name"
        required
        />
        <input 
        class="input-info"
        placeholder="Фамилия"
        v-model="last_name"
        required 
        />
        <!--<el-input class="inputInfo" placeholder="Почта" v-model="email"  />
        <el-input class="inputInfo" placeholder="Телефон" v-model="phoneNumber"  />-->
    </div>
    </form>
<form method="post" enctype="multipart/form-data" style="width: 85%; margin-left: 20px;">
  <div id="dropZone" class="drop-zone" 
  @dragover.prevent="onDragOver, this.uploadText = 'Отпустите файл'"
  @drop.prevent="onDrop"
  @drop="this.uploadText='Перетащите сюда ваше резюме'"
  @dragleave="this.uploadText='Перетащите сюда ваше резюме'"
  >
  <div  v-if="files.length !== 0" class="files-div">
    <ul>
        <img src="../../assets/docx.png" v-if="files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" class="img-docx">
        <img src="../../assets/doc.png" v-if="files[0].type == 'application/msword'" class="img-doc">
        <img src="../../assets/pdf.png" v-if="files[0].type == 'application/pdf'" class="img-pdf">
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
<div class="choose-file-div">
      <div class="choose-file-button-setting">
      <p class="other-option">Либо выберите файл вручную</p>
      <label htmlFor="choose-file">
        <el-button type="info" plain @click="openFileDialog" >Выбрать файл</el-button>
      </label>
      <input id="inputTypeFile" class="choose-file" type="file" ref="fileInput" @change="onFileSelected" accept=".pdf,.docx, .doc" />
    </div>
    <div class="choosen-file">
      <p>Выбранные файлы: </p>
      <ul>
        <li v-for="(file, index) in files" :key="index">
          {{ file.name }} 

        </li>
        <el-button 
        style="margin-bottom: 20px;
        margin-top: 20px;"
        @click="removeFile(index)" type="danger" plain  v-if="files.length !== 0">Удалить</el-button>
      </ul>
    </div>
    <el-button plain @click="uploadFiles" :disabled="!files.length" class="upload" type="success" style="margin-bottom: 20px;">Загрузить 
    </el-button>
  </div>
</div>
<ResumeConfirmModal v-if="isModalActive"
  :isModalActive="isModalActive"
  :phoneNumbers="phoneNumbers"
  :skills="skills"
  :emails="emails"
  :urls="urls"
  @close="closeModal"
  :items="items"
  />
</template>
<style scoped>
.user-name{
    width: 100%;
    margin-left: 20px;
    top: 50%;
    position: relative;
    transform: translate(0%, -50%);
}

.input-info{
    margin-top: 10px;
    border-radius: 5px;
    min-height: 30px;
    text-align: center;
    width: 80%;
}

.other-option{
  position: relative
}

ul{
  margin: 0; padding: 0;
  list-style-type: none;
}

.choosen-file{
  display: flex;
  flex-direction: column;
}

.img-pdf{
  height: calc(5em + 1vh + 1vw);
  width: calc(5em + 1vh + 1vw);
  position: relative;
}

.img-doc{
  height: calc(5em + 1vh + 1vw);
  width: calc(5em + 1vh + 1vw);
}

.img-docx{
  height: calc(5em + 1vh + 1vw);
  width: calc(5em + 1vh + 1vw);
}

.files-div{
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
}

.is-hovered{
  background-color: black
}

.drop-zone{
  box-shadow: 2px 2px 2px 2px gray;
  width: 90%;
  background-color: white;
  height: calc(20em + 1vw + 1vh);
  position: relative;
  text-align:center;
  display:flex;
  justify-content: center;
  align-items:center;
  border-radius: 20px;
  left: 7%;
}

.choose-file{
  color: transparent;
  position: relative;
  z-index: 100;
  display: none
}

.choose-file-div{
  top: 20px;
  color: black;
  position: relative;
  text-align: center;
}
</style>