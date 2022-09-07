/*
 * @Author: C.
 * @Date: 2022-09-06 09:20:31
 * @LastEditTime: 2022-09-07 13:41:37
 * @Description: file content
 */
const { successLog, errorLog, underlineLog } = require("../utils/index");
const {
    execBuild,
    startZip,
    connectSSH,
    uploadFile,
    unzipFile,
    deleteLocalZip,
    execGit
} = require("../utils/file");
// 部署流程入口
async function deploy(config) {
    const { script, webDir, distPath, projectName, name, method } = config;
    try {
        // execBuild(script);
        if (method === "ssh") {
            // 打包zip
            await startZip(distPath);
            // 链接服务器
            await connectSSH(config);
            //上传zip包
            await uploadFile(webDir);
            // 解压zip包
            await unzipFile(webDir);
            // 删除本地dist.zip包
            await deleteLocalZip();
        } else if (method === "git") {
            execGit(config);
        }
        successLog(
            `\n 恭喜您，${underlineLog(projectName)}项目${underlineLog(name)}部署成功了^_^\n`
        );
        process.exit(0);
    } catch (err) {
        errorLog(`  部署失败 ${err}`);
        process.exit(1);
    }
}
module.exports = deploy;
