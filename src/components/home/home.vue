<template>
  <div class="home">
    <v-header></v-header>
    <v-calendar class="home-top"></v-calendar>
    <v-task-list></v-task-list>
  </div>
</template>

<script>
import Header from '../homeHeader/homeHeader';
import Calendar from '../calendar/calendar';
import TaskList from '../homeTaskList/homeTaskList';

export default {
  name: 'home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  components: {
    'v-header': Header,
    'v-calendar': Calendar,
    'v-task-list': TaskList,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  background-color: #fff;
}
.home-top {
  margin-top: 40px;
}
</style>
