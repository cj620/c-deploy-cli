/*
 * @Author: C.
 * @Date: 2022-09-06 09:36:43
 * @LastEditTime: 2022-09-07 13:13:49
 * @Description: file content
 */

const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const deployPath = path.join(process.cwd(), "./deploy");
const deployConfigPath = `${deployPath}/deploy.config.js`;
const { checkNodeVersion, checkDeployConfig, underlineLog } = require("../utils/index");

const versionOptions = ["-V", "--version"];

const program = require("commander");

// 部署流程
function deploy() {
    // 检测部署配置是否合理
    const deployConfigs = checkDeployConfig(deployConfigPath);
    // console.log(deployConfigs);
    if (!deployConfigs) {
        process.exit(1);
    }

    // 注册部署命令
    deployConfigs.forEach(config => {
        const { command, projectName, name } = config;
        program
            .command(`${command}`)
            .description(`${underlineLog(projectName)}项目${underlineLog(name)}部署`)
            .action(() => {
                inquirer
                    .prompt([
                        {
                            type: "confirm",
                            message: `${underlineLog(projectName)}项目是否部署到${underlineLog(
                                name
                            )}？`,
                            name: "sure"
                        }
                    ])
                    .then(answers => {
                        const { sure } = answers;
                        if (!sure) {
                            process.exit(1);
                        }
                        if (sure) {
                            const _deploy = require("../core/deploy");
                            _deploy(config);
                            // console.log(underlineLog("开启部署脚本！"));
                        }
                    });
            });
    });
}
const deployInit = () => {
    const agrs = process.argv.slice(2);
    const firstArg = agrs[0];
    // 非version选项且有配置文件时，进入部署流程
    if (!versionOptions.includes(firstArg) && fs.existsSync(deployConfigPath)) {
        deploy();
    }
    // 无参数时默认输出help信息
    if (!firstArg) {
        program.outputHelp();
    }
};

module.exports = deployInit;
