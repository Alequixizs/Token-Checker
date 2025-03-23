const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const readline = require('readline');

// Colors
const green = chalk.green;
const red = chalk.red;
const blue = chalk.cyan;
const reset = chalk.white;
const bar = blue('|');

// Global counters
let valids = 0;
let invalids = 0;
let nitrads = 0;
let verify = 0;
let nfa = 0;
let tel = 0;

process.stdout.write('\x1B[?25l');

process.on('SIGINT', () => {
    process.stdout.write('\x1B[?25h');
    process.exit();
});

if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output');
}

function showBanner() {
    return chalk.cyan(`
 ▄▄▄       ██▓    ▓█████   █████   █    ██  ██▓▒██   ██▒ ██▓▒███████▒  ██████ 
▒████▄    ▓██▒    ▓█   ▀ ▒██▓  ██▒ ██  ▓██▒▓██▒▒▒ █ █ ▒░▓██▒▒ ▒ ▒ ▄▀░▒██    ▒ 
▒██  ▀█▄  ▒██░    ▒███   ▒██▒  ██░▓██  ▒██░▒██▒░░  █   ░▒██▒░ ▒ ▄▀▒░ ░ ▓██▄   
░██▄▄▄▄██ ▒██░    ▒▓█  ▄ ░██  █▀ ░▓▓█  ░██░░██░ ░ █ █ ▒ ░██░  ▄▀▒   ░  ▒   ██▒
 ▓█   ▓██▒░██████▒░▒████▒░▒███▒█▄ ▒▒█████▓ ░██░▒██▒ ▒██▒░██░▒███████▒▒██████▒▒
 ▒▒   ▓▒█░░ ▒░▓  ░░░ ▒░ ░░░ ▒▒░ ▒ ░▒▓▒ ▒ ▒ ░▓  ▒▒ ░ ░▓ ░░▓  ░▒▒ ▓░▒░▒▒ ▒▓▒ ▒ ░
  ▒   ▒▒ ░░ ░ ▒  ░ ░ ░  ░ ░ ▒░  ░ ░░▒░ ░ ░  ▒ ░░░   ░▒ ░ ▒ ░░░▒ ▒ ░ ▒░ ░▒  ░ ░
  ░   ▒     ░ ░      ░      ░   ░  ░░░ ░ ░  ▒ ░ ░    ░   ▒ ░░ ░ ░ ░ ░░  ░  ░  
      ░  ░    ░  ░   ░  ░    ░       ░      ░   ░    ░   ░    ░ ░          ░  
                                                            ░                    
`);
}

// Add new function to safely append unique tokens
function appendUniqueToken(filepath, token, data = '') {
    try {
        const content = fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : '';
        if (!content.includes(token)) {
            fs.appendFileSync(filepath, `${token}\n`);
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

async function tokenchecker(token) {
    try {
        const response = await axios.get('https://discordapp.com/api/v7/users/@me', {
            headers: {
                "authorization": `${token}`
            }
        });

        const { data } = response;
        const timestamp = new Date().toLocaleTimeString();
        const flags = [];
        const userData = `${data.username} | ${data.id} | ${data.email || 'No Email'} | ${data.phone || 'No Phone'}`;

        if (data.premium_type === 2) {
            flags.push("Nitro Gaming");
            if (appendUniqueToken('output/nitro.txt', token, userData)) nitrads++;
        } else if (data.premium_type > 0) {
            flags.push("Nitro Basic");
            if (appendUniqueToken('output/nitro.txt', token, userData)) nitrads++;
        }

        if (data.verified) {
            flags.push("Verified");
            if (appendUniqueToken('output/verified.txt', token, userData)) verify++;
        }

        if (data.phone) {
            flags.push("Phone");
            if (appendUniqueToken('output/phones.txt', token, userData)) tel++;
        }

        if (appendUniqueToken('output/valid.txt', token, userData)) valids++;

        console.log(
            `${green('[')} Valid - ${timestamp} ${green(']')} ${green('|')} ` +
            `${token.slice(0, 10)}**** ${green('|')} ` +
            `${data.username} ${green('|')} ` +
            `${data.id} ${green('|')} ` +
            `${flags.length > 0 ? flags.join(', ') : 'No Flags'} ${green('|')} ` +
            `${data.email || 'No Email'} ${green('|')} ` +
            `${data.phone || 'No Phone'}`
        );

    } catch (err) {
        if (appendUniqueToken('output/invalid.txt', token)) invalids++;
        const timestamp = new Date().toLocaleTimeString();
        console.log(`${red('[')} Invalid - ${timestamp} ${red(']')} ${red('|')} ${token.slice(0, 52)}****`);
    }
}

async function main() {
    console.clear();
    console.log(showBanner());

    valids = 0;
    invalids = 0;
    nitrads = 0;
    verify = 0;
    nfa = 0;
    tel = 0;

    const files = ['valid.txt', 'invalid.txt', 'nitro.txt', 'verified.txt', 'unverified.txt', 'phones.txt'];
    files.forEach(file => fs.writeFileSync(`output/${file}`, ''));

    let selected = 1;
    let checking = false;

    const menu = () => {
        console.clear();
        console.log(showBanner());
        console.log(blue('\nSelecione uma opção:'));
        console.log(`${blue(selected === 1 ? '>' : ' ')} ${blue('[')}${reset('1')}${blue(']')} ${reset('- Checkar')}`);
        console.log(`${blue(selected === 0 ? '>' : ' ')} ${blue('[')}${reset('0')}${blue(']')} ${reset('- Sair')}`);
    };

    menu();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async (key) => {
        if (key[0] === 0x03) {
            process.stdout.write('\x1B[?25h');
            process.exit();
        }

        if (!checking) {
            if (key[0] === 0x1B) {
                selected = selected === 1 ? 0 : 1;
                menu();
            }

            if (key[0] === 0x0D) {
                if (selected === 0) {
                    process.stdout.write('\x1B[?25h');
                    process.exit();
                } else if (selected === 1) {
                    checking = true;
                    try {
                        const tokens = [...new Set(fs.readFileSync('tokens.txt', 'utf8')
                            .split('\n')
                            .filter(t => t.trim()))];

                        console.clear();
                        console.log(showBanner());

                        for (const token of tokens) {
                            if (token !== "") {
                                await tokenchecker(token.trim());
                            }
                        }

                        const timestamp = new Date().toLocaleTimeString();
                        console.log(
                            `\n${blue('[')} Relatorio - ${timestamp} ${blue(']')} ${blue('|')} ` +
                            `Válidos: ${valids} ${blue('|')} ` +
                            `Inválidos: ${invalids} ${blue('|')} ` +
                            `Nitro: ${nitrads} ${blue('|')} ` +
                            `Verificadas: ${verify} ${blue('|')} ` +
                            `Tel: ${tel}`
                        );
                        console.log('\nPressione ENTER para voltar ao menu...');
                    } catch (error) {
                        console.log(red('Error:', error.message));
                        console.log('\nPressione ENTER para voltar ao menu...');
                    }
                }
            }
        } else if (key[0] === 0x0D) {
            checking = false; menu();
        }
    });
}

main();