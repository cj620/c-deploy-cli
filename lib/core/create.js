/*
 * @Author: C.
 * @Date: 2022-09-05 17:23:39
 * @LastEditTime: 2022-09-06 10:24:45
 * @Description: file content
 */
const program = require("commander");
const deployInit = require("../utils/deployInit");
const createCommands = () => {
    // // 创建项目指令
    // program

    //   .command('create <project> [otherArgs...]')
    //   .description('clone a repository into a newly created directory')
    //   .action(createProject);
    program
        .command("init")
        .description("初始化部署相关配置")
        .action(() => {
            require("../core/init")();
        });

    deployInit();
};

module.exports = createCommands;
