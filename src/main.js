import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function rv(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || path.join(process.cwd(),'/components'),
  };
  
  const currentFileUrl = import.meta.url;
  let templateDir = "";
  if(options.framework.toLowerCase() === "react"){
    templateDir = path.resolve(
      new URL(currentFileUrl).pathname,
      '../../templates',
      options.framework.toLowerCase(),
      options.template.toLowerCase(),
      options.type.toLowerCase()
      );
    } else {
    templateDir = path.resolve(
      new URL(currentFileUrl).pathname,    
      '../../templates',    
      options.framework.toLowerCase()
      )
    }
      options.templateDirectory = templateDir;

    try {
      await access(templateDir, fs.constants.R_OK);
    } catch (err) {
      console.error('%s Invalid template name', chalk.red.bold('ERROR'));
      process.exit(1);
    }
    
    console.log('Copy project files');
    await copyTemplateFiles(options);
    
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
  }
  