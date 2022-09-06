/*
 * @Author: C.
 * @Date: 2022-09-06 10:47:47
 * @LastEditTime: 2022-09-06 10:52:38
 * @Description: file content
 */
const { errorLog } = require("./log");
const semver = require("semver");
const program = require("commander");
const packageJson = require("../../package.json");
// 定义检验显示模块的版本号
const versionInit = () => {
    program.version(packageJson.version);
    checkNodeVersion(packageJson.engines.node, packageJson.name);
};
// 检查node版本是否符合特定范围
function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        errorLog(
            `You ar using Node ${process.version}, but this version of ${id} requres Node ${wanted} .\nPlease upgrage your Node version.`
        );
        process.exit(1);
    }
}
module.exports = {
    versionInit
};
