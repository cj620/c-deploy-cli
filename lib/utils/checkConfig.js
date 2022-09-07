/*
 * @Author: C.
 * @Date: 2022-09-06 10:40:04
 * @LastEditTime: 2022-09-07 13:23:23
 * @Description: file content
 */
const fs = require("fs");
const { errorLog } = require("./log");

const DEPLOY_SCHEMA = {
    name: "",
    script: "",
    host: "",
    port: 22,
    username: "",
    password: "",
    webDir: "",
    distPath: ""
};

const PRIVATE_KEY_DEPLOY_SCHEMA = {
    name: "",
    script: "",
    host: "",
    port: 22,
    webDir: "",
    distPath: ""
};
const GIT_PRIVATE_KEY_DEPLOY_SCHEMA = {
    // 线上环境
    name: "",
    method: "git",
    script: "", // 线上环境打包脚本
    gitSSH: "", // git ssh
    branch: "",
    distPath: ""
};
// 检查配置是否符合特定schema
function checkConfigScheme(command, configObj, privateKey) {
    let deploySchemaKeys = null;
    const configKeys = Object.keys(configObj);
    const neededKeys = [];
    const unConfigedKeys = [];
    let configValid = true;
    if (configObj.method == "ssh") {
        deploySchemaKeys = Object.keys(privateKey ? PRIVATE_KEY_DEPLOY_SCHEMA : DEPLOY_SCHEMA);
    } else if (configObj.method == "git") {
        deploySchemaKeys = Object.keys(GIT_PRIVATE_KEY_DEPLOY_SCHEMA);
    }
    for (let key of deploySchemaKeys) {
        if (!configKeys.includes(key)) {
            neededKeys.push(key);
        }
        if (configObj[key] === "") {
            unConfigedKeys.push(key);
        }
    }
    if (neededKeys.length > 0) {
        errorLog(`${command}缺少${neededKeys.join(",")}配置，请检查配置`);
        configValid = false;
    }
    if (unConfigedKeys.length > 0) {
        errorLog(`${command}中的${unConfigedKeys.join(", ")}暂未配置，请设置该配置项`);
        configValid = false;
    }
    return configValid;
}
// 检查deploy配置是否合理
function checkDeployConfig(deployConfigPath) {
    if (fs.existsSync(deployConfigPath)) {
        const config = require(deployConfigPath);
        const { privateKey, passphrase, projectName } = config;
        const keys = Object.keys(config);
        const configs = [];
        for (let command of keys) {
            if (config[command] instanceof Object) {
                let configObj = Object.assign(
                    {},
                    {
                        command: command,
                        privateKey,
                        passphrase,
                        projectName,
                        // 默认ssh
                        method: "ssh"
                    },
                    config[command]
                );
                if (!checkConfigScheme(command, configObj, privateKey)) {
                    return false;
                }
                configs.push(configObj);
            }
        }
        return configs;
    }
    infoLog(`缺少部署相关的配置，请运行${underlineLog("deploy init")}下载部署配置`);
    return false;
}

module.exports = {
    checkConfigScheme,
    checkDeployConfig
};
