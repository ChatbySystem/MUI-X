import * as React from 'react';
import { GridFooterProps } from '../../components/GridFooter';
import { ErrorOverlayProps } from '../../components/ErrorOverlay';
import { GridColumnHeaderMenuItemsProps } from '../../components/menu/columnMenu/GridColumnHeaderMenuItems';
import { ApiRef } from '../../models/api/apiRef';
import { ApiRefComponentsProperty } from '../../models/api/componentsApi';
import { DEFAULT_SLOTS_COMPONENTS, GridSlotsComponent } from '../../models/gridSlotsComponent';
import { BaseComponentProps } from '../../models/params/baseComponentProps';
import { RootContainerRef } from '../../models/rootContainerRef';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleColumnsSelector } from './columns/columnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedRowModelsSelector } from './rows/rowsSelector';

function EmptyComponent() {
  return null;
}

export const useComponents = (
  componentsProp: GridSlotsComponent | undefined,
  apiRef: ApiRef,
  gridRootRef: RootContainerRef,
) => {
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleColumnsSelector);
  const [state] = useGridState(apiRef!);

  const baseComponentProps: BaseComponentProps = React.useMemo(
    () => ({
      state,
      rows,
      columns,
      options,
      api: apiRef,
      rootElement: gridRootRef,
    }),
    [state, rows, columns, options, apiRef, gridRootRef],
  );

  const components: ApiRefComponentsProperty = React.useMemo(() => {
    const allComponents = { ...DEFAULT_SLOTS_COMPONENTS, ...componentsProp };

    const wrapWithBaseProps: <TProps>(
      Component: React.ElementType<TProps> | undefined | null,
    ) => React.ElementType<TProps> = <TProps extends {}>(Component) => {
      if (Component == null) {
        return EmptyComponent;
      }
      const ComponentWithBase: React.ElementType<TProps> = (props: TProps) => {
        const propsWithBase = { ...baseComponentProps, ...props };
        return <Component {...propsWithBase} />;
      };

      return ComponentWithBase;
    };

    return {
      ColumnFilteredIcon: allComponents.ColumnFilteredIcon || EmptyComponent,
      ColumnMenuIcon: allComponents.ColumnMenuIcon || EmptyComponent,
      ColumnResizeIcon: allComponents.ColumnResizeIcon || EmptyComponent,
      ColumnSelectorIcon: allComponents.ColumnSelectorIcon || EmptyComponent,
      ColumnSortedAscendingIcon: allComponents.ColumnSortedAscendingIcon || EmptyComponent,
      ColumnSortedDescendingIcon: allComponents.ColumnSortedDescendingIcon || EmptyComponent,
      DensityComfortableIcon: allComponents.DensityComfortableIcon || EmptyComponent,
      DensityCompactIcon: allComponents.DensityCompactIcon || EmptyComponent,
      DensityStandardIcon: allComponents.DensityStandardIcon || EmptyComponent,
      OpenFilterButtonIcon: allComponents.DensityStandardIcon || EmptyComponent,
      ColumnMenu: wrapWithBaseProps<GridColumnHeaderMenuItemsProps & BaseComponentProps>(
        allComponents.ColumnMenu,
      ),
      ErrorOverlay: wrapWithBaseProps<ErrorOverlayProps & BaseComponentProps>(
        allComponents.ErrorOverlay,
      ),
      Footer: wrapWithBaseProps<GridFooterProps & BaseComponentProps>(allComponents.Footer),
      Header: wrapWithBaseProps<BaseComponentProps>(allComponents.Header),
      LoadingOverlay: wrapWithBaseProps<BaseComponentProps>(allComponents.LoadingOverlay),
      NoRowsOverlay: wrapWithBaseProps<BaseComponentProps>(allComponents.NoRowsOverlay),
      Pagination: wrapWithBaseProps<BaseComponentProps>(allComponents.Pagination),
    };
  }, [baseComponentProps, componentsProp]);

  React.useEffect(() => {
    if (apiRef && apiRef.current) {
      apiRef.current.components = components;
    }
  }, [apiRef, components]);

  return components;
};
