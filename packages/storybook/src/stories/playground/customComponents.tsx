import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import CodeIcon from '@material-ui/icons/Code';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
import {
  GridFooterContainer,
  GridOverlay,
  GridColumnMenu,
  HideGridColMenuItem,
  ColumnMenuProps,
  GridBaseComponentProps,
} from '@material-ui/data-grid';
import RecipeReviewCard from './RecipeReviewCard';

export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}

export function SortedAscendingIcon() {
  return <ExpandLessIcon className="icon" />;
}

export function LoadingComponent() {
  return (
    <GridOverlay className="custom-overlay">
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export function NoRowsComponent() {
  return (
    <GridOverlay className="custom-overlay">
      <CodeIcon />
      <span style={{ lineHeight: '24px', padding: '0 10px' }}>No Rows</span>
      <CodeIcon />
    </GridOverlay>
  );
}

export function PaginationComponent(props: GridBaseComponentProps & { color?: 'primary' }) {
  const { state, apiRef } = props;
  return (
    <Pagination
      className="my-custom-pagination"
      page={state.pagination.page}
      color={props.color}
      count={state.pagination.pageCount}
      onChange={(event, value) => apiRef.current.setPage(value)}
    />
  );
}

export function CustomFooter(props) {
  const { state, apiRef } = props;
  return (
    <GridFooterContainer className="my-custom-footer">
      <span style={{ display: 'flex', alignItems: 'center', background: props.color }}>
        Custom footer is here.
      </span>
      <Pagination
        className="my-custom-pagination"
        page={state.pagination.page}
        count={state.pagination.pageCount}
        onChange={(event, value) => apiRef.current.setPage(value)}
      />
    </GridFooterContainer>
  );
}

export function FooterComponent2(props) {
  const { state } = props;

  return (
    <div className="footer my-custom-footer"> I counted {state.pagination.rowCount} row(s) </div>
  );
}

export function CustomHeader(props) {
  return (
    <div className="custom-header">
      <PaginationComponent {...props} />
    </div>
  );
}

export function ColumnMenuComponent(props: ColumnMenuProps) {
  if (props.apiRef.current.getColumnIndex(props.currentColumn.field) === 1) {
    return <RecipeReviewCard />;
  }
  if (props.currentColumn.field === 'id') {
    return <HideGridColMenuItem onClick={props.hideMenu} column={props.currentColumn!} />;
  }

  return (
    <GridColumnMenu
      open={props.open}
      hideMenu={props.hideMenu}
      currentColumn={props.currentColumn}
    />
  );
}
