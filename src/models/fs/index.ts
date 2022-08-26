export interface IStats {
  isFile(): boolean;
  isDirectory(): boolean;
}

export interface IFSAsync {
  readdirAsync: (path: string) => Promise<string[]>;
  mkdirAsync: (path: string) => Promise<void>;
  rmdirAsync: (path: string) => Promise<void>;
  readFileAsync: (path: string) => Promise<string>;
  writeFileAsync: (path: string, data: string) => Promise<void>;
  unlinkAsync: (path: string) => Promise<void>;
  lstatAsync: (path: string) => Promise<IStats>;
  existsAsync: (path: string) => Promise<boolean>;
}
