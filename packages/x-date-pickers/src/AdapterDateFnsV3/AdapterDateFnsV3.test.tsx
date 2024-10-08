import { describeGregorianAdapter } from 'test/utils/pickers/describeGregorianAdapter';
import { fr } from 'date-fns-v3/locale';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

vi.mock('date-fns/addSeconds', () => import('date-fns-v3/addSeconds'));
vi.mock('date-fns/addMinutes', () => import('date-fns-v3/addMinutes'));
vi.mock('date-fns/addHours', () => import('date-fns-v3/addHours'));
vi.mock('date-fns/addDays', () => import('date-fns-v3/addDays'));
vi.mock('date-fns/addWeeks', () => import('date-fns-v3/addWeeks'));
vi.mock('date-fns/addMonths', () => import('date-fns-v3/addMonths'));
vi.mock('date-fns/addYears', () => import('date-fns-v3/addYears'));
vi.mock('date-fns/endOfDay', () => import('date-fns-v3/endOfDay'));
vi.mock('date-fns/endOfWeek', () => import('date-fns-v3/endOfWeek'));
vi.mock('date-fns/endOfYear', () => import('date-fns-v3/endOfYear'));
vi.mock('date-fns/format', () => import('date-fns-v3/format'));
vi.mock('date-fns/getHours', () => import('date-fns-v3/getHours'));
vi.mock('date-fns/getSeconds', () => import('date-fns-v3/getSeconds'));
vi.mock('date-fns/getMilliseconds', () => import('date-fns-v3/getMilliseconds'));
vi.mock('date-fns/getWeek', () => import('date-fns-v3/getWeek'));
vi.mock('date-fns/getYear', () => import('date-fns-v3/getYear'));
vi.mock('date-fns/getMonth', () => import('date-fns-v3/getMonth'));
vi.mock('date-fns/getDate', () => import('date-fns-v3/getDate'));
vi.mock('date-fns/getDaysInMonth', () => import('date-fns-v3/getDaysInMonth'));
vi.mock('date-fns/getMinutes', () => import('date-fns-v3/getMinutes'));
vi.mock('date-fns/isAfter', () => import('date-fns-v3/isAfter'));
vi.mock('date-fns/isBefore', () => import('date-fns-v3/isBefore'));
vi.mock('date-fns/isEqual', () => import('date-fns-v3/isEqual'));
vi.mock('date-fns/isSameDay', () => import('date-fns-v3/isSameDay'));
vi.mock('date-fns/isSameYear', () => import('date-fns-v3/isSameYear'));
vi.mock('date-fns/isSameMonth', () => import('date-fns-v3/isSameMonth'));
vi.mock('date-fns/isSameHour', () => import('date-fns-v3/isSameHour'));
vi.mock('date-fns/isValid', () => import('date-fns-v3/isValid'));
vi.mock('date-fns/parse', () => import('date-fns-v3/parse'));
vi.mock('date-fns/setDate', () => import('date-fns-v3/setDate'));
vi.mock('date-fns/setHours', () => import('date-fns-v3/setHours'));
vi.mock('date-fns/setMinutes', () => import('date-fns-v3/setMinutes'));
vi.mock('date-fns/setMonth', () => import('date-fns-v3/setMonth'));
vi.mock('date-fns/setSeconds', () => import('date-fns-v3/setSeconds'));
vi.mock('date-fns/setMilliseconds', () => import('date-fns-v3/setMilliseconds'));
vi.mock('date-fns/setYear', () => import('date-fns-v3/setYear'));
vi.mock('date-fns/startOfDay', () => import('date-fns-v3/startOfDay'));
vi.mock('date-fns/startOfMonth', () => import('date-fns-v3/startOfMonth'));
vi.mock('date-fns/endOfMonth', () => import('date-fns-v3/endOfMonth'));
vi.mock('date-fns/startOfWeek', () => import('date-fns-v3/startOfWeek'));
vi.mock('date-fns/startOfYear', () => import('date-fns-v3/startOfYear'));
vi.mock('date-fns/isWithinInterval', () => import('date-fns-v3/isWithinInterval'));
vi.mock('date-fns/locale/en-US', () => import('date-fns-v3/locale/en-US'));

describe('<AdapterDateFnsV3 />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });
});
