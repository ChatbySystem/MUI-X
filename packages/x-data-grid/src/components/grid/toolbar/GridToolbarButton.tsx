/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridToolbarButtonProps extends ButtonBaseProps {
  color?: 'standard' | 'primary';
  render?: RenderProp<{}>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

// Based on @mui/material/ToggleButton styles
const StyledGridToolbarButton = styled(ButtonBase, {
  name: 'MuiDataGrid',
  slot: 'ToolbarButton',
  overridesResolver: (_, styles) => styles.toolbarButton,
})<{ ownerState: OwnerState; selected?: boolean }>(({ theme }) => ({
  ...theme.typography.button,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  padding: 7,
  minHeight: 34,
  fontSize: theme.typography.pxToRem(13),
  lineHeight: 'normal',
  color: (theme.vars || theme).palette.action.active,
  '&:disabled': {
    color: (theme.vars || theme).palette.action.disabled,
    border: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`,
  },
  '&:hover': {
    textDecoration: 'none',
    // Reset on mouse devices
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
  variants: [
    {
      props: { selected: true, color: 'standard' },
      style: {
        color: (theme.vars || theme).palette.text.primary,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.selectedOpacity})`
          : alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity),
        '&:hover': {
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.text.primaryChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))`
            : alpha(
                theme.palette.text.primary,
                theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
              ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.selectedOpacity})`
              : alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity),
          },
        },
      },
    },
    {
      props: { color: 'primary' },
      style: {
        color: (theme.vars || theme).palette.primary.main,
      },
    },
    {
      props: { selected: true, color: 'primary' },
      style: {
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
          : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:hover': {
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))`
            : alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
              ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})`
              : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
          },
        },
      },
    },
  ],
}));

const DefaultGridToolbarButton = React.forwardRef<HTMLButtonElement, GridToolbarButtonProps>(
  function DefaultGridToolbarButton(props, ref) {
    const { children, className, color = 'standard', ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledGridToolbarButton
        ref={ref}
        ownerState={rootProps}
        className={clsx(classes.root, className)}
        color={color}
        selected={!!other['aria-expanded']}
        focusRipple
        {...other}
      >
        {children}
      </StyledGridToolbarButton>
    );
  },
);

DefaultGridToolbarButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.oneOf(['primary', 'standard']),
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

const GridToolbarButton = React.forwardRef<HTMLButtonElement, GridToolbarButtonProps>(
  function GridToolbarButton(props, ref) {
    const { render, ...other } = props;

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: DefaultGridToolbarButton,
      props: {
        ref,
        ...other,
      },
    });

    return renderElement();
  },
);

GridToolbarButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.oneOf(['primary', 'standard']),
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridToolbarButton };
