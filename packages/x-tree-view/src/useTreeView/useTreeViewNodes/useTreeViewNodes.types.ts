import type { TreeViewNode } from '../../TreeView/TreeView.types';

export interface UseTreeViewNodesInstance {
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  registerNode: (node: TreeViewNode) => void;
  unregisterNode: (nodeId: string) => void;
}
