<template>
  <div class="order-task-execDate">
    <div class="mui-switch exec-date-switch" id="execDateSwitch" :class="execDate.flag ? 'mui-active' : ''">
      <div class="mui-switch-handle"></div>
    </div>
    <ul class="mui-table-view mui-table-view-radio" id="orderExecDateList">
    	<li class="mui-table-view-cell custom-tap-state" v-for="( item, key ) in date" :class="key === execDate.active ? 'mui-selected' : ''">
    		<a class="mui-navigate-right" :data-key="key" :data-value="item.value">{{ item.display }}</span></a>

        <ul id="orderAddDelete" class="order-add-delete mui-table-view" v-if="Object.prototype.toString.call( item.value ) === '[object Array]'">
          <li class="mui-table-view-cell mui-transitioning" v-for="( value, key ) in item.value" :data-id="key" :key="key" v-if="value">
            <div class="mui-slider-right mui-disabled">
              <a class="mui-btn mui-btn-red">删除</a>
            </div>
            <div class="mui-slider-handle mui-table">
              <div class="order-add-input mui-table-cell">{{ value.display }}</div>
              <i class="iconfont icon-leftSlide mui-pull-right"></i>
            </div>
          </li>
        </ul>
    	</li>
    </ul>

    <div id="actionSheet" class="mui-popover mui-popover-bottom mui-popover-action ">
      <!-- 可选择菜单 -->
      <ul class="mui-table-view">
        <li class="mui-table-view-cell" v-for="item in list">
          <a href="javascript: void(0);" :data-value="item.value">{{ item.display }}</a>
        </li>
      </ul>
      <!-- 取消菜单 -->
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a href="javascript: void(0);"><b>取消</b></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import copy from '../../common/js/copy.js';
import { customDate, onSlideLeft } from '../../common/js/customDate.js';
import { initExecDate } from '../../common/js/initData.js';
import { selectedRegExp, weekday, today } from '../../common/js/data.js';

const dateObj = new Date();

export default {
  name: 'order-task-execDate',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      list: [],
      date: {
        disposable: {
          display: '一次性（ 今天 ）',
          value: `${today}-*`,
        },
        everyDay: {
          display: '每天',
          value: '*-*-*-*',
        },
        weekly: {
          display: `每周（ 星期${weekday[ dateObj.getDay() ]} ）`,
          value: `*-*-*-${weekday[ dateObj.getDay() ]}`,
        },
        monthly: {
          display: `每月（ ${dateObj.getDate()}日 ）`,
          value: `*-*-${dateObj.getDate()}-*`,
        },
        yearly: {
          display: `每年（ ${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ）`,
          value: `*-${dateObj.getMonth() + 1}-${dateObj.getDate()}-*`,
        },
      },
    };
  },
  computed: mapState( {
    execDate: state => state.orderTask.execDate,
  } ),
  created() {
    this.$nextTick( () => {
      mui.ready( () => {
        // 保存上一次选中的内容
        const execDate = this.execDate;
        const active = this.date[ execDate.active ];

        onSlideLeft( active, execDate );
        active.display = execDate.display;
        active.value = execDate.value;
        try {
          active.value = JSON.parse( execDate.value );
        } catch ( e ) {}

        // 开关启动
        mui( '#execDateSwitch' ).switch();

        // 点击
        mui( '#orderExecDateList' ).on( 'tap', '.custom-tap-state', ( e ) => {
          const key = e.target.dataset.key;
          const date = this.date[ key ];

          if ( key ) {
            customDate[ key ].call( this );
            execDate.active = key;
            execDate.display = date.display;

            // 出现 data-value 的值变成 "[object Object]" 的 BUG
            execDate.value = JSON.stringify( date.value );
          }
        } );

        // 开关
        mui( '#execDateSwitch' )[ 0 ].addEventListener( 'toggle', ( event ) => {
          execDate.flag = event.detail.isActive;

          // 初始化数据
          const copyData = copy( initExecDate );
          // data-key="*****"
          const regExp = /data-[\w]*="([^=]*)"/g;

          for ( let key in copyData ) {
            this.date[ key ] = copyData[ key ];
          }

          let html = mui( '#orderExecDateList' )[ 0 ].innerHTML;

          html = selectedRegExp.exec( html )[ 1 ];
          html = regExp.exec( html );
          execDate.value = this.date[ html[ 1 ] ].value;
          execDate.display = this.date[ html[ 1 ] ].display;
        } );
      } );
    } );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../common/css/mui.picker.min.css';
.mui-table-view-cell {
  padding-top: 13px;
  padding-bottom: 13px;
}
.mui-navigate-right {
  font-size: 15px;
}
.exec-date-switch {
  position: fixed;
  z-index: 11;
  top: 7px;
  right: 7px;

  &::before {
    content: '单选';
  }
  &.mui-active::before {
    content: '多选';
    left: 10px;
  }
}
.order-add-delete {
  // position: static;
  margin-top: 11px;
  margin-right: -65px;
  margin-bottom: -13px;

  .mui-table-view-cell {
    width: 100%;
    padding-left: 18px;
    margin-right: 0;
    overflow: hidden;
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;

    &::after {
      // left: 30px;
      height: 1px !important;
    }

    .icon-leftSlide {
      position: absolute;
      right: -53px;
      font-size: 26px;
      // color: #007aff;
      color: #999;
    }
  }
}
</style>
