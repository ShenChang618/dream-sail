function switchExecDate( date, sum ) {
  let result = [];

  result = date.split( '-' );

  switch ( sum || getSwitchId( date ) ) {
    case 4: {
      result.pop();
      result = `${result[ 0 ]}年${result[ 1 ]}月${result[ 2 ]}日`;

      break;
    }
    case 5: {
      result.shift();
      result.pop();
      result = `${result[ 0 ]}月${result[ 1 ]}日`;

      break;
    }
    case 6: {
      result = `星期${result[ 3 ]}`;

      break;
    }
    case 7: {
      result = `${result[ 2 ]}号`;

      break;
    }
    case 8: {
      result = `${result[ 1 ]}月`;

      break;
    }
    case 10: {
      result = '每天';

      break;
    }
  }

  return result;
};

function switchExecDateArray( value ) {
  const sum = getSwitchId( value[ 0 ] );

  switch ( sum ) {
    case 4: {
      return value.map( ( item, index ) => {
        return switchExecDate( item, sum );
      } );
    }
    case 5: {
      return value.map( ( item, index ) => {
        return `每年（ ${switchExecDate( item, sum )} ）`;
      } );
    }
    case 6: {
      return value.map( ( item, index ) => {
        return `每周（ ${switchExecDate( item, sum )} ）`;
      } );
    }
    case 7: {
      return value.map( ( item, index ) => {
        return `每月（ ${switchExecDate( item, sum )} ）`;
      } );
    }
    case 8: {
      return value.map( ( item, index ) => {
        return `每年（ ${switchExecDate( item, sum )} ）`;
      } );
    }
    case 10: {
      return null;
    }
  }
}

function getSwitchId( date ) {
  let sum = 0;

  date.split( '-' ).forEach( function ( item, index ) {
    if ( item === '*' ) {
      sum += index + 1;
    }
  } );

  return sum;
}

export { switchExecDate, getSwitchId, switchExecDateArray };
