import {
  getDataArray,
  getMonth,
  getYear,
  getPrevMonthData,
  getNextMonthData,
} from './getCalendar.js';
import { todayDate } from './data.js';

const [ TR, TD, TH, THEAD, TBODY, TABLE ] = [ '<tr>*</tr>', '<td>*</td>', '<th>*</th>', '<thead>*</thead>', '<tbody>*</tbody>', '<table class="calendar">*</table>' ];
const replaceRegExp = /\*/;
const replaceTdRegExp = /<td>/;

// 获取 HTML 数据
function getHTMLData( date ) {
  const resultData = getDataArray( date, true, true );
  const weekdayData = resultData.shift();
  const length = weekdayData.length;
  const middleValue = parseInt( resultData.length * length / 2, 10 );
  let weekday = '';
  let body = '';
  let html = TABLE;

  html = html.replace( replaceRegExp, THEAD + TBODY );
  weekdayData.forEach( ( item, index ) => {
    weekday += TH.replace( replaceRegExp, item );
  } );
  html = html.replace( replaceRegExp, TR );
  html = html.replace( replaceRegExp, weekday );

  resultData.forEach( ( item, index ) => {
    let tempTd = '';

    body += TR;
    for ( let i = 0; i < length; i++ ) {
      let dataValue = {
        year: getYear( date ),
        month: getMonth( date ) + 1,
        day: item[ i ],
        weekday: weekdayData[ i ],
      };
      let value = item[ i ];

      // 第一行，说明有上个月的日期
      if ( index === 0 ) {
        if ( value > middleValue ) {
          value = `<span class="special">${value}</span>`;

          const result = getPrevMonthData( date );

          dataValue.year = result.year;
          dataValue.month = result.month;
        }

      // 最后一行，说明有下个月的日期
      } else if ( index === resultData.length - 1 ) {
        if ( value < middleValue ) {
          value = `<span class="special">${value}</span>`;

          const result = getNextMonthData( date );

          dataValue.year = result.year;
          dataValue.month = result.month;
        }
      }

      // 今天的日子需要加亮
      if ( value === getHighlight() ) {
        value = `<strong class="highlight">${value}</strong>`;
      }

      let text = `<td data-value=${JSON.stringify( dataValue )}>`;

      text = text.replace( /"/g, "'" );
      if ( resultData.length === 6 ) {
        text = text.replace( />/g, ' style="line-height:33.333333px;">' );
      }

      tempTd += TD.replace( replaceRegExp, value );
      // 直接在 td 标签上加上 data-value 数据，以便之后获取
      tempTd = tempTd.replace( replaceTdRegExp, text );
    }
    body = body.replace( replaceRegExp, tempTd );
  } );

  html = html.replace( replaceRegExp, body );

  return html;
}

// 判断是否今天需要高亮
function getHighlight( date ) {
  const today = new Date();

  if ( getYear( date ) === getYear( today ) && getMonth( date ) === getMonth( today ) ) {
    return today.getDate();
  }

  return null;
}

function tapEvent( fn ) {
  let prevDOM = null;

  setTimeout( () => {
    const dom = document.querySelector( '.calendar tbody' );

    dom.removeEventListener( 'tap', event );
    dom.addEventListener( 'tap', event );
  }, 200 );

  function event( event ) {
    const e = event.target;
    const value = JSON.parse( e.dataset.value.replace( /'/g, '"' ) );

//      this.innerHTML = this.innerHTML.replace( /class="tap-highlight"/g, '' );
//      this.childNodes.forEach( ( item, index ) => {
//        item.childNodes.forEach( ( value ) => {
//          value.className = '';
//        } );
//      } );
    try {
      prevDOM.className = '';
    } catch ( e ) {}
    e.className = 'tap-highlight';
    prevDOM = e;

    fn && fn.call( this, value, e );
  }
}

class Calendar {
  constructor( dom ) {
    this.dom = dom;
  }

  init( date, fn ) {
    // 初始化
    this.render( date, fn );
    this._disabled();
  }

  _disabled() {
    const date = this.date;

    if ( getYear( date ) === getYear( todayDate ) && getMonth( date ) === getMonth( todayDate ) ) {
      const td = this.dom.querySelectorAll( 'td' );

      for ( let i = 0; i < td.length; i++ ) {
        // console.log( td[ i ].innerHTML );
        if ( td[ i ].innerHTML.indexOf( '</strong>' ) !== -1 ) {
          return;
        }

        td[ i ].className = 'disabled';
      }
    }
  }

  prev( fn ) {
    const result = getPrevMonthData( this.date );

    fn && fn( result );
    this.render( `${result.year}-${result.month}` );
    this._disabled();
  }

  next( fn ) {
    const result = getNextMonthData( this.date );

    fn && fn( result );
    this.render( `${result.year}-${result.month}` );
  }

  today() {
    this.render( new Date() );
    this._disabled();
  }

  render( date, fn ) {
    this.date = date || this.date;
    this.fn = fn || this.fn;
    this.dom.innerHTML = getHTMLData( this.date );
    tapEvent( this.fn );
  }
}

export default Calendar;
