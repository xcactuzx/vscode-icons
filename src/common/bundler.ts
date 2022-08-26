import { join } from 'path';
import { constants } from '../constants';
import { FSNode } from '../fs/fsNode';
import { Utils } from '../utils';

const fs = new FSNode();

export class Bundler {
  public static async bundleLangResources(
    sourceDirPath: string,
    targetFilePath: string,
  ): Promise<void> {
    const iterator = async (
      filename: string,
      bundleObj: Record<string, unknown>,
    ): Promise<void> => {
      const match = /lang\.nls\.([a-zA-Z-]+)\.json/.exec(filename);
      const locale =
        filename === 'lang.nls.json'
          ? 'en'
          : match && match.length > 1
          ? match[1]
          : undefined;
      if (!locale) {
        throw new Error(`No locale found for: ${filename}`);
      }
      const content = await fs.readFileAsync(join(sourceDirPath, filename));
      const translations: Record<string, string> = Utils.parseJSONSafe<
        Record<string, string>
      >(content.toString());
      bundleObj[locale] = Reflect.ownKeys(translations).map(
        (key: string) => translations[key],
      );
    };
    const bundleJson = {};
    const promises: Array<Promise<void>> = [];
    const resourseFiles = await fs.readdirAsync(sourceDirPath);
    resourseFiles.forEach((filename: string) =>
      promises.push(iterator(filename, bundleJson)),
    );
    await Promise.all(promises);

    if (!Reflect.ownKeys(bundleJson).length) {
      throw new Error('Bundling language resources failed');
    }

    await fs.writeFileAsync(
      targetFilePath,
      JSON.stringify(
        bundleJson,
        null,
        constants.environment.production ? 0 : 2,
      ),
    );
  }

  public static async copyPackageResources(
    sourceDirPath: string,
    targetDirPath: string,
  ): Promise<void> {
    const iterator = async (filename: string): Promise<void> => {
      const content = await fs.readFileAsync(join(sourceDirPath, filename));
      const bundleJson = Utils.parseJSONSafe<Record<string, unknown>>(content);
      await fs.writeFileAsync(
        join(targetDirPath, filename),
        JSON.stringify(
          bundleJson,
          null,
          constants.environment.production ? 0 : 2,
        ),
      );
    };
    const promises = [];
    const resourseFiles = await fs.readdirAsync(sourceDirPath);
    resourseFiles.forEach((filename: string) =>
      promises.push(iterator(filename)),
    );
    await Promise.all(promises);
  }
}
