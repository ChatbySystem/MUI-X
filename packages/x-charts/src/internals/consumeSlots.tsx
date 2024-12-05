import { useTheme, useThemeProps } from '@mui/material/styles';
import deepmerge from '@mui/utils/deepmerge';
import useSlotProps from '@mui/utils/useSlotProps';
import * as React from 'react';

/**
 * A higher order component that consumes a slot from the props and renders the component provided in the slot.
 *
 * @param {string} name The mui component name.
 * @param {string} slotPropName The name of the prop to retrieve the slot from.
 * @param {object} options Options for the HOC.
 * @param {boolean} options.propagateSlots Whether to propagate the slots to the component, this is always false if the slot is provided.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
export const consumeSlots = <
  Props extends { slots?: Record<string, any>; slotProps?: Record<string, any> },
>(
  name: string,
  slotPropName: string,
  options: {
    propagateSlots?: boolean;
    defaultProps?: Omit<Partial<Props>, 'slots' | 'slotProps'>;
    classesResolver?: (props: Props, theme: any) => Record<string, string>;
  },
  InComponent: React.JSXElementConstructor<Props>,
) =>
  React.forwardRef(function (props: React.PropsWithoutRef<Props>, ref: React.Ref<any>) {
    const themedProps = useThemeProps({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name,
    });

    const defaultizedProps = deepmerge(themedProps, options.defaultProps) as Props;
    const { slots, slotProps, ...other } = defaultizedProps;

    const theme = useTheme();
    const classes = options.classesResolver?.(defaultizedProps, theme);

    const OutComponent = slots?.[slotPropName] ?? InComponent;

    const propagateSlots = options.propagateSlots && !slots?.[slotPropName];

    const outProps = useSlotProps({
      elementType: OutComponent,
      externalSlotProps: slotProps?.[slotPropName],
      additionalProps: {
        ...other,
        classes,
        ...(propagateSlots && { slots, slotProps }),
      },
      ownerState: {},
    });

    return <OutComponent {...outProps} ref={ref} />;
  });
