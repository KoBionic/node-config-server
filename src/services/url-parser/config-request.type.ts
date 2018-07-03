/** Describes a configuration request object. */
export type ConfigRequest = {
    folderPath: string;
    filename: string;
    fullPath: string;
    configFields: string[];
};
