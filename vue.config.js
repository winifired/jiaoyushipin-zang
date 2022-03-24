const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');
module.exports = {
    outputDir: 'video-zang',
    lintOnSave: false,
    devServer: {
        overlay: {
            warning: false,
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtoviewport({
                        unitToConvert: "px",
                        viewportWidth: 375,
                        unitPrecision: 6,
                        propList: ["*"],
                        viewportUnit: "vw",
                        fontViewportUnit: "vw",
                        selectorBlackList: [],
                        minPixelValue: 1,
                        mediaQuery: true,
                        exclude: [],
                        landscape: false
                    })
                ],
            }
        }
    },
    // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
};