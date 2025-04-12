
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
  
  export async function uploadFiles(files, first_name, last_name, uploading, error, componentContext) {
    if (first_name && last_name != '') {
      files.forEach((file) => {
        if (!file.validFileType) return;
      });
      if (files.length === 0) return;
  
      componentContext.uploading = true;
      error = null;
  
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('userInfo', JSON.stringify(first_name, last_name));
  
      try {
        const response = await fetch('http://localhost:8080/user/resume', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
  
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        componentContext.uploading = false; 
      }
    } else {
      alert('Сначала необходимо заполнить поля: "Имя" и "Фамилия"');
  }
}
  
  
  export async function handleTextUpload(text, first_name, last_name) {
    if (first_name && last_name != '') {
      if (!text.trim()) {
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/user/resume", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(first_name, last_name, text)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
  
      } catch (error) {
        console.error("Error uploading text:", error);
      }
    } else {
      alert('Сначала необходимо заполнить поля: "Имя" и "Фамилия"');
    }
  }
  
  export function inputSave() {
    localStorage.setItem('value', document.querySelector('textarea.textSkills').value);
  }

  export function DropHover(){

  }