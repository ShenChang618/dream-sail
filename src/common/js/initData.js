import Database from './indexedDB.js';
import storage from './localStorage.js';
import { weekday, today, taskTimeFlag, database, objectStoreOpt, taskIndexOpt, todayDate, historyIndexOpt, starIndexOpt } from './data.js';
// import minuteToHour from './minuteToHour.js';

const dateObj = new Date();
// 第二次运行会报错，是数据库版本错误，没事不用管它
const dbTask = new Database( {
  name: database.DB_TASK_NAME,
  objectStore: database.DB_OBJECT_STORE_TASK,
} );
const dbHistory = new Database( {
  name: database.DB_HISTORY_NAME,
  objectStore: database.DB_OBJECT_STORE_HISTORY,
} );
const dbStar = new Database( {
  name: database.DB_STAR_NAME,
  objectStore: database.DB_OBJECT_STORE_STAR,
} );

// 初始化数据库
dbTask.init( objectStoreOpt, taskIndexOpt );
dbHistory.init( objectStoreOpt, historyIndexOpt );
dbStar.init( objectStoreOpt, starIndexOpt );

// 初始化本地数据
if ( storage.get( 'todayGold' ) === null ) {
  storage.set( 'todayGold', 0 );
  storage.set( 'totalGold', 0 );
  storage.set( 'cacheTime', +todayDate );
  storage.set( 'background', 'default' );
  storage.set( 'shock', 'true' );
  storage.set( 'update', 'true' );
  storage.set( 'audio', 'Everyday.mp3' );
  storage.set( 'taskTime', { '10': 10, '25': 25, '30': 30, '45': 45, '60': 60, '120': 120 } );
}

// const taskTimeStorage = storage.get( storageName );
// const taskTimeFirstKey = Object.keys( taskTimeStorage )[ 0 ];

const initOrderTask = {
  execDate: {
    display: '一次性（ 今天 ）',
    value: `${today}-*`,
    flag: false,
    list: null,
    active: 'disposable',
  },
  taskTime: {
    display: '5分钟',
    value: 5,
    active: 5,
    flag: taskTimeFlag.TASK_TIME_FLAG_NORMAL,
  },
  execCount: {
    display: '1次',
    value: 1,
    active: 1,
  },
  execTime: {
    display: '5分钟',
    value: 5,
  },
  restTime: {
    display: '1分钟',
    value: 1,
  },
  dreamGold: {
    display: '5金币',
    value: 5,
  },
};

const initExecDate = {
  disposable: {
    display: '一次性（ 今天 ）',
    value: `${today}-*`,
    // value: [
    //   'aaa',
    //   'bbb',
    // ],
  },
  everyDay: {
    display: '每天',
    value: '*-*-*-*',
  },
  weekly: {
    display: `每周（ 星期${weekday[ dateObj.getDay() ]} ）`,
    value: `*-*-*-周${weekday[ dateObj.getDay() ]}`,
  },
  monthly: {
    display: `每月（ ${dateObj.getDate()}日 ）`,
    value: `*-*-${dateObj.getDate()}-*`,
  },
  yearly: {
    display: `每年（ ${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ）`,
    value: `*-${dateObj.getMonth() + 1}-${dateObj.getDate()}-*`,
  },
};

export { initExecDate, initOrderTask };
