/**
 * js-virtual-fs
 * A simple, tree-based virtual file system.
 */

export class VFSTree {
    constructor(initialData = null, storageKey = 'vfs_data') {
        this.storageKey = storageKey;
        this.fs = initialData || this.load() || { id: 'root', name: '/', type: 'folder', children: [] };
    }

    load() {
        if (typeof localStorage === 'undefined') return null;
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }

    save() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(this.storageKey, JSON.stringify(this.fs));
    }

    getTree() {
        return this.fs;
    }

    findNodeById(id, nodes = [this.fs]) {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = this.findNodeById(id, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    updateNode(id, updateFn) {
        const update = (nodes) => {
            return nodes.map(node => {
                if (node.id === id) return updateFn(node);
                if (node.children) return { ...node, children: update(node.children) };
                return node;
            });
        };

        if (this.fs.id === id) {
            this.fs = updateFn(this.fs);
        } else {
            this.fs.children = update(this.fs.children);
        }
        this.save();
        return this.fs;
    }

    addNode(parentId, newNode) {
        this.updateNode(parentId, (parent) => ({
            ...parent,
            children: [...(parent.children || []), { ...newNode, id: newNode.id || Math.random().toString(36).substr(2, 9) }]
        }));
        return this.fs;
    }

    deleteNode(id) {
        const remove = (nodes) => {
            return nodes.filter(node => node.id !== id).map(node => ({
                ...node,
                children: node.children ? remove(node.children) : undefined
            }));
        };
        if (this.fs.id === id) return null; // Can't delete root
        this.fs.children = remove(this.fs.children);
        this.save();
        return this.fs;
    }

    moveNode(id, newParentId) {
        const node = this.findNodeById(id);
        if (!node) return this.fs;
        this.deleteNode(id);
        this.addNode(newParentId, node);
        return this.fs;
    }
}
