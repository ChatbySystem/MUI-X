import * as React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { GridCellParams } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.Open': {
    color: theme.palette.info.dark,
    border: `1px solid ${theme.palette.info.main}`,
  },
  '&.Filled': {
    color: theme.palette.success.dark,
    border: `1px solid ${theme.palette.success.main}`,
  },
  '&.PartiallyFilled': {
    color: theme.palette.warning.dark,
    border: `1px solid ${theme.palette.warning.main}`,
  },
  '&.Rejected': {
    color: theme.palette.error.dark,
    border: `1px solid ${theme.palette.error.main}`,
  },
}));

interface StatusProps {
  status: string;
}

const Status = React.memo((props: StatusProps) => {
  const { status } = props;

  let icon: any = null;
  if (status === 'Rejected') {
    icon = <ReportProblemIcon className="icon" />;
  } else if (status === 'Open') {
    icon = <InfoIcon className="icon" />;
  } else if (status === 'PartiallyFilled') {
    icon = <AutorenewIcon className="icon" />;
  } else if (status === 'Filled') {
    icon = <DoneIcon className="icon" />;
  }

  let label: string = status;
  if (status === 'PartiallyFilled') {
    label = 'Partially Filled';
  }

  return (
    <StyledChip className={status} icon={icon} size="small" label={label} variant="outlined" />
  );
});

export function renderStatus(params: GridCellParams) {
  return <Status status={params.value!.toString()} />;
}
