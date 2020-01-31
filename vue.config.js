// Add this line:
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    transpileDependencies: ['vuetify'],
    filenameHashing: false,

    chainWebpack(config) {
        config.plugins.delete('prefetch');

        // and this line 
        config.plugin('CompressionPlugin').use(CompressionPlugin);
    }
};
