<template>
  <article class="order-add order-add-task">
    <header class="order-header mui-bar mui-bar-nav">
      <button class="order-add-btn mui-btn mui-pull-left" type="button" name="button" @tap="backNextPage">取消</button>
      <h2 class="mui-title">任务</h2>
      <button class="order-add-btn mui-btn mui-btn-primary mui-pull-right" type="button" name="button" @tap="saveToDatabase">确定</button>
    </header>

    <form class="order-add-form mui-input-group">
      <ul class="order-add-radio mui-table-view mui-table-view-radio order-add-input" data-key="classify" :data-value="classifyActive">
      	<li class="mui-table-view-cell" @tap="selectClassify( key )" v-for="( item, key ) in classifyToDisplay" :class="classifyActive === key ? 'mui-selected' : ''">
      		<i class="order-item-icon iconfont mui-navigate-right" :class="`icon-${key}`"></i>
          <span class="order-item-text">{{ item }}</span>
      	</li>
      </ul>

      <div class="mui-input-row">
        <input type="text" class="order-add-input mui-input-clear" autofocus placeholder="请输入任务标题" data-key="title" v-model="titleValue" :data-value="titleValue">
      </div>
      <div class="mui-input-row">
        <input type="text" class="order-add-input mui-input-clear" placeholder="请输入任务目标" data-key="task" v-model="taskValue" :data-value="taskValue">
      </div>

      <div class="mui-input-row" v-for="( item, index ) in list" @tap="openChildrenPage( item.name, item.path )" v-show="isTaskTime( item )">
        <label>{{ item.name }}</label>
        <i class="mui-input-icon mui-icon mui-icon-arrowright mui-pull-right"></i>
        <span class="order-add-input mui-input-text mui-pull-right" :data-key="item.key" :data-value="orderTask[ item.key ].value">{{ orderTask[ item.key ].display }}</span>
      </div>

      <div class="mui-input-row custom-input-row" v-for="( item, index ) in showList" v-show="showFlag( index )">
        <label>{{ item.name }}</label>
        <span class="order-add-input mui-input-text mui-pull-right" :data-key="item.key" :data-value="orderTask[ item.key ].value">{{ orderTask[ item.key ].display }}</span>
      </div>
    </form>

    <article class="order-add-cache fixedFull" v-show="flag">
      <header class="order-cache-header mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="backNextPage"></a>
        <h2 class="mui-title">{{ this.title }}</h2>
      </header>

      <transition name="routerFade">
        <router-view class="order-add-top" keep-alive></router-view>
      </transition>
    </article>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import Database from '../../common/js/indexedDB.js';
import copy from '../../common/js/copy.js';
import router from '../../router/index.js';
// import reverse from '../../common/js/reverse.js';
import { initOrderTask } from '../../common/js/initData.js';
import { database, execDateRegExp, taskTimeFlag, classifyToDisplay } from '../../common/js/data.js';

const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );

