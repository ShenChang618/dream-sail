import mui from 'mui';
import './mui.picker.all.js';
import { actionSheetH5 } from './actionSheet.js';
import { highlightRegExp, styleRegExp, weekday, today } from './data.js';

// 自定义日期函数
const customDate = {
  disposable() {
    let endDate = today.split( '-' );

    endDate[ 0 ] = +endDate[ 0 ] + 10;
    endDate = endDate.join( '-' );

    const dtPicker = new mui.DtPicker( {
      type: 'date',
      beginDate: new Date( today ),
      endDate: new Date( endDate ),
    } );
    const h3 = document.createElement( 'h3' );

    // 给组件加上日期标题
    h3.className = 'dtpicker-description';
    mui( '.mui-dtpicker-header' )[ 0 ].appendChild( h3 );

    const muiPickerDom = Array.prototype.slice.call( mui( '.mui-picker' ), 0, 3 );
    let dateArray = [];

    // 监听日期变化
    muiPickerDom.forEach( ( value, index ) => {
      value.addEventListener( 'change', ( event ) => {
        const e = event.target;
        const zeroRegExp = /^0/;
        let date = highlightRegExp.exec( e.innerHTML );

        if ( date ) {
          date = date && date[ 1 ];
          date = date.replace( zeroRegExp, '' );
          dateArray[ index ] = date;

          const [ y, m, d ] = dateArray;

          if ( y && m && d ) {
            // 月份从 0 开始，所以都需要减 1
            date = new Date( y, m - 1, d );

            const text = `${y}年${m}月${d}日 周${weekday[ date.getDay() ]}`;

            mui( '.dtpicker-description' )[ 0 ].innerHTML = text;
          }
        }
      } );
    } );

    // 确定
    dtPicker.show( ( selectItems ) => {
      const zeroRegExp = /-0/g;
      const date = this.date;
      const execDate = this.execDate;
      let dateValue = selectItems.value.replace( zeroRegExp, '-' );
      const dateObj = new Date( dateValue );
      const value = `${dateValue}-*`;
      dateValue = dateValue === today ? '今天' : dateValue;
      dateValue = `一次性（ ${dateValue} ）`;

      if ( execDate.flag ) {
        isFlagTrue( date.disposable, execDate, value, dateValue );

        return;
      }

      // 关联其它数据
      execDate.value = date.disposable.value = value;
      execDate.display = date.disposable.display = dateValue;
      date.weekly.display = `每周（ 星期${weekday[ dateObj.getDay() ]} ）`;
      date.weekly.value = `*-*-*-${weekday[ dateObj.getDay() ]}`;
      date.monthly.display = `每月（ ${dateObj.getDate()}日 ）`;
      date.monthly.value = `*-*-${dateObj.getDate()}-*`;
      date.yearly.display = `每年（ ${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ）`;
      date.yearly.value = `*-${dateObj.getMonth() + 1}-${dateObj.getDate()}-*`;
    } );

    // 释放组件
    mui( '.mui-dtpicker-header' ).on( 'tap', '.mui-btn', () => {
      dtPicker && dtPicker.dispose();
    } );
    mui( '.mui-backdrop' )[ 0 ] && mui( '.mui-backdrop' )[ 0 ].addEventListener( 'tap', () => {
      dtPicker && dtPicker.dispose();
    } );
  },
  everyDay: () => {},
  weekly( plus ) {
    this.list = [];
    weekday.forEach( value => this.list.push( {
      display: `每周（ 星期${value} ）`,
      value: `*-*-*-${value}`,
    } ) );

    _actionSheet( this.date.weekly, this.execDate );
  },
  monthly( plus ) {
    this.list = [];

    for ( let i = 1; i <= 31; i++ ) {
      this.list.push( {
        display: `每月（ ${i}日 ）`,
        value: `*-*-${i}-*`,
      } );
    }

    _actionSheet( this.date.monthly, this.execDate );
  },
  yearly( plus ) {
    let temp = null;

    if ( !this.execDate.flag ) {
      temp = this.date.disposable.value;
    }

    // if ( this.execDate.flag ) {
    //   mui.alert( '此选项只在 <strong style="color: red;">单选</strong> 开关下有效！', '警告', () => {
    //     this.execDate.flag = false;
    //
    //     const dom = mui( '#execDateSwitch' )[ 0 ];
    //     let html = dom.innerHTML;
    //
    //     dom.innerHTML = html.replace( styleRegExp, '' );
    //   } );
    //
    //   return;
    // }

    this.list = [];
    temp = temp && temp.split( '-' )[ 2 ];

    for ( let i = 1; i <= 12; i++ ) {
      this.list.push( {
        display: temp ? `每年（ ${i}月${temp}日 ）` : `每年（ ${i}月 ）`,
        value: temp ? `*-${i}-${temp}-*` : `*-${i}-*-*`,
      } );
    }

    _actionSheet( this.date.yearly, this.execDate );
  },
};

