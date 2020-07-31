import * as React from 'react';
import { PaginationProps } from './usePagination';
import {
  ComponentParams,
  ApiRef,
  GridComponentOverridesProp,
  GridOptions,
  RootContainerRef,
  InternalColumns,
  Rows,
} from '../../models';
import { LoadingOverlay, NoRowMessage } from '../../components';
import { ErrorMessage } from '../../components/error-message';

export const useComponents = (
  columns: InternalColumns,
  rows: Rows,
  options: GridOptions,
  componentOverrides: GridComponentOverridesProp | undefined,
  paginationProps: PaginationProps,
  apiRef: ApiRef,
  gridRootRef: RootContainerRef,
) => {
  const componentParams: ComponentParams = React.useMemo(
    () => ({
      paginationProps,
      rows,
      columns: columns.visible,
      options,
      api: apiRef,
      rootElement: gridRootRef,
    }),
    [paginationProps, rows, columns, options, apiRef, gridRootRef],
  );

  const headerComponent = React.useMemo(
    () =>
      componentOverrides?.header
        ? React.createElement(componentOverrides.header, componentParams)
        : null,
    [componentOverrides, componentParams],
  );
  const footerComponent = React.useMemo(
    () =>
      componentOverrides?.footer
        ? React.createElement(componentOverrides.footer, componentParams)
        : null,
    [componentOverrides, componentParams],
  );

  const loadingComponent = React.useMemo(
    () =>
      componentOverrides?.loadingOverlay ? (
        React.createElement(componentOverrides.loadingOverlay, componentParams)
      ) : (
        <LoadingOverlay />
      ),
    [componentOverrides, componentParams],
  );
  const noRowsComponent = React.useMemo(
    () =>
      componentOverrides?.noRowsOverlay ? (
        React.createElement(componentOverrides.noRowsOverlay, componentParams)
      ) : (
        <NoRowMessage />
      ),
    [componentOverrides, componentParams],
  );

  const paginationComponent = React.useMemo(
    () =>
      componentOverrides?.pagination
        ? React.createElement(componentOverrides.pagination, componentParams)
        : null,
    [componentOverrides, componentParams],
  );

  const renderError = React.useCallback((props) => {
    return componentOverrides?.errorOverlay ? (
      React.createElement(componentOverrides.errorOverlay, { ...componentParams, ...props })
    ) : (
      <ErrorMessage {...{ ...componentParams, ...props }} />
    );
  }, []);

  return {
    headerComponent,
    footerComponent,
    loadingComponent,
    noRowsComponent,
    paginationComponent,
    renderError,
  };
};
