import { createTheme } from '@mui/material/styles';
import { treeItemClasses } from '../TreeItem';
import { richTreeViewClasses } from '../RichTreeView';

createTheme({
  components: {
    MuiTreeItem: {
      defaultProps: {
        nodeId: '1',
        // @ts-expect-error invalid MuiTreeItem prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${treeItemClasses.content}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTreeItem class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiRichTreeView: {
      defaultProps: {
        defaultExpanded: ['root'],
        // @ts-expect-error invalid MuiRichTreeView prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${richTreeViewClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiRichTreeView class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiTreeView: {
      defaultProps: {
        defaultExpanded: ['root'],
        // @ts-expect-error invalid MuiTreeView prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${richTreeViewClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTreeView class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
