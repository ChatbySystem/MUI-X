import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, reactMajor, screen } from '@mui/internal-test-utils';
import { useSvgRef } from './useSvgRef';
import { DrawingProvider } from '../context/DrawingProvider';

function UseSvgRef() {
  const ref = useSvgRef();
  return <div>{ref.current?.id}</div>;
}

describe('useSvgRef', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', function test() {
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    const errorRef = React.createRef<any>();

    const errorMessage1 = 'MUI X: Could not find the svg ref context.';
    const errorMessage2 =
      'It looks like you rendered your component outside of a ChartsContainer parent component.';
    const errorMessage3 = 'The above error occurred in the <UseSvgRef> component:';
    const expextedError =
      reactMajor < 19
        ? [errorMessage1, errorMessage2, errorMessage3]
        : `${errorMessage1}\n${errorMessage2}`;

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSvgRef />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expextedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the svg ref context.',
    );
  });

  it('should not throw an error when parent context is present', async () => {
    function RenderDrawingProvider() {
      const ref = React.useRef<SVGSVGElement | null>(null);

      return (
        <svg ref={ref} id="test-id">
          <DrawingProvider svgRef={ref} width={1} height={1}>
            <UseSvgRef />
          </DrawingProvider>
        </svg>
      );
    }

    const { forceUpdate } = render(<RenderDrawingProvider />);

    // Ref is not available on first render.
    forceUpdate();

    expect(await screen.findByText('test-id')).toBeVisible();
  });
});
