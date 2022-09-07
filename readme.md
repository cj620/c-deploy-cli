<!--
 * @Author: C.
 * @Date: 2022-09-05 15:21:11
 * @LastEditTime: 2022-09-05 17:24:38
 * @Description: file content
-->
# c-deploy-cli
前端轻量化部署脚手架，支持测试、线上、github pages、gitee pages等多环境部署，支持环境配置扩展，配置好后仅需一条命令即可完成整个部署流程。

## git地址：
https://github.com/cj620/c-deploy-cli

## npm地址：
https://www.npmjs.com/package/c-deploy-cli

## 适用对象
目前还在采用手工部署又期望快速实现轻量化部署的小团队或者个人项目，毕竟像阿里这种大公司都有完善的前端部署平台。

## 前提条件
能通过ssh连上服务器即可

## 安装
全局安装c-deploy-cli
```
npm i c-deploy-cli -g
```
查看版本，表示安装成功。

## 使用
### 1.初始化部署模板
```
deploy init
```
### 2.配置部署环境
**安全起见，请在.gitignore文件中配置。让git忽略deploy文件夹，防止隐私泄露**

部署配置文件位于deploy文件夹下的`deploy.config.js`,
一般包含`dev`（测试环境）和`prod`（线上环境）两个配置，再有多余的环境配置形式与之类似，只有一个环境的可以删除另一个多余的配置（比如只有`prod`线上环境，请删除`dev`测试环境配置）。

具体配置信息请参考配置文件注释：
```
module.exports = {
  privateKey: '', // 本地私钥地址，位置一般在C:/Users/xxx/.ssh/id_rsa，非必填，有私钥则配置
  passphrase: '', // 本地私钥密码，非必填，有私钥则配置
  projectName: 'xxx', // 项目名称
  dev: { // 测试环境
    name: '测试环境',
    script: "npm run build-dev", // 测试环境打包脚本
    host: '0.0.0.0', // 开发服务器地址
    port: 22, // ssh port，一般默认22
    username: 'root', // 登录服务器用户名
    password: 'xxx', // 登录服务器密码
    distPath: 'dist',  // 本地打包dist目录
    webDir: '/var/www/html/dev/xxx',  // // 测试环境服务器地址
  },
  prod: {  // 线上环境
    name: '线上环境',
    script: "npm run build", // 线上环境打包脚本
    host: '0.0.0.0', // 开发服务器地址
    port: 22, // ssh port，一般默认22
    username: 'root', // 登录服务器用户名
    password: 'xxx', // 登录服务器密码
    distPath: 'dist',  // 本地打包dist目录
    webDir: '/var/www/html/prod/xxx' // 线上环境web目录
  },
  github: {
        // 传输方式 默认为'ssh'
        method: "git",
        name: "github Pages",
        script: "npm run build", // 打包脚本
        distPath: "dist", // 本地打包dist目录,
        gitSSH: "xxxxx.git", //git SSH
        branch: "gh-pages" //推送到开启pages的分支
    }
  // 再还有多余的环境按照这个格式写即可
}
```

### 3.查看部署命令
配置好`deploy.config.js`，运行
```
deploy --help
```
查看部署命令
### 4.测试环境部署
测试环境部署采用的时`dev`的配置
```
deploy dev
```
先有一个确认，确认后进入部署流程，完成6步操作后，部署成功！！！

### 5.线上环境部署
线上环境部署采用的是`prod`的配置
```
deploy prod
```
部署流程和测试环境相同：

### 6.github Pages服务器环境部署

github Pages服务器环境部署采用的是`github `的配置

- 通过git推送需要提前配置好SSH平台公钥
- 需要额外配置``gitSSH``、``branch``两个参数

```
deploy github
```


感谢大家支持，欢迎star，O(∩_∩)O。
