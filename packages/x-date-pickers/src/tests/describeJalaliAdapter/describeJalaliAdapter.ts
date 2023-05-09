import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { DescribeJalaliAdapterParams } from './describeJalaliAdapter.types';
import { TEST_DATE_ISO } from '../describeGregorianAdapter';

function innerJalaliDescribeAdapter<TDate>(
  Adapter: new (...args: any) => MuiPickersAdapter<TDate>,
  params: DescribeJalaliAdapterParams,
) {
  const adapter = new Adapter({ locale: params.locale });

  describe(adapter.lib, () => {
    const testSuitParams = {
      ...params,
      adapter,
      testDate: adapter.date(TEST_DATE_ISO),
    };

    if (params.before) {
      before(params.before);
    }

    if (params.after) {
      after(params.after);
    }

    testCalculations(testSuitParams);
    testLocalization(testSuitParams);
  });
}

export const describeJalaliAdapter = createDescribe('Adapter methods', innerJalaliDescribeAdapter);
