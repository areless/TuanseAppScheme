module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const util = require('util');
        const puppeteer = require('puppeteer');
        const scheme_format = 'tmall://page.tm/shop?shopId=%s';
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);
            return urls;
        }
        const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
        async function interceptRequests() {
            let tmallUid = '';
            const browser = await puppeteer.launch({
                headless: true,
                ...(item.path ? {
                    executablePath: item.path
                } : {}),
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();

            await page.setRequestInterception(true);
            page.on('request', request => {
                request.continue();
            });

            page.on('response', async (response) => {
                const request = response.request();
                const defUrl = request.url();
                if (defUrl.indexOf('weexShopTab=allitemsbar') != -1) {

                    const responseBody = defUrl.split('.m.taobao.com/')[0];

                    if (responseBody) {
                        tmallUid = responseBody.split('ttps://shop')[1]
                        if (tmallUid) {
                            const scheme = util.format(scheme_format, tmallUid);
                            resolve({
                                scheme_link_ios: scheme,
                                scheme_link_android: scheme,
                                scheme_identifier: tmallUid,
                            });
                            return;
                        } else {
                            resolve('1')
                        }
                    }
                }
            });
            // const m = puppeteer.KnownDevices['iPhone XR']
            // await page.emulate(m);
            await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");

            const urlGet = extractURLs(item.data);
            // 导航到目标页面
            await page.goto(urlGet[0]);
            await delay(3000);
            await browser.close();
        }

        interceptRequests();

    })
}
