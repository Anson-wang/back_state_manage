module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main-prod.js')
                //通过externals加载外部CDN资源,不会打包
            config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                })
                //isProd用来判断当前处于prod还是dev
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main-dev.js')
                //isProd用来判断当前处于prod还是dev
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    },
    css: {
        extract: false
    }
};