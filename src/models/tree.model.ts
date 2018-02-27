import { TreeNode } from "./tree-node.model";


/**
 * Represents a Tree composed of Tree nodes.
 *
 * @export
 * @interface Tree
 */
export interface Tree {
    content?: Array<TreeNode>;
    root: string;
}
