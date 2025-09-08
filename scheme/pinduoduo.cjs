module.exports = function (item,timeout) {
   return new Promise((resolve, reject) => {
             setTimeout(() => {
              resolve('1');
            }, timeout);
            const scheme_format = 'pinduoduo://com.xunmeng.pinduoduo/%s';
            const util = require('util');
            //pinduoduo
            const useData=item.split('mobile.yangkeduo.com/mall_page.html?ps=');
            if(useData[1]){
                const useNum = item;
                const scheme = util.format(scheme_format, useNum);
                resolve({
                scheme_link_ios: scheme,
                scheme_link_android: scheme,
                scheme_identifier: useNum,
                });
                return;
            }else{
                resolve('1')
            }
   })
}
