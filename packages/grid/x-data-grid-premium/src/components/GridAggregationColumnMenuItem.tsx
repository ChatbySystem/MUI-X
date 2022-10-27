import * as React from 'react';
import { GridColDef, useGridSelector } from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { unstable_useId as useId } from '@mui/material/utils';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  canColumnHaveAggregationFunction,
  getAggregationFunctionLabel,
} from '../hooks/features/aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { GridAggregationModel } from '../hooks/features/aggregation/gridAggregationInterfaces';

interface GridAggregationColumnMenuItemsProps {
  column: GridColDef;
  label: string;
  availableAggregationFunctions: string[];
  condensed?: boolean;
}

export const GridAggregationColumnMenuItem = (props: GridAggregationColumnMenuItemsProps) => {
  const { column, label, availableAggregationFunctions, condensed } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const id = useId();
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

  const selectedAggregationRule = React.useMemo(() => {
    if (!column || !aggregationModel[column.field]) {
      return '';
    }

    const aggregationFunctionName = aggregationModel[column.field];
    if (
      canColumnHaveAggregationFunction({
        column,
        aggregationFunctionName,
        aggregationFunction: rootProps.aggregationFunctions[aggregationFunctionName],
      })
    ) {
      return aggregationFunctionName;
    }

    return '';
  }, [rootProps.aggregationFunctions, aggregationModel, column]);

  const handleAggregationItemChange = (event: SelectChangeEvent<string | undefined>) => {
    const newAggregationItem = event.target?.value || undefined;
    const currentModel = gridAggregationModelSelector(apiRef);
    const { [column.field]: columnItem, ...otherColumnItems } = currentModel;
    const newModel: GridAggregationModel =
      newAggregationItem == null
        ? otherColumnItems
        : { ...otherColumnItems, [column.field]: newAggregationItem };

    apiRef.current.setAggregationModel(newModel);
    if (!condensed) {
      apiRef.current.hideColumnMenu();
    }
  };

  const renderFormControl = () => (
    <FormControl variant="standard" size="small" fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={`${id}-input`}
        value={selectedAggregationRule}
        label={label}
        color="primary"
        onChange={handleAggregationItemChange}
        onBlur={(e) => e.stopPropagation()}
        fullWidth
      >
        <MenuItem value="">...</MenuItem>
        {availableAggregationFunctions.map((aggFunc) => (
          <MenuItem key={aggFunc} value={aggFunc}>
            {getAggregationFunctionLabel({
              apiRef,
              aggregationRule: {
                aggregationFunctionName: aggFunc,
                aggregationFunction: rootProps.aggregationFunctions[aggFunc],
              },
            })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  if (condensed) {
    return (
      <Stack px={1.5} py={1}>
        {renderFormControl()}
      </Stack>
    );
  }

  return <MenuItem disableRipple>{renderFormControl()}</MenuItem>;
};
