import { expect } from 'chai';
import { computeFlexColumnsWidth } from './gridColumnsUtils';

describe('gridColumnsUtils', () => {
  describe('computeFlexColumnsWidth', () => {
    function getTotalFlexUnits(flexColumns: { flex: number }[]) {
      return flexColumns.reduce((acc, column) => acc + column.flex, 0);
    }

    // https://github.com/mui/mui-x/issues/3982
    it('should set the first column to be twice as wide as the second and third', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 2 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];
      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 480,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(
        computedColumns[flexColumns[2].field].computedWidth,
      );
      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(
        2 * computedColumns[flexColumns[1].field].computedWidth,
      );
    });

    it('should use `minWidth` if calculated flex size is smaller', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 2 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 100,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    it('should distribute remaining space between flex items', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 1000 },
        { field: 'username', minWidth: 50, flex: 1000 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 200,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    // https://github.com/mui/mui-x/issues/3091
    it('should work with `flex` values < 0', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 1 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 0.001 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 200,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    it('should use `minWidth` on flex columns if there is no more space to distribute', () => {
      const flexColumns = [
        { field: 'id', flex: 1, minWidth: 50 },
        { field: 'age', flex: 3, minWidth: 50 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 0,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(50);
    });

    it('should use `maxWidth` if calculated flex width exceeds it', () => {
      const flexColumns = [
        { field: 'id', flex: 1, minWidth: 50, maxWidth: 100 },
        { field: 'age', flex: 3, minWidth: 50 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 1000,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(100);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(900);
    });
  });
});
