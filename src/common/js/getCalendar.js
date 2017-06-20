const monthCount = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const weekday = [ '日', '一', '二', '三', '四', '五', '六' ];

// 获取数据数组
// 第二个参数是判断是否需要溢出数据
function getData( date, isOverflow ) {
  const monthFirstDay = getMonthFirstDayPos( date );
  let result = new Array( monthFirstDay );

  for ( let i = 1; i <= getMonthDayCount( date ); i++ ) {
    result.push( i );
  }

  const lastlineStartPos = result.length % weekday.length;
  const diffPos = weekday.length - lastlineStartPos;

  if ( typeof isOverflow === 'boolean' && isOverflow ) {
    // 一周七天

    if ( monthFirstDay !== 0 ) {
      let prevMonthCount = getMonthDayCount( `${getYear( date )}-${getPrevMonth( date ) + 1}` );

      for ( let i = monthFirstDay - 1; i >= 0; i--, prevMonthCount-- ) {
        result[ i ] = prevMonthCount;
      }
    }

    if ( lastlineStartPos !== 0 ) {
      for ( let i = 1; i <= diffPos; i++ ) {
        result.push( i );
      }
    }
  } else {
    Array.prototype.splice.apply( result, [ result.length, 0 ].concat( new Array( diffPos ) ) );
  }

  return result;
}

// 得到数据的二位数组排列
// isWeekday 为 true，在数组栈顶加上周期的显示
function getDataArray( date, isWeekday, isOverflow ) {
  const data = getData( date, isOverflow );
  const resultLength = data.length / weekday.length;
  let cache = 0;
  let result = [];

  for ( let i = 0; i < resultLength; i++, cache += weekday.length ) {
    result.push( data.slice( cache, cache + weekday.length ) );
  }

  if ( typeof isWeekday === 'boolean' && isWeekday ) {
    result.unshift( weekday );
  }

  return result;
}

// 获取每月的第一个日期
function getMonthFirstDayPos( date ) {
  return ( new Date( getYear( date ), getMonth( date ) ) ).getDay();
}

// 获取月份，注意返回的月份为传入月份的前一个月或后一个月，因为它们月份从 0 开始
// return ( date ? ( new Date( date ) ).getMonth() : ( new Date() ).getMonth() ) + 1;
function getMonth( date ) {
  return date ? ( new Date( date ) ).getMonth() : ( new Date() ).getMonth();
}
// 获取上一个月份
function getPrevMonth( date ) {
  const month = getMonth( date ) - 1;

  return month === -1 ? 11 : month;
}
function getPrevMonthData( date ) {
  let dataValue = {
    year: getYear( date ),
    day: getDate( date ),
  };

  dataValue.month = getPrevMonth( date ) + 1;

  if ( dataValue.month === 12 ) {
    dataValue.year = dataValue.year - 1;
  }

  return dataValue;
}
// 获取下一个月份
function getNextMonth( date ) {
  const month = getMonth( date ) + 1;

  return month === 12 ? 0 : month;
}
function getNextMonthData( date ) {
  let dataValue = {
    year: getYear( date ),
    day: getDate( date ),
  };

  dataValue.month = getNextMonth( date ) + 1;

  if ( dataValue.month === 1 ) {
    dataValue.year = dataValue.year + 1;
  }

  return dataValue;
}

// 获取年份
function getYear( date ) {
  return date ? ( new Date( date ) ).getFullYear() : ( new Date() ).getFullYear();
}

// 获取天
function getDate( date ) {
  return date ? ( new Date( date ) ).getDate() : ( new Date() ).getDate();
}

// 获取月份数量
function getMonthDayCount( date ) {
  let monthCountValue = monthCount;

  monthCountValue[ 1 ] = isLeapYear( getYear( date ) ) ? 29 : 28;

  return monthCountValue[ getMonth( date ) ];
}

// 判断闰年
function isLeapYear( year ) {
  return year % 4 === 0 && ( year % 100 !== 0 || year % 400 === 0 );
}

export {
  getData,
  getDataArray,
  getMonthFirstDayPos,
  getMonth,
  getYear,
  getMonthDayCount,
  isLeapYear,
  getPrevMonth,
  getPrevMonthData,
  getNextMonth,
  getNextMonthData,
};
