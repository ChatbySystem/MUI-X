import { isNumber } from '../../utils/utils';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type PropValidator<TProps> = (props: TProps) => string | undefined;

export const propValidatorsDataGrid: PropValidator<DataGridProcessedProps>[] = [
  (props) =>
    (props.autoPageSize &&
      props.autoHeight &&
      [
        'MUI X: `<DataGrid autoPageSize={true} autoHeight={true} />` are not valid props.',
        'You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.',
        '',
        'Please remove one of these two props.',
      ].join('\n')) ||
    undefined,
  (props) =>
    (props.paginationMode === 'client' &&
      isNumber(props.rowCount) &&
      'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect. `rowCount` is only meant to be used with `paginationMode="server"`.') ||
    undefined,
];

const warnedOnceMap = new Set();
const warnOnce = (message: string) => {
  if (!warnedOnceMap.has(message)) {
    console.error(message);
    warnedOnceMap.add(message);
  }
};

export const validateProps = <TProps>(props: TProps, validators: PropValidator<TProps>[]) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  validators.forEach((validator) => {
    const warning = validator(props);
    if (warning) {
      warnOnce(warning);
    }
  });
};
