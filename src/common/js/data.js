import formatDate from './date.js';

const highlightRegExp = /<li.*class="(?:visible )?highlight"[^>]*>([\d]*)<\/li>/;
const selectedRegExp = /<li[^>]*class="[^>]*selected[^>]*"[^>]*>(<a[^<]*<\/a>)/;
const execDateRegExp = /((?:[^"]*-){3}[^"]*)/g;
const styleRegExp = /style="[^"]*"/g;
const weekday = [ '日', '一', '二', '三', '四', '五', '六' ];
const today = formatDate( new Date(), 'yyyy-MM-dd' );
const tempDate = new Date();
const todayDate = new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() );
const taskTimeFlag = {
  TASK_TIME_FLAG_NORMAL: 0,
  TASK_TIME_FLAG_UNCERTAIN_TIME: 1,
  TASK_TIME_FLAG_UNLIMITED_TIME: 2,
};
const database = {
  DB_TASK_NAME: 'db_task',
  DB_HISTORY_NAME: 'db_history',
  DB_STAR_NAME: 'db_star',
  DB_OBJECT_STORE_TASK: 'task',
  DB_OBJECT_STORE_HISTORY: 'history',
  DB_OBJECT_STORE_STAR: 'star',
};
const objectStoreOpt = {
  keyPath: 'id',
  autoIncrement: true,
};
const taskIndexOpt = [
  {
    name: 'title',
    keyPath: 'title',
    option: {
      unique: false,
    },
  },
  // 查找当天执行，同一个任务可能会有多个日期，需要通过 unique 设置为 key 来显示
  {
    name: 'execDate',
    keyPath: 'execDate',
    option: {
      unique: false,
      // 如果是数组，设置为 true，数组的每个值都为索引
      multiEntry: true,
    },
  },
  {
    name: 'classify',
    keyPath: 'classify',
    option: {
      unique: false,
    },
  },
  {
    name: 'taskTime',
    keyPath: 'taskTime',
    option: {
      unique: false,
    },
  },
];
const historyIndexOpt = [
  {
    name: 'type',
    keyPath: 'type',
    option: {
      unique: false,
    },
  },
  {
    name: 'date',
    keyPath: 'date',
    option: {
      unique: false,
    },
  },
];
const starIndexOpt = [
  {
    name: 'title',
    keyPath: 'title',
    option: {
      unique: false,
    },
  },
  {
    name: 'gold',
    keyPath: 'gold',
    option: {
      unique: false,
    },
  },
];

const classifyToDisplay = {
  language: '语言',
  examination: '职业',
  computer: '计算机',
  profession: '考试',
  design: '设计',
  life: '生活',
  other: '其它',
};

export {
  highlightRegExp,
  selectedRegExp,
  styleRegExp,
  execDateRegExp,
  weekday,
  today,
  todayDate,
  taskTimeFlag,
  database,
  objectStoreOpt,
  taskIndexOpt,
  starIndexOpt,
  classifyToDisplay,
  historyIndexOpt,
};
