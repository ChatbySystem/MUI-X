import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterItem } from '../../../models/gridFilterItem';
import type { GridApiCommon } from '../../../models/api/gridApiCommon';
import type { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export type GridFilterInputValueProps<Api extends GridApiCommon = GridApiCommunity> = {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: React.MutableRefObject<Api>;
  focusElementRef?: React.Ref<any>;
  dateType: 'date' | 'time' | 'dateTime';
} & Pick<TextFieldProps, 'color' | 'error' | 'helperText' | 'size' | 'variant'>;
