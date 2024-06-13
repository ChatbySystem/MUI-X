import * as React from 'react';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
  UseTreeItem2ContentSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem2';
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
import { ThreeDItem } from './SceneObjects';
import CustomTreeItemContextMenu from './ContextMenu';

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

interface CustomTreeItemProps extends Omit<UseTreeItem2Parameters, 'rootRef'> {
  toggleVisibility: (itemId: string) => void;
  sceneObjects: ThreeDItem[];
}

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, children, sceneObjects, toggleVisibility, ...other } =
    props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, rootRef: ref });

  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const item = publicAPI.getItem(itemId);

  const [mousePosition, setMousePosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMousePosition({
      x: event.clientX - 2,
      y: event.clientY - 4,
    });
  };

  const handleContextMenuClose = () => {
    setMousePosition(null); // Closes the context menu
  };

  const handleContextMenuItemClick = () => {
    handleContextMenuClose();
  };

  const handleVisibilityIconClick = (
    event: React.MouseEvent & { defaultMuiPrevented?: boolean },
  ) => {
    event.defaultMuiPrevented = true;
    toggleVisibility(itemId);
  };

  const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event: React.MouseEvent) => {
    interactions.handleExpansion(event);
  };

  let itemIcon: React.ReactNode;
  switch (item.type) {
    case 'mesh':
      itemIcon = <ViewInArOutlinedIcon style={{ color: 'darkolivegreen' }} />;
      break;
    case 'light':
      itemIcon = <LightbulbOutlinedIcon style={{ color: 'yellow' }} />;
      break;
    case 'collection':
      itemIcon = <FolderOutlinedIcon style={{ color: 'gray' }} />;
      break;
    default:
      itemIcon = null;
  }

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps()}
          onContextMenu={handleContextMenu}
          onClick={handleContentClick}
        >
          <TreeItem2IconContainer
            {...getIconContainerProps()}
            onClick={handleIconContainerClick}
          >
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2IconContainer onClick={handleVisibilityIconClick}>
            {item.visibility ? (
              <VisibilityIcon color="primary" />
            ) : (
              <VisibilityOffIcon sx={{ color: '#555' }} />
            )}
          </TreeItem2IconContainer>
          {itemIcon}
          <TreeItem2Label
            {...getLabelProps()}
            sx={{
              opacity: item.visibility ? 1 : 0.5,
            }}
          />
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
