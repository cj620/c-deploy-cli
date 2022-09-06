/*
 * @Author: C.
 * @Date: 2022-09-06 10:40:04
 * @LastEditTime: 2022-09-06 10:46:26
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
    webDir: ""
};

const PRIVATE_KEY_DEPLOY_SCHEMA = {
    name: "",
    script: "",
    host: "",
    port: 22,
    webDir: ""
};
// 检查配置是否符合特定schema
function checkConfigScheme(configKey, configObj, privateKey) {
    let deploySchemaKeys = null;
    const configKeys = Object.keys(configObj);
    const neededKeys = [];
    const unConfigedKeys = [];
    let configValid = true;
    if (privateKey) {
        deploySchemaKeys = Object.keys(PRIVATE_KEY_DEPLOY_SCHEMA);
    } else {
        deploySchemaKeys = Object.keys(DEPLOY_SCHEMA);
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
        errorLog(`${configKey}缺少${neededKeys.join(",")}配置，请检查配置`);
        configValid = false;
    }
    if (unConfigedKeys.length > 0) {
        errorLog(`${configKey}中的${unConfigedKeys.join(", ")}暂未配置，请设置该配置项`);
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
        for (let key of keys) {
            if (config[key] instanceof Object) {
                if (!checkConfigScheme(key, config[key], privateKey)) {
                    return false;
                }
                config[key].command = key;
                config[key].privateKey = privateKey;
                config[key].passphrase = passphrase;
                config[key].projectName = projectName;
                configs.push(config[key]);
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
