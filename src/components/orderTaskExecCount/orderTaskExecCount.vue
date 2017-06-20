<template>
  <article class="order-task-execCount">
    <ul class="mui-table-view mui-table-view-radio">
    	<li class="mui-table-view-cell" @tap="selectRadio" :class="execCount.active === 0 ? 'mui-selected' : ''" data-value="0" data-display="0次（ 不休息 ）">
    		<a class="mui-navigate-right">0次（ 不休息 ）</a>
    	</li>
    	<li class="mui-table-view-cell" @tap="selectRadio" v-for="item in list" :class="execCount.active === item ? 'mui-selected' : ''" :data-value="item" :data-display="`${item}次`">
    		<a class="mui-navigate-right">{{ item }}次</a>
    	</li>
    </ul>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import { getCorrectIntergerList, getInteger } from '../../common/js/getCorrectIntergerList.js';
import minuteToHour from '../../common/js/minuteToHour.js';

export default {
  name: 'order-task-execCount',
  data() {
    return {
      list: [],
    };
  },
  computed: mapState( {
    orderTask: state => state.orderTask,
    execCount: state => state.orderTask.execCount,
  } ),
  created() {
    this.list = getCorrectIntergerList( this.orderTask.taskTime.value );
  },
  methods: {
    // 单选
    selectRadio( event ) {
      const data = event.target.dataset;
      const value = +data.value;
      const orderTask = this.orderTask;
      const list = this.list;
      const length = list.length;
      const last = list[ length - 1 ];
      let execTime = last / value;

      if ( last > 10 && getInteger( last ).length === 2 && value !== 1 && value !== last ) {
        execTime = ( last + 1 ) / value;
      }

      const restTime = Math.round( execTime * 0.2, 10 );

      orderTask.restTime.display = minuteToHour( execTime === Infinity ? 0 : restTime );
      orderTask.restTime.value = execTime === Infinity ? 0 : restTime;

      execTime = execTime === Infinity ? last : execTime;

      orderTask.execTime.display = minuteToHour( execTime );
      orderTask.execTime.value = execTime;
      this.execCount.active = this.execCount.value = value;
      this.execCount.display = data.display;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mui-table-view-cell {
  padding-top: 13px;
  padding-bottom: 13px;
  font-size: 15px;

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
