// TODO: make default export
/** A Tree object holds information about a directory, its sub-directories & files. */
export type Tree = {
    createdOn?: Date;
    children?: Tree[];
    extension?: string;
    modifiedOn?: Date;
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    url?: string;
};
