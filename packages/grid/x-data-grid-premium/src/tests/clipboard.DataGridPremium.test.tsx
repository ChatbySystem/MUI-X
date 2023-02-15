import * as React from 'react';
import {
  GridApi,
  useGridApiRef,
  DataGridPremium,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, userEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { stub, SinonStub, spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { getBasicGridData } from '@mui/x-data-grid-generator';

describe('<DataGridPremium /> - Clipboard', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function Test({
    rowLength = 4,
    ...other
  }: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridPremiumProps, 'rows' | 'columns'>> & { rowLength?: number }) {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => {
      const basicData = getBasicGridData(rowLength, 3);
      return {
        ...basicData,
        columns: basicData.columns.map((column) => ({ ...column, editable: true })),
      };
    }, [rowLength]);

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

    beforeEach(function beforeEachHook() {
      writeText = stub().resolves();

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
      });
    });

    afterEach(function afterEachHook() {
      Object.defineProperty(navigator, 'clipboard', { value: undefined });
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
  });

  describe.only('paste', () => {
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
  });
});
