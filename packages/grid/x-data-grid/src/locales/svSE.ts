import { svSE as svSECore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const svSEGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Inga rader',
  noResultsOverlayLabel: 'Inga resultat funna.',
  errorOverlayDefaultLabel: 'Ett fel uppstod.',

  // Density selector toolbar button text
  toolbarDensity: 'Densitet',
  toolbarDensityLabel: 'Densitet',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Bekväm',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolumner',
  toolbarColumnsLabel: 'Välj kolumner',

  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Visa filter',
  toolbarFiltersTooltipHide: 'Dölj filter',
  toolbarFiltersTooltipShow: 'Visa filter',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiva filter` : `${count} aktivt filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Sök…',
  toolbarQuickFilterLabel: 'Sök',
  toolbarQuickFilterDeleteIconLabel: 'Rensa',

  // Export selector toolbar button text
  toolbarExport: 'Exportera',
  toolbarExportLabel: 'Exportera',
  toolbarExportCSV: 'Ladda ner som CSV',
  toolbarExportPrint: 'Skriv ut',
  toolbarExportExcel: 'Ladda ner som Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Hitta kolumn',
  columnsPanelTextFieldPlaceholder: 'Kolumntitel',
  columnsPanelDragIconLabel: 'Ordna om kolumnen',
  columnsPanelShowAllButton: 'Visa alla',
  columnsPanelHideAllButton: 'Dölj alla',

  // Filter panel text
  filterPanelAddFilter: 'Lägg till filter',
  filterPanelDeleteIconLabel: 'Ta bort',
  filterPanelLinkOperator: 'Logisk operatör',
  filterPanelOperator: 'Operatör',
  filterPanelOperatorAnd: 'Och',
  filterPanelOperatorOr: 'Eller',
  filterPanelColumns: 'Kolumner',
  filterPanelInputLabel: 'Värde',
  filterPanelInputPlaceholder: 'Filtervärde',

  // Filter operators text
  filterOperatorContains: 'innehåller',
  filterOperatorEquals: 'är lika med',
  filterOperatorStartsWith: 'börjar med',
  filterOperatorEndsWith: 'slutar med',
  filterOperatorIs: 'är',
  filterOperatorNot: 'är inte',
  filterOperatorAfter: 'är efter',
  filterOperatorOnOrAfter: 'är på eller efter',
  filterOperatorBefore: 'är innan',
  filterOperatorOnOrBefore: 'är på eller innan',
  filterOperatorIsEmpty: 'är tom',
  filterOperatorIsNotEmpty: 'är inte tom',
  filterOperatorIsAnyOf: 'är någon av',

  // Filter values text
  filterValueAny: 'något',
  filterValueTrue: 'sant',
  filterValueFalse: 'falskt',

  // Column menu text
  columnMenuLabel: 'Meny',
  columnMenuShowColumns: 'Visa kolumner',
  columnMenuFilter: 'Filtrera',
  columnMenuHideColumn: 'Dölj',
  columnMenuUnsort: 'Osortera',
  columnMenuSortAsc: 'Sortera stigande',
  columnMenuSortDesc: 'Sortera fallande',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiva filter` : `${count} aktivt filter`,
  columnHeaderFiltersLabel: 'Visa filter',
  columnHeaderSortIconLabel: 'Sortera',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rader markerade`
      : `${count.toLocaleString()} rad markerad`,

  // Total row amount footer text
  footerTotalRows: 'Totalt antal rader:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Markering med kryssruta',
  checkboxSelectionSelectAllRows: 'Markera alla rader',
  checkboxSelectionUnselectAllRows: 'Avmarkera alla rader',
  checkboxSelectionSelectRow: 'Markera rad',
  checkboxSelectionUnselectRow: 'Avmarkera rad',

  // Boolean cell text
  booleanCellTrueLabel: 'ja',
  booleanCellFalseLabel: 'nej',

  // Actions cell more text
  actionsCellMore: 'mer',

  // Column pinning text
  pinToLeft: 'Fäst till vänster',
  pinToRight: 'Fäst till höger',
  unpin: 'Ta bort fäste',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupp',
  treeDataExpand: 'visa underordnade',
  treeDataCollapse: 'dölj underordnade',

  // Grouping columns
  groupingColumnHeaderName: 'Grupp',
  groupColumn: (name) => `Gruppera efter ${name}`,
  unGroupColumn: (name) => `Sluta gruppera efter ${name}`,

  // Master/detail
  // detailPanelToggle: 'Detail panel toggle',
  expandDetailPanel: 'Expandera',
  collapseDetailPanel: 'Kollapsa',

  // Row reordering text
  rowReorderingHeaderName: 'Ordna om rader',

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export const svSE: Localization = getGridLocalization(svSEGrid, svSECore);
