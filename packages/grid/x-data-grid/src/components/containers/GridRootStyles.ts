import { CSSInterpolation } from '@mui/system';
import { darken, lighten, alpha, styled } from '@mui/material/styles';
import { gridClasses } from '../../constants/gridClasses';

export const GridRootStyles = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    { [`&.${gridClasses.autoHeight}`]: styles.autoHeight },
    { [`& .${gridClasses.editBooleanCell}`]: styles.editBooleanCell },
    { [`& .${gridClasses['cell--editing']}`]: styles['cell--editing'] },
    { [`& .${gridClasses['cell--textCenter']}`]: styles['cell--textCenter'] },
    { [`& .${gridClasses['cell--textLeft']}`]: styles['cell--textLeft'] },
    { [`& .${gridClasses['cell--textRight']}`]: styles['cell--textRight'] },
    // TODO v6: Remove
    { [`& .${gridClasses['cell--withRenderer']}`]: styles['cell--withRenderer'] },
    { [`& .${gridClasses.cell}`]: styles.cell },
    { [`& .${gridClasses.cellContent}`]: styles.cellContent },
    { [`& .${gridClasses.cellCheckbox}`]: styles.cellCheckbox },
    { [`& .${gridClasses.checkboxInput}`]: styles.checkboxInput },
    { [`& .${gridClasses['columnHeader--alignCenter']}`]: styles['columnHeader--alignCenter'] },
    { [`& .${gridClasses['columnHeader--alignLeft']}`]: styles['columnHeader--alignLeft'] },
    { [`& .${gridClasses['columnHeader--alignRight']}`]: styles['columnHeader--alignRight'] },
    { [`& .${gridClasses['columnHeader--dragging']}`]: styles['columnHeader--dragging'] },
    { [`& .${gridClasses['columnHeader--moving']}`]: styles['columnHeader--moving'] },
    { [`& .${gridClasses['columnHeader--numeric']}`]: styles['columnHeader--numeric'] },
    { [`& .${gridClasses['columnHeader--sortable']}`]: styles['columnHeader--sortable'] },
    { [`& .${gridClasses['columnHeader--sorted']}`]: styles['columnHeader--sorted'] },
    { [`& .${gridClasses.columnHeader}`]: styles.columnHeader },
    { [`& .${gridClasses.columnHeaderCheckbox}`]: styles.columnHeaderCheckbox },
    { [`& .${gridClasses.columnHeaderDraggableContainer}`]: styles.columnHeaderDraggableContainer },
    { [`& .${gridClasses.columnHeaderTitleContainer}`]: styles.columnHeaderTitleContainer },
    { [`& .${gridClasses['columnSeparator--resizable']}`]: styles['columnSeparator--resizable'] },
    { [`& .${gridClasses['columnSeparator--resizing']}`]: styles['columnSeparator--resizing'] },
    { [`& .${gridClasses.columnSeparator}`]: styles.columnSeparator },
    { [`& .${gridClasses.filterIcon}`]: styles.filterIcon },
    { [`& .${gridClasses.iconSeparator}`]: styles.iconSeparator },
    { [`& .${gridClasses.menuIcon}`]: styles.menuIcon },
    { [`& .${gridClasses.menuIconButton}`]: styles.menuIconButton },
    { [`& .${gridClasses.menuOpen}`]: styles.menuOpen },
    { [`& .${gridClasses.menuList}`]: styles.menuList },
    { [`& .${gridClasses['row--editable']}`]: styles['row--editable'] },
    { [`& .${gridClasses['row--editing']}`]: styles['row--editing'] },
    { [`& .${gridClasses['row--dragging']}`]: styles['row--dragging'] },
    { [`& .${gridClasses.row}`]: styles.row },
    { [`& .${gridClasses.rowReorderCellPlaceholder}`]: styles.rowReorderCellPlaceholder },
    { [`& .${gridClasses.rowReorderCell}`]: styles.rowReorderCell },
    { [`& .${gridClasses['rowReorderCell--draggable']}`]: styles['rowReorderCell--draggable'] },
    { [`& .${gridClasses.sortIcon}`]: styles.sortIcon },
    { [`& .${gridClasses.withBorder}`]: styles.withBorder },
    { [`& .${gridClasses.treeDataGroupingCell}`]: styles.treeDataGroupingCell },
    { [`& .${gridClasses.treeDataGroupingCellToggle}`]: styles.treeDataGroupingCellToggle },
    { [`& .${gridClasses.detailPanelToggleCell}`]: styles.detailPanelToggleCell },
    {
      [`& .${gridClasses['detailPanelToggleCell--expanded']}`]:
        styles['detailPanelToggleCell--expanded'],
    },
    styles.root,
  ],
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68);

  const gridStyle: CSSInterpolation = {
    flex: 1,
    boxSizing: 'border-box',
    position: 'relative',
    border: `1px solid ${borderColor}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    ...theme.typography.body2,
    outline: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [`&.${gridClasses.autoHeight}`]: {
      height: 'auto',
      [`& .${gridClasses['row--lastVisible']} .${gridClasses.cell}`]: {
        borderBottomColor: 'transparent',
      },
    },
    [`& .${gridClasses['virtualScrollerContent--overflowed']} .${gridClasses['row--lastVisible']} .${gridClasses.cell}`]:
      {
        borderBottomColor: 'transparent',
      },
    [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
      WebkitTapHighlightColor: 'transparent',
      lineHeight: null,
      padding: '0 10px',
      boxSizing: 'border-box',
    },
    [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
      outline: `solid ${alpha(theme.palette.primary.main, 0.5)} 1px`,
      outlineWidth: 1,
      outlineOffset: -1,
    },
    [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.cell}:focus`]: {
      outline: `solid ${theme.palette.primary.main} 1px`,
    },
    [`& .${gridClasses.columnHeaderCheckbox}, & .${gridClasses.cellCheckbox}`]: {
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    [`& .${gridClasses.columnHeader}`]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    [`& .${gridClasses['columnHeader--sorted']} .${gridClasses.iconButtonContainer}, & .${gridClasses['columnHeader--filtered']} .${gridClasses.iconButtonContainer}`]:
      {
        visibility: 'visible',
        width: 'auto',
      },
    [`& .${gridClasses.columnHeader}:not(.${gridClasses['columnHeader--sorted']}) .${gridClasses.sortIcon}`]:
      {
        opacity: 0,
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
      },
    [`& .${gridClasses.columnHeader}:not(.${gridClasses['columnHeader--sorted']}):hover .${gridClasses.sortIcon}`]:
      {
        opacity: 0.5,
      },
    [`& .${gridClasses.columnHeaderTitleContainer}`]: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    [`& .${gridClasses.columnHeaderTitleContainerContent}`]: {
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    },
    [`& .${gridClasses.sortIcon}, & .${gridClasses.filterIcon}`]: {
      fontSize: 'inherit',
    },
    [`& .${gridClasses['columnHeader--sortable']}`]: {
      cursor: 'pointer',
    },
    [`& .${gridClasses['columnHeader--alignCenter']} .${gridClasses.columnHeaderTitleContainer}`]: {
      justifyContent: 'center',
    },
    [`& .${gridClasses['columnHeader--alignRight']} .${gridClasses.columnHeaderDraggableContainer}, & .${gridClasses['columnHeader--alignRight']} .${gridClasses.columnHeaderTitleContainer}`]:
      {
        flexDirection: 'row-reverse',
      },
    [`& .${gridClasses['columnHeader--alignCenter']} .${gridClasses.menuIcon}, & .${gridClasses['columnHeader--alignRight']} .${gridClasses.menuIcon}`]:
      {
        marginRight: 'auto',
        marginLeft: -6,
      },
    [`& .${gridClasses['columnHeader--alignRight']} .${gridClasses.menuIcon}, & .${gridClasses['columnHeader--alignRight']} .${gridClasses.menuIcon}`]:
      {
        marginRight: 'auto',
        marginLeft: -10,
      },
    [`& .${gridClasses['columnHeader--moving']}`]: {
      backgroundColor: theme.palette.action.hover,
    },
    [`& .${gridClasses.columnSeparator}`]: {
      position: 'absolute',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: borderColor,
    },
    [`& .${gridClasses['columnSeparator--sideLeft']}`]: {
      left: -12,
    },
    [`& .${gridClasses['columnSeparator--sideRight']}`]: {
      right: -12,
    },
    [`& .${gridClasses['columnSeparator--resizable']}`]: {
      cursor: 'col-resize',
      touchAction: 'none',
      '&:hover': {
        color: theme.palette.text.primary,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          color: borderColor,
        },
      },
      [`&.${gridClasses['columnSeparator--resizing']}`]: {
        color: theme.palette.text.primary,
      },
    },
    [`& .${gridClasses.iconSeparator}`]: {
      color: 'inherit',
    },
    [`& .${gridClasses.menuIcon}`]: {
      width: 0,
      visibility: 'hidden',
      fontSize: 20,
      marginRight: -10,
      display: 'flex',
      alignItems: 'center',
    },
    [`& .${gridClasses.columnHeader}:hover`]: {
      [`& .${gridClasses.iconButtonContainer}`]: {
        visibility: 'visible',
        width: 'auto',
      },
      [`& .${gridClasses.menuIcon}`]: {
        width: 'auto',
        visibility: 'visible',
      },
    },
    [`.${gridClasses.menuOpen}`]: {
      visibility: 'visible',
      width: 'auto',
    },
    [`& .${gridClasses.row}`]: {
      display: 'flex',
      width: 'fit-content',
      breakInside: 'avoid', // Avoid the row to be broken in two different print pages.
      '&:hover, &.Mui-hovered': {
        backgroundColor: theme.palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
          ),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity,
            ),
          },
        },
      },
    },
    [`& .${gridClasses.cell}`]: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${borderColor}`,
    },
    [`& .${gridClasses.row}:not(.${gridClasses['row--dynamicHeight']}) > .${gridClasses.cell}`]: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    [`& .${gridClasses.cellContent}`]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    [`& .${gridClasses.cell}.${gridClasses['cell--editing']}`]: {
      padding: 1,
      display: 'flex',
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.background.paper,
      '&:focus-within': {
        outline: `solid ${theme.palette.primary.main} 1px`,
        outlineOffset: '-1px',
      },
    },
    [`& .${gridClasses['row--editing']}`]: {
      boxShadow: theme.shadows[2],
    },
    [`& .${gridClasses['row--editing']} .${gridClasses.cell}`]: {
      boxShadow: theme.shadows[0],
      backgroundColor: theme.palette.background.paper,
    },
    [`& .${gridClasses.editBooleanCell}`]: {
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`& .${gridClasses.booleanCell}[data-value="true"]`]: {
      color: theme.palette.text.secondary,
    },
    [`& .${gridClasses.booleanCell}[data-value="false"]`]: {
      color: theme.palette.text.disabled,
    },
    [`& .${gridClasses.actionsCell}`]: {
      display: 'inline-flex',
      alignItems: 'center',
      gridGap: theme.spacing(1),
    },
    [`& .${gridClasses.rowReorderCell}`]: {
      display: 'inline-flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: theme.palette.action.disabledOpacity,
    },
    [`& .${gridClasses['rowReorderCell--draggable']}`]: {
      cursor: 'move',
      opacity: 1,
    },
    [`& .${gridClasses.rowReorderCellContainer}`]: {
      padding: 0,
      alignItems: 'stretch',
    },
    [`& .${gridClasses.withBorder}`]: {
      borderRight: `1px solid ${borderColor}`,
    },
    [`& .${gridClasses['cell--textLeft']}`]: {
      justifyContent: 'flex-start',
    },
    [`& .${gridClasses['cell--textRight']}`]: {
      justifyContent: 'flex-end',
    },
    [`& .${gridClasses['cell--textCenter']}`]: {
      justifyContent: 'center',
    },
    [`& .${gridClasses.columnHeaderDraggableContainer}`]: {
      display: 'flex',
      width: '100%',
    },
    [`& .${gridClasses.rowReorderCellPlaceholder}`]: {
      display: 'none',
    },
    [`& .${gridClasses['columnHeader--dragging']}, & .${gridClasses['row--dragging']}`]: {
      background: theme.palette.background.paper,
      padding: '0 12px',
      borderRadius: theme.shape.borderRadius,
      opacity: theme.palette.action.disabledOpacity,
    },
    [`& .${gridClasses['row--dragging']}`]: {
      background: theme.palette.background.paper,
      padding: '0 12px',
      borderRadius: theme.shape.borderRadius,
      opacity: theme.palette.action.disabledOpacity,

      [`& .${gridClasses.rowReorderCellPlaceholder}`]: {
        display: 'flex',
      },
    },
    [`& .${gridClasses.treeDataGroupingCell}`]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    [`& .${gridClasses.treeDataGroupingCellToggle}`]: {
      flex: '0 0 28px',
      alignSelf: 'stretch',
      marginRight: theme.spacing(2),
    },
    [`& .${gridClasses.groupingCriteriaCell}`]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    [`& .${gridClasses.groupingCriteriaCellToggle}`]: {
      flex: '0 0 28px',
      alignSelf: 'stretch',
      marginRight: theme.spacing(2),
    },
  };

  return gridStyle;
});
