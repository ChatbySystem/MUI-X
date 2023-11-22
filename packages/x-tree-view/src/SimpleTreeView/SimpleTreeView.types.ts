import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { SimpleTreeViewClasses } from './simpleTreeViewClasses';
import { SimpleTreeViewPluginParameters } from './SimpleTreeView.plugins';

export interface SimpleTreeViewProps<Multiple extends boolean | undefined>
  extends SimpleTreeViewPluginParameters<Multiple>,
    React.HTMLAttributes<HTMLUListElement> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<SimpleTreeViewClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
