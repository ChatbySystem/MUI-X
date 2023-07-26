import type { GridKeyValue } from './colDef/gridColDef';

export type GridValidRowModel = { [key: string | symbol]: any };

export type GridRowsProp<R extends GridValidRowModel = GridValidRowModel> = Readonly<
  GridRowModel<R>[]
>;

/**
 * The key value object representing the data of a row.
 */
export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;

export type GridUpdateAction = 'delete';

export interface GridRowModelUpdate extends GridRowModel {
  _action?: GridUpdateAction;
}

/**
 * The grid rows total height and row positions.
 */
export interface GridRowsMeta {
  /**
   * The sum of all grid rows.
   */
  totalHeight: number;
  /**
   * The grid rows positions.
   */
  positions: number[];
}

export interface GridTreeBasicNode {
  /**
   * The uniq id of this node.
   */
  id: GridRowId;
  /**
   * Depth of this node in the tree.
   */
  depth: number;
}

export interface GridLeafNode extends GridTreeBasicNode {
  type: 'leaf';
  /**
   * The id of the group containing this node.
   */
  parent: GridRowId;
  /**
   * The key used to group the children of this row.
   */
  groupingKey: GridKeyValue | null;
}

export interface GridBasicGroupNode extends GridTreeBasicNode {
  type: 'group';
  /**
   * The key used to group the children of this row.
   */
  groupingKey: GridKeyValue | null;
  /**
   * The field used to group the children of this row.
   * Is `null` if no field has been used to group the children of this row.
   */
  groupingField: string | null;
  /**
   * The id of the body children nodes.
   * Only contains the children of type "group" and "leaf".
   */
  children: GridRowId[];
  /**
   * The id of the footer child node.
   */
  footerId?: GridRowId | null;
  /**
   * The id of the children nodes, grouped by grouping field and grouping key.
   * Only contains the children of type "group" and "leaf".
   * Empty for flat tree.
   */
  childrenFromPath: GridChildrenFromPathLookup;
  /**
   * If `true`, the children of this group are not visible.
   * @default false
   */
  childrenExpanded?: boolean;
  /**
   * The id of the group containing this node (null for the root group).
   */
  parent: GridRowId | null;
  /**
   * If `true`, this row is pinned.
   * @default false
   */
  isPinned?: boolean;
}

export interface GridAutoGeneratedGroupNode extends GridBasicGroupNode {
  /**
   * If `true`, this node has been automatically generated by the grid.
   * In the row grouping, all groups are auto-generated
   * In the tree data, some groups can be passed in the rows
   */
  isAutoGenerated: true;
}

export interface GridDataGroupNode extends GridBasicGroupNode {
  /**
   * If `true`, this node has been automatically generated by the grid.
   * In the row grouping, all groups are auto-generated
   * In the tree data, some groups can be passed in the rows
   */
  isAutoGenerated: false;
}

export type GridGroupNode = GridDataGroupNode | GridAutoGeneratedGroupNode;

export type GridChildrenFromPathLookup = {
  [groupingField: string]: {
    [groupingKey: string]: GridRowId;
  };
};

export interface GridFooterNode extends GridTreeBasicNode {
  type: 'footer';
  /**
   * The id of the group containing this node.
   */
  parent: GridRowId;
}

export interface GridSkeletonRowNode extends GridTreeBasicNode {
  type: 'skeletonRow';
  /**
   * The id of the group containing this node.
   * Is always equal to `GRID_ROOT_GROUP_ID`.
   */
  parent: GridRowId;
}

interface GridBasicPinnedRowNode extends GridTreeBasicNode {
  type: 'pinnedRow';
  /**
   * The id of the group containing this node.
   * Is always equal to `GRID_ROOT_GROUP_ID`.
   */
  parent: GridRowId;
}

export interface GridDataPinnedRowNode extends GridBasicPinnedRowNode {
  /**
   * If `true`, this node has been automatically generated by the grid.
   */
  isAutoGenerated: true;
}

export interface GridAutoGeneratedPinnedRowNode extends GridBasicPinnedRowNode {
  /**
   * If `true`, this node has been automatically generated by the grid.
   */
  isAutoGenerated: false;
}

export type GridPinnedRowNode = GridDataPinnedRowNode | GridAutoGeneratedPinnedRowNode;

export type GridTreeNode =
  | GridLeafNode
  | GridGroupNode
  | GridFooterNode
  | GridPinnedRowNode
  | GridSkeletonRowNode;

export type GridTreeNodeWithRender =
  | GridLeafNode
  | GridGroupNode
  | GridFooterNode
  | GridPinnedRowNode;

export type GridRowTreeConfig = Record<GridRowId, GridTreeNode>;

/**
 * The type of Id supported by the grid.
 */
export type GridRowId = string | number | bigint;

export interface GridRowEntry<R extends GridValidRowModel = GridValidRowModel> {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * The row model.
   */
  model: R;
}

/**
 * The function to retrieve the id of a [[GridRowModel]].
 */
export type GridRowIdGetter<R extends GridValidRowModel = GridValidRowModel> = (
  row: R,
) => GridRowId;
