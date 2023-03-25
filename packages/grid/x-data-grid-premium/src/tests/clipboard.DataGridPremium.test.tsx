import * as React from 'react';
import {
  GridApi,
  useGridApiRef,
  DataGridPremium,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, userEvent, act, waitFor } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { stub, SinonStub, spy } from 'sinon';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import { getBasicGridData } from '@mui/x-data-grid-generator';

describe('<DataGridPremium /> - Clipboard', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function Test({
    rowLength = 4,
    colLength = 3,
    ...other
  }: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridPremiumProps, 'rows' | 'columns'>> & {
      rowLength?: number;
      colLength?: number;
    }) {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => {
      const basicData = getBasicGridData(rowLength, colLength);
      return {
        ...basicData,
        columns: basicData.columns.map((column) => ({ ...column, type: 'string', editable: true })),
      };
    }, [rowLength, colLength]);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          {...data}
          {...other}
          apiRef={apiRef}
          rowSelection={false}
          unstable_cellSelection
          disableVirtualization
        />
      </div>
    );
  }

  describe('copy', () => {
    let writeText: SinonStub;
    const originalClipboard = navigator.clipboard;

    beforeEach(function beforeEachHook() {
      writeText = stub().resolves();

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
      });
    });

    afterEach(function afterEachHook() {
      Object.defineProperty(navigator, 'clipboard', { value: originalClipboard });
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should copy the selected cells to the clipboard when ${key} + C is pressed`, () => {
        render(<Test />);

        const cell = getCell(0, 0);
        cell.focus();
        userEvent.mousePress(cell);

        fireEvent.keyDown(cell, { key: 'Shift' });
        fireEvent.click(getCell(2, 2), { shiftKey: true });

        fireEvent.keyDown(cell, { key: 'c', keyCode: 67, [key]: true });
        expect(writeText.firstCall.args[0]).to.equal(
          [
            ['0', 'USDGBP', '1'].join('\t'),
            ['1', 'USDEUR', '11'].join('\t'),
            ['2', 'GBPEUR', '21'].join('\t'),
          ].join('\r\n'),
        );
      });
    });

    it(`should copy cells range selected in one row`, () => {
      render(<Test />);

      const cell = getCell(0, 0);
      cell.focus();
      userEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(0, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.firstCall.args[0]).to.equal([['0', 'USDGBP', '1'].join('\t')].join('\r\n'));
    });
  });

  describe('paste', () => {
    let readText: SinonStub;
    const originalClipboard = navigator.clipboard;

    beforeEach(function beforeEachHook() {
      readText = stub().resolves();

      Object.defineProperty(navigator, 'clipboard', {
        value: { readText },
        writable: true,
      });
    });

    afterEach(function afterEachHook() {
      Object.defineProperty(navigator, 'clipboard', { value: originalClipboard });
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should not enter cell edit mode when ${key} + V is pressed`, () => {
        render(<Test />);

        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        userEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, [key]: true }); // Ctrl+V
        expect(listener.callCount).to.equal(0);
      });
    });

    it('should paste into each cell of the range when single value is pasted', async () => {
      render(<Test />);

      const clipboardData = '12';
      readText.returns(clipboardData);

      const cell = getCell(0, 1);
      cell.focus();
      userEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V

      await act(() => Promise.resolve());

      expect(getCell(0, 1)).to.have.text(clipboardData);
      expect(getCell(0, 2)).to.have.text(clipboardData);
      expect(getCell(1, 1)).to.have.text(clipboardData);
      expect(getCell(1, 2)).to.have.text(clipboardData);
      expect(getCell(2, 1)).to.have.text(clipboardData);
      expect(getCell(2, 2)).to.have.text(clipboardData);
    });

    it('should not paste values outside of the selected cells range', async () => {
      render(<Test rowLength={5} colLength={5} />);

      const clipboardData = [
        ['01', '02', '03'],
        ['11', '12', '13'],
        ['21', '22', '23'],
        ['31', '32', '33'],
        ['41', '42', '43'],
        ['51', '52', '53'],
      ];
      readText.returns(clipboardData.map((row) => row.join('\t')).join('\r\n'));

      const cell = getCell(0, 1);
      cell.focus();
      userEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V

      await act(() => Promise.resolve());

      // selected cells should be updated
      expect(getCell(0, 1)).to.have.text('01');
      expect(getCell(0, 2)).to.have.text('02');
      expect(getCell(1, 1)).to.have.text('11');
      expect(getCell(1, 2)).to.have.text('12');
      expect(getCell(2, 1)).to.have.text('21');
      expect(getCell(2, 2)).to.have.text('22');

      // cells out of selection range should not be updated
      expect(getCell(0, 3)).not.to.have.text('03');
      expect(getCell(3, 1)).not.to.have.text('31');
    });

    it('should not paste empty values into cells withing selected range when there are no corresponding values in the clipboard', async () => {
      render(<Test rowLength={5} colLength={5} />);

      const clipboardData = [
        ['01'], // first row
        ['11'], // second row
        ['21'], // third row
      ];
      readText.returns(clipboardData.map((row) => row.join('\t')).join('\r\n'));

      const cell = getCell(0, 1);
      cell.focus();
      userEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V

      await act(() => Promise.resolve());

      const secondColumnValuesBeforePaste = [
        getCell(0, 2).textContent!,
        getCell(1, 2).textContent!,
        getCell(2, 2).textContent!,
      ];

      // selected cells should be updated if there's data in the clipboard
      expect(getCell(0, 1)).to.have.text('01');
      expect(getCell(1, 1)).to.have.text('11');
      expect(getCell(2, 1)).to.have.text('21');

      // selected cells should be updated if there's no data for them in the clipboard
      expect(getCell(0, 2)).to.have.text(secondColumnValuesBeforePaste[0]);
      expect(getCell(1, 2)).to.have.text(secondColumnValuesBeforePaste[1]);
      expect(getCell(2, 2)).to.have.text(secondColumnValuesBeforePaste[2]);
    });

    it('should work well with `getRowId` prop', async () => {
      const columns = [{ field: 'brand' }];
      const rows = [
        { customIdField: 0, brand: 'Nike' },
        { customIdField: 1, brand: 'Adidas' },
        { customIdField: 2, brand: 'Puma' },
      ];
      function Component() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={columns}
              rows={rows}
              getRowId={(row) => row.customIdField}
              rowSelection={false}
              unstable_cellSelection
            />
          </div>
        );
      }

      render(<Component />);

      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

      const clipboardData = 'Nike';
      readText.returns(clipboardData);

      const cell = getCell(1, 0);
      cell.focus();
      userEvent.mousePress(cell);
      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Nike', 'Puma']);
      });
    });
  });
});
