<template>
    <div class="loader" v-if="isLoading">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  </template>

  <script>
  export default {
    props: {
      isLoading: {
        type: Boolean,
        required: true,
      },
      message: {
        type: String,
        default: 'Загрузка...',
      },
    },
  };
  </script>

  <style scoped>
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Убедитесь, что он выше всего */
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
    margin-bottom: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>