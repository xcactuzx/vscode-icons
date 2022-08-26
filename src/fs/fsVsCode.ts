import { IFSAsync, IStats } from '../models/fs';
import { TextDecoder, TextEncoder } from 'util';
import { workspace, Uri, FileType } from 'vscode';

const fs = workspace.fs;

const stringToRawData = function (text: string): Uint8Array {
  return new TextEncoder().encode(text);
};

const rawDataToString = function (data: Uint8Array): string {
  return new TextDecoder().decode(data);
};

export class FSVsCode implements IFSAsync {
  public async readdirAsync(path: string): Promise<string[]> {
    const uri = Uri.file(path);
    const entries = await fs.readDirectory(uri);
    return entries.map(([filename, _]) => filename);
  }

  public async mkdirAsync(path: string): Promise<void> {
    const uri = Uri.file(path);
    await fs.createDirectory(uri);
  }

  public async rmdirAsync(path: string): Promise<void> {
    const uri = Uri.file(path);
    await fs.delete(uri);
  }

  public async readFileAsync(path: string): Promise<string> {
    const uri = Uri.file(path);
    const raw = await fs.readFile(uri);
    return rawDataToString(raw);
  }

  public async writeFileAsync(path: string, data: string): Promise<void> {
    const uri = Uri.file(path);
    const raw = stringToRawData(data);
    await fs.writeFile(uri, raw);
  }

  public async unlinkAsync(path: string): Promise<void> {
    const uri = Uri.file(path);
    await fs.delete(uri);
  }

  public async lstatAsync(path: string): Promise<IStats> {
    const uri = Uri.file(path);
    const stats = await fs.stat(uri);
    return {
      isFile: () => stats.type === FileType.File,
      isDirectory: () => stats.type === FileType.Directory,
    };
  }

  public async existsAsync(path: string): Promise<boolean> {
    const uri = Uri.file(path);
    try {
      await fs.stat(uri);
      return true;
    } catch {
      return false;
    }
  }
}
