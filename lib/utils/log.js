/*
 * @Author: C.
 * @Date: 2022-09-05 17:23:39
 * @LastEditTime: 2022-09-06 10:34:43
 * @Description: file content
 */
const chalk = require("chalk");

// 开始部署日志
function startLog(...content) {
    console.log(chalk.magenta(...content));
}

// 信息日志
function infoLog(...content) {
    console.log(chalk.blue(...content));
}

// 成功日志
function successLog(...content) {
    console.log(chalk.green(...content));
}

// 错误日志
function errorLog(...content) {
    console.log(chalk.red(...content));
}

// 下划线重点输出
function underlineLog(content) {
    return chalk.blue.underline.bold(`${content}`);
}

module.exports = {
    startLog,
    infoLog,
    successLog,
    errorLog,
    underlineLog
};
