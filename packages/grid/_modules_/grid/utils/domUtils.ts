import { gridClasses } from '../gridClasses';
import { GridRowId } from '../models/gridRows';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findParentElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest(`.${className}`);
}

export function getRowEl(cell?: Element | null): HTMLElement | null {
  if (!cell) {
    return null;
  }
  return findParentElementFromClassName(cell as HTMLDivElement, gridClasses.row)! as HTMLElement;
}

export function isGridCellRoot(elem: Element | null): boolean {
  return elem != null && elem.classList.contains(gridClasses.cell);
}

export function isGridHeaderCellRoot(elem: Element | null): boolean {
  return elem != null && elem.classList.contains(gridClasses.columnHeader);
}

export function getIdFromRowElem(rowEl: Element): string {
  return rowEl.getAttribute('data-id')!;
}

export function getFieldFromHeaderElem(colCellEl: Element): string {
  return colCellEl.getAttribute('data-field')!;
}

export function findHeaderElementFromField(elem: Element, field: string): Element | null {
  return elem.querySelector(`[data-field="${field}"]`);
}

export function findGridCellElementsFromCol(col: HTMLElement): NodeListOf<Element> | null {
  const field = col.getAttribute('data-field');
  const root = findParentElementFromClassName(col, 'MuiDataGrid-root');
  if (!root) {
    throw new Error('Material-UI: The root element is not found.');
  }
  const cells = root.querySelectorAll(`.${gridClasses.cell}[data-field="${field}"]`);
  return cells;
}

function escapeOperandAttributeSelector(operand: string): string {
  return operand.replace(/["\\]/g, '\\$&');
}

export function getGridColumnHeaderElement(root: Element, field: string) {
  return root.querySelector(
    `[role="columnheader"][data-field="${escapeOperandAttributeSelector(field)}"]`,
  ) as HTMLDivElement;
}

export function getGridRowElement(root: Element, id: GridRowId) {
  return root.querySelector(
    `.${gridClasses.row}[data-id="${escapeOperandAttributeSelector(String(id))}"]`,
  ) as HTMLDivElement;
}

export function getGridCellElement(root: Element, { id, field }: { id: GridRowId; field: string }) {
  const row = getGridRowElement(root, id);
  if (!row) {
    return null;
  }
  return row.querySelector(
    `.${gridClasses.cell}[data-field="${escapeOperandAttributeSelector(field)}"]`,
  ) as HTMLDivElement;
}
