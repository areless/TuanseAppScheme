module.exports = function (item,timeout) {
   return new Promise((resolve, reject) => {
             setTimeout(() => {
              resolve('1');
            }, timeout);
            const scheme_format = 'reddit://reddit/user/%s/';
            const util = require('util');
            const useData=item.split('reddit.com/u/');
            if(useData[1]){
                const useNum = useData[1].split('/')[0];
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
