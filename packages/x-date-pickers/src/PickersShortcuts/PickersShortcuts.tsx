import * as React from 'react';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import { VIEW_HEIGHT } from '../internals/constants/dimensions';

interface PickersShortcutsItemGetValueParams<TValue> {
  isValid: (value: TValue) => boolean;
}

export interface PickersShortcutsItem<TValue> {
  label: string;
  getValue: (params: PickersShortcutsItemGetValueParams<TValue>) => TValue;
}

export interface PickersShortcutsProps<TValue> extends Omit<ListProps, 'onChange'> {
  /**
   * Ordered array of shortcuts to display.
   * If empty, does not display the shortcuts.
   * @default `[]`
   */
  items?: PickersShortcutsItem<TValue>[];
  isLandscape: boolean;
  onChange: (newValue: TValue) => void;
  isValid: (value: TValue) => boolean;
}

export function PickersShortcuts<TValue>(props: PickersShortcutsProps<TValue>) {
  const { items, isLandscape, onChange, isValid, ...other } = props;

  if (items == null || items.length === 0) {
    return null;
  }

  const itemsAttributs = items.map((item) => {
    const newValue = item.getValue({ isValid });

    return {
      label: item.label,
      onClick: () => {
        onChange(newValue);
      },
      disabled: !isValid(newValue),
    };
  });

  return (
    <List
      dense
      sx={[
        { maxHeight: VIEW_HEIGHT, overflow: 'auto' },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
      {...other}
    >
      {itemsAttributs.map((item) => {
        return (
          <ListItem key={item.label}>
            <Chip {...item} />
          </ListItem>
        );
      })}
    </List>
  );
}
