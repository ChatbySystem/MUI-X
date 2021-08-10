import * as React from 'react';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useEnhancedEffect } from '../../utils/material-ui-utils';
import { GridEditMode } from '../../models/gridEditRowModel';

const renderSingleSelectOptions = (option) =>
  typeof option === 'object' ? (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ) : (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  );

interface GridEditSingleSelectCellProps extends GridCellParams {
  editMode?: GridEditMode;
}

export function GridEditSingleSelectCell(props: GridEditSingleSelectCellProps & SelectProps) {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    colDef,
    cellMode,
    isEditable,
    tabIndex,
    className,
    getValue,
    hasFocus,
    editMode,
    ...other
  } = props;

  const ref = React.useRef<any>();
  const [open, setOpen] = React.useState(editMode === 'cell');

  const handleChange = (event) => {
    setOpen(false);
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    if (!event.key && editMode === 'cell') {
      api.commitCellChange({ id, field }, event);
      api.setCellMode(id, field, 'view');
    }
  };

  const handleClose = (event, reason) => {
    if (editMode === 'row') {
      setOpen(false);
      return;
    }
    if (reason === 'backdropClick' || isEscapeKey(event.key)) {
      api.setCellMode(id, field, 'view');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEnhancedEffect(() => {
    if (hasFocus) {
      // TODO v5: replace with inputRef.current.focus()
      // See https://github.com/mui-org/material-ui/issues/21441
      ref.current.querySelector('[role="button"]').focus();
    }
  }, [hasFocus]);

  return (
    <Select
      ref={ref}
      value={value}
      onChange={handleChange}
      open={open}
      onOpen={handleOpen}
      MenuProps={{
        onClose: handleClose,
      }}
      fullWidth
      {...other}
    >
      {colDef.valueOptions?.map(renderSingleSelectOptions)}
    </Select>
  );
}
export const renderEditSingleSelectCell = (params) => <GridEditSingleSelectCell {...params} />;
