/**
 * Represents a Tree node.
 *
 * @export
 * @interface TreeNode
 */
export interface TreeNode {
    content?: Array<TreeNode>;
    name: string;
    shortName: string;
    type: "file" | "folder";
    url?: string;
}
