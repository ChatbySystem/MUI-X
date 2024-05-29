import { expect } from 'chai';
import { checkScale } from './checkScale';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

describe('BarChart - checkScale', () => {
  describe('verticalLayout: true', () => {
    it('should throw an error when the x-axis is not a band scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).throws(
        'MUI X Charts: The first `xAxis` should be of type "band" to display the bar series of id "seriesId".',
      );
    });

    it('should throw an error when the x-axis has no data property', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).throws('MUI X Charts: The first `xAxis` should have data property.');
    });

    it('should throw an error when the y-axis is not a continuous scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band', data: [] },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band' },
          },
        );
      }).throws(
        'MUI X Charts: The first `yAxis` should be a continuous type to display the bar series of id "seriesId".',
      );
    });

    it('should not throw an error when the scales are correct', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band', data: [] },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).not.to.throw();
    });
  });

  describe('verticalLayout: false', () => {
    it('should throw an error when the y-axis is not a band scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).throws(
        'MUI X Charts: The first `yAxis` should be of type "band" to display the bar series of id "seriesId".',
      );
    });

    it('should throw an error when the y-axis has no data property', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band' },
          },
        );
      }).throws('MUI X Charts: The first `yAxis` should have data property.');
    });

    it('should throw an error when the x-axis is not a continuous scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band', data: [] },
          },
        );
      }).throws(
        'MUI X Charts: The first `xAxis` should be a continuous type to display the bar series of id "seriesId".',
      );
    });

    it('should not throw an error when the scales are correct', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScale(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band', data: [] },
          },
        );
      }).not.to.throw();
    });
  });

  it('should throw an error specifying the x-axis id when it is not the default one', () => {
    expect(() => {
      const xKey = 'x-test';
      const yKey = 'y-test';
      checkScale(
        true,
        'seriesId',
        xKey,
        {
          // @ts-expect-error
          [xKey]: { id: xKey, scaleType: 'linear' },
        },
        yKey,
        {
          [yKey]: { id: yKey, scaleType: 'band' },
        },
      );
    }).throws(
      'MUI X Charts: The x-axis with id "x-test" should be of type "band" to display the bar series of id "seriesId".',
    );
  });

  it('should throw an error specifying the y-axis id when it is not the default one', () => {
    expect(() => {
      const xKey = 'x-test';
      const yKey = 'y-test';
      checkScale(
        false,
        'seriesId',
        xKey,
        {
          // @ts-expect-error
          [xKey]: { id: xKey, scaleType: 'band' },
        },
        yKey,
        {
          [yKey]: { id: yKey, scaleType: 'linear' },
        },
      );
    }).throws(
      'MUI X Charts: The y-axis with id "y-test" should be of type "band" to display the bar series of id "seriesId".',
    );
  });
});
