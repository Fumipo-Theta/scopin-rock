const fs = require("fs-extra")
const { execSync } = require("child_process")
const path = require('path')
const { exit } = require("process")
const { updatePackageJson, copyCoreScripts } = require(path.resolve(__dirname, "common.js"))

const usage = `
Usage:
(direct use)

    node update_core.js | <git-ref>

(via npm script)

    npm run update:core | -- <git-ref>
`

if (process.argv.includes("-h")) {
    console.log(usage)
    exit(1)
}

const [_node, _script, ...args] = process.argv
const appDir = path.resolve(__dirname, "../../")
const coreDir = path.resolve(appDir, "deps/scopin-core")

const command = args.length === 0 ? "git checkout origin/release" : `git checkout ${args[0]}`
const subModule = `${appDir}/deps/scopin-core`

if (!fs.existsSync(`${subModule}`)) {
    const repoUrl = "https://github.com/Fumipo-Theta/scopin-core.git"
    console.log(`[info] Clone core into ${subModule}`)

    execSync(`git clone ${repoUrl} ${appDir}/deps/scopin-core`)
    execSync('git checkout release', { cwd: `${appDir}/deps/scopin-core` })
}

if (!fs.existsSync(`${subModule}/.git`)) {
    console.log(`[error] ${subModule} is not git managed directory`)
    exit(1)
}

execSync(`git checkout .`, { cwd: subModule })

execSync(`git fetch --all`, { cwd: subModule })
const stdout = execSync(command, { cwd: subModule })
console.log(stdout.toString())

const status = execSync(`git status`, { cwd: subModule })
console.log(status.toString())

console.log("[info] Copy core scripts")
copyCoreScripts(coreDir, appDir)

console.log("[info] Update package.json")
const currentJson = JSON.parse(fs.readFileSync(`${appDir}/package.json`))
const coreJson = JSON.parse(fs.readFileSync(`${coreDir}/package.json`))
const newJson = updatePackageJson(currentJson, coreJson)
fs.writeFileSync(`${appDir}/package.json`, JSON.stringify(newJson, null, 2))

fs.copySync(`${coreDir}/src`, `${appDir}/_src`)
