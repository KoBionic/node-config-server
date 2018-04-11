/** Represents a Tree node. */
export type TreeNode = {
    content?: Array<TreeNode>;
    name: string;
    shortName: string;
    type: "file" | "folder";
    url?: string;
};

/** Represents a Tree composed of Tree nodes. */
export type Tree = {
    content?: Array<TreeNode>;
    root: string;
};
