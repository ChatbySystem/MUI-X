import { UseFieldResponse } from '@mui/x-date-pickers/internals';

/* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
export const excludeClearableProps = <TTextFieldSlotProps extends {}>(
  props: UseFieldResponse<TTextFieldSlotProps>,
): UseFieldResponse<TTextFieldSlotProps> =>
  Object.keys(props).reduce((prev, key) => {
    if (key !== 'clearable' && key !== 'onClear') {
      return {
        ...prev,
        [key as keyof UseFieldResponse<TTextFieldSlotProps>]:
          props[key as keyof UseFieldResponse<TTextFieldSlotProps>],
      };
    }
    return prev;
  }, {}) as UseFieldResponse<TTextFieldSlotProps>;
