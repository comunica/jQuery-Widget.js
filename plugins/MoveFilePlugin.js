const fs = require('fs');

class MoveFilePlugin {

    /**
     * Create a new instance of the MoveFilePlugin.
     * This plugin expects two functions as arguments, because the paths will be different at runtime.
     * @param getSource method to retrieve the source file path
     * @param getDestination method to retrieve the destination file path
     */
    constructor(getSource, getDestination) {
        this.getSource = getSource;
        this.getDestination = getDestination;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('MoveFilePlugin', (compilation) => {
            if (fs.existsSync(this.getSource())) {
                fs.renameSync(this.getSource(), this.getDestination());
            }
        });
    }
}

module.exports = MoveFilePlugin;
