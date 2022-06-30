import puppeteer from "puppeteer";
import fs from "fs";
import hbs from 'handlebars';

const handler = async (req, res) => {
    const {name, description} = req.query;
    try {
        const doc = await fs.promises.readFile('./public/static/report-templates/report1.html', 'utf-8');
        const template = await hbs.compile(doc);
        const content = template({
            name,
            description
        })
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setContent(content);
        await page.addStyleTag({
            path: './mdb.rtl.min.css'
        })
        await page.waitForSelector('img')
        await page.emulateMediaType('screen');

        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');

        res.send(buffer);
    } catch (e) {
        console.log({e})
        res.status(400).json({message: e.message})
    }
}

export default handler
