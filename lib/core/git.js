/*
 * @Author: C.
 * @Date: 2022-09-06 11:29:14
 * @LastEditTime: 2022-09-07 09:52:05
 * @Description: file content
 */
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const ora = require("ora");
const { successLog, errorLog, underlineLog, startLog } = require("../utils/index");

const projectDir = process.cwd();
// 部署流程入口
async function gitdeploy(config) {
    const { script, branch, distPath, projectName, name, ssh } = config;
    let cwd = `${projectDir}/${distPath}`;
    try {
        await execBuild(script);
        await execGitPre(cwd);
        await execGitPush(config);
        successLog(
            `\n 恭喜您，${underlineLog(projectName)}项目${underlineLog(name)}部署成功了^_^\n`
        );
        process.exit(0);
    } catch (err) {
        errorLog(`  
        \n 部署失败 ${err}`);
        process.exit(1);
    }
}

// 第一步，执行打包脚本
function execBuild(script) {
    try {
        const spinner = ora("正在打包中，请耐心等待~~~~");
        spinner.start();
        execSync(script, { cwd: projectDir });
        spinner.stop();
    } catch (err) {
        errorLog(err);
        process.exit(1);
    }
}
const GITINIT = "git init";
const GITADD = "git add -A";
const GITCOMMIT = "git commit -m 'deploy'";
function execGitPre(cwd) {
    let gitDir = { cwd };
    try {
        startLog(`
        \n-git初始化`);
        execSync(GITINIT, gitDir);
        execSync(GITADD, gitDir);
        execSync(GITCOMMIT, gitDir);
        successLog(`
        \n-git初始化完成`);
    } catch (err) {
        errorLog(`
        \n${err}`);
        process.exit(1);
    }
}
function execGitPush(config) {
    const { branch, distPath, ssh } = config;
    let gitDir = { cwd: `${projectDir}/${distPath}` };
    let pushTerminal = `git push -f ${ssh} master:${branch}`;
    try {
        const spinner = ora(`正在推送至${branch}分支，请等待~~`);
        spinner.start();
        execSync(pushTerminal, gitDir);
        spinner.stop();
        successLog(`
        \n-已完成推送`);
    } catch (err) {
        errorLog(`
        \n${err}`);
        process.exit(1);
    }
}
module.exports = gitdeploy;
