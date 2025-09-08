import prompts from 'prompts';
import chalk from 'chalk';

const supportList = ['ctrip'];

const main = async (name, data, timeout) => {
    const useTaskMod = await import(`./scheme/${name}.cjs`);
    const useTaskModRun = useTaskMod.default(data, timeout);
    const backFlag = await useTaskModRun;
    if (backFlag !== '1') {
        console.log(chalk.white('/* ios */'));
        console.log(chalk.blue(backFlag.scheme_link_ios));
        console.log(chalk.white('/* android */'));
        console.log(chalk.blue(backFlag.scheme_link_android));
    } else {
        console.log(chalk.red.bold('Something went wrong...'));
    }
    
    const response = await prompts({
        type: 'select',
        name: 'next',
        message: 'again next App?',
        choices: [{
                title: 'Yes',
                value: 'y'
            },{
                title: 'No',
                value: 'n'
            }
        ]
    });
    if(response.next == 'y') start();
    if(response.next == 'n') process.exit();
};

const start = async () => {

    const response = await prompts({
        type: 'select',
        name: 'app',
        message: 'Choose a App',
        choices: [{
                title: 'Ctrip',
                value: 'ctrip'
            }
        ]
    });

    if (!response.app || supportList.indexOf(response.app.toLowerCase()) === -1) {
        console.log('no support');
        return;
    }

    const responseNext = await prompts({
        type: 'text',
        name: 'data',
        message: `copy ${response.app} share link, help doc see /gif/${response.app.toLowerCase()}.gif`,
    });

    main(response.app.toLowerCase(), responseNext.data, 10000);
};

start();