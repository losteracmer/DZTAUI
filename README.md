
DZTAXT 电子提案系统


# 目录说明：
dist/  经过打包压缩后的文件，一般用于正式环境使用
src/   源代码，一般用于开发环境

# 源码构建
项目可采用 gulp 构建，gulpfile.js 是任务脚本，package.json 是任务配置文件
step1：确保你的电脑已经安装好了 Node.js
step2: 命令行安装 gulp：npm install gulp -g
step3：切换到 layuiAdmin 项目根目录（即 gulpfile.js 所在目录），命令行安装任务所依赖的包：npm install
安装完成后，即可直接执行命令：gulp
即可完成 src 到 dist 目录的构建



