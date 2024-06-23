import dayjs from 'dayjs';
import 'dayjs/locale/ja'; // 일본어 로케일을 불러옴

dayjs.locale('ja'); // 로케일을 일본어로 설정

const formatJapanTime = (date: dayjs.ConfigType) => {
  return dayjs(date).format('YYYY年M月D日 HH時mm分');
};

const day = {
  formatJapanTime,
};

export default day;
