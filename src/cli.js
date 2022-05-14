import arg from 'arg';
import inquirer from 'inquirer';
import { rv } from './main';

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
			'--react': Boolean,
			'--vue':Boolean,
			'--javascript': Boolean,
			'--typescript': Boolean,
			'--class': Boolean,
			'--functional': Boolean,
			'--eject': Boolean,
			'-r':'--react',
			'-v':'--vue',
			'-js':'--javascript',
			'-ts':'--typescript',
			'-c':'--class',
			'-f':'--functional',
			'-e':'--eject'
		},
		{
			argv: rawArgs.slice(2),
		}
		);
		return {
			eject: args['--eject'] || false,
			command: args._[0].split(':')[0],
			object: args._[0].split(':')[1],
			name: args._[1],
			framework: args['--react'] ? 'React' : false || args['--vue'] ? 'Vue' : false || false,
			template: args['--javascript'] ? 'Javascript' : false || args['--typescript'] ? 'Typescript' : false,
			type: args['--class'] ? 'Class' : false || args['--functional'] ? 'Functional' : false || false
		};
	}
	
	async function promptForMissingOptions(options) {
		const framework = 'React';
		const template = 'Javascript';
		const type = 'Functional';
		const questions = [];
		
		if (!options.framework) {
			questions.push({
				type: 'list',
				name: 'framework',
				message: 'Please choose which project framework to use',
				choices: ['React', 'Vue'],
				default: framework,
			});
			
			questions.push({	
				type: 'list',
				name: 'template',
				message: 'Please choose which project template to use',
				choices: ['Javascript', 'Typescript'],
				default: template,	
				when: (answers) => answers.framework === 'React'
			});
			
			questions.push({		
				type: 'list',
				name: 'type',
				message: 'Please choose which project type of file to use',
				choices: ['Class','Functional'],
				default: type,
				when: (answers) => answers.framework === 'React' && typeof answers.template === 'string'
			});
		}

		if(options.framework === 'React' && !options.template){
			questions.push({
				type: 'list',
				name: 'template',
				message: 'Please choose which project template to use',
				choices: ['Javascript', 'Typescript'],
				default: template,
			});
			questions.push({		
				type: 'list',
				name: 'type',
				message: 'Please choose which project type of file to use',
				choices: ['Class','Functional'],
				default: type,
				when: (answers) => typeof answers.template === 'string'
			});
		}
		
		if(options.framework === 'React' && !options.type){
			questions.push({
				type:'list',
				name:'type',
				message:'Please choose which project type of file to use',
				choices: ['Class','Functional'],
				default: type,
			})
		}
		
		const answers = await inquirer.prompt(questions);
		return {
			...options,
			framework: answers.framework || options.framework,
			template: answers.template || options.template,
			type: answers.type || options.type,
		};
	}
	
	export async function cli(args) {
		let options = parseArgumentsIntoOptions(args);
		options = await promptForMissingOptions(options);
		await rv(options);
	}
	