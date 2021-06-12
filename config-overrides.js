/* 
antd按需引入
自定义主题
*/
const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    //根据import内容来打包（使用babel-plugin-import）
    fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
    }),
    addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#0883bd'},
    }),
);