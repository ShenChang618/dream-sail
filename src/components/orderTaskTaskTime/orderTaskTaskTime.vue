<template>
  <article class="order-task-taskTime">
    <ul class="mui-table-view" id="orderTaskTaskTimeDelete">
      <li class="mui-table-view-cell custom-table-view-cell" @tap="selectRadio" :class="+taskTime.active === 0 ? 'custom-selected' : ''" data-value="0" data-display="不确定时间">
				<a class="mui-navigate-right">不确定时间<i class="iconfont icon-leftSlide mui-pull-right"></i></a>
			</li>

      <li class="mui-table-view-cell custom-table-view-cell" @tap="selectRadio" :class="[taskTime.active === '*' || numberFlag === true ? 'custom-selected' : '', isPassTen === true ? 'pointer-events-none' : '']" data-value="*" data-display="不限时">
				<div class="mui-navigate-right">
					<div class="mui-table-cell">不限时<span class="special" v-show="isPassTen === true">（ 已超过 10 条，禁止选择 ）</span></div>

          <div class="mui-numbox custom-numbox" :data-numbox-min='1' data-numbox-max='50' v-show="numberFlag">
            <button class="mui-btn mui-numbox-btn-minus" type="button" @tap="inputNumberMin">-</button>
            <input class="mui-numbox-input" id="inputNumber" type="number" disabled>
            <button class="mui-btn mui-numbox-btn-plus" type="button" @tap="inputNumberAdd">+</button>
          </div>
          <i class="iconfont icon-leftSlide custom-special mui-pull-right"></i>
				</div>
			</li>

      <li class="mui-table-view-cell custom-table-view-cell" @tap="selectRadio" :class="+taskTime.active === 5 ? 'custom-selected' : ''" data-value="5" data-display="5分钟">
				<a class="mui-navigate-right">5分钟<i class="iconfont icon-leftSlide mui-pull-right"></i></a>
			</li>

      <li class="mui-table-view-cell" @tap="selectRadio" v-for="item in list" :class="taskTime.active === item ? 'custom-selected' : ''" :data-value="item" :data-display="computedTime( item )">
				<div class="mui-slider-right mui-disabled">
					<a class="mui-btn mui-btn-red">删除</a>
				</div>

				<div class="mui-slider-handle mui-table mui-navigate-right">
					<div class="mui-table-cell">{{ computedTime( item ) }}</div>
          <i class="iconfont icon-leftSlide mui-pull-right"></i>
				</div>
			</li>
    </ul>

    <a class="custom-btn mui-btn mui-btn-primary" id="orderTaskTimeCustomBtn" href="javascript: void(0);" @tap="selectTime">自定义</a>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import '../../common/js/mui.picker.all.js';
import storage from '../../common/js/localStorage.js';
import minuteToHour from '../../common/js/minuteToHour.js';
import { database, taskTimeFlag, weekday } from '../../common/js/data.js';
import Database from '../../common/js/indexedDB.js';
import { removeSlideBUG } from '../../common/js/customDate.js';
import { getMonthDayCount } from '../../common/js/getCalendar.js';

const storageName = 'taskTime';
const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );

