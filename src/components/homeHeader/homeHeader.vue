<template>
  <header class="home-header mui-bar mui-bar-nav">
    <div class="mui-pull-left">
      <strong class="month">{{ homeHeader.month }}月</strong>
      <span class="year">{{ homeHeader.year }}年</span>
      <span class="day">{{ homeHeader.day }}日</span>
    </div>

    <button class="today-btn normalfont" id="switchStarBtn" type="button" name="button" @tap="tapStar" v-show="starList.length > 0">奖</button>

    <div class="mui-pull-right">
      <strong class="gold numberfont">{{ todayGold }}</strong>
    </div>

    <div class="mui-popover" id="switchStarPopover" v-show="starList.length > 0">
      <v-order-star-list></v-order-star-list>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import mui from 'mui';
import storage from '../../common/js/localStorage.js';
import OrderStarList from '../../components/orderStarList/orderStarList';
import Database from '../../common/js/indexedDB.js';
import { database } from '../../common/js/data.js';

const dbStar = new Database( {
  name: database.DB_STAR_NAME,
  objectStore: database.DB_OBJECT_STORE_STAR,
} );

export default {
  name: 'home-header',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  computed: mapState( {
    homeHeader: state => state.homeHeader,
    todayGold: state => state.todayGold,
    totalGold: state => state.totalGold,
    starList: state => state.starList,
  } ),
  created() {
    this.$nextTick( () => {
      this.$store.commit( 'changeIsBuyPage', true );
      this.$store.commit( 'changeTodayGold', storage.get( 'todayGold' ) );
    } );
  },
  methods: {
    tapStar() {
      if ( this.starList.length === 0 ) {
        return;
      }

      this.$store.commit( 'changeTotalGold', storage.get( 'totalGold' ) );

      const range = IDBKeyRange.upperBound( this.totalGold, false );

      dbStar.query( 'index', 'gold', { range, direction: 'prev' }, data => {
        this.$store.commit( 'changeStarList', data );
      } );

      this.$nextTick( () => {
        mui( '#switchStarPopover' ).popover( 'toggle', mui( '#switchStarBtn' )[ 0 ] );

        mui( '.mui-backdrop' )[ 0 ].addEventListener( 'tap', ( e ) => {
          try {
            e.target.parentNode.removeChild( e.target );
          } catch ( e ) {}
        } );
      } );
    },
  },
  components: {
    'v-order-star-list': OrderStarList,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home-header {
  height: 40px;
  color: #fff;
  background-color: #007aff;

  .mui-pull-left {
    width: 120px;
    margin-left: -5px;
  }
  .mui-pull-right,
  .mui-pull-left {
    height: 100%;
  }
  .month {
    display: block;
    width: 60px;
    height: 100%;
    float: left;
    font-size: 28px;
    font-weight: 400;
    text-align: center;
    line-height: 43px;
  }
  .year,
  .day {
    display: block;
    height: 50%;
    font-size: 12px;
  }
  .year {
    line-height: 26px;
  }
  .day {
    line-height: 18px;
  }

  .gold {
    display: block;
    width: 55px;
    height: 100%;
    font-size: 20px;
    text-align: right;
    line-height: 50px;
    letter-spacing: 5px;
    color: #f0ad4e;
  }
}
.mui-bar-nav {
  box-shadow: 0 0 0;
}
.today-btn {
  // right: 25%;
  // left: initial;
  // margin-left: 0;
  // margin-right: -20px;
  color: #fff;
  background-color: #f0ad4e;
}
.mui-popover {
  padding: 15px;
  color: #333;
}
.order-star-list {
  display: block;
}
.mui-popover {
  background-color: #fff;

  .mui-popover-arrow:after {
    background-color: #fff;
  }
  .mui-table-view {
    background-color: #fff;
  }
}
</style>
