import * as fs from 'fs';
import { promisify } from 'util';
import { IFSAsync } from '../models/fs';

export class FSNode implements IFSAsync {
  public readdirAsync(path: string): Promise<string[]> {
    return promisify(fs.readdir)(path);
  }

  public mkdirAsync(path: string): Promise<void> {
    return promisify(fs.mkdir)(path);
  }

  public rmdirAsync(path: string): Promise<void> {
    return promisify(fs.rmdir)(path);
  }

  // returns buffer
  public readFileAsync(path: string): Promise<string> {
    return promisify(fs.readFile)(path, 'utf8');
  }

  public writeFileAsync(path: string, data: string): Promise<void> {
    return promisify(fs.writeFile)(path, data);
  }

  public unlinkAsync(path: string): Promise<void> {
    return promisify(fs.unlink)(path);
  }

  public lstatAsync(path: string): Promise<fs.Stats> {
    return promisify(fs.lstat)(path);
  }

  public existsAsync(path: string): Promise<boolean> {
    return promisify(fs.exists)(path);
  }
}
