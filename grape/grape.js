var program = require('commander');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var readline = require('readline');
var sortedObject = require('sorted-object');
program
    .version('0.0.1')
    .option('-p, --package', 'list package')
    .option('-v, --version', 'list version')
    .option('-i, --init', 'init a project')
    .parse(process.argv);

console.log('start.......');
if (program.init) {
    main();
}
if (program.package) {
    console.log('list package')
    //先要判断项目文件有没有且package.json有没有
    emptyDirectory('wap-fe', function (is) {
        if (is) {
            console.log('   \033[36mwap-fe is empty\033[0m : ');
        } else {
            var pack = require(__dirname + '/wap-fe/package.json');
            var temPkg = require(__dirname + '/templates/js/package.json');
            var temPkgList = temPkg.dependencies;
            var packList = pack.dependencies;
            pack.dependencies = sortedObject(temPkgList);
            write(__dirname + '/wap-fe/package.json', JSON.stringify(pack, null, 2) + '\n');
            for (var item in packList) {
                console.log(item + '-----' + packList[item])
            }
        }
    })

}
//main();
function main() {
    console.log('init program');
    var destinationPath = program.args.shift() || '.';
    var appName = createAppName(path.resolve(destinationPath)) || 'wap-fe';
    console.log(destinationPath);
    //createApplication(appName,destinationPath)
    emptyDirectory(destinationPath, function (empty) {
        if (empty) {
            createApplication(appName, destinationPath)
        } else {
            console.log('wap-fe is here')
            confirm('wap-fe is not empty, Are you want to upgrate modules? [y/N] ', function (ok) {
                if (ok) {
                    //process.stdin.destroy();
                    //createApplication(appName, destinationPath);
                    console.log('升级完成')
                } else {
                    console.log('升级完成')

                }
            })
        }
    })
}
function createAppName(pathName) {
    return path.basename(pathName)
        .replace(/[^A-Za-z0-9\.()!~*'-]+/g, '-')
        .replace(/^[-_\.]+|-+$/g, '')
        .toLowerCase()
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
    mkdirp(path, 0755, function (err) {
        if (err) throw err;
        console.log('   \033[36mcreate\033[0m : ' + path);
        fn && fn();
    });
}
/**
 * 
 * @param {string} app_name 
 * @param {string} path 
 */
function createApplication(app_name, path) {
    var wait = 4;

    console.log();
    function complete() {
        if (--wait) return;
        var prompt = launchedFromCmd() ? '>' : '$';

        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', prompt, path);
        console.log();
        console.log('   run the app:');

        if (launchedFromCmd()) {
            console.log('     %s SET DEBUG=%s:* & npm start', prompt, app_name);
        } else {
            console.log('     %s DEBUG=%s:* npm start', prompt, app_name);
        }

        console.log();
    }
    //copy模板里的内容
    var server = loadTemplate('js/server.js');
    var webpack = loadTemplate('js/webpack.config.js');
    var gulpfile = loadTemplate('js/gulpfile.js');
    var gitignore = loadTemplate('js/gitignore');
    var package = loadTemplate('js/package.json');
    //创建文件目录
    mkdir(path, function () {
        mkdir(path + '/src');
        mkdir(path + '/src/js');
        mkdir(path + '/src/images');
        mkdir(path + '/src/pro', function () {
            complete();
        });

        mkdir(path + '/src/style', function () {
            complete();
        });

        mkdir(path + '/src/style', function () {
            complete();
        });
        write(path + '/serve.js', server);
        write(path + '/webpack.config.js', webpack);
        write(path + '/gulpfile.js', gulpfile);
        write(path + '/.gitignore', gitignore);
        write(path + '/package.json', package);
        complete();
    });
}
/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
    return process.platform === 'win32'
        && process.env._ === undefined;
}
/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
    fs.readdir(path, function (err, files) {
        if (err && 'ENOENT' != err.code) throw err;
        fn(!files || !files.length);
    });
}
/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm(msg, callback) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(msg, function (input) {
        rl.close();
        callback(/^y|yes|ok|true$/i.test(input));
    });
}
/**
 * Load template file.
 */

function loadTemplate(name) {
    return fs.readFileSync(path.join(__dirname, 'templates', name), 'utf-8');
}
/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
    fs.writeFileSync(path, str, { mode: mode || 0666 });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}
