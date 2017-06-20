import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/home/home';
import Order from '../components/order/order';
import Setting from '../components/setting/setting';
import OrderTask from '../components/orderTask/orderTask';
import OrderStar from '../components/orderStar/orderStar';
import History from '../components/history/history';
import Ring from '../components/ring/ring';
import Background from '../components/background/background';
import About from '../components/about/about';
import OrderTaskExecDate from '../components/OrderTaskExecDate/OrderTaskExecDate';
import OrderTaskTaskTime from '../components/OrderTaskTaskTime/OrderTaskTaskTime';
import OrderTaskExecCount from '../components/OrderTaskExecCount/OrderTaskExecCount';

Vue.use( VueRouter );

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/order',
    component: Order,
    children: [
      {
        path: 'history',
        component: History,
      },
      {
        path: 'orderTask',
        component: OrderTask,
        children: [
          {
            path: 'orderTaskExecDate',
            component: OrderTaskExecDate,
          },
          {
            path: 'orderTaskTaskTime',
            component: OrderTaskTaskTime,
          },
          {
            path: 'orderTaskExecCount',
            component: OrderTaskExecCount,
          },
        ],
      },
      {
        path: 'orderStar',
        component: OrderStar,
      },
    ],
  },
  {
    path: '/setting',
    component: Setting,
    children: [
      {
        path: 'ring',
        component: Ring,
      },
      {
        path: 'background',
        component: Background,
      },
      {
        path: 'about',
        component: About,
      },
    ],
  },
];

const router = new VueRouter( {
  linkActiveClass: 'custom-active',
  // 缩写，routes: routes,
  routes,
} );

export default router;
