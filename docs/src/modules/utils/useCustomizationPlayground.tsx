import * as React from 'react';
import { useTheme, Theme } from '@mui/system';
import pick from 'lodash/pick';
import { blue, grey, deepPurple, amber, pink } from '@mui/material/colors';
import { BoxProps } from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export type CustomizationLabelType = {
  [k in 'customTheme' | 'styledComponents' | 'sxProp']: string;
};

type CustomizationItemType = {
  type: 'warning' | 'success';
  comments?: string;
  componentProps?: Object;
};
export type CustomizationItemsType = Partial<{
  [k in keyof CustomizationLabelType]: CustomizationItemType;
}>;

export type PickersSubcomponentType = {
  [k: string]: { examples: CustomizationItemsType; slots: string[] };
};

export interface UseCustomizationPlaygroundProps {
  examples: PickersSubcomponentType;
  children?: React.ReactElement | React.ReactElement[];
  componentName: string;
}
export const customizationLabels: CustomizationLabelType = {
  customTheme: 'Custom Theme',
  styledComponents: 'Styled Components',
  sxProp: 'SX Prop',
};

export const DEFAULT_COLORS = { deepPurple, amber, pink, blue, grey };
export type ColorKey = keyof typeof DEFAULT_COLORS;

export type StyleTokensType = {
  color: ColorKey;
  padding: number;
  borderRadius: number;
  borderWidth: number;
};
const styleTokens: StyleTokensType = {
  color: 'deepPurple',
  padding: 1,
  borderRadius: 2,
  borderWidth: 1,
};
export type HandleTokenChangeType = (
  token: keyof Partial<typeof styleTokens>,
  value: string | keyof typeof DEFAULT_COLORS | number,
) => void;

export type UseCustomizationPlaygroundReturnType = {
  selectedDemo: string | null;
  customizationOptions: Partial<CustomizationLabelType> | null;
  selectedCustomizationOption: keyof CustomizationLabelType | null;
  selectDemo: (interactionTarget: string | null) => void;
  setSelectedCustomizationOption: (
    customizationOption: keyof CustomizationLabelType | null,
  ) => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  codeExample: string | null;
  availableSlots: string[] | null;
  handleTokenChange: HandleTokenChangeType;
  selectedTokens: StyleTokensType;
};

export function withStyles(
  Component: React.ElementType,
  selectedTokens: StyleTokensType,
  selectedCustomizationOption: string | null,
  selectedDemo: string | null,
  selectedSlot: string | null,
) {
  return function StyledChild<T extends BoxProps>(props: T) {
    const theme = useTheme();

    const tokens = {
      padding: selectedTokens.padding,
      borderRadius: selectedTokens.borderRadius,
      borderColor: DEFAULT_COLORS[selectedTokens.color][500],
      border: `${selectedTokens.borderWidth}px solid`,
      backgroundColor:
        theme.palette.mode === 'light'
          ? DEFAULT_COLORS[selectedTokens.color][100]
          : DEFAULT_COLORS[selectedTokens.color][700],
      color:
        theme.palette.mode === 'light'
          ? DEFAULT_COLORS[selectedTokens.color][900]
          : DEFAULT_COLORS[selectedTokens.color][100],
    };

    if (selectedCustomizationOption === 'sxProp') {
      const sxProp = {
        [`& .Mui${selectedDemo}-${selectedSlot}`]: { ...tokens },
      };
      return <Component {...props} sx={{ ...sxProp, ...props?.sx }} />;
    }

    if (selectedCustomizationOption === 'customTheme') {
      const newTheme = createTheme({
        components: {
          [`Mui${selectedDemo}`]: { styleOverrides: { [selectedSlot as string]: { ...tokens } } },
        },
      });
      return (
        <ThemeProvider theme={newTheme}>
          <Component {...props} />
        </ThemeProvider>
      );
    }

    if (selectedCustomizationOption === 'styledComponents') {
      const StyledComponent = styled(Component as React.JSXElementConstructor<any>)(() => ({
        [`& .Mui${selectedDemo}-${selectedSlot}`]: { ...tokens },
      }));
      return <StyledComponent {...props} />;
    }
    return <Component {...props} />;
  };
}

interface Props
  extends Pick<
      UseCustomizationPlaygroundReturnType,
      'selectedDemo' | 'selectedSlot' | 'selectedCustomizationOption' | 'selectedTokens'
    >,
    Pick<UseCustomizationPlaygroundProps, 'componentName'> {
  theme: Theme;
  examples: CustomizationItemType;
}

function formatComponentProps(componentProps: Object) {
  function formatObject(obj: Object, indentLevel = 0, separator = ': '): string {
    const indent = ' '.repeat(indentLevel * 2);
    return (Object.keys(obj) as Array<keyof typeof obj>)
      .map((key) => {
        const value = obj[key];
        if (typeof value === 'object') {
          return `${indent}${key}${separator}${separator === '=' ? '{' : ''}{\n${formatObject(
            value,
            indentLevel + 1,
            ': ',
          )}\n${indent}${separator === '=' ? '}' : ''}}`;
        }
        return `${indent}${key}${separator}${separator === '=' ? '{' : ''}${value}${
          separator === '=' ? '}' : ''
        }`;
      })
      .join('\n');
  }

  if (!componentProps) {
    return '';
  }

  return `\n${formatObject(componentProps, 1, '=')}`;
}

