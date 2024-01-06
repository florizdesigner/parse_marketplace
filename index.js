import puppeteer from 'puppeteer'
import axios from 'axios'
import FormData from 'form-data'

const constants = {
    MEGAMARKET_LINK: "https://megamarket.ru/catalog/igrovye-pristavki-playstation/#?filters=%7B%22D9B2B6E06C83C3E7C121ED558D2E1DBD%22%3A%5B%22Playstation%205%22%2C%22playstation%205%22%5D%2C%221B3347144BD148AF9B0CE4AFF47710F7%22%3A%5B%221%22%5D%2C%2288C83F68482F447C9F4E401955196697%22%3A%7B%22max%22%3A55000%7D%7D&sort=1",
    YANDEX_MARKET_LINK: "https://market.yandex.ru/catalog--playstation-5/40910350/list?cvredirect=3&rs=eJwzamIOYDzKyLAgyxZIPphjDSQPvLABkWx7gGTCVysgqdAPFuECkQpdu0FkJUjlggMgkYTJYFIRrD4fJHvgEUikYTeInbAdxHbQAckeWA0SYbgGYjcEgcgFwSB7D6iCTegHyS44C1a_B2yCwE6QLANIzYJ1YPHrYBdW7wepfw6SfeAEEn8QBnbbRrDJ3mD1P8DqeUBsh2YQ2eAJlmUEi2iB7HLoA_uiGuy7P2BzzoPZJ8AunwlmbwOFQMMKsPm3wGpeg3Q5PAe7UAPscvm9IJUmYPXMIPMTwGG1YAlYlxBY5TOQ7QoNYFf5gtgPLoJDQ9ba6Q4jlzQXBweDAIMEgwKDAJsUZ0pqWmJpTkm8kQKDBgMuSWN8koZgSUmgJKMAowSjAqMAkxQ7VBIsZQiW4pDgVWAREJCSTkoszkyOT04syi8tTs2JL8hJzMyLL05NLErOUPjXYK7xdbE7lzGSVQJSsni0AB2-ayqXxsOXmgKMAGdYvfA%2C&suggest_text=sony%20playstation%205&hid=91122&how=aprice&allowCollapsing=1&local-offers-first=0&glfilter=30785750%3A39020583%2C30786070&glfilter=7893318%3A152955&resale_goods=resale_new",
    OZON_LINK: "https://www.ozon.ru/category/konsoli-playstation-31751/sony-26303399/?brandcertified=t&platform=271299%2C100918737&sorting=price",
    TELEGRAM_TOKEN: '5926753819:AAG62DqKBs-O0HP1ycgUBP83HVQT7nB1UTk',
    CHAT_ID: '818727118'
}

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// получить короткую ссылку
const getShortLink = async (url) => {
    let form = new FormData();
    form.append('url', url);
    form.append('alias', '');
    form.append('is_public', '1');
    form.append('password', '');

    const options = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://goo.su',
            'referer': 'https://goo.su/',
            'cookie': 'tmr_lvid=74846e20b6c7bd7045fd65037c8c25f1; tmr_lvidTS=1704573423889; adtech_uid=dec7d6cb-ad85-4422-84dd-f97acf574a2b%3Agoo.su; top100_id=t1.6673155.1344938699.1704573423966; _ym_uid=1704573424723651919; _ym_d=1704573424; _ym_isad=2; _ym_visorc=b; cf_clearance=sJ9CbVa_gPWhwhX.G7eby.TLIHQr.Kmvxwu0sExhEPI-1704573424-0-2-9e753d46.842f5e93.c22b4d8e-0.2.1704573424; XSRF-TOKEN=eyJpdiI6Imo4WkRGVjJ4UENGajd1TEdUbS94K3c9PSIsInZhbHVlIjoiK01pM1MvdUxHRXpmQ0xCcnVoU3U4RVhoOGVQd1NjQ0J5cURQVnpUZ2p6bnlSSFdhQklUK0puanhrRFdyN0tEaWZQNklOOUhuTWt6WEdUNDh0RWkxcmZVYTlCNzBIWG9jSGczSXN2eTRXTXJ3ZmFhUWZBZGhaVUFsNkZ1cEhjd0EiLCJtYWMiOiJhMTdhMTBkMTM5M2VhNjAxNWY4YTQ3M2M0MThiMGEyMTMzMjZhMWUyODczNWU0ODIxOWFlY2M4YWRmZTdjMzAxIiwidGFnIjoiIn0%3D; goosu_session=eyJpdiI6Ill1VnJLdEhHZEZzNldtZ1c5S0VkNlE9PSIsInZhbHVlIjoiOHlJeCsrSU5vNUJiczYxMEFDWWd4bE81NFdVZlBTSGtEMTZyL0RBMzZZa1pueG1BR25vZzdzeGh5QUhXQTZHbVhGYUFlaEVCUHJIQXVRV3A0ZTlJTU8vdUVrTXVUQ0o1RGFaVmVmd00xQ0s5MEg5aDNORW1uYjZJWlV1MjdmMlEiLCJtYWMiOiI4NjIxZjczMTg3MzE0NDI0OTY3YTEzMTMzZmNhNmM2ZTZlOGE1MTI5M2E1YjIzM2E1NmRlMThlZjc0MjEzMTdhIiwidGFnIjoiIn0%3D; last_visit=1704562639249%3A%3A1704573439249; tmr_detect=0%7C1704573441514; t3_sid_6673155=s1.877151238.1704573423967.1704573473914.1.7',
            'x-csrf-token': 'OHaRKv34bKG3ddzZudhAJXeFJFt6tARNdoR8S6XR'
        },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        cookies: 'tmr_lvid=74846e20b6c7bd7045fd65037c8c25f1; tmr_lvidTS=1704573423889; adtech_uid=dec7d6cb-ad85-4422-84dd-f97acf574a2b%3Agoo.su; top100_id=t1.6673155.1344938699.1704573423966; _ym_uid=1704573424723651919; _ym_d=1704573424; _ym_isad=2; _ym_visorc=b; cf_clearance=sJ9CbVa_gPWhwhX.G7eby.TLIHQr.Kmvxwu0sExhEPI-1704573424-0-2-9e753d46.842f5e93.c22b4d8e-0.2.1704573424; XSRF-TOKEN=eyJpdiI6Imo4WkRGVjJ4UENGajd1TEdUbS94K3c9PSIsInZhbHVlIjoiK01pM1MvdUxHRXpmQ0xCcnVoU3U4RVhoOGVQd1NjQ0J5cURQVnpUZ2p6bnlSSFdhQklUK0puanhrRFdyN0tEaWZQNklOOUhuTWt6WEdUNDh0RWkxcmZVYTlCNzBIWG9jSGczSXN2eTRXTXJ3ZmFhUWZBZGhaVUFsNkZ1cEhjd0EiLCJtYWMiOiJhMTdhMTBkMTM5M2VhNjAxNWY4YTQ3M2M0MThiMGEyMTMzMjZhMWUyODczNWU0ODIxOWFlY2M4YWRmZTdjMzAxIiwidGFnIjoiIn0%3D; goosu_session=eyJpdiI6Ill1VnJLdEhHZEZzNldtZ1c5S0VkNlE9PSIsInZhbHVlIjoiOHlJeCsrSU5vNUJiczYxMEFDWWd4bE81NFdVZlBTSGtEMTZyL0RBMzZZa1pueG1BR25vZzdzeGh5QUhXQTZHbVhGYUFlaEVCUHJIQXVRV3A0ZTlJTU8vdUVrTXVUQ0o1RGFaVmVmd00xQ0s5MEg5aDNORW1uYjZJWlV1MjdmMlEiLCJtYWMiOiI4NjIxZjczMTg3MzE0NDI0OTY3YTEzMTMzZmNhNmM2ZTZlOGE1MTI5M2E1YjIzM2E1NmRlMThlZjc0MjEzMTdhIiwidGFnIjoiIn0%3D; last_visit=1704562639249%3A%3A1704573439249; tmr_detect=0%7C1704573441514; t3_sid_6673155=s1.877151238.1704573423967.1704573473914.1.7'
    }
    const response = await axios.post('https://goo.su/frontend-api/convert', form, options)
    return response.data.short_url
}

