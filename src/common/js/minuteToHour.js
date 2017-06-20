export default function minuteToHour( time, flag ) {
  const minute = time % 60;
  let hour = time / 60;

  hour = parseInt( hour, 10 );
  if ( flag === true ) {
    return { hour, minute };
  }

  if ( time < 60 ) {
    return `${time}分钟`;
  }

  return minute === 0 ? `${hour}小时` : `${hour}小时${minute}分钟`;
};
