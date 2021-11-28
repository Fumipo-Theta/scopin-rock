const fs = require("fs-extra")

const updatePackageJson = (current, coreJson) => {
    const { new: _, ...scripts } = coreJson.scripts
    const appOnlyScripts = {
        "update:core": "node script/core/update_core.js",
    }
    return {
        ...current,
        scripts: {
            ...scripts,
            ...appOnlyScripts,
            ...current.scripts,
        },
        devDependencies: { ...current.devDependencies, ...coreJson.devDependencies },
        dependencies: { ...current.dependencies, ...coreJson.dependencies },
    }
}

const updateReadme = (appName, baseContent) => {
    return baseContent.replace('@APP_NAME@', appName)
}

const copyCoreScripts = (coreDir, appDir) => {
    fs.copySync(`${coreDir}/script/core`, `${appDir}/script/core`)
}

module.exports = { updatePackageJson, updateReadme, copyCoreScripts }
