import { usePickerTranslations } from '../../hooks';
import { AdapterFormats } from '../../models';
import { PickerValue } from '../models';
import { useUtils } from './useUtils';

export const useGetOpenDialogAriaText = (params: {
  formatKey: keyof AdapterFormats;
  translationKey: 'openDatePickerDialogue' | 'openTimePickerDialogue';
}) => {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const { formatKey, translationKey } = params;

  return (value: PickerValue) => {
    const formattedValue =
      value !== null && utils.isValid(value) ? utils.format(value, formatKey) : null;
    return translations[translationKey](formattedValue);
  };
};
