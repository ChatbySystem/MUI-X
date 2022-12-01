import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { useGridColumnMenuComponents } from '../../../../hooks/features/columnMenu/useGridColumnMenuComponents';
import { GridColumnMenuContainer } from '../GridColumnMenuContainer';
import { GridColumnMenuProps, GridGenericColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItem } from './GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './GridColumnMenuFilterItem';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuSortItem } from './GridColumnMenuSortItem';

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS = {
  ColumnMenuSortItem: GridColumnMenuSortItem,
  ColumnMenuFilterItem: GridColumnMenuFilterItem,
  ColumnMenuHideItem: GridColumnMenuHideItem,
  ColumnMenuColumnsItem: GridColumnMenuColumnsItem,
};

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS = {
  columnMenuSortItem: { displayOrder: 0 },
  columnMenuFilterItem: { displayOrder: 10 },
  columnMenuHideItem: { displayOrder: 20 },
  columnMenuColumnsItem: { displayOrder: 30 },
};

const StyledDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
}));

const GridGenericColumnMenuDefault = React.forwardRef<HTMLUListElement, GridGenericColumnMenuProps>(
  function GridColumnMenuDefault(props, ref) {
    const { defaultComponents, defaultComponentsProps, components, componentsProps, ...other } =
      props;

    const orderedComponents = useGridColumnMenuComponents({
      ...other,
      defaultComponents,
      defaultComponentsProps,
      components,
      componentsProps,
    });

    return (
      <GridColumnMenuContainer ref={ref} {...other}>
        {orderedComponents.map(([Component, extraProps], index: number) => (
          <div key={index}>
            <StyledDiv>
              <Component onClick={props.hideMenu} colDef={props.colDef} {...extraProps} />
            </StyledDiv>
            {index !== orderedComponents.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </GridColumnMenuContainer>
    );
  },
);

const GridColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuDefault(props, ref) {
    return (
      <GridGenericColumnMenuDefault
        {...props}
        ref={ref}
        defaultComponents={GRID_COLUMN_MENU_DEFAULT_COMPONENTS}
        defaultComponentsProps={GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS}
      />
    );
  },
);

GridColumnMenuDefault.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  /**
   * `components` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `componentsProps`
   * or it will be placed in the end of the list
   */
  components: PropTypes.object,
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  componentsProps: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuDefault, GridGenericColumnMenuDefault };