export default {
  name: 'order-task',
  data() {
    return {
      title: '导航栏',
      taskValue: '',
      titleValue: '',
      flag: false,
      classifyActive: 'language',
      classifyToDisplay,
      list: [
        {
          name: '执行日期',
          path: 'ExecDate',
          key: 'execDate',
        },
        {
          name: '任务计时',
          path: 'TaskTime',
          key: 'taskTime',
        },
        {
          name: '执行次数',
          path: 'ExecCount',
          key: 'execCount',
        },
      ],
      showList: [
        {
          name: '执行时间',
          key: 'execTime',
        },
        {
          name: '休息时间',
          key: 'restTime',
        },
        {
          name: '梦想金币',
          key: 'dreamGold',
        },
      ],
    };
  },
  computed: mapState( {
    orderTask: state => state.orderTask,
    taskList: state => state.taskList,
  } ),
  created() {
    // 初始化数据
    const copyData = copy( initOrderTask );

    for ( let key in this.orderTask ) {
      this.orderTask[ key ] = copyData[ key ];
    }

    // 监听历史
    window.onhashchange = ( e ) => {
      if ( document.location.hash === '#/order/orderTask' ) {
        this.flag = false;
      }
    };
  },
  methods: {
    isTaskTime( item ) {
      const value = this.orderTask.taskTime.value;

      return !( item.key === 'execCount' && ( value === '*' || +value === 0 ) );
    },

    // 返回上一个页面
    backNextPage() {
      this.flag = false;
      // router.go( -1 );
      window.history.back();
    },

    // 打开子页面
    openChildrenPage( name, path ) {
      this.title = name;
      this.flag = true;
      router.push( `/order/orderTask/orderTask${path}` );
    },

    // 保存到数据库
    saveToDatabase() {
      const inputList = mui( '.order-add-input' );
      const _self = this;
      let inputData = {};

      inputList.each( ( index, dom ) => {
        const data = dom.dataset;

        inputData[ data.key ] = data.value;
      } );

      if ( inputData.title === '' ) {
        const btnValue = [ '确定', '取消' ];

        mui.prompt( '标题不能为空，请输入标题！', '', '警告', btnValue, ( e ) => {
          if ( e.index === 0 ) {
            inputData.title = e.value === '' ? '无标题' : e.value;
            save();
          }
        }, 'div' );
      } else {
        save();
      }

      function save() {
        // 保存一些默认参数
        // 按天来算
        inputData.continuityDate = 0;
        inputData.completedDate = 0;
        // 0 未完成
        // 1 正在执行
        // 2 完成
        inputData.state = 0;

        inputData.execDate = inputData.execDate.match( execDateRegExp );
        if ( inputData.execDate === null ) {
          inputData.execDate = '*-*-*-*';
        }

        inputData.unique = +new Date();
        inputData.task = inputData.task === '' ? '并没有什么目标哦！' : inputData.task;
        // inputData.execTime = 0.1;
        // inputData.restTime = 0.1;
        // inputData.dreamGold = 1;
        // inputData.execCount = 2;
        // inputData.execDate = [ '2017-6-21-*' ];
        // inputData.state = 2;
        inputData.tempCount = inputData.execCount;
        dbTask.insert( inputData );

        mui.alert( '恭喜你，任务添加成功！', '提醒', '确定', () => {
          _self.backNextPage();
          dbTask.query( null, ( data ) => {
            _self.$store.commit( 'changeTaskList', data );
          }, { direction: 'prev' } );
        }, 'div' );
      }
    },

    // 选择分类
    selectClassify( value ) {
      this.classifyActive = value;
    },

    showFlag( index ) {
      const flag = this.orderTask.taskTime.flag;

      if ( flag === taskTimeFlag.TASK_TIME_FLAG_UNCERTAIN_TIME ) {
        return false;
      }

      if ( flag === taskTimeFlag.TASK_TIME_FLAG_UNLIMITED_TIME ) {
        return index === this.showList.length - 1;
      }

      return true;
    },
    showIconFlag( index ) {
      if ( index < 3 ) {
        return true;
      }

      return false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.order-add-task {
  background-color: #fff;
}
.order-header .order-add-btn {
  padding: 6px 10px 3px;
}
.order-add-radio {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px 20px;
}
.order-add-radio .order-item-icon {
  width: 50px;
  height: 50px;
  font-size: 3rem;
}
.order-add-radio .mui-table-view-cell {
  // display: inline-block;
  flex: 0 0 auto;
  width: 50px;
  height: 70px;
  padding: 0;
  margin: 5px 10px;
  transform-style: flat;
}
.order-add-radio .order-item-icon {
  position: absolute;
  top: 16px;
  left: 0;
}
.order-add-radio .mui-table-view-cell::after {
  display: none;
}
.order-add-radio .order-item-text {
  display: block;
  height: 16px;
  margin-top: 50px;
  font-size: 14px;
  text-align: center;
}
.order-add-radio .mui-selected {
  opacity: .8;
}
.order-add-radio .mui-selected .mui-navigate-right::after {
  position: absoulte;
  top: 9px;
  left: -1px;
  font-size: 50px;
}
.mui-input-text,
.mui-input-icon {
  color: #999;
}
.mui-input-text {
  height: 50px;
  padding: 15px 0;
  font-size: 13px;
  line-height: 20px;
}
.mui-input-icon {
  padding: 11px;
  font-size: 26px;
  padding-left: 5px;
}
.order-add-radio {
  .icon-other.mui-navigate-right::after {
    top: 13px;
    left: -2px;
  }
}
.order-add-form,
.order-add-top {
  margin-top: 45px;
}
.order-add-top {
  position: absolute;
  top: 0;
  width: 100%;
}
.order-add-cache {
  overflow-y: auto;
}
.order-input-execDate {
  height: auto;
  overflow: visible;

  .order-input-top {
    height: 50px;
    overflow: hidden;

    &.mui-table-view-cell {
      padding: 0;
    }
  }
}
.order-add-delete {
  position: static;

  &::after {
    left: 15px;
  }

  .mui-table-view-cell {
    padding-left: 30px;
    margin-right: 0;
    font-size: 15px;

    &::after {
      left: 30px;
      height: 1px !important;
    }

    .icon-leftSlide {
      position: absolute;
      right: 0;
      font-size: 26px;
      // color: #007aff;
      color: #999;
    }
  }
}
.mui-input-text {
  width: 50%;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.custom-input-row {
  padding-left: 20%;
  padding-right: 20%;

  label,
  span {
    display: inline-block;
    width: 50%;
    padding-left: 0;
    padding-right: 0;
    text-align: center;
  }
  &::after {
    right: 20%;
    left: 20%;
  }
}
</style>
