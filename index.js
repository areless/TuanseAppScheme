import prompts from 'prompts';
import chalk from 'chalk';
const chromePath = ''; // chrome path
const supportList = ['ctrip', 'tiktok', 'soul', 'youtube', 'dewu', 'kwai', 'fleamarket','xiaohongshu'];
const useChrome = [0, 0, 0, 0, 1, 0, 1, 0];

const main = async (name, data, timeout) => {
    const useTaskMod = await import(`./scheme/${name}.cjs`);
    const realData = useChrome[supportList.indexOf(name)] == 1 ? {
        data: data,
        path: chromePath
    } : data;
    const useTaskModRun = useTaskMod.default(realData, timeout);
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
        }, {
            title: 'No',
            value: 'n'
        }]
    });
    if (response.next == 'y') start();
    if (response.next == 'n') process.exit();
};

const start = async () => {

    const response = await prompts({
        type: 'select',
        name: 'app',
        message: 'Choose a App',
        choices: supportList.map(item => ({
            title: item.charAt(0).toUpperCase() + item.slice(1),
            value: item
        }))
    });

    if (!response.app || supportList.indexOf(response.app.toLowerCase()) === -1) {
        console.log('no support');
        return;
    }
    if (useChrome[supportList.indexOf(response.app.toLowerCase())] == 1 && chromePath == '') {
        console.log('Please set the browser path');
        return;
    }
    const responseNext = await prompts({
        type: 'text',
        name: 'data',
        message: `copy ${response.app} share link, help doc see /gif/${response.app.toLowerCase()}.gif`,
    });

    main(response.app.toLowerCase(), responseNext.data, 100000, chromePath);
};

start();