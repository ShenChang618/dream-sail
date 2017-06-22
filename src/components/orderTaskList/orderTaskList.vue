<template>
  <div class="mui-slider-item mui-control-content mui-active order-task-list" data-switch="Task">
    <ul class="mui-table-view">
      <li class="mui-table-view-cell mui-collapse" v-for="( item, index ) in taskList">
        <div class="order-list-item mui-navigate-right">
          <i class="mui-media-object mui-pull-left order-item-icon iconfont" :class="`icon-${item.classify}`"></i>

          <section class="mui-media-body">
            <h3 class="order-item-title mui-ellipsis">{{ item.title }}</h3>
            <p class="mui-ellipsis">{{ item.task }}</p>
          </section>

          <strong class="order-item-dreamGold numberfont">{{ item.dreamGold }}</strong>

          <div class="custom-control" @tap="controlShow( index )">
            <button class="custom-control-btn custom-control-task" type="button" name="button" @tap="controlTask( item )">目标</button>
            <button class="custom-control-btn custom-control-delete mui-btn-danger" type="button" name="button" @tap="controlDelete( item )">删除</button>
          </div>
        </div>

        <ul class="mui-collapse-content">
          <li class="mui-input-row custom-input-row">
            <label>执行日期</label>
            <a class="mui-input-text mui-pull-right switch-active" :class="`switchExecDateBtn_${index}`" @tap="tapExecDate( item.execDate, index )">{{ switchExecDate( item.execDate ) }}</a>
          </li>
          <li class="mui-input-row custom-input-row">
            <label>执行次数</label>
            <span class="mui-input-text mui-pull-right mui-ellipsis">{{ item.execCount }}次</span>
          </li>
          <li class="mui-input-row custom-input-row" v-if="item.taskTime !== '*' && +item.taskTime !== 0">
            <label>执行时间</label>
            <span class="mui-input-text mui-pull-right mui-ellipsis">{{ switchTime( item.execTime ) }}</span>
          </li>
          <li class="mui-input-row custom-input-row" v-if="item.taskTime !== '*' && +item.taskTime !== 0">
            <label>休息时间</label>
            <span class="mui-input-text mui-pull-right mui-ellipsis">{{ switchTime( item.restTime ) }}</span>
          </li>
          <li class="mui-input-row custom-input-row">
            <label>任务时长</label>
            <span class="mui-input-text mui-pull-right mui-ellipsis">{{ switchTime( item.taskTime ) }}</span>
          </li>
          <li class="mui-input-row custom-input-row">
            <label>梦想金币</label>
            <span class="mui-input-text mui-pull-right mui-ellipsis">{{ item.dreamGold }}个</span>
          </li>
          <li class="mui-input-row custom-input-row custom-special" v-if="item.completedDate > 0">
            <p>连续 <strong>{{ item.continuityDate }}</strong> 次 <span>/</span> 执行 <strong>{{ item.completedDate }}</strong> 天</p>
          </li>
        </ul>
      </li>
    </ul>
    <p class="not-task normalfont" v-show="taskList.length === 0">没有任务哦!</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import minuteToHour from '../../common/js/minuteToHour.js';
import Database from '../../common/js/indexedDB.js';
import resetDatabaseState from '../../common/js/resetDatabaseState.js';
import { getSwitchId, switchExecDateArray } from '../../common/js/switchExecDate.js';
import { database, today } from '../../common/js/data.js';
import isYesterday from '../../common/js/isYesterday.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );
const dbHistory = new Database( {
  name: database.DB_HISTORY_NAME,
  objectStore: database.DB_OBJECT_STORE_HISTORY,
} );

