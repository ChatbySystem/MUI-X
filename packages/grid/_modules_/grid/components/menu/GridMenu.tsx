import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';

type MenuPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top'
  | undefined;

export interface MenuProps extends Omit<PopperProps, 'onKeyDown'> {
  open: boolean;
  target: React.ReactNode;
  onKeyDown: (event: React.KeyboardEvent<HTMLUListElement>) => void;
  onClickAway: (event: React.MouseEvent<Document, MouseEvent>) => void;
  position?: MenuPosition;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

export const GridMenu: React.FC<MenuProps> = ({
  open,
  target,
  onKeyDown,
  onClickAway,
  children,
  position,
  ...other
}) => {
  const menuListRef = React.useRef<HTMLUListElement | null>(null);
  const focusTimeout = React.useRef<any>();

  React.useEffect(() => {
    focusTimeout.current = setTimeout(() => {
      if (open && menuListRef.current && target) {
        const firstItem = menuListRef.current.querySelector('li:first-child');
        if (firstItem) {
          (firstItem as HTMLLIElement).focus();
        } else {
          menuListRef.current.focus();
        }
      }
    }, 0);
  }, [target, open, menuListRef]);

  React.useEffect(() => {
    return () => {
      clearTimeout(focusTimeout.current);
    };
  }, []);

  return (
    <Popper open={open} anchorEl={target as any} transition placement={position} {...other}>
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: transformOrigin[placement] }}>
          <Paper>
            <ClickAwayListener onClickAway={onClickAway}>
              <MenuList ref={menuListRef} id="menu-list-grow" onKeyDown={onKeyDown}>
                {children}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
