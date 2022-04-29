import { GridRowId, GridRowModel, GridRowTreeConfig } from '../../../models';

/**
 * A helper function to check if the id provided is valid.
 * @param {GridRowId} id Id as [[GridRowId]].
 * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowModel]].
 * @param {string} detailErrorMessage A custom error message to display for invalid IDs
 */
export function checkGridRowIdIsValid(
  id: GridRowId,
  row: GridRowModel | Partial<GridRowModel>,
  detailErrorMessage: string = 'A row was provided without id in the rows prop:',
) {
  if (id == null) {
    throw new Error(
      [
        'MUI: The data grid component requires all rows to have a unique `id` property.',
        'Alternatively, you can use the `getRowId` prop to specify a custom id for each row.',
        detailErrorMessage,
        JSON.stringify(row),
      ].join('\n'),
    );
  }
}

export const getTreeNodeDescendants = (
  tree: GridRowTreeConfig,
  parentId: GridRowId,
  skipAutoGeneratedRows: boolean,
) => {
  const children = tree[parentId]?.children;
  if (children == null) {
    return [];
  }

  const validDescendants: GridRowId[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const childNode = tree[child];
    if (!skipAutoGeneratedRows || !childNode.isAutoGenerated) {
      validDescendants.push(child);
    }
    validDescendants.push(...getTreeNodeDescendants(tree, childNode.id, skipAutoGeneratedRows));
  }

  return validDescendants;
};
