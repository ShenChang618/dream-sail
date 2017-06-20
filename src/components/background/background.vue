<template>
  <article class="background">
    <div class="background-bottom">
      <div class="mui-card" v-for="item in list" @tap="selectBg( item )">
      	<div class="mui-card-header mui-card-media" :class="[`order-banner-${item}`, background === item ? 'highlight' : '']"></div>
      </div>
    </div>
  </article>
</template>

<script>
import storage from '../../common/js/localStorage.js';

export default {
  name: 'background',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      list: [
        'default',
        'green',
        'arrows',
        'stairs',
        'colourful',
        'yinyang',
        'wall',
        'brick',
      ],
      background: storage.get( 'background' ),
    };
  },
  methods: {
    selectBg( item ) {
      storage.set( 'background', item );
      this.background = item;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.background {
  width: 100%;
  height: 100%;
}
.highlight {
  &::before {
    content: '已应用';
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 30px;
    font-family: normalfont;
    text-align: center;
    line-height: 168px;
    background-color: rgba( 0, 0, 0, .2 );
  }
}
.background-bottom {
  margin-bottom: 52px;
}
.mui-card-media {
  height: 168px;
}
</style>