const getCodeExample = ({
  selectedDemo,
  selectedSlot,
  selectedCustomizationOption,
  selectedTokens,
  componentName,
  examples,
  theme,
}: Props) => {
  const tokens = {
    ...selectedTokens,
    borderColor: DEFAULT_COLORS[selectedTokens.color][500],
    border: `${selectedTokens.borderWidth}px solid`,
    backgroundColor:
      theme.palette.mode === 'light'
        ? DEFAULT_COLORS[selectedTokens.color][100]
        : DEFAULT_COLORS[selectedTokens.color][700],
    color:
      theme.palette.mode === 'light'
        ? DEFAULT_COLORS[selectedTokens.color][700]
        : DEFAULT_COLORS[selectedTokens.color][100],
  };

  const getTokensString = (indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    return (Object.keys(tokens) as Array<keyof typeof tokens>).reduce((acc, key) => {
      return `${acc}\n${spaces}${key}: ${
        typeof tokens[key] === 'string' ? `'${tokens[key]}'` : tokens[key]
      },`;
    }, '');
  };

  const componentProps = examples?.componentProps
    ? formatComponentProps(examples.componentProps)
    : '';

  let code = examples?.comments ? `\n// ${examples?.comments}` : '';

  if (selectedCustomizationOption === 'sxProp') {
    code = `${code}\n<${componentName} ${componentProps}
  sx={{
    '& .Mui${selectedDemo}-${selectedSlot}': {${getTokensString(3)}
    },
  }}
/>`;
  } else if (selectedCustomizationOption === 'customTheme') {
    code = `import { createTheme } from '@mui/material/styles'\n${code}
<ThemeProvider 
  theme={
    createTheme({
      components: {
        Mui${selectedDemo}: {
          styleOverrides: {
            ${selectedSlot}:{${getTokensString(7)}
            }
          }
        }
    })
  }
>
  <${componentName} />
</ThemeProvider>`;
  } else if (selectedCustomizationOption === 'styledComponents') {
    return `import { styled } from '@mui/material/styles'\n${code}
const Styled${componentName} = styled(${componentName})({
  '& .Mui${selectedDemo}-${selectedSlot}': {${getTokensString(3)}
}))\n
export default function StyledPickerContainer() {
  return (
    <StyledPicker ${componentProps.trim()}/>
  );
}`;
  }

  return code;
};

export function useCustomizationPlayground({
  examples,
  componentName,
}: UseCustomizationPlaygroundProps): UseCustomizationPlaygroundReturnType {
  const theme = useTheme();

  const [selectedDemo, setSelectedDemo] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] =
    React.useState<Partial<CustomizationLabelType> | null>(null);
  const [selectedCustomizationOption, setSelectedCustomizationOption] = React.useState<
    keyof CustomizationLabelType | null
  >(null);

  const [codeExample, setCodeExample] = React.useState<string | null>(null);

  const [selectedTokens, setSelectedTokens] = React.useState<StyleTokensType>(styleTokens);

  React.useEffect(() => {
    setSelectedDemo(Object.keys(examples)[0]);
  }, [examples]);

  const setOptions = React.useCallback(
    (demo: string) => {
      const slot = examples[demo]?.slots?.length ? examples[demo]?.slots[0] : 'root';
      const customizationExamples = Object.keys(examples[demo].examples) as Array<
        keyof CustomizationLabelType
      >;
      // set the array of customization options to the available options for the selected subcomponent
      setCustomizationOptions(pick(customizationLabels, customizationExamples));
      // set the selected customization option to the first available option for the selected subcomponent
      setSelectedCustomizationOption(customizationExamples[0]);
      setSelectedSlot(slot);
    },
    [examples, setSelectedCustomizationOption, setSelectedSlot],
  );

  React.useEffect(() => {
    if (selectedDemo) {
      setOptions(selectedDemo);
    }
  }, [selectedDemo, setOptions]);

  React.useEffect(() => {
    if (selectedDemo && selectedCustomizationOption) {
      const code = getCodeExample({
        selectedDemo,
        selectedSlot,
        selectedCustomizationOption,
        selectedTokens,
        componentName,
        examples: examples[selectedDemo]?.examples[
          selectedCustomizationOption
        ] as CustomizationItemType,
        theme,
      });
      if (code) {
        setCodeExample(code);
      }
    }
  }, [
    selectedDemo,
    examples,
    selectedTokens,
    theme,
    selectedSlot,
    selectedCustomizationOption,
    componentName,
  ]);

  const selectDemo = (interactionTarget: string | null) => {
    setSelectedDemo(interactionTarget);
  };

  const handleTokenChange = (
    token: keyof typeof styleTokens,
    value: string | keyof typeof DEFAULT_COLORS | number,
  ) => {
    setSelectedTokens((prev: StyleTokensType) => ({ ...prev, [token]: value }));
  };

  return {
    selectedDemo,
    customizationOptions,
    selectedCustomizationOption,
    selectDemo,
    setSelectedCustomizationOption,
    selectedSlot,
    setSelectedSlot,
    codeExample,
    availableSlots: selectedDemo ? examples[selectedDemo]?.slots : ['root'],
    handleTokenChange,
    selectedTokens,
  };
}
