<template>
  <article class="ring">
    <ul class="mui-table-view">
      <li class="mui-table-view-cell" v-for="item in list" data-path="item.path" :class="{ 'highlight': audio === item.path }" @tap="selectRing( item.path )">
        <h3 class="title normalfont">{{ item.name }}</h3>
        <strong class="time">{{ item.time }}</strong>
      </li>
    </ul>
  </article>
</template>

<script>
import storage from '../../common/js/localStorage.js';

export default {
  name: 'ring',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      audio: storage.get( 'audio' ),
      // 下面这个列表是渣渣啊，要放在耻辱柱上鞭挞的存在
      list: [
        {
          name: 'Everyday',
          path: 'Everyday.mp3',
          time: '1分37秒',
        },
        {
          name: '纯音乐',
          path: 'AbsoluteMusic.mp3',
          time: '24秒',
        },
        {
          name: '丛林鸟鸣',
          path: 'JungleTwitter.mp3',
          time: '25秒',
        },
        {
          name: '大自然',
          path: 'Nature.mp3',
          time: '30秒',
        },
        {
          name: '搞怪',
          path: 'Funny.mp3',
          time: '16秒',
        },
        {
          name: '韩国铃声',
          path: 'RingtoneKorea.mp3',
          time: '44秒',
        },
        {
          name: '军队起床',
          path: 'GetUpInTheArmy.mp3',
          time: '20秒',
        },
        {
          name: '梦幻',
          path: 'Dream.mp3',
          time: '42秒',
        },
        {
          name: '鸟语花香',
          path: 'SingingBirdsAndFragrantFlowers.mp3',
          time: '1分2秒',
        },
        {
          name: '水晶鸟叫',
          path: 'CrystalBird.mp3',
          time: '30秒',
        },
      ],
    };
  },
  methods: {
    selectRing( path ) {
      storage.set( 'audio', path );
      this.audio = path;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.ring {
  height: 100%;
}
.mui-table-view {
  margin-bottom: 43px;

  .mui-table-view-cell::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    height: 100%;
  }
  .highlight::before {
    content: '已应用';
    font-size: 30px;
    font-family: normalfont;
    text-align: center;
    line-height: 72px;
    color: #fff;
    background-color: rgba( 0, 0, 0, .2 );
  }

  .title {
    font-size: 18px;
    color: #333;
  }
  .time {
    font-weight: 400;
    font-size: 14px;
    color: #929292;
  }
}
</style>
