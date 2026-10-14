import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walk, shouldVisit, sortChildren } from '../src/index.js';

test('visits root and all descendants in alphabetical order', () => {
  const tree = {
    name: 'root',
    children: [
      { name: 'zeta', children: [{ name: 'inner_a' }, { name: 'inner_b' }] },
      { name: 'alpha', children: [{ name: 'inner_c' }] }
    ]
  };
  const visited = [];
  walk(tree, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['root', 'alpha', 'inner_c', 'zeta', 'inner_a', 'inner_b']);
});

test('visits a leaf node with no children property', () => {
  const leaf = { name: 'leaf' };
  const visited = [];
  walk(leaf, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['leaf']);
});

test('visits a node with an empty children array exactly once', () => {
  const tree = { name: 'empty', children: [] };
  const visited = [];
  walk(tree, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['empty']);
});

test('does not descend when prune is true, but still visits the node itself', () => {
  const tree = {
    name: 'root',
    children: [
      {
        name: 'pruned',
        prune: true,
        children: [{ name: 'hidden' }]
      },
      { name: 'visible' }
    ]
  };
  const visited = [];
  walk(tree, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['root', 'pruned', 'visible']);
});

test('does not descend when children is undefined, even without prune', () => {
  const tree = {
    name: 'root',
    children: [
      { name: 'branch_with_no_children_field', extra: 'data' },
      { name: 'leaf' }
    ]
  };
  const visited = [];
  walk(tree, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['root', 'branch_with_no_children_field', 'leaf']);
});

test('sortChildren returns a new array and does not mutate input', () => {
  const input = [{ name: 'c' }, { name: 'a' }, { name: 'b' }];
  const sorted = sortChildren(input);
  assert.deepEqual(sorted.map(n => n.name), ['a', 'b', 'c']);
  assert.equal(input === sorted, false);
  assert.deepEqual(input.map(n => n.name), ['c', 'a', 'b']);
});

test('shouldVisit returns false for prune true', () => {
  assert.equal(shouldVisit({ name: 'x', prune: true, children: [] }), false);
});

test('shouldVisit returns true when children array present and no prune', () => {
  assert.equal(shouldVisit({ name: 'x', children: [] }), true);
});

test('shouldVisit returns false when children is undefined', () => {
  assert.equal(shouldVisit({ name: 'x' }), false);
});

test('handles a single-node tree (root is a leaf)', () => {
  const tree = { name: 'solo' };
  const visited = [];
  walk(tree, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['solo']);
});

test('deterministic order for identically named siblings (stable sort)', () => {
  const a1 = { name: 'dup', tag: 1 };
  const a2 = { name: 'dup', tag: 2 };
  const tree = { name: 'root', children: [a2, a1] };
  const visited = [];
  walk(tree, (node) => visited.push(node.tag));
  assert.deepEqual(visited, [undefined, 2, 1]);
});

test('visits are depth-first preorder', () => {
  const tree = {
    name: 'a',
    children: [
      { name: 'b', children: [{ name: 'd' }] },
      { name: 'c' }
    ]
  };
  const visited = [];
  walk(tree, (node) => visited.push(node.name));
  assert.deepEqual(visited, ['a', 'b', 'd', 'c']);
});
