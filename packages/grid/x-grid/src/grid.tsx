import React from 'react';

import { LicenseInfo, useLicenseVerifier } from '@material-ui/x-license';
import { GridComponent, GridProps } from '@material-ui/x-grid-modules';

const RELEASE_INFO = '__RELEASE_INFO__';
LicenseInfo.setReleaseInfo(RELEASE_INFO);

export const Grid: React.FC<Omit<GridProps, 'licenseStatus'>> = React.memo(props => {
  const licenseStatus = useLicenseVerifier();

  return <GridComponent {...props} licenseStatus={licenseStatus.toString()} />;
});
Grid.displayName = 'Grid';
