const fs = require('fs')
const path = require('path')

module.exports = function (creater, params, chalk, shelljs, ora) {
    const {
        projectName,
        description,
        src,
        css
    } = params
    const cwd = process.cwd()
    const projectPath = path.join(cwd, projectName)
    const sourceDir = path.join(projectPath, src)
    

    fs.mkdirSync(projectPath)
    fs.mkdirSync(sourceDir)
    fs.mkdirSync(path.join(sourceDir, 'pages'))

    creater.template(path.join(cwd, 'minip-temp/pkg'), path.join(projectPath, 'package.json'), {
        projectName,
        description,
    })

    creater.template(path.join(cwd, 'minip-temp/project'), path.join(projectPath, 'project.config.json'), {
        projectName,
        css,
    })

    creater.template(path.join(cwd, 'minip-temp/.eslintrc'), path.join(projectPath, '.eslintrc.json'))
    creater.template(path.join(cwd, 'minip-temp/.eslintignore'), path.join(projectPath, '.eslintignore'))
    creater.template(path.join(cwd, 'minip-temp/README'), path.join(projectPath, 'README.md'))
    creater.template(path.join(cwd, 'minip-temp/gitignore'), path.join(projectPath, '.gitignore'))
    creater.copy(path.join(cwd, 'minip-temp/src'), path.join(projectPath, 'src'));

    creater.fs.commit(() => {
        console.log()
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建项目: ${chalk.grey.bold(projectName)}`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建源码目录: ${projectName}/${src}`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建页面目录: ${projectName}/${src}/pages`)}`)

        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/package.json`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/project.config.json`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.eslintignore`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/README.md`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`创建文件: ${projectName}/.gitignore`)}`)
        console.log(`${chalk.green('✔ ')}${chalk.grey(`拷贝源码: ${projectName}/${src}`)}`)

        const styleExtMap = {
            sass: 'scss',
            less: 'less',
            none: 'wxss'
        }
        if (css !== 'less') {
            const currentStyleExt = styleExtMap[css] || 'wxss'
            // gStyleExt = styleExtMap[css] || 'wxss'
            // exchangeStyleExtFile(path.join(projectPath, 'src'));
            creater.exchangeStyleExtFn(path.join(projectPath, 'src'), currentStyleExt)
        }
        // 目录切换
        shelljs.cd(projectPath);
        const command = 'npm install'
        const installSpinner = ora(`执行安装项目依赖 ${chalk.cyan.bold(command)}, 需要一会儿...`).start()
        const install = shelljs.exec(command, {
            silent: true
        })
        if (install.code === 0) {
            installSpinner.color = 'green'
            installSpinner.succeed('安装成功')
            console.log(`${install.stderr}${install.stdout}`)
        } else {
            installSpinner.color = 'red'
            installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
            console.log(`${install.stderr}${install.stdout}`)
        }
        console.log(chalk.green(`创建项目 ${chalk.green.bold(projectName)} 成功！`))
        console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
    })
}