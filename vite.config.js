const path = require('path');

export default {
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: path.resolve(__dirname, 'public_html/assets'),
        target: 'esnext'
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
        }
    },
    server: {
        port: 4000,
        hot: true
    }
};
