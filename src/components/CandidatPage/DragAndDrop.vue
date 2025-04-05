<script>
export default {
    data() {
        return {
            files: [],
            uploading: false,
            error: null,
            text: '',
            first_name: '',
            second_name: '',
        }
    },
  computed:{
    validFileType(){
      if (!this.file) return true;
      
      const allowedTypes = ['.docx', '.pdf'];
      const fileExtensions = '.' + this.file.name.split('.').pop().toLowerCase();
      return allowedTypes.includes(fileExtensions);
    },
    //DropHover(){
    //    const 
    //}
  },
  methods: {
    
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
      if (this.first_name && this.second_name != ''){
      let userInfo = {
      first_name: this.first_name,
      second_name: this.second_name,
      }
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
      formData.append('userInfo', JSON.stringify(userInfo));
      fetch('http://localhost:8080/user/resume', {
        method: 'POST',
        body: formData,
        userInfo,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
        console.log(response.json())
      })

      }  
      else{
        alert('Сначала необходимо заполнить поля: "Имя" и "Фамилия"')
      }
    },
  async handleTextUpload() {
        let data = {
        text: this.text,
        first_name: this.first_name,
        second_name: this.second_name,
      }
      if (this.first_name && this.second_name != ''){
      if (!this.text.trim()) {
        return;
      }
      fetch("http://localhost:8080/user/resume", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log(response.json())

      })
      }
      else {
        alert ('Сначала необходимо заполнить поля: "Имя" и "Фамилия"')
      }
   } },
    inputSave(){
      localStorage.setItem('value', document.querySelector('textarea.textSkills').value);
    },  
}

</script>

<template>
    <form @submit.prevent="handleTextUpload()">
      <div class="userName">
      <input class="inputName" placeholder="Имя" v-model="first_name" required>
      <input class="inputName" placeholder="Фамилия" v-model="second_name">
      </div>
    </form>
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


      <button @click="uploadFiles" :disabled="!files.length" class="upload" type="submit">Загрузить 
      </button>
      </div>


      <div class="typeSkills">
        <textarea type="text" class="textSkills" value="" v-model="text" id="textSkills" placeholder="Введите сюда свои навыки, если отсутствует резюме"></textarea>
        <button class="upload" @click="handleTextUpload()" type="submit" style="margin-top: 30px; margin-bottom: 40px;" :disabled="!text.trim()">Сохранить ответ</button>
    </div>


</template>

<style scoped>
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
  button{
  font-size: calc(0.1em + 1vw);
}
.inputName{
  border-radius: 20px;
  margin-bottom: 10px;
  height: calc(1em + 1vw);
  font-family: 'Montserrat';
  text-align: center;
  font-size: calc(0.5em + 0.3vw);
  transition: 0.5s;
}
.inputName:focus{
  outline: none;
  height: calc(1.3em + 1vw)
}
.userName{
  width: 100%;
  height: calc(5em + 1vw);
  justify-content: center;
  align-items:center;
  display: flex;
  flex-direction: column;
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
li{
  list-style-type: none;
}
button{
  font-size: calc(0.1em + 1vw);
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
</style>