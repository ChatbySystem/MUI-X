import * as React from 'react';
import {
  MergePluginsProperty,
  TreeItemWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewItemPluginResponse,
  TreeViewPublicAPI,
} from '../models';

export type TreeViewContextValue<TPlugins extends readonly TreeViewAnyPluginSignature[]> =
  MergePluginsProperty<TPlugins, 'contextValue'> & {
    instance: TreeViewInstance<TPlugins>;
    publicAPI: TreeViewPublicAPI<TPlugins>;
    wrapItem: TreeItemWrapper;
    runItemPlugins: <TProps extends {}>(props: TProps) => Required<TreeViewItemPluginResponse>;
  };

export interface TreeViewProviderProps<TPlugins extends readonly TreeViewAnyPluginSignature[]> {
  value: TreeViewContextValue<TPlugins>;
  children: React.ReactNode;
}
