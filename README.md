# simple-tree-walk

Prune-aware, depth-first, deterministically ordered traversal of plain JavaScript tree objects.

## Usage

```js
import { walk } from 'simple-tree-walk';

const tree = {
  name: 'root',
  children: [
    { name: 'beta', prune: true, children: [{ name: 'hidden' }] },
    { name: 'alpha', children: [{ name: 'leaf' }] }
  ]
};

walk(tree, (node) => console.log(node.name));
// root
// alpha
// leaf
// beta
```

## Why

Directory trees need a traversal order that is stable across runs and platforms. This library walks a tree of `{ name, children?, prune? }` nodes in depth-first preorder, sorting the children of each node by `name` so that two runs over the same tree produce identical sequences. A node with `prune: true` is visited but its subtree is skipped, which mirrors the directory use case where a single entry is recorded but not descended into.

The one interpretation chosen: the decision to descend is governed by `shouldVisit`, which returns true only when `children` is defined (an array, possibly empty) and `prune` is not `true`. A node with no `children` property is treated as a leaf and is never descended into, regardless of `prune`.

## Edge cases

- Siblings are sorted by `name` using a plain less-than comparison on strings. Identically named siblings keep their original relative order because the sort comparator returns 0, and `Array.prototype.sort` is stable in modern engines.
- The `children` array is never mutated; `sortChildren` returns a fresh sorted copy.
- An empty `children: []` array is a valid subtree that simply contributes no descendants — the node itself is still visited.
