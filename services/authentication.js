require('dotenv').config()
const jwt = require ('jsonwebtoken');

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorizeation']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)
    return res.SendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN, (err, response) => {
        if (err)
        return res.SendStatus(403);
    res.locals = response;
    next()
    })

}
module.exports = { authenticateToken: authenticateToken}
