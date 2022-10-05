import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/aggregation/aggregation.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd />;
}
