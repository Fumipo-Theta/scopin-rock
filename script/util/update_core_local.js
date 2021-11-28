const fs = require("fs-extra")
const path = require('path')
const { exit } = require("process")

const usage = `
Usage:
(via npm script)

    yarn update:core:local <path to local scopin-core>
`

const [_node, _scriot, ...args] = process.argv

if (args.length < 1) {
    console.log(usage)
    exit(1)
}

const appDir = path.resolve(__dirname, "../../")
const coreDir = args[0]

fs.copySync(`${coreDir}/src`, `${appDir}/_src`)
