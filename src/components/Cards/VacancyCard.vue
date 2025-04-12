<script>
import CandidateCard from './CandidateCard.vue';

export default {
  name: 'VacancyCard',
  components: {
    CandidateCard,
  },
  props: {
    vacancy: {
      type: Object,
      required: true,
    },
    candidates: {
      type: Array,
      required: true,
    },
  },
  emits: ['click'],
  computed: {
    // Метод для получения компетенций в правильном формате для отображения
    formattedCompetencies() {
      // Если у вакансии есть обработанные данные компетенций
      if (this.vacancy.competenciesData && this.vacancy.competenciesData.length > 0) {
        return this.vacancy.competenciesData;
      }
      
      // Если компетенции представлены как массив строк (как в исходных мок-данных)
      if (Array.isArray(this.vacancy.requirements)) {
        return this.vacancy.requirements.map(req => ({ name: req }));
      }
      
      // Если компетенции представлены как объект с ID и уровнем
      if (this.vacancy.competencies && typeof this.vacancy.competencies === 'object' && !Array.isArray(this.vacancy.competencies)) {
        // Возвращаем пустой массив, так как без данных о компетенциях мы не можем отобразить их названия
        return [];
      }
      
      // Если компетенции представлены как массив строк в поле competencies
      if (Array.isArray(this.vacancy.competencies)) {
        return this.vacancy.competencies.map(comp => ({ name: comp }));
      }
      
      return [];
    },
    
    // Определяем уровни компетенций для отображения
    competencyLevels() {
      return ['Начальный', 'Средний', 'Продвинутый'];
    }
  },
  methods: {
    handleCardClick() {
      this.$emit('click', this.vacancy);
    }
  }
};
</script>

<template>
  <el-card 
    shadow="hover" 
    class="vacancy-card"
    @click="handleCardClick"
  >
    <div>
      <h3>{{ vacancy.title }}</h3>
      <p>{{ vacancy.description }}</p>
      <h4>Компетенции:</h4>
      <div class="tag">
        <!-- Отображаем компетенции с уровнем, если он есть -->
        <template v-for="comp in formattedCompetencies" :key="comp.id || comp.name">
          <el-tooltip 
            v-if="comp.level" 
            :content="'Уровень: ' + competencyLevels[comp.level - 1]" 
            placement="top"
          >
            <el-tag type="success" class="competency-tag">
              {{ comp.name }}
              <span class="level-indicator">{{ comp.level }}</span>
            </el-tag>
          </el-tooltip>
          
          <el-tag v-else type="success" class="competency-tag">
            {{ comp.name }}
          </el-tag>
        </template>
        
        <!-- Если компетенций нет, показываем сообщение -->
        <p v-if="formattedCompetencies.length === 0">Компетенции не указаны</p>
      </div>
      <div class="candidates">
        <h4>Подходящие кандидаты:</h4>
        <CandidateCard
            v-for="candidate in candidates"
            :key="candidate.id"
            :candidate="candidate"
            @click.stop
        />
        <div @click.stop>
          <slot name="actions"></slot>
        </div>
        <p v-if="candidates.length === 0">Кандидаты на эту вакансию не найдены.</p>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.vacancy-card {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.vacancy-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

h3 {
  margin-top: 0;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

.candidates {
  margin-top: 15px;
}

.tag {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem
}

.competency-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.level-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  font-size: 12px;
  margin-left: 3px;
}
</style>