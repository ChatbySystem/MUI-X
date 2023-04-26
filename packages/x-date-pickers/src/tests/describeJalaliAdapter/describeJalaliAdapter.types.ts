import { MuiPickersAdapter } from '@mui/x-date-pickers/models';

export interface DescribeJalaliAdapterParams {
  // TODO: Type once the adapter locale is correctly types
  locale: any;
  before?: () => void;
  after?: () => void;
}

export type DescribeJalaliAdapterTestSuite = <TDate>(params: {
  adapter: MuiPickersAdapter<TDate>;
  testDate: TDate;
}) => void;
