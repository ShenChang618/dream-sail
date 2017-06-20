<template>
  <article class="history background">
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back"></a>
      <h2 class="mui-title">足迹</h2>
    </header>

    <div class="history-content" v-show="historyData.length > 0">
      <article class="mui-card" v-for="item in historyData">
      	<section class="mui-card-header mui-card-media">
      	  <h3 class="normalfont">{{ item.type }}</h3>
          <div class="mui-media-body">
        	   <p class="mui-card-content mui-ellipsis" :class="item.type === '目标' ? 'history-special' : ''">{{ item.value }}</p>
         	   <p class="mui-card-content mui-ellipsis history-gold-warpper" v-show="item.type !== '目标'">此{{ item.type }}<span v-show="item.type === '任务'">获得</span><span v-show="item.type === '奖励'">花费</span><span class="gold numberfont">{{ item.gold }}</span>金币</p>
          </div>
      	</section>
      	<div class="mui-card-footer">
          <span class="date">{{ item.date }}</span>
        </div>
      </article>
    </div>

    <p class="not-task normalfont" v-show="historyData.length === 0">没有足迹哦!</p>
  </article>
</template>

<script>
import router from '../../router/index.js';
import Database from '../../common/js/indexedDB.js';
import { database } from '../../common/js/data.js';

const dbHistory = new Database( {
  name: database.DB_HISTORY_NAME,
  objectStore: database.DB_OBJECT_STORE_HISTORY,
} );

export default {
  name: 'history',
  data() {
    return {
      historyData: [],
    };
  },
  created() {
    this.$nextTick( () => {
      dbHistory.query( null, ( data ) => {
        this.historyData = data;
      }, { direction: 'prev' } );
    } );
  },
  methods: {
    back() {
      router.go( -1 );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.history-content {
  margin-top: 54px;
}
.mui-card-header {
  height: 80px;
}
.normalfont {
  margin: 0;
  float: left;
  font-size: 24px;
  line-height: 60px;
  color: #007aff;
}
.mui-media-body {
  margin-left: 60px !important;
}
.mui-card-content {
  font-size: 16px !important;
  line-height: 30px;
  color: #333;
}
.history-special {
  line-height: 60px;
}
.other {
  position: absolute;
  top: 5px;
  bottom: 5px;
  width: 65px;
}
.date {
  display: block;
  width: 100%;
  font-size: 14px;
  text-align: right;
}
.mui-card-footer {
  &::before {
    display: none;
  }
}
.history-gold-warpper {
  font-size: 12px !important;
  color: #8f8f94;
}
.gold {
  margin: 0 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #f0ad4e;
}
.not-task {
  margin-top: -44px;
  font-size: 30px;
  color: #333;
}
</style>
