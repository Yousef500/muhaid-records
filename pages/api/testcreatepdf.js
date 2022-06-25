import puppeteer from "puppeteer";
import fs from "fs";
import hbs from 'handlebars';

const handler = async (req, res) => {
    const {name, description} = req.query;
    try {
        const doc = fs.readFileSync('./test.html', 'utf-8');
        const template = await hbs.compile(doc);
        const content = template({
            name,
            description
        })
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setContent(content);
        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        })
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');

        res.send(buffer);
    } catch (e) {
        console.log({e})
        res.status(400).json({message: e.message})
    }
}

export default handler
