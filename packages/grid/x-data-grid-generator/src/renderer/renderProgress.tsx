import * as React from 'react';
import clsx from 'clsx';
import { GridCellParams } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';

interface ProgressBarProps {
  value: number;
}

const Root = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 2,
}));

const Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Bar = styled('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336',
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3',
  },
  '&.high': {
    backgroundColor: '#088208a3',
  },
});

const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { value } = props;
  const valueInPercent = value * 100;

  return (
    <Root>
      <Value>{`${valueInPercent.toLocaleString()} %`}</Value>
      <Bar
        className={clsx({
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </Root>
  );
});

export function renderProgress(params: GridCellParams) {
  return <ProgressBar value={Number(params.value)!} />;
}
