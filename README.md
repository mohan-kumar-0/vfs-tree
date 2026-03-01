# vfs-treejs

A lightweight, tree-based virtual file system for JavaScript. Create, read, update, delete, and move nodes in a hierarchical structure with optional localStorage persistence.

[![npm version](https://img.shields.io/npm/v/vfs-treejs.svg)](https://www.npmjs.com/package/vfs-treejs)
[![license](https://img.shields.io/npm/l/vfs-treejs.svg)](https://github.com/mohan-kumar-0/vfs-tree/blob/main/LICENSE)

---

## Features

- **Tree Structure** -- Deeply nested folders and files represented as a JSON tree.
- **Full CRUD** -- Add, update, delete, and move nodes anywhere in the tree.
- **Persistence** -- Built-in localStorage support (opt-in, works in browsers).
- **Recursive Search** -- Find any node by ID, no matter how deep.
- **Zero Dependencies** -- No external packages required.
- **Isomorphic** -- Works in Node.js (without persistence) and all modern browsers.

---

## Installation

```bash
npm install vfs-treejs
```

---

## Usage

### Creating a File System

```javascript
import { VFSTree } from 'vfs-treejs';

const fs = new VFSTree({
  id: 'root',
  name: 'My Computer',
  type: 'folder',
  children: [
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      children: []
    },
    {
      id: 'downloads',
      name: 'Downloads',
      type: 'folder',
      children: []
    }
  ]
});
```

### Adding Files and Folders

```javascript
// Add a file to Documents
fs.addNode('documents', {
  id: 'readme',
  name: 'readme.txt',
  type: 'file',
  content: 'Hello World!'
});

// Add a subfolder to Documents
fs.addNode('documents', {
  id: 'projects',
  name: 'Projects',
  type: 'folder',
  children: []
});

// Add a file inside the subfolder
fs.addNode('projects', {
  id: 'app-js',
  name: 'app.js',
  type: 'file',
  content: 'console.log("hello");'
});
```

### Finding a Node

```javascript
const readme = fs.findNodeById('readme');
console.log(readme);
// { id: 'readme', name: 'readme.txt', type: 'file', content: 'Hello World!' }

const missing = fs.findNodeById('does-not-exist');
console.log(missing);
// null
```

### Updating a Node

```javascript
fs.updateNode('readme', (node) => ({
  ...node,
  name: 'README.md',
  content: '# My Project\n\nThis is the updated content.'
}));
```

### Deleting a Node

```javascript
fs.deleteNode('downloads');
// The Downloads folder and all its children are removed
```

### Moving a Node

```javascript
// Move readme.txt from Documents into the Projects folder
fs.moveNode('readme', 'projects');
```

### Getting the Full Tree

```javascript
const tree = fs.getTree();
console.log(JSON.stringify(tree, null, 2));
```

### Custom Storage Key

```javascript
// Use a custom localStorage key instead of the default 'vfs_data'
const fs = new VFSTree(null, 'my_custom_storage_key');
```

---

## API Reference

| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `new VFSTree(data, key)` | `data: Object or null`, `key: string` | `VFSTree` | Create a new virtual file system |
| `getTree()` | -- | `Object` | Returns the full file system tree |
| `findNodeById(id)` | `id: string` | `Object or null` | Recursively finds a node by ID |
| `addNode(parentId, node)` | `parentId: string`, `node: Object` | `Object` | Adds a child node to a parent |
| `updateNode(id, fn)` | `id: string`, `fn: Function` | `Object` | Updates a node using a transform function |
| `deleteNode(id)` | `id: string` | `Object or null` | Removes a node and its children |
| `moveNode(id, newParentId)` | `id: string`, `newParentId: string` | `Object` | Moves a node to a new parent |
| `save()` | -- | `void` | Manually saves to localStorage |
| `load()` | -- | `Object or null` | Manually loads from localStorage |

---

## License

MIT -- see [LICENSE](https://github.com/mohan-kumar-0/vfs-tree/blob/main/LICENSE) for details.
