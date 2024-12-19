import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import Box, { BoxProps } from '@mui/material/Box';
import { RenderProp, useGridComponentRenderer } from './useGridComponentRenderer';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('useGridComponentRenderer', () => {
  const { render } = createRenderer();

  function TestComponent(
    props: React.ComponentPropsWithoutRef<'button'> & {
      render?: RenderProp<{ someState: string }>;
    },
  ) {
    const { render: renderProp, ...other } = props;
    return useGridComponentRenderer('button', renderProp, other, { someState: 'state value' });
  }

  it('should render intrinsic element type as default element', () => {
    render(<TestComponent data-testid="rendered-element">children</TestComponent>);
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLButtonElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should render component type as default element', () => {
    function CustomButton(props: React.ComponentPropsWithoutRef<'button'>) {
      return <button {...props} />;
    }
    function TestComponentWithCustomButton(props: React.ComponentPropsWithoutRef<'button'>) {
      return useGridComponentRenderer(CustomButton, undefined, props);
    }
    render(
      <TestComponentWithCustomButton data-testid="rendered-element">
        children
      </TestComponentWithCustomButton>,
    );
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLButtonElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should allow default element to be overridden by render prop set to a children', () => {
    render(<TestComponent data-testid="rendered-element" render={<div>children</div>} />);
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should allow default element to be overridden by render prop set to a function', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        render={(props) => <div {...props}>children</div>}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('children');
  });

  it('should pass state to render prop', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        render={(props, state) => <div {...props}>{state.someState}</div>}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.be.instanceOf(window.HTMLDivElement);
    expect(screen.getByTestId('rendered-element')).to.have.text('state value');
  });

  it('should merge className props', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        className="test-class-1"
        render={<div className="test-class-2" />}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.have.class('test-class-1');
    expect(screen.getByTestId('rendered-element')).to.have.class('test-class-2');
  });

  it('should merge style props', () => {
    render(
      <TestComponent
        data-testid="rendered-element"
        style={{ color: 'red' }}
        render={<div style={{ backgroundColor: 'blue' }} />}
      />,
    );
    expect(screen.getByTestId('rendered-element')).to.have.attribute(
      'style',
      'background-color: blue; color: red;',
    );
  });

  it('should merge sx props', function test() {
    if (isJSDOM) {
      // Doesn't work with mocked window.getComputedStyle
      this.skip();
    }

    function TestComponentWithSxProp(
      props: BoxProps & { render?: RenderProp<{ someState: string }> },
    ) {
      const { render: renderProp, ...other } = props;
      return useGridComponentRenderer(Box, renderProp, other as Omit<BoxProps, 'color'>);
    }
    render(
      <TestComponentWithSxProp
        data-testid="rendered-element"
        sx={{ color: 'red' }}
        render={<Box sx={{ backgroundColor: 'blue' }} />}
      />,
    );
    const computedStyle = window.getComputedStyle(screen.getByTestId('rendered-element'));
    expect(computedStyle.color).to.equal('rgb(255, 0, 0)');
    expect(computedStyle.backgroundColor).to.equal('rgb(0, 0, 255)');
  });
});
