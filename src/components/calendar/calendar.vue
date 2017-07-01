<template>
  <article class="calendar-wrapper"></article>
</template>

<script>
import { mapState } from 'vuex';
import Calendar from '../../common/js/calendarToDOM.js';
import { getMonthDayCount } from '../../common/js/getCalendar.js';
import { touchLeft, touchRight } from '../../common/js/events.js';
import queryData from '../../common/js/queryData.js';
import resetDatabaseState from '../../common/js/resetDatabaseState.js';
import isYesterday from '../../common/js/isYesterday.js';

const btn = document.createElement( 'button' );
let calendar;

btn.className = 'today-btn normalfont';
btn.innerHTML = '今';

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: mapState( {
    homeUnfinishedList: state => state.homeUnfinishedList,
    homeHeader: state => state.homeHeader,
    homeBackdropFlag: state => state.homeBackdrop.flag,
    homeUncertainTimeBackdropFlag: state => state.homeUncertainTimeBackdrop.flag,
    screenState: state => state.screenState,
  } ),
  created() {
    this.$nextTick( this.createdRun );
  },
  watch: {
    // 下面代码作用为：在进入软件前台后、关闭计时器后刷新主页
    screenState() {
      if ( this.screenState === 'pause' ) {
        return;
      }

      if ( this.homeBackdropFlag === true || this.homeUncertainTimeBackdropFlag === true ) {
        return;
      }

      if ( isYesterday() === false ) {
        return;
      }

      this.createdRun();
    },
    homeBackdropFlag() {
      if ( this.homeBackdropFlag === true ) {
        return;
      }

      if ( isYesterday() === false ) {
        return;
      }

      this.createdRun();
    },
    homeUncertainTimeBackdropFlag() {
      if ( this.homeUncertainTimeBackdropFlag === true ) {
        return;
      }

      if ( isYesterday() === false ) {
        return;
      }

      this.createdRun();
    },
  },
  methods: {
    createdRun() {
      calendar = new Calendar( document.querySelector( '.calendar-wrapper' ) );

      // 多次一举的目的是为了在页面切换时刷新时间，不然在隔天时就会出错
      const tempDate = new Date();
      const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
      const today = todayDate;
      const calendarDOM = document.querySelector( '.calendar-wrapper' );
      const _self = this;

      // 今天按钮
      btn.addEventListener( 'tap', btnEvent, false );

      function btnEvent( event ) {
        calendar.today();
        setHeaderDate( {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        } );
        _self.queryData();

        // 阻止调用相同事件
        event.stopImmediatePropagation();
      };

      // 初始化
      this.queryData();
      setHeaderDate( {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      } );
      calendar.init( today, ( value ) => {
        const text = `${value.year}-${value.month}-${value.day}`;

        toToday( text );
        setHeaderDate( value );
        this.queryData( text );
      } );

      function setHeaderDate( value ) {
        _self.homeHeader.year = value.year;
        _self.homeHeader.month = value.month;
        _self.homeHeader.day = value.day;
      }

      // 向上个月，向下个月
      setTimeout( () => {
        const calendarDOM = document.querySelector( '.calendar-wrapper' );

        touchLeft( calendarDOM, event => calendar.next( queryToday ) );
        touchRight( calendarDOM, event => {
          if ( this.homeHeader.year === today.getFullYear() && today.getMonth() + 1 === this.homeHeader.month ) {
            return;
          }
          calendar.prev( queryToday );
        } );

        function queryToday( result ) {
          const todayDay = today.getDate();
          const maxMonthDay = getMonthDayCount( `${result.year}-${result.month}` );

          _self.homeHeader.year = result.year;
          _self.homeHeader.month = result.month;
          _self.homeHeader.day = todayDay > maxMonthDay ? maxMonthDay : todayDay;

          const text = `${result.year}-${result.month}-${_self.homeHeader.day}`;
          _self.queryData( text );
          toToday( text );
        }
      }, 600 );

      // 显示今天
      function toToday( date ) {
        try {
          calendarDOM.removeChild( calendarDOM.childNodes[ 1 ] );
        } catch ( e ) {}

        if ( +new Date( date ) !== +todayDate ) {
          setTimeout( () => {
            calendarDOM.append( btn );
          }, 200 );
        }
      }
    },

    queryData( date ) {
      const tempDate = new Date();
      const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
      const dateData = date ? new Date( date ) : todayDate;
      let inputDataList = queryData( dateData );

      // 计数
      let dataCount = 10;
      // 数据重置完毕执行
      const dataResult = setInterval( () => {
        if ( inputDataList.length > 0 && dataCount < 6 || dataCount <= 0 ) {
          clearInterval( dataResult );

          this.$store.commit( 'changeIsHomeToday', false );
          if ( +dateData === +todayDate ) {
            this.$store.commit( 'changeIsHomeToday', true );
          }

          // 重置数据
          inputDataList = resetDatabaseState.call( this, inputDataList );
          this.$store.commit( 'changeHomeUnfinishedList', inputDataList );
        }

        dataCount -= 1;
      }, 100 );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.calendar-wrapper {
  position: relative;
  width: 100%;
  height: 240px;

  &::after {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    right: 0;
    left: 0;
    display: block;
    height: 1px;
    content: '';
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
}
</style>
