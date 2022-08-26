import { ErrorHandler } from '../common/errorHandler';
import { constants } from '../constants';
import { FSNode } from '../fs/fsNode';
import { IconsGenerator } from '../iconsManifest/iconsGenerator';
import { IIconsGenerator } from '../models';

const build = async (argv: string[]): Promise<void> => {
  try {
    constants.environment.production = argv.some((arg: string) =>
      /release|production/.test(arg),
    );
    const iconsGenerator: IIconsGenerator = new IconsGenerator(new FSNode());
    const iconsManifest = await iconsGenerator.generateIconsManifest();
    await iconsGenerator.persist(iconsManifest, /* updatePackageJson */ true);
  } catch (error) {
    ErrorHandler.logError(error);
  }
};

void build(process.argv);
