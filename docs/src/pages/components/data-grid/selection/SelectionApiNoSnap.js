import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-selection-api.json';

export default function SelectionApiNoSnap() {
  return <ApiDocs api={api} />;
}
