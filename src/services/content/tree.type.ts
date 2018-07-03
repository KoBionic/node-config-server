/** A Tree object holds information about a directory, its sub-directories & files. */
export type Tree = {
    createdOn?: Tree[];
    children?: Tree[];
    extension?: string;
    modifiedOn?: Date;
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    url: string;
};
