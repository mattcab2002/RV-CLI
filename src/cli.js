import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
        '--class': Boolean,
        '--eject': Boolean,
        '-c':'--class',
        '-e':'--eject'
   },
   {
        argv: rawArgs.slice(2),
   }
 );
 return {
        type: args['--class'] ? 'class' : 'functional',
        eject: args['--eject'] || false,
        command: args._[0].split(':')[0],
        object: args._[0].split(':')[1],
        framework: args._[1],
 };
}

async function promptForMissingOptions(options) {
 const defaultTemplate = 'JavaScript';
 const questions = [];

 if (!options.framework) {
   questions.push({
     type: 'list',
     name: 'framework',
     message: 'Please choose which project framework to use',
     choices: ['React', 'Vue'],
     default: defaultTemplate,
   });
 }
const answers = await inquirer.prompt(questions);
return {
   ...options,
   framework: options.framework || answers.framework,
 };
}

export async function cli(args) {
        let options = parseArgumentsIntoOptions(args);
        options = await promptForMissingOptions(options);
        console.log(options);
}

