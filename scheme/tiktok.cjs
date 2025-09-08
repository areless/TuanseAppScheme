module.exports = function (item, timeout) {
    //tiktok
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format = 'snssdk1233://user/profile/%s';
        const util = require('util');
        const axios = require('axios');
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);
            return urls;
        }

        const urlGet = extractURLs(item);
        if (urlGet && urlGet[0]) {
            //tiktok share link
            axios.get(urlGet[0], {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
                    }
                })
                .then((response) => {
                    console.log('res',response.data)
                    const leftCut = response.data.split(`//user/profile/`);
                    
                    const rightFin= leftCut[1].split('?');
                    if(rightFin[0]){
                        const scheme = util.format(scheme_format, rightFin[0]);
                        resolve({
                            scheme_link_ios: scheme,
                            scheme_link_android: scheme,
                            scheme_identifier: rightFin[0],
                        });
                        return;    
                    }else{
                        resolve('1')
                    }
                })
                .catch(() => {
                    resolve('1')
                });
        }else{
            resolve('1');
        }
    })
}