import { base64Decode, base64Encode } from '../encoding/base64';
import { md5 } from '../encoding/md5';
import { LicenseStatus } from '../utils/licenseStatus';
import { LicenseScope } from '../utils/licenseScope';
import { LicenseTerm } from '../utils/licenseTerm';

const getDefaultReleaseDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
};

export function generateReleaseInfo(releaseDate = getDefaultReleaseDate()) {
  return base64Encode(releaseDate.getTime().toString());
}

const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;

interface MuiLicense {
  term: LicenseTerm | null;
  scope: LicenseScope | null;
  expiryTimestamp: number | null;
}

/**
 * Format: ORDER:${orderNumber},EXPIRY=${expiryTimestamp},KEYVERSION=1
 */
const decodeLicenseVersion1 = (license: string): MuiLicense => {
  let expiryTimestamp: number | null;
  try {
    expiryTimestamp = parseInt(license.match(expiryReg)![1], 10);
    if (!expiryTimestamp || Number.isNaN(expiryTimestamp)) {
      expiryTimestamp = null;
    }
  } catch (err) {
    expiryTimestamp = null;
  }

  return {
    scope: 'pro',
    term: 'perpetual',
    expiryTimestamp,
  };
};

/**
 * Format: ORDER=${orderNumber},EXPIRY=${expiryTimestamp},KEYVERSION=2,SCOPE=${scope},TERM=${term}`;
 */
const decodeLicenseVersion2 = (license: string): MuiLicense => {
  const licenseInfo: MuiLicense = {
    scope: null,
    term: null,
    expiryTimestamp: null,
  };

  license
    .split(',')
    .map((token) => token.split('='))
    .filter((el) => el.length === 2)
    .forEach(([key, value]) => {
      if (key === 'SCOPE') {
        licenseInfo.scope = value as LicenseScope;
      }

      if (key === 'TERM') {
        licenseInfo.term = value as LicenseTerm;
      }

      if (key === 'EXPIRY') {
        const expiryTimestamp = parseInt(value, 10);
        if (expiryTimestamp && !Number.isNaN(expiryTimestamp)) {
          licenseInfo.expiryTimestamp = expiryTimestamp;
        }
      }
    });

  return licenseInfo;
};

const decodeLicense = (encodedLicense: string): MuiLicense | null => {
  const license = base64Decode(encodedLicense);

  if (license.includes('KEYVERSION=1')) {
    return decodeLicenseVersion1(license);
  }

  if (license.includes('KEYVERSION=2')) {
    return decodeLicenseVersion2(license);
  }

  return null;
};

export function verifyLicense({
  releaseInfo,
  licenseKey,
  acceptedScopes,
  isProduction,
}: {
  releaseInfo: string;
  licenseKey: string | undefined;
  acceptedScopes: LicenseScope[];
  isProduction: boolean;
}) {
  if (!releaseInfo) {
    throw new Error('MUI: The release information is missing. Not able to validate license.');
  }

  if (!licenseKey) {
    return LicenseStatus.NotFound;
  }

  const hash = licenseKey.substr(0, 32);
  const encoded = licenseKey.substr(32);

  if (hash !== md5(encoded)) {
    return LicenseStatus.Invalid;
  }

  const license = decodeLicense(encoded);

  if (license == null) {
    console.error('Error checking license. Key version not found!');
    return LicenseStatus.Invalid;
  }

  if (license.term == null) {
    console.error('Error checking license. Term not found or invalid!');
    return LicenseStatus.Invalid;
  }

  if (license.expiryTimestamp == null) {
    console.error('Error checking license. Expiry timestamp not found or invalid!');
    return LicenseStatus.Invalid;
  }

  if (license.term === 'perpetual' || isProduction) {
    const pkgTimestamp = parseInt(base64Decode(releaseInfo), 10);
    if (Number.isNaN(pkgTimestamp)) {
      throw new Error('MUI: The release information is invalid. Not able to validate license.');
    }

    if (license.expiryTimestamp < pkgTimestamp) {
      return LicenseStatus.Expired;
    }
  } else if (license.term === 'subscription') {
    if (license.expiryTimestamp < new Date().getTime()) {
      return LicenseStatus.Expired;
    }
  }

  if (license.scope == null) {
    console.error('Error checking license. scope not found!');
    return LicenseStatus.Invalid;
  }

  if (!acceptedScopes.includes(license.scope)) {
    return LicenseStatus.Invalid;
  }

  return LicenseStatus.Valid;
}
