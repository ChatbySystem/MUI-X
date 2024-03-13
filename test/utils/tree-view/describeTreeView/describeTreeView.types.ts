import { TreeViewAnyPluginSignature, TreeViewUsedParams } from '@mui/x-tree-view/internals/models';

export type DescribeTreeViewTestRunner<TPlugin extends TreeViewAnyPluginSignature> = (
  params: DescribeTreeViewTestRunnerParams<TPlugin>,
) => void;

export interface DescribeTreeViewRendererReturnValue<TPlugin extends TreeViewAnyPluginSignature> {
  setProps: (props: Partial<TreeViewUsedParams<TPlugin>>) => void;
  getRoot: () => HTMLElement;
  getAllItemRoots: () => HTMLElement[];
  getItemRoot: (id: string) => HTMLElement;
  getItemContent: (id: string) => HTMLElement;
}

export type DescribeTreeViewRenderer<TPlugin extends TreeViewAnyPluginSignature> = <
  R extends DescribeTreeViewItem,
>(
  params: {
    items: readonly R[];
  } & TreeViewUsedParams<TPlugin>,
) => DescribeTreeViewRendererReturnValue<TPlugin>;

interface DescribeTreeViewTestRunnerParams<TPlugin extends TreeViewAnyPluginSignature> {
  render: DescribeTreeViewRenderer<TPlugin>;
}

export interface DescribeTreeViewItem {
  id: string;
  label?: string;
  disabled?: boolean;
  children?: readonly DescribeTreeViewItem[];
}
