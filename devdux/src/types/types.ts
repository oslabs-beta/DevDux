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
export type FileDataType = {
  [fileName: string]: {
    filePath?: string,
    imports: { [key: string]: any }[],
    selected?: { [key: string]: any }[],
    dispatched?: string[],
    renderedComponents?: string[],
    props?: { [key: string]: any },
    
    astBody?: { [key: string]: any }[],
    astTokens?: { [key: string]: any }[],
    getSelectedState: (arg: any) => void,
    getDispatched: (arg: any) => void,
    getRenderComponents: () => void,
    getProps: () => void,
  

  }
};