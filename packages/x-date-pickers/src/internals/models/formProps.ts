export interface FormProps {
  /**
   * If `true`, the component will be disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the component will be read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
   * @default false
   */
  readOnly?: boolean;
}
