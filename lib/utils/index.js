/*
 * @Author: C.
 * @Date: 2022-09-06 09:59:55
 * @LastEditTime: 2022-09-07 10:04:27
 * @Description: file content
 */
const { startLog, infoLog, successLog, errorLog, underlineLog } = require("../utils/log");
const { checkDeployConfig } = require("./checkConfig");
const { versionInit } = require("./version");
// const { delFile } = require("./file");
module.exports = {
    startLog,
    infoLog,
    successLog,
    errorLog,
    underlineLog,
    versionInit,
    checkDeployConfig
};
