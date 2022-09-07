/*
 * @Author: your name
 * @Date: 2021-12-09 10:08:44
 * @LastEditTime: 2022-09-06 15:07:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Coder脚手架\lib\utils\terminal.js
 */
const { spawn, exec } = require("child_process");

const spawnCommand = (...args) => {
    return new Promise((resole, reject) => {
        const childProcess = spawn(...args);
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        childProcess.on("close", () => {
            resole();
        });
    });
};

const execCommand = (...args) => {
    console.log(args[0]);
    return new Promise((resolve, reject) => {
        exec(...args, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(stdout.replace("\n", ""));
            // console.log(stderr);
            resolve();
        });
    });
};

module.exports = {
    spawn: spawnCommand,
    exec: execCommand
};