export default {
  name: 'order-task-list',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: mapState( {
    taskList: state => state.taskList,
    orderTaskDateList: state => state.orderTaskDateList,
    screenState: state => state.screenState,
  } ),
  watch: {
    screenState() {
      if ( this.screenState === 'pause' ) {
        return;
      }

      if ( isYesterday() === false ) {
        return;
      }

      this.createdRun();
    },
  },
  created() {
    this.$nextTick( this.createdRun );
  },
  methods: {
    createdRun() {
      // 任务列表输出
      // const keyRange = IDBKeyRange.only( '2017-6-7-*' );
      dbTask.query( null, ( data ) => {
        const resultData = resetDatabaseState( data, true );

        if ( resultData === true ) {
          setTimeout( () => {
            dbTask.query( null, ( value ) => {
              console.log( value );
              this.$store.commit( 'changeTaskList', value );
            }, { direction: 'prev' } );
          }, 1000 );
        } else {
          this.$store.commit( 'changeTaskList', resultData );
        }
      }, { direction: 'prev' } );
    },

    // 修改目标
    controlTask( item ) {
      const btnValue = [ '确定', '取消' ];

      mui.prompt( '请输入新的目标！', '', '提醒', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          if ( item.task !== '并没有什么目标哦！' ) {
            const historyData = {
              type: '目标',
              date: today,
              gold: null,
              value: item.task,
            };

            dbHistory.insert( historyData );
          }

          item.task = e.value === '' ? '并没有什么目标哦！' : e.value;
          dbTask.update( item );
        }
      }, 'div' );
    },

    // 删除
    controlDelete( item ) {
      const btnValue = [ '确定', '取消' ];

      mui.confirm( '是否确认 <strong style="color:#f00;">删除</strong> 这条任务？', '警告', btnValue, ( e ) => {
        if ( e.index === 0 ) {
          if ( item.taskTime === '*' && item.state === 2 ) {
            mui.alert( '<strong style="color:#f00;">不能删除</strong>，无限制任务只能在<strong style="color:#f00;">未完成时</strong>删除', '警告', '确定', null, 'div' );

            return;
          }

          dbTask.delete( item.id );
          dbTask.query( null, ( data ) => {
            this.$store.commit( 'changeTaskList', data );
          }, { direction: 'prev' } );

          // 删除存入历史
          if ( item.completedDate > 0 ) {
            let gold = item.dreamGold * item.completedDate;

            const historyData = {
              type: '任务',
              date: today,
              value: item.title,
              gold,
            };

            dbHistory.insert( historyData );

            if ( item.task !== '并没有什么目标哦！' ) {
              const historyTaskData = {
                type: '目标',
                date: today,
                gold: null,
                value: item.task,
              };

              dbHistory.insert( historyTaskData );
            }
          }
        }
      }, 'div' );
    },

    // 点击不收起菜单
    controlShow( index ) {
      mui( '.mui-collapse' )[ index ].className += 'mui-active';
    },

    // 转换执行日期
    switchExecDate( value ) {
      switch ( getSwitchId( value[ 0 ] ) ) {
        case 4: {
          return '一次性';
        }
        case 5:
        case 8: {
          return '每年';
        }
        case 6: {
          return '每周';
        }
        case 7: {
          return '每月';
        }
        case 10: {
          return '每天';
        }
      }
    },
    tapExecDate( value, index ) {
      if ( getSwitchId( value[ 0 ] ) === 10 ) {
        return;
      }

      // this.dateList = switchExecDateArray( value );
      this.$store.commit( 'changeOrderTaskDateList', switchExecDateArray( value ) );

      this.$nextTick( () => {
        mui( '#switchExecDatePopover' ).popover( 'toggle', mui( `.switchExecDateBtn_${index}` )[ 0 ] );

        mui( '.mui-backdrop' )[ 0 ].addEventListener( 'tap', ( e ) => {
          try {
            e.target.parentNode.removeChild( e.target );
          } catch ( e ) {}
        } );
      } );
    },

    // 转换分钟
    switchTime( value ) {
      if ( +value === 0 ) {
        return '不确定';
      }

      if ( value === '*' ) {
        return '无限制';
      }

      return minuteToHour( value );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mui-media-body {
  padding-right: 60px;

  p {
    font-size: 12px;
  }
}
.mui-navigate-right {
  position: relative;
}
.mui-navigate-right::after {
  position: absolute;
  right: 0;
  bottom: 50px;
  height: 24px;
  display: none;
  font-size: 24px;
}
.mui-collapse {
  padding-top: 15px;
  padding-bottom: 15px;

  &.mui-active {
    .custom-control {
      display: block;
    }
  }
}
.mui-collapse-content {
  letter-spacing: -.31em;
  margin-bottom: -15px !important;
}
.custom-input-row {
  display: inline-block;
  width: 50%;
  letter-spacing: normal;

  label,
  .mui-input-text {
    display: inline-block;
    width: 50%;
    padding: 5px 0;
    line-height: 20px;
    text-align: center;
  }
  .mui-input-text {
    font-size: 13px;
    color: #999;
  }
  &.custom-special {
    width: 100%;
    text-align: center;

    strong {
      font-weight: 400;
    }
  }
  &::after {
    right: 20%;
    left: 20%;
  }
}
.custom-control {
  position: absolute;
  z-index: 2;
  top: -15px;
  right: -4px;
  bottom: -20px;
  display: none;
  width: 60px;

  .custom-control-btn {
    width: 100%;
    border: 0 none;
    border-radius: 0;
  }
  .custom-control-task {
    height: 40%;
    line-height: 26px;
  }
  .custom-control-delete {
    height: 60%;
    line-height: 40px;
  }
}
.mui-input-row {
  overflow: visible;
}
.order-item-dreamGold {
  position: absolute;
  top: 0;
  right: 0;
  width: 55px;
  height: 53px;
  font-size: 20px;
  text-align: center;
  line-height: 53px;
  letter-spacing: 4px;
  color: #f0ad4e;
}
.switch-active {
  padding-top: 6px !important;
  padding-bottom: 4px !important;
  color: #fff !important;
  background-color: #007aff;
}
.not-task {
  top: 34px;
}
</style>
