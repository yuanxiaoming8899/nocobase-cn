import Application from '../application';
import { Command } from 'commander';

export function createCli(app: Application) {
  const program = new Command();

  const runSubCommand =
    (name) =>
    (...cliArgs) => {
      const command = require(`./${name}`).default;

      Promise.resolve()
        .then(() => {
          return command({ app, cliArgs });
        })
        .catch((error) => {
          console.error(error);
          process.exit(1);
        });
    };

  program.command('start').description('start NocoBase application').action(runSubCommand('start'));
  program.command('install').option('-f, --force').option('-c, --clean').action(runSubCommand('install'));
  program.command('db:sync').option('-f, --force').action(runSubCommand('db-sync'));
  program.command('console').action(runSubCommand('console'));

  program
    .command('create-plugin')
    .argument('<name>', 'name of plugin')
    .description('create NocoBase plugin')
    .action(runSubCommand('create-plugin'));

  return program;
}