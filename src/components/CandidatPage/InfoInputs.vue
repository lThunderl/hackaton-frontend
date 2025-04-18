<template>
<div 
class="user-name" >
    <input 
    class="input-info" 
    placeholder="Имя" 
    :first_name="first_name"
    @input="updateFirstName"
    required
    />
    <input 
    class="input-info"
    placeholder="Фамилия"
    :last_name="last_name"
    @input="updateLastName"
    required 
    />
    <!--<el-input class="inputInfo" placeholder="Почта" v-model="email"  />
    <el-input class="inputInfo" placeholder="Телефон" v-model="phoneNumber"  />-->
</div>
</template>
<script>
export default {
    props:{
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        }
    },
    methods:{
        updateFirstName(e){
            const newFirstName = e.target.value;
            this.$emit('first-name-changed', newFirstName)
        },
        updateLastName(e){
            const newLastName = e.target.value;
            this.$emit('last-name-changed', newLastName)
        }

    }
    
}
</script>

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
</style>