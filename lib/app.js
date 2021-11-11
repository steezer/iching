import * as util from './util.js'
window.util=util;
// 组建加载函数
window.component=function(url){
    return ()=>util.loadModule(url);
};
// 首页组建加载
util.loadModule('@/index.vue').then(res=>{
    new Vue({
        el: '#app',
        render: h=>h(res)
    })
});

