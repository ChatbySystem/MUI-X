import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { unstable_useTreeItem2 as useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';

import { findItemById } from './SceneObjects'; //temporarily solution
import CustomTreeItemContextMenu from './ContextMenu';

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, children, sceneObjects, toggleVisibility, ...other } =
    props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem2({ id, itemId, children, label, rootRef: ref });

  const originalItem = findItemById(sceneObjects, itemId);
  const { visibility, type } = originalItem;

  const [mousePosition, setMousePosition] = React.useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMousePosition({
      x: event.clientX - 2,
      y: event.clientY - 4,
    });
  };

  const handleContextMenuClose = () => {
    setMousePosition(null); // Closes the context menu
  };

  const handleContextMenuItemClick = (action) => {
    console.log(action);
    handleContextMenuClose();
  };

  const handleEyeClick = () => {
    toggleVisibility(itemId);
  };

  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleContentClick = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event) => {
    interactions.handleExpansion(event);
  };

  const ItemIcon = () => {
    switch (type) {
      case 'mesh':
        return <ViewInArOutlinedIcon style={{ color: 'darkolivegreen' }} />;
      case 'light':
        return <LightbulbOutlinedIcon style={{ color: 'yellow' }} />;
      case 'collection':
        return <FolderOutlinedIcon style={{ color: 'gray' }} />;
      default:
        return null;
    }
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps()}
          onContextMenu={handleContextMenu}
        >
          <TreeItem2IconContainer
            {...getIconContainerProps()}
            onClick={handleIconContainerClick}
          >
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <Box
            sx={{ flexGrow: 1, display: 'flex', gap: 1 }}
            onClick={handleContentClick}
          >
            {visibility ? (
              <VisibilityIcon
                sx={(theme) => ({
                  color: theme.palette.primary.main,
                  width: 24,
                  height: 24,
                })}
                onClick={handleEyeClick}
              />
            ) : (
              <VisibilityOffIcon
                sx={{ width: 24, height: 24, color: '#555' }}
                onClick={handleEyeClick}
              />
            )}

            <ItemIcon />
            <TreeItem2Label
              {...getLabelProps()}
              sx={(theme) => ({
                color: visibility ? theme.palette.text.primary : '#888',
              })}
            />
          </Box>
        </CustomTreeItemContent>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
      <CustomTreeItemContextMenu
        positionSeed={mousePosition}
        onClose={handleContextMenuClose}
        onClick={handleContextMenuItemClick}
        menuItems={['Action 1', 'Action 2', 'Action 3']}
      />
    </TreeItem2Provider>
  );
});

export default CustomTreeItem;
