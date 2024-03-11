import PropTypes from 'prop-types';
import { TreeItem2ProviderProps } from './TreeItem2Provider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';

function TreeItem2Provider(props: TreeItem2ProviderProps) {
  const { children, nodeId } = props;
  const { wrapItem } = useTreeViewContext<[]>();

  return wrapItem({ children, nodeId });
}

TreeItem2Provider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  nodeId: PropTypes.string.isRequired,
} as any;

export { TreeItem2Provider };
