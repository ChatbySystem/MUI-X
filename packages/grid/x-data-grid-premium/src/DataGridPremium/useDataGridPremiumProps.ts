import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DATA_GRID_PRO_PROPS_DEFAULT_VALUES, GRID_DEFAULT_LOCALE_TEXT } from '@mui/x-data-grid-pro';
import { uncapitalizeObjectKeys } from '@mui/x-data-grid-pro/internals';
import {
  DataGridPremiumProps,
  DataGridPremiumProcessedProps,
  DataGridPremiumPropsWithDefaultValue,
} from '../models/dataGridPremiumProps';
import { UncapitalizedGridPremiumSlotsComponent } from '../models';
import { GRID_AGGREGATION_FUNCTIONS } from '../hooks/features/aggregation';
import { DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS } from '../constants/dataGridPremiumDefaultSlotsComponents';

/**
 * The default values of `DataGridPremiumPropsWithDefaultValue` to inject in the props of DataGridPremium.
 */
export const DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES: DataGridPremiumPropsWithDefaultValue = {
  ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  unstable_cellSelection: false,
  disableAggregation: false,
  disableRowGrouping: false,
  rowGroupingColumnMode: 'single',
  aggregationFunctions: GRID_AGGREGATION_FUNCTIONS,
  aggregationRowsScope: 'filtered',
  getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
};

export const useDataGridPremiumProps = (inProps: DataGridPremiumProps) => {
  const { componentsProps, ...themedProps } = useThemeProps({
    props: inProps,
    name: 'MuiDataGrid',
  });

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<UncapitalizedGridPremiumSlotsComponent>(() => {
    const uncapitalizedDefaultSlots = uncapitalizeObjectKeys(
      DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS,
    )!;
    const overrides =
      themedProps.slots ?? themedProps.components
        ? uncapitalizeObjectKeys(themedProps.components)
        : null;

    if (!overrides) {
      return { ...uncapitalizedDefaultSlots };
    }

    type GridSlot = keyof UncapitalizedGridPremiumSlotsComponent;
    return Object.entries(uncapitalizedDefaultSlots).reduce((acc, [key, defaultComponent]) => {
      const override = overrides[key as GridSlot];
      const component = override !== undefined ? override : defaultComponent;
      return { ...acc, [key as GridSlot]: component };
    }, {} as UncapitalizedGridPremiumSlotsComponent);
  }, [themedProps.components, themedProps.slots]);

  return React.useMemo<DataGridPremiumProcessedProps>(
    () => ({
      ...DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES,
      ...themedProps,
      slotProps: themedProps.slotProps ?? componentsProps,
      localeText,
      slots,
      signature: 'DataGridPremium',
    }),
    [themedProps, componentsProps, localeText, slots],
  );
};
