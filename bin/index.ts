#!/usr/bin/env node
import process from 'node:process';
import { confirm } from '@inquirer/prompts';
import { program } from 'commander';
import type { CommandOptions } from '../src/lib';

program
  .name('cra-to-vite')
  .description('Convert a Create-React-App project to use Vite')
  .option('--input <string>', 'Path to input project. Default: current directory')
  .option('--output <string>', 'Path to output. Default: current directory')
  .option('--force <boolean>', 'Force mode. Allow project to be overwritten.', false)
  .parse();

async function execute() {
  let { input: inputPath, output: outputPath, force: forceMode } = program.opts<CommandOptions>();
  console.log({ input: inputPath, output: outputPath, force: forceMode });
  if (!inputPath) {
    inputPath = process.cwd();
  }
  if (!outputPath) {
    outputPath = process.cwd();
  }

  if (inputPath === outputPath && forceMode === false) {
    console.warn('WARNING! Input and output are the same path. This project will be overwritten.');
    forceMode = await confirm({ message: 'Do you want to proceed?', default: false });
    if (!forceMode) {
      console.log('Project not allowed to be overwritten. Exiting...');
      process.exit(0);
    }
  }
}

execute();
