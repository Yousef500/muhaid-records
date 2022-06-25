import puppeteer from "puppeteer";
import fs from "fs";

const handler = async (req, res) => {
    try {
        const content = fs.readFileSync('./test.html', 'utf-8');
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setContent(content);
        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            path: 'test.pdf'
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
