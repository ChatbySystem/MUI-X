import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './grid-export-csv-trigger.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={pageContent} />;
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/data-grid/grid-export-csv-trigger',
    false,
    /\.\/grid-export-csv-trigger.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
