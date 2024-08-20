import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { sharedLicenseStatuses } from '@mui/x-license/useLicenseVerifier/useLicenseVerifier';
import { ResponsiveChartContainerPro } from './ResponsiveChartContainerPro';
// eslint-disable-next-line import/order
import packageJson from '@mui/material/package.json';

// eslint-disable-next-line no-console
console.log(`@mui/x-charts-pro: @mui/material version`, packageJson.version);

describe('<ResponsiveChartContainerPro /> - License', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    Object.keys(sharedLicenseStatuses).forEach((key) => {
      delete sharedLicenseStatuses[key];
    });
  });

  it('should render watermark when the license is missing', async () => {
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(<ResponsiveChartContainerPro series={[]} width={100} height={100} />),
    ).toErrorDev(['MUI X: Missing license key.']);

    expect(await screen.findAllByText('MUI X Missing license key')).not.to.equal(null);
  });
});
