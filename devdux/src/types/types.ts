import * as babelParser from '@babel/parser';
import { File } from '@babel/types';
import FileNode from '../FileNode';

export type FileNodeType = {
  [fileName: string]: {
    fileName?: string,
    filePath?: string,
    imports?: { [key: string]: any }[],
    selected?: { [key: string]: any }[],
    dispatched?: string[],
    renderedComponents?: { [key: string]: any }[],
    // props?: { [key: string]: any },
    
  }
};
// export type FileDataType = {
//   [fileName: string]: {
//     filePath?: string,
//     imports: { [key: string]: any }[],
//     selected?: { [key: string]: any }[],
//     dispatched?: string[],
//     renderedComponents?: string[],
//     props?: { [key: string]: any },
    
//     astBody?: { [key: string]: any }[],
//     astTokens?: { [key: string]: any }[],
//     getSelectedState: (arg: any) => void,
//     getDispatched: (arg: any) => void,
//     getRenderComponents: () => void,
//     getProps: () => void,
  

//   }
// };
export type FileDataType = {
  [fileName: string]: FileNode
};
export type AST = babelParser.ParseResult<File>;
export type AstToken = AST["tokens"];
export type AstBody = AST["program"]["body"];
export type RenderedComp = { [key: string]: { [key: string]: string }[] };
// export type AstToken = [{
//   type: {
//     label: string
//   },
//   value: string,
//   end: number,
//   location: object,
// }];

// export type AstBody = [{
//   type?: string,
//   declarations?: undefined | [{
//     init?: {
//       type?: string,
//       body?: {
//         body?: [{
//           type?: string,
//           declarations?: [{
//             init?: {
//               callee?: {
//                 name?: string
//               },
//               type: string,
//               body?: {
//                 body?: [{
//                   type: string,
//                   expression: {
//                     callee?: {
//                       name?: string
//                     },
//                     arguments: [{
//                       callee?: {
//                         name?: string
//                       }
//                     }]
//                   }
//                 }]
//               },
//               arguments: {
//                 type?: string,
//                 body?: {
//                   object?: {
//                     property?: {
//                       name?: string,
//                     }
//                   },
//                   property?: {
//                     name?: string,
//                   }
//                 }
//               }[],
//             },
//             id: {
//               name: string
//             },
//           }]
//         }]
//       }
//     }
//   }]
// }];
