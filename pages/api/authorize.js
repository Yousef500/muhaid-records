const handler = async (req, res) => {
    try {
        const accessToken = req.cookies.accesss_token;
        if (accessToken) return res.status(200).json({loggedIn: true});
        return res.status(403).json({loggedIn: false});
    } catch (e) {
        console.log({e});
        return res.status(400).json({message: e.message})
    }
}
export default handler;