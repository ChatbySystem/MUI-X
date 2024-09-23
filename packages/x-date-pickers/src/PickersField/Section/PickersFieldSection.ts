import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldSection } from './usePickersFieldSection';
import { PickersSectionElement } from '../../PickersSectionList';

const PickersFieldSection = React.forwardRef(function PickersFieldSection(
  props: PickersFieldSection.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, section, ...otherProps } = props;
  const ownerState: PickersFieldSection.OwnerState = {};

  const { getSectionProps } = usePickersFieldSection({ section });

  const { renderElement } = useComponentRenderer({
    propGetter: getSectionProps,
    render: render ?? 'span',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace PickersFieldSection {
  export interface OwnerState {}

  export interface Props extends BaseUIComponentProps<'span', OwnerState> {
    section: PickersSectionElement;
  }
}

export { PickersFieldSection };
