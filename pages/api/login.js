import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";
import jwt from "jsonwebtoken";
import {serialize} from "cookie";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const {email, password} = req.body;
        if (email?.length > 4 && password) {
            try {
                const {db} = await connectToDatabase();
                const user = await db.collection('Users').findOne({email});
                if (!user) return res.status(403).json({message: "هذا البريد غير مسجل"});
                const match = await bcrypt.compare(password, user.hashedPassword);
                if (!match) return res.status(403).json({message: 'تأكد من كلمة المرور'})
                const privateKey = fs.readFileSync('./src/app/privateKey.pem');
                const data = {
                    time: new Date(),
                    email,
                }
                const token = await jwt.sign(data, privateKey, {algorithm: 'RS256', expiresIn: 21600});
                const serializedAccessToken = serialize('access_token', token, {
                    httpOnly: true,
                    maxAge: 21599,
                    path: '/'
                });
                res.setHeader('Set-Cookie', serializedAccessToken);
                return res.status(200).json();
            } catch (e) {
                console.log({e})
                return res.status(400).json({message: 'لقد حدث خطأ ما'});
            }
        } else {
            return res.status(403).json({message: 'الرجاء ادخال البريد وكلمة المرور'})
        }
    } else {
        res.status(400).json()
    }
}

export default handler;