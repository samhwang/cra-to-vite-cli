import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { z } from 'zod';

export type CommandOptions = {
  input?: string;
  output?: string;
  force: boolean;
};

export function error(msg: string) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const PackageJson = z
  .object({
    dependencies: z
      .object({
        'react-scripts': z.string({ message: 'Not a Create-React-App project. "react-scripts" not found.' }),
      })
      .passthrough(),
    scripts: z
      .object({
        start: z.literal('react-scripts start', { errorMap: () => ({ message: 'Unexpected "start" script. Expected "react-scripts start".' }) }),
        build: z.literal('react-scripts build', { errorMap: () => ({ message: 'Unexpected "build" script. Expected "react-scripts build".' }) }),
        test: z.literal('react-scripts test', { errorMap: () => ({ message: 'Unexpected "test" script. Expected "react-scripts test".' }) }),
      })
      .passthrough(),
  })
  .passthrough();
type PackageJson = z.infer<typeof PackageJson>;
export function precheck(inputPath = '.') {
  const rawPkg = JSON.parse(fs.readFileSync(path.resolve(inputPath, 'package.json'), 'utf-8'));
  const parsedPkg = PackageJson.safeParse(rawPkg);
  if (!parsedPkg.success) {
    return error(`Invalid package.json format! Cannot complete migration. Error: ${parsedPkg.error.issues.map((e) => e.message).join('\r\n')}`);
  }
}

export function detectPackageManager(inputPath = '.') {
  if (fs.existsSync(path.join(inputPath, 'package-lock.json'))) {
    return 'npm';
  }

  if (fs.existsSync(path.join(inputPath, 'yarn.lock'))) {
    return 'yarn';
  }

  if (fs.existsSync(path.join(inputPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  return error('No known package manager lock file detected!');
}
