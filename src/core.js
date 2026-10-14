function sortChildren(children) {
  return children.slice().sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

function shouldVisit(node) {
  if (node.prune === true) return false;
  return typeof node.children !== 'undefined';
}

function walk(root, visit) {
  visit(root);
  if (shouldVisit(root)) {
    const sorted = sortChildren(root.children);
    for (const child of sorted) {
      walk(child, visit);
    }
  }
}

export { walk, shouldVisit, sortChildren };