export default {
  name: 'order-task-taskTime',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      list: [],
      numberFlag: false,
      isPassTen: false,
    };
  },
  computed: mapState( {
    taskTime: state => state.orderTask.taskTime,
    orderTask: state => state.orderTask,
  } ),
  created() {
    this.$nextTick( () => {
      // 当不限时大于 10 条
      const range = IDBKeyRange.only( '*' );
      const dateData = new Date();
      const dateYear = dateData.getFullYear();
      const dateMonth = dateData.getMonth() + 1;
      const dateDay = dateData.getDate();
      const dateWeekday = weekday[ dateData.getDay() ];
      const maxMonthDay = getMonthDayCount();
      const rangeList = [
        `${dateYear}-${dateMonth}-${dateDay}-*`,
        `*-${dateMonth}-${dateDay}-*`,
        `*-${dateMonth}-*-*`,
        `*-*-${dateDay}-*`,
        `*-*-*-${dateWeekday}`,
        '*-*-*-*',
      ];
      let tempRangeList = [];
      let count = 0;

      if ( maxMonthDay === dateDay ) {
        // 月份最大 31
        for ( let i = 31; i > maxMonthDay; i-- ) {
          tempRangeList.push( `*-${dateMonth}-${i}-*` );
          tempRangeList.push( `*-*-${i}-*` );
        }

        if ( tempRangeList.length > 0 ) {
          Array.prototype.unshift.apply( rangeList, tempRangeList );
        }
      }

      dbTask.query( 'index', 'taskTime', { range }, data => {
        data.map( ( item ) => {
          if ( isToday( JSON.stringify( item.execDate ) ) ) {
            count += 1;

            if ( count > 10 ) {
              this.isPassTen = true;
            }
          }
        } );

        function isToday( value ) {
          return rangeList.some( item => {
            return value.indexOf( item ) !== -1;
          } );
        }
      } );

      mui.ready( () => {
        this.list = storage.get( storageName );
        if ( this.taskTime.active === '*' ) {
          this.numberFlag = true;
          mui( '.custom-numbox' ).numbox().setValue( this.orderTask.dreamGold.value );
        }

        mui( '#orderTaskTaskTimeDelete' ).on( 'slideleft', '.mui-table-view-cell', ( event ) => {
          const elem = event.target;
          const btnArray = [ '确认', '取消' ];

          mui.confirm( '确认删除该条计时？', '任务计时', btnArray, ( e ) => {
            if ( e.index === 0 && elem.className.indexOf( 'custom-selected' ) === -1 ) {
              const value = elem.dataset.value;
              let result = storage.get( storageName );

              delete result[ value ];
              storage.set( storageName, result );
              this.list = result;
              removeSlideBUG( mui( '#orderTaskTaskTimeDelete .mui-selected' )[ 0 ], 'mui-selected' );
            } else {
              setTimeout( function () {
                mui.swipeoutClose( elem );
              }, 0 );
            }
          }, 'div' );
        } );
      } );
    } );
  },
  methods: {
    // 计算时间
    computedTime( time ) {
      return minuteToHour( time );
    },

    // 自定义
    selectTime() {
      const dtPicker = new mui.DtPicker( {
        type: 'time',
        beginYear: new Date( '0000-00-00' ),
      } );

      dtPicker.show( ( selectItems ) => {
        let result = storage.get( storageName );
        let h = +selectItems.h.value;
        let i = +selectItems.i.value;
        let value = h * 60 + i;

        if ( value === 5 || value === 0 ) {
          return;
        }

        result[ value ] = value;
        storage.set( storageName, result );
        this.list = result;
      } );

      // 释放组件
      mui( '.mui-dtpicker-header' ).on( 'tap', '.mui-btn', () => {
        dtPicker && dtPicker.dispose();
      } );
      mui( '.mui-backdrop' )[ 0 ] && mui( '.mui-backdrop' )[ 0 ].addEventListener( 'tap', () => {
        dtPicker && dtPicker.dispose();
      } );
    },

    // 单选
    selectRadio( event ) {
      const data = event.target.dataset;
      const orderTask = this.orderTask;

      if ( !data.value ) {
        return;
      }
      this.numberFlag = false;
      this.taskTime.flag = taskTimeFlag.TASK_TIME_FLAG_NORMAL;
      if ( +data.value === 0 ) {
        this.taskTime.flag = taskTimeFlag.TASK_TIME_FLAG_UNCERTAIN_TIME;
        orderTask.dreamGold.display = '0金币';
        orderTask.dreamGold.value = 0;

        mui.alert( '此选项 <strong style="color:#f00;">从零开始</strong> 计时，自己确认即表示完成！', '提醒', '确定', null, 'div' );
      } else if ( data.value === '*' ) {
        this.taskTime.flag = taskTimeFlag.TASK_TIME_FLAG_UNLIMITED_TIME;

        mui.alert( '此选项 <strong style="color:#f00;">不计算时间</strong>，自己判定完成！请输入 <strong style="color:#f00;">金币数</strong>。', '提醒', '确定', this.inputNumber(), 'div' );
      } else {
        const gold = Math.round( +data.value, 10 );
        const restTime = Math.round( +data.value * 0.2, 10 );

        orderTask.dreamGold.display = `${gold}金币`;
        orderTask.dreamGold.value = gold;

        // gold = gold === 0 ? 1 : gold;
        orderTask.restTime.display = minuteToHour( restTime );
        orderTask.restTime.value = restTime;
        orderTask.execTime.display = minuteToHour( +data.value );
        orderTask.execTime.value = +data.value;
      }

      orderTask.execCount.display = '1次';
      orderTask.execCount.value = 1;
      orderTask.execCount.active = 1;
      this.taskTime.active = this.taskTime.value = +data.value || data.value;
      this.taskTime.display = data.display;
    },

    // 输入数字
    inputNumber() {
      this.numberFlag = true;

      const orderTask = this.orderTask;

      orderTask.dreamGold.display = `1金币`;
      orderTask.dreamGold.value = 1;
      mui( '.custom-numbox' ).numbox().setValue( 1 );
    },
    inputNumberMin() {
      const orderTask = this.orderTask;
      let gold = +mui( '#inputNumber' )[ 0 ].value || 1;

      if ( gold === 1 ) {
        return false;
      }
      gold -= 1;

      orderTask.dreamGold.display = `${gold}金币`;
      orderTask.dreamGold.value = gold;
    },
    inputNumberAdd() {
      const orderTask = this.orderTask;
      let gold = +mui( '#inputNumber' )[ 0 ].value || 1;

      if ( gold === 50 ) {
        return false;
      }
      gold += 1;

      orderTask.dreamGold.display = `${gold}金币`;
      orderTask.dreamGold.value = gold;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.order-task-taskTime {
  overflow: hidden;
}
.mui-table-view-cell {
  padding-top: 13px;
  padding-bottom: 13px;
  font-size: 15px;

  &::before {
    content: '';
    position: absolute;
    z-index: 8;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
  .icon-leftSlide {
    position: absolute;
    right: 0;
    font-size: 26px;
    // color: #007aff;
    color: #999;
  }
  .custom-btn {
    top: 0;
  }
  &.custom-selected {
    .icon-leftSlide {
      right: -2px;
      font-size: 30px;
      font-weight: 700;
      color: #007aff;
    }
    .icon-leftSlide::before {
      content: '\e616';
    }
  }
}
.mui-navigate-right:after {
  display: none;
}
.mui-table-view {
  margin-bottom: 60px;
}
.custom-btn {
  position: fixed;
  right: 10px;
  left: 10px;
  bottom: 10px;
  padding: 13px;
  font-size: 16px;
}
.custom-table-view-cell {
  .icon-leftSlide::before {
    content: '';
  }
  &.custom-selected {
    .icon-leftSlide {
      right: 12px;
    }
  }
}
.custom-special {
  top: 12px;
}
.custom-numbox {
  position: absolute;
  z-index: 9;
  top: 5px;
  right: 58px;
}
.special {
  color: #f00;
}
.pointer-events-none {
  pointer-events: none;
}
</style>
