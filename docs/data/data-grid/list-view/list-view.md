---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">Display data in a single-column list view. Can be used to present a more compact grid on smaller screens and mobile devices.</p>

:::warning
This feature is marked as **unstable**. While you can use this feature in production, the API could change in the future.
:::

List view can be enabled by providing the `unstable_listView` prop.

Unlike the default grid view, the list view makes no assumptions on how data is presented to end users.

In order to display data in a list view, a `unstable_listColumn` prop must be provided with a `renderCell` function.

```tsx
function ListViewCell(params: GridRenderCellParams) {
  return <>{params.row.id}</>;
}

const listColDef: GridListColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};
```

{{"demo": "ListView.js", "bg": true}}

## Enable with a media query

The `useMediaQuery` hook from `@mui/material` can be used to enable the list view feature at a specified breakpoint.

```tsx
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const theme = useTheme();
  const isListView = useMediaQuery(theme.breakpoints.down('md'));

  return <DataGrid unstable_listView={isListView} />;
}
```

## Editable rows

The [editing](/x/react-data-grid/editing/) feature is not supported in list view, however, it is possible to build an editing experience from within your custom cell renderer.

{{"demo": "ListViewEdit.js", "bg": true}}

## Field visibility

Similar to the default grid view, field visibilty can be toggled in list view.

In the list view column’s `renderCell` function, data can be conditionally rendered based on [column visibility](/x/react-data-grid/column-visibility/).

```tsx
import {
  useGridSelector,
  useGridApiContext,
  gridColumnVisibilityModelSelector,
} from '@mui/x-data-grid';

function ListViewCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const columnVisibilityModel = useGridSelector(
    apiRef,
    gridColumnVisibilityModelSelector,
  );
  const showCreatedAt = columnVisibilityModel.createdBy !== false;

  return (
    <>
      <span>{params.row.id}</span>
      {showCreatedAt && (
        <time datetime={params.row.createdAt}>
          {formatDate(params.row.createdAt)}
        </time>
      )}
    </>
  );
}
```

## Advanced usage

The list view feature can be combined with [custom subcomponents](/x/react-data-grid/components/) to provide an improved user experience on small screens.

{{"demo": "ListViewAdvanced.js", "iframe": true, "maxWidth": 360, "height": 600}}

## Feature support

The list view feature can be used in combination with the following features:

- ✅ [Sorting](/x/react-data-grid/sorting/)
- ✅ [Filtering](/x/react-data-grid/filtering/)
- ✅ [Multi filters](/x/react-data-grid/filtering/multi-filters/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Row pinning](/x/react-data-grid/row-pinning/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Pagination](/x/react-data-grid/pagination/)
- ✅ [Row selection](/x/react-data-grid/row-selection/)
- ✅ [Cell selection](/x/react-data-grid/cell-selection/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

:::warning
Features not listed may not work as expected, or may not work at all.

If you are using a feature that is listed and it is not working as expected, please [open a bug report](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cbug+%F0%9F%90%9B&projects=&template=1.bug.yml).

If you need to use list view with any other features, please [open a feature request](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cnew+feature&projects=&template=2.feature.yml).
:::

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "List View"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
