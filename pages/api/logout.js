import {serialize} from "cookie";
import jwt from "jsonwebtoken";
import fs from "fs";

const handler = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        const publicKey = fs.readFileSync('./src/app/public.pem')
        const verified = await jwt.verify(token, publicKey, {algorithm: 'RS256'})

        if (!verified.email) return res.status(403).json({message: "You're not logged in"});

        const badToken = serialize('access_token', '', {
            httpOnly: true,
            maxAge: -1,
            path: '/'
        });

        res.setHeader('Set-Cookie', badToken);
        return res.status(200).json();
    } catch (e) {
        console.log({e})
        return res.status(400).json({message: e.message})
    }
}

export default handler;