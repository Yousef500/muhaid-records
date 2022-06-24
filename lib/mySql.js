import mysql from 'mysql'
import {env} from "../next.config";


const sqlMgr = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
});
sqlMgr.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB');
});

export default sqlMgr;

