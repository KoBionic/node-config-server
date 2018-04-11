import * as fs from "fs";
import { promisify } from "util";

import { logger } from "..";
import { Tree, TreeNode } from "../../models/tree.types";
import { AppUtil, ServerUtil } from "../../utils";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);


/**
 * Content service.
 *
 * @export
 * @class ContentService
 */
export class ContentService {

    /** The Tree filled with Tree nodes. */
    private tree: Tree;


    /**
     * Default constructor.
     *
     * @memberof ContentService
     */
    constructor() {
        this.tree = {
            content: [],
            root: AppUtil.CONFIG_DIR
        };
    }


    /**
     * Returns a Tree object filled with Tree nodes.
     *
     * @returns {Promise<Tree>} the Tree object
     * @memberof ContentService
     */
    public async getTree(): Promise<Tree> {
        await this.addNode(AppUtil.CONFIG_DIR);

        return this.tree;
    }

    /**
     * Adds a TreeNode to the global Tree object.
     *
     * @private
     * @param {string} path the path to look in
     * @returns {Promise<Array<TreeNode>>} an array containing the listed Tree nodes
     * @memberof ContentService
     */
    private async addNode(path: string): Promise<Array<TreeNode>> {
        logger.debug(`Listing path: ${path}`);
        const content = await readdir(path);
        const nodes: Array<TreeNode> = [];

        for (const listed of content) {
            const fullPath = `${path}/${listed}`;
            const stats = await stat(fullPath);

            const name = fullPath.replace(`${AppUtil.CONFIG_DIR}/`, "");
            const url = `http://${ServerUtil.HOST}:${ServerUtil.PORT}${ServerUtil.API_URL}/${name}`;

            const node: TreeNode = stats.isDirectory()
                ? { name: name, shortName: listed, type: "folder", content: await this.addNode(fullPath) }
                : { name: name, shortName: listed, type: "file", url: url };

            logger.debug(`Node added: ${node.name}`);
            nodes.push(node);
        }

        this.tree.content = nodes;
        this.tree.content.sort((prev, curr) => {
            if (prev.type === "file" && curr.type === "folder") return 1;
            if (prev.type === "folder" && curr.type === "file") return -1;

            return;
        });

        return nodes;
    }

}
