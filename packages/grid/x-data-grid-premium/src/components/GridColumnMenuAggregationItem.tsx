import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { unstable_useId as useId } from '@mui/utils';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  canColumnHaveAggregationFunction,
  getAggregationFunctionLabel,
  getAvailableAggregationFunctions,
} from '../hooks/features/aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { GridAggregationModel } from '../hooks/features/aggregation/gridAggregationInterfaces';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 1.5, 1, 1.5),
}));

function GridColumnMenuAggregationItemRoot(props: GridColumnMenuItemProps) {
  const { colDef } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const id = useId();
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

  const availableAggregationFunctions = React.useMemo(
    () =>
      getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef,
      }),
    [colDef, rootProps.aggregationFunctions],
  );

  const selectedAggregationRule = React.useMemo(() => {
    if (!colDef || !aggregationModel[colDef.field]) {
      return '';
    }

    const aggregationFunctionName = aggregationModel[colDef.field];
    if (
      canColumnHaveAggregationFunction({
        colDef,
        aggregationFunctionName,
        aggregationFunction: rootProps.aggregationFunctions[aggregationFunctionName],
      })
    ) {
      return aggregationFunctionName;
    }

    return '';
  }, [rootProps.aggregationFunctions, aggregationModel, colDef]);

  const handleAggregationItemChange = (event: SelectChangeEvent<string | undefined>) => {
    const newAggregationItem = event.target?.value || undefined;
    const currentModel = gridAggregationModelSelector(apiRef);
    const { [colDef.field]: columnItem, ...otherColumnItems } = currentModel;
    const newModel: GridAggregationModel =
      newAggregationItem == null
        ? otherColumnItems
        : { ...otherColumnItems, [colDef?.field]: newAggregationItem };

    apiRef.current.setAggregationModel(newModel);
  };

  const label = apiRef.current.getLocaleText('aggregationMenuItemHeader');

  return (
    <FormControl size="small" fullWidth sx={{ minWidth: 150 }}>
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
}

GridColumnMenuAggregationItemRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

function GridColumnMenuAggregationItem(props: GridColumnMenuItemProps) {
  return (
    <StyledStack>
      <GridColumnMenuAggregationItemRoot {...props} />
    </StyledStack>
  );
}

GridColumnMenuAggregationItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuAggregationItem };

function GridColumnMenuAggregationItemSimple(props: GridColumnMenuItemProps) {
  return (
    <MenuItem disableRipple>
      <GridColumnMenuAggregationItemRoot {...props} />
    </MenuItem>
  );
}

GridColumnMenuAggregationItemSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuAggregationItemSimple };
