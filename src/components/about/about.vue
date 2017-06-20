<template>
  <article class="about">
    <figure class="about-header">
      <img class="img" src="/static/img/appIcon.png" alt="图标">
      <figcaption class="text">时间都去哪了!</figcaption>
    </figure>

    <ul class="mui-table-view">
      <li class="mui-table-view-cell" @tap="openPath( 'http://www.cfmwsc.cn/' )">
        <h3 class="title mui-pull-left">开发者</h3>
        <figure class="about-right mui-pull-right">
          <img class="img" src="/static/img/avatar.png" alt="图标">
          <figcaption class="text">Sam</figcaption>
        </figure>
      </li>
      <li class="mui-table-view-cell">
        <h3 class="title mui-pull-left">微信</h3>
        <span class="text mui-pull-right">s2696922797c</span>
      </li>
      <li class="mui-table-view-cell">
        <h3 class="title mui-pull-left">QQ</h3>
        <span class="text mui-pull-right">2696922797</span>
      </li>
      <li class="mui-table-view-cell">
        <h3 class="title" @tap="openPath( 'http://www.gnu.org/licenses/gpl.html' )"><a class="mui-navigate-right">开源协议</a></h3>
      </li>
      <li class="mui-table-view-cell" @tap="openPath( 'https://github.com/Sam618' )">
        <h3 class="title"><a class="mui-navigate-right">github</a></h3>
      </li>
    </ul>
  </article>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  methods: {
    openPath( value ) {
      if ( window.plus ) {
        // window.plus.runtime.launchApplication( {
        //   pname: 'com.android.browser',
        //   extra: { url: value },
        // }, ( e ) => {} );
        window.plus.runtime.openURL( value, e => {}, 'com.android.browser' );
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.about-header {
  margin-top: 25px;
  margin-bottom: 25px;
  text-align: center;

  .img {
    width: 100px;
    border-radius: 50%;
  }
  .text {
    margin-top: 5px;
    font-size: 14px;
  }
}
.mui-table-view-cell {
  padding-top: 15px;
  padding-bottom: 15px;

  .title {
    font-weight: 400;
    font-size: 18px;
  }
  .text {
    display: block;
    font-size: 15px;
    line-height: 26px;
  }
}
.mui-table-view-cell,
.mui-navigate-right {
  color: #333;
}
.about-right {
  margin: 0;

  .img {
    width: 30px;
    border-radius: 50%;
  }
  .text {
    display: inline-block;
    margin-left: 5px;
    font-size: 15px;
    line-height: 26px;
  }
  .img,
  .text {
    vertical-align: middle;
  }
}
</style>
