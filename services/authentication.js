require('dotenv').config()
const jwt = require ('jsonwebtoken');

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorizeation']
    const token = authHeader && authHeader.split[' '][1]
    if(token == null)
    return res.endStatus(401);

    jwt.verify(token,process.env.Au)
}