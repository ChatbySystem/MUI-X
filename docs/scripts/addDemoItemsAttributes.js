const importToIgnore = (name) => {
  if (['LocalizationProvider', 'DemoItem', 'DemoContainer'].includes(name)) {
    return true;
  }
  if (name.startsWith('Adapter')) {
    return true;
  }
  if (name.startsWith('use')) {
    return true;
  }
  return false;
};

export default function transformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const printOptions = options || {
    quote: 'single',
    trailingComma: true,
  };

  const pickersComponentNames = new Set();
  root
    .find(j.ImportDeclaration)
    .filter(({ node }) => {
      return node.source.value.startsWith('@mui/x-date-picker');
    })
    .forEach((path) => {
      path.node.specifiers.forEach((node) => {
        const name = node.local.name;

        if (!importToIgnore(name)) {
          pickersComponentNames.add(name);
        }
      });
    });

  return root
    .find(j.JSXElement)
    .filter((path) => {
      return ['DemoItem', 'DemoContainer'].includes(path.value.openingElement.name.name);
    })
    .forEach((wrapperPath) => {
      const children = [];
      pickersComponentNames.forEach((componentName) => {
        const foundElements = j(wrapperPath).findJSXElements(componentName);
        // we need to repeat same component names if there are with same name
        foundElements.forEach(() => children.push(componentName));
      });

      if (children.length === 0) {
        // If we did not found children it might be an interactive demo, so we do not modify it
        return;
      }

      const isItem = wrapperPath.value.openingElement.name.name === 'DemoItem';
      const propName = isItem ? 'component' : 'components';
      const newValue = isItem
        ? j.stringLiteral(children[0])
        : j.jsxExpressionContainer(j.arrayExpression(children.map((c) => j.stringLiteral(c))));

      // Remove pervious prop
      j(wrapperPath)
        .find(j.JSXAttribute)
        .filter((attribute) => attribute.node.name.name === propName)
        .remove();

      const newComponent = j.jsxElement(
        j.jsxOpeningElement(wrapperPath.node.openingElement.name, [
          ...wrapperPath.node.openingElement.attributes,
          // build and insert our new prop
          j.jsxAttribute(j.jsxIdentifier(propName), newValue),
        ]),
        wrapperPath.node.closingElement,
        wrapperPath.node.children,
      );

      // Replace the original component with our modified one
      j(wrapperPath).replaceWith(newComponent);
    })
    .toSource(printOptions);
}
