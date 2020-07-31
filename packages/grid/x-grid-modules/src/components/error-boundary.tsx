import * as React from 'react';
import { ErrorInfo } from 'react';
import { Logger } from '../hooks/utils/useLogger';
import { ApiRef } from '../models/api';

export interface ErrorBoundaryProps {
  logger: Logger;
  render: ({ error }: any) => React.ReactNode;
  api: ApiRef;
  hasError: boolean;
  componentProps?: any[];
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, {}> {
  constructor(props: any) {
    super(props);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.api.current) {
      this.logError(error);

      // Allows to trigger the Error event and all listener can run on Error
      this.props.api.current.showError({ error, errorInfo });
    }
  }

  logError(error: Error, errorInfo?: ErrorInfo) {
    this.props.logger.error(
      `An unexpected error occurred. Error: ${error && error.message}. `,
      error,
      errorInfo,
    );
  }

  render() {
    if (this.props.hasError) {
      // You can render any custom fallback UI
      return this.props.render(this.props.componentProps);
    }

    return this.props.children;
  }
}
