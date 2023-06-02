import { GRID_ROOT_GROUP_ID, GridGroupNode, GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';
import { GridSortingModelApplier } from '@mui/x-data-grid/internals';

interface SortRowTreeParams {
  rowTree: GridRowTreeConfig;
  disableChildrenSorting: boolean;
  sortRowList: GridSortingModelApplier | null;
  /**
   * Defines where the groups are placed relative to the leaves of same depth when no sorting rule is applied.
   * If `true` the groups will be rendered below the leaves.
   * If `false`, the groups will be rendered on their creation order.
   */
  shouldRenderGroupBelowLeaves: boolean;
}

// Double-linked list node
class Node<T> {
  previous: null | Node<T>;

  next: null | Node<T>;

  data: T;

  constructor(data: T, previous: null | Node<T>, next: null | Node<T>) {
    this.previous = previous;
    this.next = next;
    this.data = data;
  }

  insertAfter(list: List<T>) {
    if (!list.first || !list.last) {
      return;
    }
    const next = this.next;
    this.next = list.first;
    list.first.previous = this;

    list.last.next = next;
    if (next) {next.previous = list.last;}
  }
}

// Double-linked list container
class List<T> {
  first: Node<T> | null;

  last: Node<T> | null;

  constructor(first: Node<T> | null, last: Node<T> | null) {
    this.first = first;
    this.last = last;
  }

  nodes() {
    const array = [] as Node<T>[];
    this.forEach((node) => {
      array.push(node);
    });
    return array;
  }

  data() {
    const array = [] as T[];
    this.forEach((node) => {
      array.push(node.data);
    });
    return array;
  }

  forEach(fn: (node: Node<T>) => void) {
    let current = this.first;

    while (current !== null) {
      fn(current);
      current = current.next;
    }
  }

  static from<T>(array: T[]): List<T> {
    if (array.length === 0) {return new List(null, null);}

    let index = 0;
    const first = new Node(array[index], null, null);
    let current = first;
    while (index + 1 < array.length) {
      index += 1;
      const node = new Node(array[index], current, null);
      current.next = node;
      current = node;
    }

    return new List(first, current);
  }
}


export const sortRowTree = (params: SortRowTreeParams) => {
  const { rowTree, disableChildrenSorting, sortRowList, shouldRenderGroupBelowLeaves } = params;

  const sortedGroupedByParentRows = new Map<GridRowId, GridRowId[]>();

  const sortGroup = (node: GridGroupNode) => {
    const shouldSortGroup = !!sortRowList && (!disableChildrenSorting || node.depth === -1);

    let sortedRowIds: GridRowId[];

    if (shouldSortGroup) {
      for (let i = 0; i < node.children.length; i += 1) {
        const childNode = rowTree[node.children[i]];
        if (childNode.type === 'group') {
          sortGroup(childNode);
        }
      }

      sortedRowIds = sortRowList(node.children.map((childId) => rowTree[childId]));
    } else if (shouldRenderGroupBelowLeaves) {
      const childrenLeaves: GridRowId[] = [];
      const childrenGroups: GridRowId[] = [];
      for (let i = 0; i < node.children.length; i += 1) {
        const childId = node.children[i];
        const childNode = rowTree[childId];
        if (childNode.type === 'group') {
          sortGroup(childNode);
          childrenGroups.push(childId);
        } else if (childNode.type === 'leaf') {
          childrenLeaves.push(childId);
        }
      }

      sortedRowIds = [...childrenLeaves, ...childrenGroups];
    } else {
      for (let i = 0; i < node.children.length; i += 1) {
        const childNode = rowTree[node.children[i]];
        if (childNode.type === 'group') {
          sortGroup(childNode);
        }
      }

      sortedRowIds = [...node.children];
    }

    if (node.footerId != null) {
      sortedRowIds.push(node.footerId);
    }

    sortedGroupedByParentRows.set(node.id, sortedRowIds);
  };

  sortGroup(rowTree[GRID_ROOT_GROUP_ID] as GridGroupNode);

  const rootList = List.from<GridRowId>(sortedGroupedByParentRows.get(GRID_ROOT_GROUP_ID)!);

  const fillList = (nodes: Node<GridRowId>[]) => {
    nodes.forEach((node) => {
      const children = sortedGroupedByParentRows.get(node.data);

      if (children?.length) {
        const sublist = List.from(children);
        const subnodes = sublist.nodes();
        node.insertAfter(sublist);
        fillList(subnodes);
      }
    });
  };

  fillList(rootList.nodes());

  return rootList.data();
};
