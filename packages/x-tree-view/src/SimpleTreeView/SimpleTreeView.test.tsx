import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { act, createRenderer, ErrorBoundary, fireEvent, screen } from '@mui-internal/test-utils';
import Portal from '@mui/material/Portal';
import { SimpleTreeView, simpleTreeViewClasses as classes } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { describeConformance } from 'test/utils/describeConformance';
import { useTreeViewApiRef } from '../hooks';
import { SimpleTreeViewApiRef } from './SimpleTreeView.types';

describe('<SimpleTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<SimpleTreeView />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiSimpleTreeView',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describe('warnings', () => {
    it('should warn when switching from controlled to uncontrolled of the expandedNodes prop', () => {
      const { setProps } = render(
        <SimpleTreeView expandedNodes={[]}>
          <TreeItem nodeId="1" label="one" />
        </SimpleTreeView>,
      );

      expect(() => {
        setProps({ expandedNodes: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled expandedNodes state of TreeView to be uncontrolled.',
      );
    });

    it('should warn when switching from controlled to uncontrolled of the selectedNodes prop', () => {
      const { setProps } = render(
        <SimpleTreeView selectedNodes={null}>
          <TreeItem nodeId="1" label="one" />
        </SimpleTreeView>,
      );

      expect(() => {
        setProps({ selectedNodes: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled selectedNodes state of TreeView to be uncontrolled.',
      );
    });

    it('should not crash when shift clicking a clean tree', () => {
      render(
        <SimpleTreeView multiSelect>
          <TreeItem nodeId="one" label="one" />
          <TreeItem nodeId="two" label="two" />
        </SimpleTreeView>,
      );

      fireEvent.click(screen.getByText('one'), { shiftKey: true });
    });

    it('should not crash when selecting multiple items in a deeply nested tree', () => {
      render(
        <SimpleTreeView multiSelect defaultExpandedNodes={['1', '1.1', '2']}>
          <TreeItem nodeId="1" label="Item 1">
            <TreeItem nodeId="1.1" label="Item 1.1">
              <TreeItem nodeId="1.1.1" data-testid="item-1.1.1" label="Item 1.1.1" />
            </TreeItem>
          </TreeItem>
          <TreeItem nodeId="2" data-testid="item-2" label="Item 2" />
        </SimpleTreeView>,
      );
      fireEvent.click(screen.getByText('Item 1.1.1'));
      fireEvent.click(screen.getByText('Item 2'), { shiftKey: true });

      expect(screen.getByTestId('item-1.1.1')).to.have.attribute('aria-selected', 'true');
      expect(screen.getByTestId('item-2')).to.have.attribute('aria-selected', 'true');
    });

    it('should not crash when unmounting with duplicate ids', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function CustomTreeItem(props: any) {
        return <TreeItem nodeId="iojerogj" />;
      }
      function App() {
        const [isVisible, hideTreeView] = React.useReducer(() => false, true);

        return (
          <React.Fragment>
            <button onClick={hideTreeView} type="button">
              Toggle
            </button>
            {isVisible && (
              <SimpleTreeView>
                <TreeItem nodeId="a" label="b">
                  <CustomTreeItem nodeId="a" />
                </TreeItem>
              </SimpleTreeView>
            )}
          </React.Fragment>
        );
      }
      const errorRef = React.createRef<ErrorBoundary>();
      render(
        <ErrorBoundary ref={errorRef}>
          <App />
        </ErrorBoundary>,
      );

      expect(() => {
        act(() => {
          screen.getByRole('button').click();
        });
      }).not.toErrorDev();
    });
  });

  it('should call onKeyDown when a key is pressed', () => {
    const handleTreeViewKeyDown = spy();
    const handleTreeItemKeyDown = spy();

    const { getByTestId } = render(
      <SimpleTreeView onKeyDown={handleTreeViewKeyDown}>
        <TreeItem nodeId="one" data-testid="one" onKeyDown={handleTreeItemKeyDown} />
      </SimpleTreeView>,
    );
    act(() => {
      getByTestId('one').focus();
    });

    fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });
    fireEvent.keyDown(getByTestId('one'), { key: 'A' });
    fireEvent.keyDown(getByTestId('one'), { key: ']' });

    expect(handleTreeViewKeyDown.callCount).to.equal(3);
    expect(handleTreeItemKeyDown.callCount).to.equal(3);
  });

  it('should select node when Enter key is pressed ', () => {
    const handleKeyDown = spy();

    const { getByTestId } = render(
      <SimpleTreeView onKeyDown={handleKeyDown}>
        <TreeItem nodeId="one" data-testid="one" />
      </SimpleTreeView>,
    );
    act(() => {
      getByTestId('one').focus();
    });

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');

    fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });

    expect(getByTestId('one')).to.have.attribute('aria-selected');
  });

  it('should be able to be controlled with the expandedNodes prop', () => {
    function MyComponent() {
      const [expandedState, setExpandedState] = React.useState([]);
      const onExpandedNodesChange = (event, nodes) => {
        setExpandedState(nodes);
      };
      return (
        <SimpleTreeView expandedNodes={expandedState} onExpandedNodesChange={onExpandedNodesChange}>
          <TreeItem nodeId="one" label="one" data-testid="one">
            <TreeItem nodeId="two" />
          </TreeItem>
        </SimpleTreeView>
      );
    }

    const { getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

    fireEvent.click(getByText('one'));
    act(() => {
      getByTestId('one').focus();
    });

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

    fireEvent.keyDown(getByTestId('one'), { key: '*' });

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
  });

  it('should be able to be controlled with the selectedNodes prop and singleSelect', () => {
    function MyComponent() {
      const [selectedState, setSelectedState] = React.useState(null);
      const onSelectedNodesChange = (event, nodes) => {
        setSelectedState(nodes);
      };
      return (
        <SimpleTreeView selectedNodes={selectedState} onSelectedNodesChange={onSelectedNodesChange}>
          <TreeItem nodeId="1" label="one" data-testid="one" />
          <TreeItem nodeId="2" label="two" data-testid="two" />
        </SimpleTreeView>
      );
    }

    const { getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');
    expect(getByTestId('two')).not.to.have.attribute('aria-selected');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
    expect(getByTestId('two')).not.to.have.attribute('aria-selected');

    fireEvent.click(getByText('two'));

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
  });

  it('should be able to be controlled with the selectedNodes prop and multiSelect', () => {
    function MyComponent() {
      const [selectedState, setSelectedState] = React.useState([]);
      const onSelectedNodesChange = (event, nodes) => {
        setSelectedState(nodes);
      };
      return (
        <SimpleTreeView
          selectedNodes={selectedState}
          onSelectedNodesChange={onSelectedNodesChange}
          multiSelect
        >
          <TreeItem nodeId="1" label="one" data-testid="one" />
          <TreeItem nodeId="2" label="two" data-testid="two" />
        </SimpleTreeView>
      );
    }

    const { getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

    fireEvent.click(getByText('two'), { ctrlKey: true });

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
  });

  it('should not error when component state changes', () => {
    function MyComponent() {
      const [, setState] = React.useState(1);

      return (
        <SimpleTreeView
          defaultExpandedNodes={['one']}
          onNodeFocus={() => {
            setState(Math.random);
          }}
        >
          <TreeItem nodeId="one" data-testid="one">
            <TreeItem nodeId="two" data-testid="two" />
          </TreeItem>
        </SimpleTreeView>
      );
    }

    const { getByTestId } = render(<MyComponent />);

    fireEvent.focus(getByTestId('one'));
    fireEvent.focus(getByTestId('one'));
    expect(getByTestId('one')).toHaveFocus();

    fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveFocus();

    fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp' });

    expect(getByTestId('one')).toHaveFocus();

    fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveFocus();
  });

  it('should support conditional rendered tree items', () => {
    function TestComponent() {
      const [hide, setState] = React.useState(false);

      return (
        <React.Fragment>
          <button type="button" onClick={() => setState(true)}>
            Hide
          </button>
          <SimpleTreeView>{!hide && <TreeItem nodeId="test" label="test" />}</SimpleTreeView>
        </React.Fragment>
      );
    }

    const { getByText, queryByText } = render(<TestComponent />);

    expect(getByText('test')).not.to.equal(null);
    fireEvent.click(getByText('Hide'));
    expect(queryByText('test')).to.equal(null);
  });

  it('should work in a portal', () => {
    const { getByTestId } = render(
      <Portal>
        <SimpleTreeView>
          <TreeItem nodeId="one" data-testid="one" />
          <TreeItem nodeId="two" data-testid="two" />
          <TreeItem nodeId="three" data-testid="three" />
          <TreeItem nodeId="four" data-testid="four" />
        </SimpleTreeView>
      </Portal>,
    );

    act(() => {
      getByTestId('one').focus();
    });
    fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveFocus();

    fireEvent.keyDown(getByTestId('two'), { key: 'ArrowDown' });

    expect(getByTestId('three')).toHaveFocus();

    fireEvent.keyDown(getByTestId('three'), { key: 'ArrowDown' });

    expect(getByTestId('four')).toHaveFocus();
  });

  describe('onNodeFocus', () => {
    it('should be called when a node is focused', () => {
      const onFocus = spy();
      const { getByTestId } = render(
        <SimpleTreeView onNodeFocus={onFocus}>
          <TreeItem nodeId="one" data-testid="one" />
        </SimpleTreeView>,
      );

      act(() => {
        getByTestId('one').focus();
      });

      expect(onFocus.callCount).to.equal(1);
      expect(onFocus.args[0][1]).to.equal('one');
    });
  });

  describe('onNodeToggle', () => {
    it('should be called when a parent node label is clicked', () => {
      const onExpandedNodesChange = spy();

      const { getByText } = render(
        <SimpleTreeView onExpandedNodesChange={onExpandedNodesChange}>
          <TreeItem nodeId="1" label="outer">
            <TreeItem nodeId="2" label="inner" />
          </TreeItem>
        </SimpleTreeView>,
      );

      fireEvent.click(getByText('outer'));

      expect(onExpandedNodesChange.callCount).to.equal(1);
      expect(onExpandedNodesChange.args[0][1]).to.deep.equal(['1']);
    });

    it('should be called when a parent node icon is clicked', () => {
      const onExpandedNodesChange = spy();

      const { getByTestId } = render(
        <SimpleTreeView onExpandedNodesChange={onExpandedNodesChange}>
          <TreeItem slots={{ icon: () => <div data-testid="icon" /> }} nodeId="1" label="outer">
            <TreeItem nodeId="2" label="inner" />
          </TreeItem>
        </SimpleTreeView>,
      );

      fireEvent.click(getByTestId('icon'));

      expect(onExpandedNodesChange.callCount).to.equal(1);
      expect(onExpandedNodesChange.args[0][1]).to.deep.equal(['1']);
    });
  });

  describe('useTreeViewFocus', () => {
    it('should set tabIndex={0} on the selected item', () => {
      const { getByTestId } = render(
        <SimpleTreeView selectedNodes="one">
          <TreeItem nodeId="one" data-testid="one" />
          <TreeItem nodeId="two" data-testid="two" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('two').tabIndex).to.equal(-1);
    });

    it('should set tabIndex={0} on the selected item (multi select)', () => {
      const { getByTestId } = render(
        <SimpleTreeView multiSelect selectedNodes={['one']}>
          <TreeItem nodeId="one" data-testid="one" />
          <TreeItem nodeId="two" data-testid="two" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('two').tabIndex).to.equal(-1);
    });

    it('should set tabIndex={0} on the first visible selected item (multi select)', () => {
      const { getByTestId } = render(
        <SimpleTreeView multiSelect selectedNodes={['two', 'three']}>
          <TreeItem nodeId="one" data-testid="one">
            <TreeItem nodeId="two" data-testid="two" />
          </TreeItem>
          <TreeItem nodeId="three" data-testid="three" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(-1);
      expect(getByTestId('three').tabIndex).to.equal(0);
    });

    it('should set tabIndex={0} on the first item if the selected item is not visible', () => {
      const { getByTestId } = render(
        <SimpleTreeView selectedNodes="two">
          <TreeItem nodeId="one" data-testid="one">
            <TreeItem nodeId="two" data-testid="two" />
          </TreeItem>
          <TreeItem nodeId="three" data-testid="three" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('three').tabIndex).to.equal(-1);
    });

    it('should set tabIndex={0} on the first item if no selected item is visible (multi select)', () => {
      const { getByTestId } = render(
        <SimpleTreeView multiSelect selectedNodes={['two']}>
          <TreeItem nodeId="one" data-testid="one">
            <TreeItem nodeId="two" data-testid="two" />
          </TreeItem>
          <TreeItem nodeId="three" data-testid="three" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('three').tabIndex).to.equal(-1);
    });

    it('should focus specific node using `apiRef`', () => {
      let apiRef: SimpleTreeViewApiRef;
      const onNodeFocus = spy();

      function TestCase() {
        apiRef = useTreeViewApiRef();
        return (
          <SimpleTreeView apiRef={apiRef} onNodeFocus={onNodeFocus}>
            <TreeItem nodeId="one" data-testid="one">
              <TreeItem nodeId="two" data-testid="two" />
            </TreeItem>
            <TreeItem nodeId="three" data-testid="three" />
          </SimpleTreeView>
        );
      }

      const { getByTestId } = render(<TestCase />);

      act(() => {
        apiRef.current?.focusNode({} as React.SyntheticEvent, 'three');
      });

      expect(getByTestId('three')).toHaveFocus();
      expect(onNodeFocus.lastCall.lastArg).to.equal('three');
    });

    it('should not focus node if parent is collapsed', () => {
      let apiRef: SimpleTreeViewApiRef;
      const onNodeFocus = spy();

      function TestCase() {
        apiRef = useTreeViewApiRef();
        return (
          <SimpleTreeView apiRef={apiRef} onNodeFocus={onNodeFocus}>
            <TreeItem nodeId="1" label="1">
              <TreeItem nodeId="1.1" label="1.1" />
            </TreeItem>
            <TreeItem nodeId="2" label="2" />
          </SimpleTreeView>
        );
      }

      const { getByRole } = render(<TestCase />);

      act(() => {
        apiRef.current?.focusNode({} as React.SyntheticEvent, '1.1');
      });

      expect(getByRole('tree')).not.toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('(TreeView) should have the role `tree`', () => {
      const { getByRole } = render(<SimpleTreeView />);

      expect(getByRole('tree')).not.to.equal(null);
    });

    it('(TreeView) should have the attribute `aria-multiselectable=false if using single select`', () => {
      const { getByRole } = render(<SimpleTreeView />);

      expect(getByRole('tree')).to.have.attribute('aria-multiselectable', 'false');
    });

    it('(TreeView) should have the attribute `aria-multiselectable=true if using multi select`', () => {
      const { getByRole } = render(<SimpleTreeView multiSelect />);

      expect(getByRole('tree')).to.have.attribute('aria-multiselectable', 'true');
    });
  });
});
