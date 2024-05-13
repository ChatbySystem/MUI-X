import type { GridColumnGroup, GridCsvExportOptions, GridRowId } from '../../../../models';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../../colDef';
import type { GridCellParams } from '../../../../models/params/gridCellParams';
import type { GridStateColDef } from '../../../../models/colDef/gridColDef';
import type { GridApiCommunity } from '../../../../models/api/gridApiCommunity';
import { buildWarning } from '../../../../utils/warning';

function sanitizeCellValue(value: any, csvOptions: CSVOptions) {
  if (typeof value === 'string') {
    if (csvOptions.shouldAppendQuotes) {
      const escapedValue = value.replace(/"/g, '""');
      // Make sure value containing delimiter or line break won't be split into multiple rows
      if ([csvOptions.delimiter, '\n', '\r', '"'].some((delimiter) => value.includes(delimiter))) {
        return `"${escapedValue}"`;
      }
      return escapedValue;
    }

    return value;
  }

  return value;
}

export const serializeCellValue = (
  cellParams: GridCellParams,
  options: {
    csvOptions: CSVOptions;
    ignoreValueFormatter: boolean;
  },
) => {
  const { csvOptions, ignoreValueFormatter } = options;
  let value: any;
  if (ignoreValueFormatter) {
    const columnType = cellParams.colDef.type;
    if (columnType === 'number') {
      value = String(cellParams.value);
    } else if (columnType === 'date' || columnType === 'dateTime') {
      value = (cellParams.value as Date)?.toISOString();
    } else if (typeof cellParams.value?.toString === 'function') {
      value = cellParams.value.toString();
    } else {
      value = cellParams.value;
    }
  } else {
    value = cellParams.formattedValue;
  }

  return sanitizeCellValue(value, csvOptions);
};

const objectFormattedValueWarning = buildWarning([
  'MUI X: When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.',
  'You can provide a `valueFormatter` with a string representation to be used.',
]);

type CSVOptions = Required<Pick<GridCsvExportOptions, 'delimiter' | 'shouldAppendQuotes'>>;

type CSVRowOptions = {
  sanitizeCellValue?: (value: any, csvOptions: CSVOptions) => any;
  csvOptions: CSVOptions;
};
class CSVRow {
  options: CSVRowOptions;

  rowString = '';

  isEmpty = true;

  constructor(options: CSVRowOptions) {
    this.options = options;
  }

  addValue(value: string) {
    if (!this.isEmpty) {
      this.rowString += this.options.csvOptions.delimiter;
    }
    if (value === null || value === undefined) {
      this.rowString += '';
    } else if (typeof this.options.sanitizeCellValue === 'function') {
      this.rowString += this.options.sanitizeCellValue(value, this.options.csvOptions);
    } else {
      this.rowString += value;
    }
    this.isEmpty = false;
  }

  getRowString() {
    return this.rowString;
  }
}

const serializeRow = ({
  id,
  columns,
  getCellParams,
  csvOptions,
  ignoreValueFormatter,
}: {
  id: GridRowId;
  columns: GridStateColDef[];
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  csvOptions: CSVOptions;
  ignoreValueFormatter: boolean;
}) => {
  const row = new CSVRow({ csvOptions });

  columns.forEach((column) => {
    const cellParams = getCellParams(id, column.field);
    if (process.env.NODE_ENV !== 'production') {
      if (String(cellParams.formattedValue) === '[object Object]') {
        objectFormattedValueWarning();
      }
    }
    row.addValue(
      serializeCellValue(cellParams, {
        ignoreValueFormatter,
        csvOptions,
      }),
    );
  });

  return row.getRowString();
};

interface BuildCSVOptions {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  csvOptions: Required<
    Pick<
      GridCsvExportOptions,
      'delimiter' | 'includeColumnGroupsHeaders' | 'includeHeaders' | 'shouldAppendQuotes'
    >
  >;
  ignoreValueFormatter: boolean;
  apiRef: React.MutableRefObject<GridApiCommunity>;
}

export function buildCSV(options: BuildCSVOptions): string {
  const { columns, rowIds, csvOptions, ignoreValueFormatter, apiRef } = options;

  const CSVBody = rowIds
    .reduce<string>(
      (acc, id) =>
        `${acc}${serializeRow({
          id,
          columns,
          getCellParams: apiRef.current.getCellParams,
          ignoreValueFormatter,
          csvOptions,
        })}\r\n`,
      '',
    )
    .trim();

  if (!csvOptions.includeHeaders) {
    return CSVBody;
  }

  const filteredColumns = columns.filter(
    (column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field,
  );

  const headerRows: CSVRow[] = [];

  if (csvOptions.includeColumnGroupsHeaders) {
    const columnGroupLookup = apiRef.current.getAllGroupDetails();

    let maxColumnGroupsDepth = 0;
    const columnGroupPathsLookup = filteredColumns.reduce<
      Record<GridStateColDef['field'], GridColumnGroup['groupId'][]>
    >((acc, column) => {
      const columnGroupPath = apiRef.current.getColumnGroupPath(column.field);
      acc[column.field] = columnGroupPath;
      maxColumnGroupsDepth = Math.max(maxColumnGroupsDepth, columnGroupPath.length);
      return acc;
    }, {});

    for (let i = 0; i < maxColumnGroupsDepth; i += 1) {
      const headerGroupRow = new CSVRow({
        csvOptions,
        sanitizeCellValue,
      });
      headerRows.push(headerGroupRow);
      filteredColumns.forEach((column) => {
        const columnGroupId = (columnGroupPathsLookup[column.field] || [])[i];
        const columnGroup = columnGroupLookup[columnGroupId];
        headerGroupRow.addValue(columnGroup ? columnGroup.headerName || columnGroup.groupId : '');
      });
    }
  }

  const mainHeaderRow = new CSVRow({
    csvOptions,
    sanitizeCellValue,
  });
  filteredColumns.forEach((column) => {
    mainHeaderRow.addValue(column.headerName || column.field);
  });
  headerRows.push(mainHeaderRow);

  const CSVHead = `${headerRows.map((row) => row.getRowString()).join('\r\n')}\r\n`;

  return `${CSVHead}${CSVBody}`.trim();
}
