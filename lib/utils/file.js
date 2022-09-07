/*
 * @Author: C.
 * @Date: 2022-09-06 17:13:25
 * @LastEditTime: 2022-09-07 13:48:55
 * @Description: file content
 */
const { successLog, errorLog, underlineLog, startLog } = require("./log");
const { execSync } = require("child_process");
const ora = require("ora");
const node_ssh = require("node-ssh");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const projectDir = process.cwd();

let ssh = new node_ssh(); // 生成ssh实例

//执行打包脚本
function execBuild(script) {
    try {
        console.log(`\n - ${script}`);
        const spinner = ora("正在打包中~~~~");
        spinner.start();
        console.log();
        execSync(script, { cwd: projectDir });
        spinner.stop();
        successLog("  打包成功");
    } catch (err) {
        errorLog(err);
        process.exit(1);
    }
}

// 打包zip 约定zip命名为dist.zip
function startZip(distPath) {
    return new Promise((resolve, reject) => {
        distPath = path.resolve(projectDir, distPath);
        console.log(" - 打包成zip");
        const archive = archiver("zip", {
            zlib: { level: 9 }
        }).on("error", err => {
            throw err;
        });
        const output = fs.createWriteStream(`${projectDir}/dist.zip`);
        output.on("close", err => {
            if (err) {
                errorLog(`  关闭archiver异常 ${err}`);
                reject(err);
                process.exit(1);
            }
            successLog("  zip打包成功");
            resolve();
        });
        archive.pipe(output);
        archive.directory(distPath, "/");
        archive.finalize();
    });
}
//链接服务器
async function connectSSH(config) {
    const { host, port, username, password, privateKey, passphrase } = config;
    const sshConfig = {
        host,
        port,
        username,
        password,
        privateKey,
        passphrase
    };
    try {
        console.log(` - 连接${underlineLog(host)}`);
        await ssh.connect(sshConfig);
        successLog("  SSH连接成功");
    } catch (err) {
        errorLog(`  连接失败 ${err}`);
        process.exit(1);
    }
}
//上传zip包
async function uploadFile(webDir) {
    try {
        console.log(` - 上传zip至目录${underlineLog(webDir)}`);
        await ssh.putFile(`${projectDir}/dist.zip`, `${webDir}/dist.zip`);
        successLog("  zip包上传成功");
    } catch (err) {
        errorLog(`  zip包上传失败 ${err}`);
        process.exit(1);
    }
}
// 运行命令
async function runCommand(command, webDir) {
    await ssh.execCommand(command, { cwd: webDir });
}
// 解压zip包
async function unzipFile(webDir) {
    try {
        console.log(" - 开始解压zip包");
        await runCommand(`cd ${webDir}`, webDir);
        await runCommand("unzip -o dist.zip && rm -f dist.zip", webDir);
        successLog("  zip包解压成功");
    } catch (err) {
        errorLog(`  zip包解压失败 ${err}`);
        process.exit(1);
    }
}

// 删除本地dist.zip包
async function deleteLocalZip() {
    return new Promise((resolve, reject) => {
        console.log(" - 开始删除本地zip包");
        fs.unlink(`${projectDir}/dist.zip`, err => {
            if (err) {
                errorLog(`  本地zip包删除失败 ${err}`, err);
                reject(err);
                process.exit(1);
            }
            successLog("  本地zip包删除成功\n");
            resolve();
        });
    });
}

const GITINIT = "git init";
const GITADD = "git add -A";
const GITCOMMIT = "git commit -m 'deploy'";
function execGit(config) {
    const { branch, distPath, gitSSH } = config;
    const cwd = { cwd: `${projectDir}/${distPath}` };
    const pushTerminal = `git push -f ${gitSSH} master:${branch}`;
    try {
        startLog(`
    \n-git初始化`);
        execSync(GITINIT, cwd);
        execSync(GITADD, cwd);
        execSync(GITCOMMIT, cwd);
        successLog(`
    \n-git初始化完成`);
        const spinner = ora(`正在推送至${branch}分支，请等待~~`);
        spinner.start();
        execSync(pushTerminal, cwd);
        spinner.stop();
        successLog(`
        \n-已完成推送`);
    } catch (err) {
        errorLog(
            `\n${err}\n请检查是否配置是否正确,请参考${underlineLog(
                "https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent"
            )}`
        );

        process.exit(1);
    }
}

module.exports = {
    execBuild,
    startZip,
    connectSSH,
    uploadFile,
    unzipFile,
    deleteLocalZip,
    execGit
};
