<script>
import { testVacancyGet } from '@/service/candidate.service'
import VacancyCard from '../Cards/CandidatVacancyCard.vue'
import { mockVacancies } from '@/utils/mockVacancyData'

export default {
  components:{
    VacancyCard,
  },

  data(){
    return{
      dataChecked: false,
      learn_skills: [],
      vacancies: mockVacancies,
    }
  },
  props: {
    isModalActive: {
      type: Boolean,
      required: true,
    },
    phoneNumbers: {
      type: Array,
    },
    emails: {
      type: Array,
    },
    skills: {
      type: Array,
    },
    urls: {
      type: Array,
    },
    items: {
      type: Object,
      required: true
    },
  },
  methods: {
  getList(list){
  return this.items.filter((item) => item.list == list)
  },

  startDrag(e, item){
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('itemId', item.id)
  },

  onDragAndDrop(e, list){
    const itemId = e.dataTransfer.getData('itemId')
    const item = this.items.find((item) => item.id == itemId)
    item.list = list
  },
  closeModal() {
    this.$emit('close');
  },

  testVacancyGet(){
    const info = testVacancyGet()
    this.learn_skills = info.learn_skills
    this.dataChecked=true;
  }
  }
}
</script>

<template>
    <div v-if="this.dataChecked == false" class="modal" style="margin-top: 20px;" :class="{ 'is-active': isModalActive }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="box">
        <h1 style="margin-left: 20px; padding-bottom: 20px; position: relative; padding-top: 20px">Подтверждение данных</h1>
        <div class="info">
          <el-p style="padding-left: 20px; padding-bottom: 30px;">Выберите правильные данные</el-p>
          <div style="display: flex; flex-direction: row; gap: 15%; justify-content: center;">
          <div>  
          <el-p style="position: relative; transform: translate(-50%); left: 20%">Номера телефонов</el-p>
            <ul v-for="(phoneNumber, index) in phoneNumbers" :key="index" style="list-style-type: none; text-align: center;">
            <li v-if="phoneNumbers.length != 0"><el-button>{{ phoneNumber }}</el-button></li>
            <input v-else placeholder="Номера телефона не были найдены, напишите здесь" type="tel">
            </ul>
          </div>
          <div>
      <el-p style="margin-left: 20px;">Электронные почты</el-p>
        <ul v-for="(email, index) in emails" :key="index" style="text-align: center; list-style-type: none;">
          <li v-if="emails.length != 0"><el-button>{{ email }}</el-button>
          </li>
          <input v-else placeholder="Электронные почты не были найдены, напишите здесь" type="email">
        </ul>
      </div>
      <div>
        <el-p style="text-align: center; left: 35%; position: relative;">URL адреса</el-p>
        <ul v-for="(url, index) in urls" :key="index" style="list-style-type: none; text-align:center">
          <li v-if="urls.length != 0">
          <el-button >{{ url }}</el-button>
          </li>
          <input v-else placeholder="URL Ваших проектов не были найдены, напишите здесь, если имеются">
        </ul>
      </div>
        <!--<input class="input-info" :value="phoneNumber" @input="updatePhoneNumber"/>
        <input class="input-info" :value="email" @input="updateEmail"/>-->
      </div>
      </div>
        <h3 style="padding-top: 40px; padding-left: 20px; padding-bottom: 20px;">Перетащите в область ваши навыки</h3>
      <div class="drop-zone-skills"
        @drop="onDragAndDrop($event, 1)"
        @dragenter.prevent
        @dragover.prevent
      >
        <div class="tag"
        >
        <el-tag type="success"
        v-for="item in getList(1)"
        :key="item.id"
        draggable="true"
        @dragstart="startDrag($event, item)"
        >{{ item.title }}
      </el-tag>
          
    </div>
  </div>

  <div class="drop-zone-skills"
    @drop="onDragAndDrop($event, 2)"
    @dragenter.prevent
    @dragover.prevent
    >
    <div
    class="tag"
    >
    <el-tag 
    type="success"
    v-for="item in getList(2)"
    :key = "item.id"
    draggable="true"
    @dragstart="startDrag($event, item)"
    >
    {{ item.title }}
    </el-tag>
    </div>
    </div>
    <div style="display: flex; flex-direction: column;">
    <el-button style="width: 20%; left: 50%; transform: translate(-50%); position: relative; margin-bottom: 10px;"
    @click="testVacancyGet"
    >
      Отправить данные
    </el-button>
          <el-button 
          @click="closeModal"
          style="position: relative; 
          left: 49.1%; 
          transform: translate(-50%, 0%);
          margin-bottom: 20px;
          width: 20%;
          ">
          Закрыть
        </el-button>
        </div>
      </div>
      </div>
    </div>
    <div v-else class="modal">
      <h1 style="padding-bottom: 20px; margin-left: 20px;">Подходящие вакансии:</h1>
    <div style="display: flex; flex-direction: row; gap: 20px; margin-left: 20px;">
      <VacancyCard
        v-for="vacancy in vacancies"
        :key="vacancy.id"
        :vacancy="vacancy"

      />
      </div>
    <h3 style="margin-top: 20px; margin-left: 20px; margin-bottom: 20px;">Список компетенций, которые нужно изучить:</h3>
    <ul style="list-style-type: none;" v-for="(learn_skill, index) in learn_skills" :key="index">
      <li>
        {{ learn_skill }}
      </li>
    </ul>
    </div>
  </template>
  

  <style scoped>
  .info{
    display: flex;
    flex-direction: column;
  }

  .input-info{

    margin-left: 20px;
    width: 40%;
    margin-top: 20px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow: auto;
    overflow-y: scroll;
    height: 100vh;
    max-height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: white;
  }
  
  .modal.is-active {
    display: flex;
  }
  
  .modal-background {
    position: absolute;
    width: 100%;
    height: 100vh;
    background-color: white;
  }
  
  .modal-content {
    position: relative;
    z-index: 2;
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    font-size: 2em;
    cursor: pointer;
  }

  .tag {
    padding-top: 20px;
    padding-left: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: .5rem
  }

  .tag:nth-last-of-type(1){
    margin-bottom: 0;
  }

  .drop-zone-skills{
    background-color: white;
    right: 0;
    width: 96%;
    font-size: calc(0.2em + 0.5vw + 0.5vh);
    font-family: 'Montserrat';
    border-radius: 20px;
    box-shadow: 2px 2px 2px 2px rgb(201, 201, 201);
    position: relative;
    margin-bottom: 20px;
    margin-left: 20px;
    min-height: 100px;
  }

  </style>