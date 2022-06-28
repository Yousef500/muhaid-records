import fs from "fs";
import jwt from "jsonwebtoken";
import TokenExpiredError from "jsonwebtoken/lib/TokenExpiredError";

const handler = async (req, res) => {
    try {
        const accessToken = req.cookies.accesss_token;
        if (accessToken) {
            const publicKey = await fs.promises.readFile('./src/app/public.pem');
            try {
                const verifiedUser = await jwt.verify(accessToken, publicKey, {algorithm: 'RS256'});
                if (verifiedUser.email) return res.status(200).json({loggedIn: true});
            } catch (e) {
                if (e instanceof TokenExpiredError) {
                    return res.status(403).json({message: 'Your session has ended.', loggedIn: false});
                }
                return res.status(400).json({message: e.message, loggedIn: false})
            }
        }
        return res.status(403).json({loggedIn: false});
    } catch (e) {
        console.log({e});
        return res.status(400).json({message: e.message, loggedIn: false})
    }
}
export default handler;