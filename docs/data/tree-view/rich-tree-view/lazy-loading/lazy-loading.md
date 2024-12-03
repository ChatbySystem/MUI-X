---
productId: x-tree-view
title: Rich Tree View - Lazy Loading Children
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Lazy Loading Children

<p class="description">Lazy load the data from your Tree View.</p>

## Basic usage

To dynamically load data from the server, including lazy-loading of children, you must create a data source and pass the dataSource prop to the Rich Tree View.

The data source also requires the `getChildrenCount()` attribute to handle tree data:

`getChildrenCount()`: Returns the number of children for the item. If the children count is not available for some reason, but there are some children, returns -1.

The `items` prop serves as an initial state.

{{"demo": "LazyLoadingInitialState.js"}}

If you want to dynamically load all items of the Tree View, you can pass and empty array to the `items` prop, and the `getTreeItems` method will be called on the first render.

{{"demo": "BasicLazyLoading.js"}}

## Data caching

### Custom cache

### Customize the cache lifetime

The `DataSourceCacheDefault` has a default Time To Live (`ttl`) of 5 minutes. To customize it, pass the ttl option in milliseconds to the `DataSourceCacheDefault` constructor, and then pass it as the `dataSourceCache` prop.

{{"demo": "LowTTLCache.js"}}

## Error management

{{"demo": "ErrorManagement.js"}}