function _actionSheet( date, execDate ) {
  actionSheetH5( '#actionSheet', ( event ) => {
    const e = event.target;
    const html = e.innerHTML;

    if ( html.indexOf( '取消' ) !== -1 ) {
      execDate.display = date.display;
      execDate.value = date.value;

      return;
    }

    if ( execDate.flag ) {
      isFlagTrue( date, execDate, e.dataset.value, html );

      return;
    }
    execDate.display = date.display = html;
    execDate.value = date.value = e.dataset.value;
  } );
};

function isFlagTrue( date, execDate, value, display ) {
  if ( Object.prototype.toString.call( date.value ) !== '[object Array]' ) {
    date.value = [];
    date.display = '';
    execDate.value = '';
  }

  const obj = {
    value: value,
    display: display,
  };

  const flag = date.value.some( function ( item, index ) {
    if ( item ) {
      return item.display === obj.display;
    }
  } );

  if ( !flag ) {
    date.value.push( obj );
    date.display += `,${display}`;
    if ( date.display[ 0 ] === ',' ) {
      date.display = date.display.substr( 1 );
    }
    execDate.display = date.display;
    date.value = date.value.filter( value => value !== undefined && value !== null );
    execDate.value = JSON.stringify( date.value );
    onSlideLeft( date, execDate );
  }
}

function onSlideLeft( date, execDate ) {
  const btnArray = [ '确认', '取消' ];

  // 第二个demo，向左拖拽后显示操作图标，释放后自动触发的业务逻辑
  setTimeout( () => {
    mui( '#orderAddDelete' ).off( 'slideleft' );
    mui( '#orderAddDelete' ).on( 'slideleft', '.mui-table-view-cell', ( event ) => {
      const elem = event.target;

      mui.confirm( '确认删除该条日期？', '执行日期', btnArray, ( e ) => {
        if ( e.index === 0 && JSON.parse( execDate.value ).length > 1 ) {
          let text = mui( '.order-add-delete .mui-selected .order-add-input' )[ 0 ].innerHTML;
          const id = elem.dataset.id;
          const regExp = new RegExp( text, 'g' );
          let temp = date.display;

          temp = temp.replace( regExp, '' );
          temp = temp.replace( /,,/g, ',' );
          temp = temp.replace( /(^,)|(,$)/g, '' );
          execDate.display = date.display = temp;
          // 直接删除不能更新视图
          date.value.splice( id, 1, null );
          temp = date.value.filter( value => value !== undefined && value !== null );
          execDate.value = JSON.stringify( temp );

          // 删除后出现自动向左滑动 BUG
          removeSlideBUG( mui( '.order-add-delete .mui-selected' )[ 0 ], 'mui-selected' );
        } else {
          setTimeout( function () {
            mui.swipeoutClose( elem );
          }, 0 );
        }
      }, 'div' );
    } );
  }, 500 );
}

function removeSlideBUG( domValue, classValue ) {
  setTimeout( () => {
    try {
      const dom = domValue;
      let html = dom.innerHTML;
      let className = dom.className;

      className = className.replace( classValue, '' );
      html = html.replace( classValue, '' );
      html = html.replace( styleRegExp, '' );
      dom.className = className;
      dom.innerHTML = html;
    } catch ( e ) {}
  }, 200 );
}

export { customDate, onSlideLeft, removeSlideBUG };
