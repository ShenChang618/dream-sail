<template>
	<nav class="tabbar mui-bar mui-bar-tab">
    <router-link to="/home" class="custom-tab-item custom-home">
        <span class="custom-icon iconfont icon-home"></span>
        <span class="custom-tab-label">首页</span>
    </router-link>
    <router-link to="/order" class="custom-tab-item">
        <span class="custom-icon iconfont icon-order-copy"></span>
        <span class="custom-tab-label">制定</span>
    </router-link>
    <router-link to="/setting" class="custom-tab-item">
        <span class="custom-icon iconfont icon-shezhi"></span>
        <span class="custom-tab-label">设置</span>
    </router-link>
	</nav>
</template>

<script>
export default {
  name: 'tabbar',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabbar {
	border-top: 0 none;
}
.custom-tab-item {
  display: table-cell;
  width: 1%;
  height: 50px;
  vertical-align: middle;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #929292;
}
.custom-icon {
	position: relative;
	z-index: 20;
	top: 3px;
	display: inline-block;
	width: 24px;
	height: 24px;
	padding-top: 0;
	padding-bottom: 0;
	font-size: 24px;
	font-family: Muiicons;
	font-weight: normal;
	font-style: normal;
	line-height: 1;
	text-decoration: none;
	-webkit-font-smoothing: antialiased;
}
.custom-tab-label {
  display: block;
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
}
.custom-home {
	color: #f0ad4e;
}
.custom-active {
	color: #007aff;
}
.icon-shezhi {
	top: 1px;
}
</style>
