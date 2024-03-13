import { expect } from 'chai';
import { spy } from 'sinon';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals';
import { act, fireEvent } from '@mui-internal/test-utils';

describeTreeView<UseTreeViewExpansionSignature>('useTreeViewExpansion plugin', ({ render }) => {
  describe('expandedItems / defaultExpandedItems / onExpandedItemsChange props', () => {
    it('should not expand items when no default state and no control state are defined', () => {
      const { getItemRoot, getAllItemRoots } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      expect(getAllItemRoots()).to.have.length(2);
    });

    it('should use the default state when defined', () => {
      const { getItemRoot, getAllItemRoots } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedNodes: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      expect(getAllItemRoots()).to.have.length(3);
    });

    it('should use the control state when defined', () => {
      const { getItemRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        expandedNodes: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      expect(getItemRoot('1.1')).toBeVisible();
    });

    it('should use the control state upon the default state when both are defined', () => {
      const { getItemRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        expandedNodes: ['1'],
        defaultExpandedNodes: ['2'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should react to control state update', () => {
      const { getItemRoot, setProps } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        expandedNodes: [],
      });

      setProps({ expandedNodes: ['1'] });
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should call callback when expanded items are updated (add expanded item to empty list)', () => {
      const onExpandedNodesChange = spy();

      const { getItemContent, getRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }],
        onExpandedNodesChange,
      });

      fireEvent.click(getItemContent('1'));
      act(() => {
        getRoot().focus();
      });

      expect(onExpandedNodesChange.callCount).to.equal(1);
      expect(onExpandedNodesChange.lastCall.args[1]).to.deep.equal(['1']);
    });

    it('should call callback when expanded items are updated (add expanded item no non-empty list)', () => {
      const onExpandedNodesChange = spy();

      const { getItemContent, getRoot } = render({
        items: [
          { id: '1', children: [{ id: '1.1' }] },
          { id: '2', children: [{ id: '2.1' }] },
        ],
        onExpandedNodesChange,
        defaultExpandedNodes: ['1'],
      });

      fireEvent.click(getItemContent('2'));
      act(() => {
        getRoot().focus();
      });

      expect(onExpandedNodesChange.callCount).to.equal(1);
      expect(onExpandedNodesChange.lastCall.args[1]).to.deep.equal(['2', '1']);
    });

    it('should call callback when expanded items are updated (remove expanded item)', () => {
      const onExpandedNodesChange = spy();

      const { getItemContent, getRoot } = render({
        items: [
          { id: '1', children: [{ id: '1.1' }] },
          { id: '2', children: [{ id: '2.1' }] },
        ],
        onExpandedNodesChange,
        defaultExpandedNodes: ['1'],
      });

      fireEvent.click(getItemContent('1'));
      act(() => {
        getRoot().focus();
      });

      expect(onExpandedNodesChange.callCount).to.equal(1);
      expect(onExpandedNodesChange.lastCall.args[1]).to.deep.equal([]);
    });

    it('should warn when switching from controlled to uncontrolled', () => {
      const { setProps } = render({
        items: [{ id: '1' }],
        expandedNodes: [],
      });

      expect(() => {
        setProps({ expandedNodes: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled expandedNodes state of TreeView to be uncontrolled.',
      );
    });

    it('should warn and not react to update when updating the default state', () => {
      const { getItemRoot, setProps } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedNodes: ['1'],
      });

      expect(() => {
        setProps({ defaultExpandedNodes: ['2'] });
        expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
        expect(getItemRoot('2')).not.to.have.attribute('aria-expanded', 'true');
      }).toErrorDev(
        'MUI X: A component is changing the default expandedNodes state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.',
      );
    });
  });

  describe('basic interactions', () => {
    it('should expand collapsed item when clicking on its content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should collapse expanded item when clicking on its content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedNodes: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
    });

    it('should expand collapsed item when pressing Enter', () => {
      const { getItemRoot, getRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      act(() => {
        getRoot().focus();
      });
      fireEvent.keyDown(getRoot(), { key: 'Enter' });
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should collapse expanded item when pressing Enter', () => {
      const { getItemRoot, getRoot } = render({
        items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedNodes: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      act(() => {
        getRoot().focus();
      });
      fireEvent.keyDown(getRoot(), { key: 'Enter' });
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
    });
  });

  describe('disabled item', () => {
    it('should not expand collapsed item when clicking on its content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
    });

    it('should not collapse expanded item when clicking on its content', () => {
      const { getItemRoot, getItemContent } = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedNodes: ['1'],
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      fireEvent.click(getItemContent('1'));
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });

    it('should not expand collapsed item when pressing Enter', () => {
      const { getItemRoot, getRoot } = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
        disabledItemsFocusable: true,
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
      act(() => {
        getRoot().focus();
      });
      fireEvent.keyDown(getRoot(), { key: 'Enter' });
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'false');
    });

    it('should not collapse expanded item when pressing Enter', () => {
      const { getItemRoot, getRoot } = render({
        items: [{ id: '1', disabled: true, children: [{ id: '1.1' }] }, { id: '2' }],
        defaultExpandedNodes: ['1'],
        disabledItemsFocusable: true,
      });

      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
      act(() => {
        getRoot().focus();
      });
      fireEvent.keyDown(getRoot(), { key: 'Enter' });
      expect(getItemRoot('1')).to.have.attribute('aria-expanded', 'true');
    });
  });
});
