/*
 * @Author: C.
 * @Date: 2022-09-06 09:36:43
 * @LastEditTime: 2022-09-07 08:44:04
 * @Description: file content
 */

const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const deployPath = path.join(process.cwd(), "./deploy");
const deployConfigPath = `${deployPath}/git.config.js`;
const { checkDeployConfig, underlineLog } = require("../utils/index");
const program = require("commander");

// 部署流程
function deploy() {
    program
        .command(`gitee`)
        .description("gitee部署")
        .action(() => {
            const _deploy = require("../core/git");
            _deploy({
                // 线上环境
                name: "码云page环境",
                script: "cnpm run build", // 线上环境打包脚本
                ssh: "git@gitee.com:cj6209577/vue-file-viewer.git", // 线上服务器地址
                branch: "gh-pages",
                distPath: "dist"
            });
        });
    // // 检测部署配置是否合理
    // const deployConfigs = checkDeployConfig(deployConfigPath);
    // if (!deployConfigs) {
    //     process.exit(1);
    // }

    // // 注册部署命令
    // deployConfigs.forEach(config => {
    //     const { command, projectName, name } = config;
    //     program
    //         .command(`${command}`)
    //         .description(`${underlineLog(projectName)}项目${underlineLog(name)}部署`)
    //         .action(() => {
    //             inquirer
    //                 .prompt([
    //                     {
    //                         type: "confirm",
    //                         message: `${underlineLog(projectName)}项目是否部署到${underlineLog(
    //                             name
    //                         )}？`,
    //                         name: "sure"
    //                     }
    //                 ])
    //                 .then(answers => {
    //                     const { sure } = answers;
    //                     if (!sure) {
    //                         process.exit(1);
    //                     }
    //                     if (sure) {
    //                         const _deploy = require("../core/deploy");
    //                         _deploy(config);
    //                     }
    //                 });
    //         });
    // });
}
const gitDeployInit = () => {
    // 文件存在，进入部署流程
    if (fs.existsSync(deployConfigPath)) {
        // console.log("文件存在，进入部署流程");
        deploy();
    }
};

module.exports = gitDeployInit;
