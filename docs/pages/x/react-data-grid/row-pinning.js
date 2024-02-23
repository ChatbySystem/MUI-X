import * as React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import * as pageProps from 'docsx/data/data-grid/row-pinning/row-pinning.md?@mui/internal-markdown';

export default function Page() {
  return <MarkdownDocs {...pageProps} disableAd />;
}
