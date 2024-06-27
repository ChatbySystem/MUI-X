import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { test } from 'mocha';
import { LineChart } from './LineChart';

describe('<LineChart />', () => {
  const { render } = createRenderer();
  const testClass = 'test-class';

  test('should pass className prop to root component', () => {
    const { container } = render(
      <LineChart
        height={100}
        series={[
          {
            data: [100, 200],
          },
        ]}
        className={testClass}
      />,
    );
    expect(container.firstElementChild?.classList.contains(testClass)).to.equal(true);
  });
});
