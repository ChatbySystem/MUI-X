import { TreeViewPluginSignature } from '../../models';

export interface UseTreeViewIdInstance {
  getTreeItemId: (itemId: string, idAttribute: string | undefined) => string;
}

export interface UseTreeViewIdParameters {
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
}

export type UseTreeViewIdDefaultizedParameters = UseTreeViewIdParameters;

export interface UseTreeViewIdState {
  focusedItemId: string | null;
}

export type UseTreeViewIdSignature = TreeViewPluginSignature<{
  params: UseTreeViewIdParameters;
  defaultizedParams: UseTreeViewIdDefaultizedParameters;
  instance: UseTreeViewIdInstance;
  state: UseTreeViewIdState;
}>;
