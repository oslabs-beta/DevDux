export type FileNodeType = {
  [fileName: string]: {
    filePath?: string,
    imports?: { [key: string]: any }[],
    selected?: { [key: string]: any }[],
    dispatched?: string[],
    renderedComponents?: string[],
    props?: { [key: string]: any },
  }
};
export type FileDataType = FileNodeType & {
  astBody?: {[key: string]: any}[],
  astTokens?: {[key: string]: any}[]
};