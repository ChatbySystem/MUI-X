import * as React from 'react';
import { unstable_useId as useId, unstable_useForkRef as useForkRef } from '@mui/utils';
import MenuList from '@mui/material/MenuList';
import { ButtonProps } from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { GridDensity } from '../../models/gridDensity';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridDensityOption } from '../../models/api/gridDensityApi';
import { GridMenu, GridMenuProps } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';

export const GridToolbarDensitySelector = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function GridToolbarDensitySelector(props, ref) {
    const { onClick, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const densityValue = useGridSelector(apiRef, gridDensityValueSelector);
    const densityButtonId = useId();
    const densityMenuId = useId();

    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);

    const densityOptions: GridDensityOption[] = [
      {
        icon: <rootProps.components.DensityCompactIcon />,
        label: apiRef.current.getLocaleText('toolbarDensityCompact'),
        value: 'compact',
      },
      {
        icon: <rootProps.components.DensityStandardIcon />,
        label: apiRef.current.getLocaleText('toolbarDensityStandard'),
        value: 'standard',
      },
      {
        icon: <rootProps.components.DensityComfortableIcon />,
        label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
        value: 'comfortable',
      },
    ];

    const startIcon = React.useMemo<React.ReactElement>(() => {
      switch (densityValue) {
        case 'compact':
          return <rootProps.components.DensityCompactIcon />;
        case 'comfortable':
          return <rootProps.components.DensityComfortableIcon />;
        default:
          return <rootProps.components.DensityStandardIcon />;
      }
    }, [densityValue, rootProps]);

    const handleDensitySelectorOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen((prevOpen) => !prevOpen);
      onClick?.(event);
    };
    const handleDensitySelectorClickAway: GridMenuProps['onClickAway'] = (event) => {
      if (
        buttonRef.current === event.target ||
        // if user clicked on the icon
        buttonRef.current?.contains(event.target as Element)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleDensityUpdate = (newDensity: GridDensity) => {
      apiRef.current.setDensity(newDensity);
      setOpen(false);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (isTabKey(event.key)) {
        event.preventDefault();
      }
      if (isHideMenuKey(event.key)) {
        setOpen(false);
      }
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableDensitySelector) {
      return null;
    }

    const densityElements = densityOptions.map<React.ReactElement>((option, index) => (
      <MenuItem
        key={index}
        onClick={() => handleDensityUpdate(option.value)}
        selected={option.value === densityValue}
      >
        <ListItemIcon>{option.icon}</ListItemIcon>
        {option.label}
      </MenuItem>
    ));

    return (
      <React.Fragment>
        <rootProps.components.BaseButton
          ref={handleRef}
          size="small"
          startIcon={startIcon}
          aria-label={apiRef.current.getLocaleText('toolbarDensityLabel')}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          aria-controls={densityMenuId}
          id={densityButtonId}
          {...other}
          onClick={handleDensitySelectorOpen}
          {...rootProps.componentsProps?.baseButton}
        >
          {apiRef.current.getLocaleText('toolbarDensity')}
        </rootProps.components.BaseButton>
        <GridMenu
          open={open}
          target={buttonRef.current}
          onClickAway={handleDensitySelectorClickAway}
          position="bottom-start"
        >
          <MenuList
            id={densityMenuId}
            className={gridClasses.menuList}
            aria-labelledby={densityButtonId}
            onKeyDown={handleListKeyDown}
            autoFocusItem={open}
          >
            {densityElements}
          </MenuList>
        </GridMenu>
      </React.Fragment>
    );
  },
);
