<template>
  <article class="order-add order-add-star fixedFull">
    <header class="order-header mui-bar mui-bar-nav">
      <button class="order-add-btn mui-btn mui-pull-left" type="button" name="button" @tap="backNextPage">取消</button>
      <h2 class="mui-title">奖励</h2>
      <button class="order-add-btn mui-btn mui-btn-primary mui-pull-right" type="button" name="button" @tap="saveToDatabase">确定</button>
    </header>

    <form class="order-add-form mui-input-group">
      <div class="mui-input-row">
        <label>奖励</label>
        <input type="text" class="order-add-input mui-input-clear" autofocus placeholder="请输入奖励" data-key="title" v-model="titleValue" :data-value="titleValue">
      </div>
      <div class="mui-input-row input-special">
        <label>花费金币</label>
        <input type="number" class="order-add-input mui-input-clear numberfont" placeholder="0" data-key="gold" v-model="goldValue" :data-value="goldValue">
      </div>
    </form>

    <section class="order-star-info">
      <h3 class="order-star-title">使用须知</h3>
      <p class="order-star-text">花费金币与货币的比例建议为 <strong class="special">19 / 1</strong>，可以根据自己的情况进行调整！</p>
      <p class="order-star-text">和货币相比只是为了有个参照物，有些奖励不能用物质去衡量；就需要自己进行估算了！</p>
    </section>
  </article>
</template>

<script>
import mui from 'mui';
import Database from '../../common/js/indexedDB.js';
import { database } from '../../common/js/data.js';

const dbStar = new Database( {
  name: database.DB_STAR_NAME,
  objectStore: database.DB_OBJECT_STORE_STAR,
} );

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      goldValue: '',
      titleValue: '',
    };
  },
  methods: {
    // 返回上一个页面
    backNextPage() {
      this.flag = false;
      // router.go( -1 );
      window.history.back();
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

        mui.prompt( '奖励不能为空，请输入奖励！', '', '警告', btnValue, ( e ) => {
          if ( e.index === 0 ) {
            if ( e.value === '' ) {
              return;
            }

            inputData.title = e.value;
            save();
          }
        }, 'div' );
      } else {
        save();
      }

      function save() {
        inputData.gold = inputData.gold === '' ? 0 : +inputData.gold;
        dbStar.insert( inputData );

        mui.alert( '恭喜你，奖励添加成功！', '提醒', '确定', () => {
          _self.backNextPage();
          dbStar.query( null, ( data ) => {
            _self.$store.commit( 'changeStarList', data );
          }, { direction: 'prev' } );
        }, 'div' );
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.order-add-star {
  background-color: #fff;
}
.order-header .order-add-btn {
  padding: 6px 10px 3px;
}
.order-add-form {
  margin-top: 44px;
}
.numberfont {
  padding-top: 24px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #f0ad4e;
}
.order-star-info {
  position: absolute;
  top: 50%;
  width: 100%;
  // margin-top: -62px;

  .order-star-title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
  }
  .order-star-text {
    padding: 0 15px;
    font-size: 12px;
    text-indent: 2em;
    line-height: 20px;
  }
  .special {
    color: #dd524d;
  }
}
</style>
