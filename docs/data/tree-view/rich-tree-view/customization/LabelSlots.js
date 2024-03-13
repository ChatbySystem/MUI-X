import * as React from 'react';
import { TreeItem2, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useTreeItem2Utils } from '@mui/x-tree-view';

function CustomLabel(props) {
  const { children, onChange, ...other } = props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState('');
  const editingLabelRef = React.useRef(null);

  const handleLabelDoubleClick = () => {
    setIsEditing(true);
    setValue(children);
  };

  const handleEditingLabelChange = (event) => {
    setValue(event.target.value);
  };

  const handleEditingLabelKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      setIsEditing(false);
      onChange(value);
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      editingLabelRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        value={value}
        onChange={handleEditingLabelChange}
        onKeyDown={handleEditingLabelKeyDown}
        ref={editingLabelRef}
      />
    );
  }

  return (
    <TreeItem2Label {...other} onDoubleClick={handleLabelDoubleClick}>
      {children}
    </TreeItem2Label>
  );
}

const TreeItemContext = React.createContext({ onLabelValueChange: () => {} });

const CustomTreeItem = React.forwardRef((props, ref) => {
  const { interactions } = useTreeItem2Utils({
    nodeId: props.nodeId,
    children: props.children,
  });

  const { onLabelValueChange } = React.useContext(TreeItemContext);

  const handleLabelValueChange = (newLabel) => {
    onLabelValueChange(props.nodeId, newLabel);
  };

  const handleContentClick = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItem2
      ref={ref}
      {...props}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        content: { onClick: handleContentClick },
        iconContainer: { onClick: handleIconContainerClick },
        label: {
          onChange: handleLabelValueChange,
        },
      }}
    />
  );
});

const DEFAULT_MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

const DEFAULT_EXPANDED_ITEMS = ['pickers'];

export default function LabelSlots() {
  const [products, setProducts] = React.useState(DEFAULT_MUI_X_PRODUCTS);

  const context = React.useMemo(
    () => ({
      onLabelValueChange: (nodeId, label) =>
        setProducts((prev) => {
          const walkTree = (item) => {
            if (item.id === nodeId) {
              return { ...item, label };
            }
            if (item.children) {
              return { ...item, children: item.children.map(walkTree) };
            }

            return item;
          };

          return prev.map(walkTree);
        }),
    }),
    [],
  );

  return (
    <TreeItemContext.Provider value={context}>
      <RichTreeView
        items={products}
        aria-label="customized"
        defaultExpandedItems={DEFAULT_EXPANDED_ITEMS}
        sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
        slots={{ item: CustomTreeItem }}
      />
    </TreeItemContext.Provider>
  );
}
