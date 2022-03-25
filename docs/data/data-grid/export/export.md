---
title: Data Grid - Export
---

# Data Grid - Export

<p class="description">Easily export the rows in various file formats such as CSV, Excel, or PDF.</p>

## Enabling export

### Default Toolbar

To enable the export menu, pass the `GridToolbar` component in the `Toolbar` [component slot](/components/data-grid/components/#toolbar).

{{"demo": "ExportDefaultToolbar.js", "bg": "inline"}}

### Custom Toolbar

The export menu is provided in a stand-alone component named `GridToolbarExport`. You can use it in a custom toolbar component as follows.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
```

{{"demo": "ExportCustomToolbar.js", "bg": "inline", "defaultCodeOpen": false}}

## Export options

By default, the export menu displays all the available export formats, according to your license, which are

- [Print](#print-export)
- [CSV](#csv-export)
- [Excel](#excel-export) [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)
- [Clipboard](#clipboard) [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/) (🚧 Not delivered yet)

You can customize their respective behavior by passing an options object either to the `GridToolbar` or to the `GridToolbarExport` as a prop.

```tsx
<DataGrid componentsProps={{ toolbar: { csvOptions } }} />
// same as
<GridToolbarExport csvOptions={csvOptions} />
```

Each export option has its own API page:

- [`csvOptions`](/api/data-grid/grid-csv-export-options/)
- [`printOptions`](/api/data-grid/grid-print-export-options/)

## Disabled format

You can remove an export format from the toolbar by setting its option property `disableToolbarButton` to `true`.
In the following example, the print export is disabled.

```jsx
<DataGrid
  componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
/>
```

{{"demo": "RemovePrintExport.js", "bg": "inline", "defaultCodeOpen": false}}

## Exported columns

By default, the export will only contain the visible columns of the grid.
There are a few ways to include or hide other columns.

- Set the `disableExport` attribute to `true` in `GridColDef` for columns you don't want to be exported.

```jsx
<DataGrid columns={[{ field: 'name', disableExport: true }, { field: 'brand' }]} />
```

- Set `allColumns` in export option to `true` to also include hidden columns. Those with `disableExport=true` will not be exported.

```jsx
<DataGrid componentsProps={{ toolbar: { csvOptions: { allColumns: true } } }} />
```

- Set the exact columns to be exported in the export option. Setting `fields` overrides the other properties. Such that the exported columns are exactly those in `fields` in the same order.

```jsx
<DataGrid
  componentsProps={{ toolbar: { csvOptions: { fields: ['name', 'brand'] } } }}
/>
```

## Exported rows

> ⚠️ This section only applies to the CSV and the Excel export.
> The print export always prints rows in their current state.

By default, the grid exports the selected rows if there are any.
If not, it exports all rows (filtered and sorted rows, according to active rules), including the collapsed ones.

Alternatively, you can set the `getRowsToExport` function and export any rows you want, as in the following example.
The grid exports a few [selectors](/components/data-grid/state/#access-the-state) that can help you get the rows for the most common use-cases:

| Selector                                       | Behavior                                                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gridRowIdsSelector`                           | The rows in their original order.                                                                                                                                                                                          |
| `gridSortedRowIdsSelector`                     | The rows after applying the sorting rules.                                                                                                                                                                                 |
| `gridFilteredSortedRowIdsSelector`             | The rows after applying the sorting rules, and the filtering rules.                                                                                                                                                        |
| `gridVisibleSortedRowIdsSelector`              | The rows after applying the sorting rules, the filtering rules, and without the collapsed rows.                                                                                                                            |
| `gridPaginatedVisibleSortedGridRowIdsSelector` | The rows after applying the sorting rules, the filtering rules, without the collapsed rows and only for the current page (**Note**: If the pagination is disabled, it will still take the value of `page` and `pageSize`). |

{{"demo": "CsvGetRowsToExport.js", "bg": "inline", "defaultCodeOpen": false}}
When using [Row grouping](/components/data-grid/group-pivot/#row-grouping), it can be useful to remove the groups from the CSV export

{{"demo": "CsvGetRowsToExportRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

## CSV export

### Exported cells

When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.
You can provide a [`valueFormatter`](/components/data-grid/columns/#value-formatter) with a string representation to be used.

```jsx
<DataGrid
  columns={[
    {
      field: 'progress',
      valueFormatter: ({ value }) => `${value * 100}%`,
      renderCell: ({ value }) => <ProgressBar value={value} />,
    },
  ]}
/>
```

### File encoding

You can use `csvOptions` to specify the format of the export, such as the `delimiter` character used to separate fields, the `fileName`, or `utf8WithBom` to prefix the exported file with UTF-8 Byte Order Mark (BOM).
For more details on these options, please visit the [`csvOptions` api page](/api/data-grid/grid-csv-export-options/).

```jsx
<GridToolbarExport
  csvOptions={{
    fileName: 'customerDataBase',
    delimiter: ';',
    utf8WithBom: true,
  }}
/>
```

## Print export

### Modify the grid style

By default, the printed grid is equivalent to printing a page containing only the grid.
To modify the styles used for printing, such as colors, you can either use the `@media print` media query or the `pageStyle` property of `printOptions`.

For example, if the grid is in dark mode, the text color will be inappropriate for printing (too light).

With media query, you have to start your `sx` object with `@media print` key, such that all the style inside are only applied when printing.

```jsx
<DataGrid
  sx={{
    "@media print": {
      ".MuiDataGrid-main": { color: 'rgba(0, 0, 0, 0.87)' }
    }
  }}
  {/* ... */}
/>
```

With `pageStyle` option, you can override the main content color with a [more specific selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity).

```jsx
<DataGrid
  componentsProps={{
    GridToolbar: {
      printOptions:{
        pageStyle: '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); }',
      }
    }
  }}
  {/* ... */}
/>
```

### Customize grid display

By default, the print export display all the DataGrid. It is possible to remove the footer and the toolbar by setting respectively `hideFooter` and `hideToolbar` to `true`.

```jsx
<GridToolbarExport
  printOptions={{
    hideFooter: true,
    hideToolbar: true,
  }}
/>
```

For more option to customize the print export, please visit the [`printOptions` api page](/api/data-grid/grid-print-export-options/).

> ⚠️ Due to the fact that the Print export relies on the usage of an `iframe`, there is a limitation around the usage of `X-Frame-Options`.
>
> In order for the Print export to work as expected set `X-Frame-Options: SAMEORIGIN`.

## Custom export format

You can add custom export formats by creating your own export menu.
To simplify its creation, we export `<GridToolbarExportContainer />` which contains the menu logic.
The default `<GridToolbarExport />` is defined as follow:

```jsx
const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem options={csvOptions} />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);
```

Each child of the `<GridToolbarExportContainer />` receives a prop `hideMenu` to close the export menu after the export.
The demo below shows how to add a JSON export.

{{"demo": "CustomExport.js", "bg": "inline", "defaultCodeOpen": false}}

## Excel export [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature is temporarily available on the Pro plan until the release of the Premium plan.
>
> To avoid future regression for users of the Pro plan, the feature needs to be explicitly activated using the `excelExport` experimental feature flag.
>
> ```tsx
> <DataGridPro experimentalFeatures={{ excelExport: true }} {...otherProps} />
> ```
>
> The feature is stable in its current form, and we encourage users willing to migrate to the Premium plan once available to start using it.

The Excel export allows translating columns' type and tree structure of a DataGrid to an Excel file.

Columns with types `'boolean'`, `'number'`, `'singleSelect'`, `'date'`, and `'dateTime'` are exported in their corresponding type in Excel. Please ensure the `rows` values have the correct type, you can always [convert them](/components/data-grid/columns/#converting-types) as needed.

{{"demo": "ExcelExport.js", "bg": "inline", "defaultCodeOpen": false}}

This feature relies on [exceljs](https://github.com/exceljs/exceljs).
To install it:

```sh
 // with npm
 npm install exceljs

 // with yarn
 yarn add exceljs
```

### Customizing the exported file

You can customize the document using two callback functions:

- `exceljsPreProcess` called **before** adding the rows' dataset.
- `exceljsPostProcess` called **after** the dataset has been exported to the document.

Both functions receive `{ workbook, worksheet }` as input.
They are [exceljs](https://github.com/exceljs/exceljs#interface) objects and allow you to directly manipulate the Excel file.

Thanks to these two methods, you can modify the metadata of the exported spreadsheet.
You can also use it to add add custom content on top or bottom of the worksheet, as follow:

```jsx
function exceljsPreProcess({ workbook, worksheet }) {
  workbook.created = new Date(); // Add metadata
  worksheet.name = 'Monthly Results'; // Modify worksheet name

  // Write on first line the date of creation
  worksheet.getCell('A1').value = `Values from the`;
  worksheet.getCell('A2').value = new Date();
}

function exceljsPostProcess({ worksheet }) {
  // Add a text after the data
  worksheet.addRow(); // Add empty row

  const newRow = worksheet.addRow();
  newRow.getCell(1).value = 'Those data are for internal use only';
}
```

Since `exceljsPreProcess` is applied before adding the content of the grid, you can use it to add some informative rows on top of the document.
The content of the grid will start on the next row after those added by `exceljsPreProcess`.

To customize the rows after the grid content, you should use `exceljsPostProcess`. As it is applied after adding the content, you can also use it to access the generated cells.

In the following demo, both methods are used to set a custom header and a custom footer.

{{"demo": "ExcelCustomExport.js", "bg": "inline", "defaultCodeOpen": false}}

## 🚧 Clipboard [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #199](https://github.com/mui/mui-x/issues/199) if you want to see it land faster.
> You will be able to copy and paste items to and from the grid using the system clipboard.

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

### CSV

{{"demo": "CsvExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Print

{{"demo": "PrintExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Excel [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "ExcelExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [csvOptions](/api/data-grid/grid-csv-export-options/)
- [printOptions](/api/data-grid/grid-print-export-options/)
- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
