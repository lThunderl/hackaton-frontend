<script setup>
import { computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import CandidateCard from './CandidateCard.vue';

const props = defineProps({
  vacancy: {
    type: Object,
    required: true,
  },
  candidates: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['click']);

const formattedCompetencies = computed(() => {
  if (props.vacancy.competenciesData && props.vacancy.competenciesData.length > 0) {
    return props.vacancy.competenciesData;
  }
  
  if (Array.isArray(props.vacancy.requirements)) {
    return props.vacancy.requirements.map(req => ({ name: req }));
  }
  
  if (props.vacancy.competencies && typeof props.vacancy.competencies === 'object' && !Array.isArray(props.vacancy.competencies)) {
    return [];
  }
  
  if (Array.isArray(props.vacancy.competencies)) {
    return props.vacancy.competencies.map(comp => ({ name: comp }));
  }
  
  return [];
});

const competencyLevels = computed(() => ['Начальный', 'Средний', 'Продвинутый']);

const handleCardClick = () => {
  emit('click', props.vacancy);
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