const parseLink = async () => {

    const browser = await puppeteer.launch({headless: 'new'})
    const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});

    let result = []

    const getYMLink = async () => {
        const page = await browser.newPage();
        await page.setUserAgent(userAgent)

        await page.goto(constants.YANDEX_MARKET_LINK);
        await page.screenshot({ path: "ym_screenshot.png" })
        await page.waitForSelector('#header-search')
        return await page.evaluate( () => {
            const allDOMresults = document.getElementById('searchResults').querySelectorAll('article')
            let resultArray = []
            for (let index = 0; index < allDOMresults.length; index++) {
                let obj = {}
                obj.name = allDOMresults[index].querySelector('h3>a').innerText
                obj.link = allDOMresults[index].querySelector('h3>a').href
                obj.price = Number(allDOMresults[index].querySelector('span[data-auto="price-value"]').innerText.split(' ').join(''))
                resultArray.push(obj)
            }
            return resultArray
        })
    }
    const getMegaMarketLink = async () => {
        const page = await browser.newPage();
        await page.setUserAgent(userAgent)
        await page.setViewport({width: 2560, height: 1600})
        await page.goto(constants.MEGAMARKET_LINK);
        await page.screenshot({ path: "megamarket_screenshot.png" })
        await page.waitForSelector('.catalog-listing__items')
        return await page.evaluate( () => {
            const allDOMresults = document.querySelectorAll('.catalog-item')
            let resultArray = []
            for (let index = 0; index < allDOMresults.length; index++) {
                let obj = {}
                obj.name = allDOMresults[index].querySelector('.item-title').querySelector('.ddl_product_link').innerText
                obj.link = allDOMresults[index].querySelector('.ddl_product_link').href
                obj.price = Number(allDOMresults[index].querySelector('.item-price').innerText.split(' ')[0].split(' ').join(''))
                resultArray.push(obj)
            }
            return resultArray.filter(elem => elem.name.includes('PS5') || elem.name.includes('tation 5'))
        })
    }
    const getOzonLink = async () => {
        const page = await browser.newPage();
        await page.setUserAgent(userAgent)
        // озон блочит, парсить не выходит
        await page.goto(constants.OZON_LINK, {});
        await sleep(5000)
        await page.screenshot({ path: "ozon_screenshot.png" })
        await page.waitForSelector('.widget-search-result-container')
        return await page.evaluate( () => {
            // window.location.href - посмотреть
            const allDOMresults = document.querySelector('.widget-search-result-container').querySelectorAll('.i6w.iw7')
            let resultArray = []
            for (let index = 0; index < allDOMresults.length; index++) {
                let obj = {}
                obj.name = allDOMresults[index].querySelector('h3>a').innerText
                obj.link = allDOMresults[index].querySelector('h3>a').href
                obj.price = Number(allDOMresults[index].innerText.split(' ', 2).join(''))
                resultArray.push(obj)
            }
            return resultArray
        })
    }

    const YMPrices = await getYMLink()
    const MegaMarketPrices = await getMegaMarketLink()
    // const OzonPrices = await getOzonLink()
    // console.log(OzonPrices)
    result = [...result, ...YMPrices, ...MegaMarketPrices]

    await browser.close();

    if (result) {
            result = result.filter(elem => elem.price < 50000)

            const getNewArr = async (array) => {
                return array.map(async (el) => {
                    const link = await getShortLink(el.link)
                    return {link, price: el.price, name: el.name}
                })
            }

            Promise.all(await getNewArr(result)).then(async values => {
                // const elements = values.filter(elem => elem.price < 50000)
                // if (elements.length > 0) {
                if (values.length > 0) {
                    await sendMessage(values)
                } else {
                    console.log('Ничего не нашлось ниже 50000 рублей', new Date())
                    setTimeout(() => parseLink(), 600000)
                }
            })

            const sendMessage = async (array) => {
                const options = {
                    method: 'POST',
                    url: `https://api.telegram.org/bot${constants.TELEGRAM_TOKEN}/sendMessage`,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: typeof(array) == 'object' ? {chat_id: constants.CHAT_ID, text: '<code>' + JSON.stringify(array, null, '\t') + '</code>', parse_mode: "HTML"} : {chat_id: constants.CHAT_ID, text: ""}
                };

                await axios.request(options)
            }
    }
}
parseLink()