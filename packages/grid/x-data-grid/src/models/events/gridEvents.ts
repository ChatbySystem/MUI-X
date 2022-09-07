import { GridEventLookup } from './gridEventLookup';

enum GridEvents {
  resize = 'resize',
  debouncedResize = 'debouncedResize',
  viewportInnerSizeChange = 'viewportInnerSizeChange',
  componentError = 'componentError',
  unmount = 'unmount',
  cellModeChange = 'cellModeChange',
  cellClick = 'cellClick',
  cellDoubleClick = 'cellDoubleClick',
  cellMouseDown = 'cellMouseDown',
  cellMouseUp = 'cellMouseUp',
  cellKeyDown = 'cellKeyDown',
  cellFocusIn = 'cellFocusIn',
  cellFocusOut = 'cellFocusOut',
  cellDragEnter = 'cellDragEnter',
  cellDragOver = 'cellDragOver',
  editCellPropsChange = 'editCellPropsChange',
  cellEditCommit = 'cellEditCommit',
  cellEditStart = 'cellEditStart',
  cellEditStop = 'cellEditStop',
  cellModesModelChange = 'cellModesModelChange',
  rowModesModelChange = 'rowModesModelChange',
  rowEditStart = 'rowEditStart',
  rowEditStop = 'rowEditStop',
  rowEditCommit = 'rowEditCommit',
  cellNavigationKeyDown = 'cellNavigationKeyDown',
  rowClick = 'rowClick',
  rowDoubleClick = 'rowDoubleClick',
  rowMouseEnter = 'rowMouseEnter',
  rowMouseLeave = 'rowMouseLeave',
  editRowsModelChange = 'editRowsModelChange',
  rowDragStart = 'rowDragStart',
  rowDragOver = 'rowDragOver',
  rowDragEnd = 'rowDragEnd',
  columnHeaderBlur = 'columnHeaderBlur',
  columnHeaderFocus = 'columnHeaderFocus',
  columnHeaderNavigationKeyDown = 'columnHeaderNavigationKeyDown',
  columnHeaderKeyDown = 'columnHeaderKeyDown',
  columnHeaderClick = 'columnHeaderClick',
  columnHeaderDoubleClick = 'columnHeaderDoubleClick',
  columnHeaderOver = 'columnHeaderOver',
  columnHeaderOut = 'columnHeaderOut',
  columnHeaderEnter = 'columnHeaderEnter',
  columnHeaderLeave = 'columnHeaderLeave',
  columnHeaderDragStart = 'columnHeaderDragStart',
  columnHeaderDragOver = 'columnHeaderDragOver',
  columnHeaderDragEnter = 'columnHeaderDragEnter',
  columnHeaderDragEnd = 'columnHeaderDragEnd',
  selectionChange = 'selectionChange',
  headerSelectionCheckboxChange = 'headerSelectionCheckboxChange',
  rowSelectionCheckboxChange = 'rowSelectionCheckboxChange',
  pageChange = 'pageChange',
  pageSizeChange = 'pageSizeChange',
  rowGroupingModelChange = 'rowGroupingModelChange',
  aggregationModelChange = 'aggregationModelChange',
  rowsScroll = 'rowsScroll',
  rowsScrollEnd = 'rowsScrollEnd',
  columnSeparatorMouseDown = 'columnSeparatorMouseDown',
  columnResize = 'columnResize',
  columnWidthChange = 'columnWidthChange',
  columnResizeStart = 'columnResizeStart',
  columnResizeStop = 'columnResizeStop',
  columnOrderChange = 'columnOrderChange',
  rowOrderChange = 'rowOrderChange',
  rowsSet = 'rowsSet',
  rowExpansionChange = 'rowExpansionChange',
  sortedRowsSet = 'sortedRowsSet',
  filteredRowsSet = 'filteredRowsSet',
  columnsChange = 'columnsChange',
  detailPanelsExpandedRowIdsChange = 'detailPanelsExpandedRowIdsChange',
  pinnedColumnsChange = 'pinnedColumnsChange',
  activeStrategyProcessorChange = 'activeStrategyProcessorChange',
  strategyAvailabilityChange = 'strategyAvailabilityChange',
  sortModelChange = 'sortModelChange',
  filterModelChange = 'filterModelChange',
  columnVisibilityModelChange = 'columnVisibilityModelChange',
  stateChange = 'stateChange',
  columnVisibilityChange = 'columnVisibilityChange',
  virtualScrollerContentSizeChange = 'virtualScrollerContentSizeChange',
  virtualScrollerWheel = 'virtualScrollerWheel',
  virtualScrollerTouchMove = 'virtualScrollerTouchMove',
  preferencePanelClose = 'preferencePanelClose',
  preferencePanelOpen = 'preferencePanelOpen',
  menuOpen = 'menuOpen',
  menuClose = 'menuClose',
  renderedRowsIntervalChange = 'renderedRowsIntervalChange',
  fetchRows = 'fetchRows',
}

export type GridEventsStr = keyof GridEventLookup;

export { GridEvents };
