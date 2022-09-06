#!/usr/bin/env node
/*
 * @Author: C.
 * @Date: 2022-09-05 17:23:39
 * @LastEditTime: 2022-09-06 10:53:35
 * @Description: file content
 */
const program = require("commander");
// --help 的一些引导
const helpOptions = require("./lib/core/help");
const createCommands = require("./lib/core/create");
const { versionInit } = require("./lib/utils/index");

// 定义检验显示模块的版本号
versionInit();

// 给help增加其他选项
// helpOptions();

// 创建命令
createCommands();

// 解析终端指令
program.parse(process.argv);
