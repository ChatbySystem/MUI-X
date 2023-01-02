import transformColumnMenu from '../column-menu-components-rename';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  // Grid codemods
  file.source = transformColumnMenu(file, api, options);

  return file.source;
}
