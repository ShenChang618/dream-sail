import Vue from 'vue';
import Vuex from 'vuex';

import { initOrderTask } from '../common/js/initData.js';
import copy from '../common/js/copy.js';
import storage from '../common/js/localStorage.js';

Vue.use( Vuex );

const copyData = copy( initOrderTask );

const state = {
  orderTask: copyData,
  taskList: [],
  starList: [],
  orderTaskDateList: [],
  homeUnfinishedList: [],
  isHomeToday: true,
  isBuyPage: false,
  homeHeader: {
    year: 0,
    month: 0,
    day: 0,
  },
  todayGold: storage.get( 'todayGold' ),
  totalGold: storage.get( 'totalGold' ),
  homeBackdrop: {
    flag: false,
    index: 0,
    data: {},
  },
  homeUncertainTimeBackdrop: {
    flag: false,
    index: 0,
    data: {},
  },
};

const actions = {

};

const mutations = {
  changeOrderTask( state, payload ) {
    state.orderTask[ payload.key ] = payload.value;
  },
  changeTaskList( state, payload ) {
    state.taskList = payload;
  },
  changeStarList( state, payload ) {
    state.starList = payload;
  },
  changeOrderTaskDateList( state, payload ) {
    state.orderTaskDateList = payload;
  },
  changeHomeUnfinishedList( state, payload ) {
    state.homeUnfinishedList = payload;
  },
  changeHomeHeader( state, payload ) {
    state.homeHeader[ payload.key ] = payload.value;
  },
  changeIsHomeToday( state, payload ) {
    state.isHomeToday = payload;
  },
  changeIsBuyPage( state, payload ) {
    state.isBuyPage = payload;
  },
  changeHomeBackdropFlag( state, payload ) {
    state.homeBackdrop.flag = payload;
  },
  changehomeUncertainTimeBackdropFlag( state, payload ) {
    state.homeUncertainTimeBackdrop.flag = payload;
  },
  changeTodayGold( state, payload ) {
    state.todayGold = payload;
  },
  changeTotalGold( state, payload ) {
    state.totalGold = payload;
  },
};

const store = new Vuex.Store( {
  state,
  actions,
  mutations,
} );

export default store;
