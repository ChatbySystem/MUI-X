import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from '../../../../../pages/api-docs/data-grid/grid-edit-row-api.json';

export default function FilterApiNoSnap() {
  return <ApiDocs api={api} />;
}
