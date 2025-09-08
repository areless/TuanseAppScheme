module.exports = function (item, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1');
        }, timeout);
        const scheme_format= 'taobao://%s.m.taobao.com';
        const util = require('util');
        const puppeteer = require('puppeteer');
        const extractURLs = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);
            return urls;
        }
        const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
        async function interceptRequests() {
            let taobaoUid = '';
            const browser = await puppeteer.launch({
                headless: true,
                pipe: true,
                ...(item.path ? {
                    executablePath: item.path
                } : {}),
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
            const page = await browser.newPage();

            await page.setRequestInterception(true);
            page.on('request', request => {
                const defUrl = request.url();
                if (defUrl.indexOf('.taobao.com/?weexShopTab') != -1) {
                    taobaoUid = defUrl.substring(8).split('.taobao.com/?weexShopTab')[0];
                }
                request.continue();
            });

            const urlGet = extractURLs(item.data);
            await page.goto(urlGet[0]);
            await delay(3000);
            await browser.close();
            if (taobaoUid) {
                const scheme = util.format(scheme_format, taobaoUid.split('.world')[0]);
                resolve({
                    scheme_link_ios: scheme,
                    scheme_link_android: scheme,
                    scheme_identifier: taobaoUid.split('.world')[0],
                });
                return;
            } else {
                resolve('1')
            }
        }

        interceptRequests();

    })
}
