const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { token } = req.body;
    console.log(req.body)
    console.log("ini token" + token)
    let decodedToken;
    if(!token){
        res.status(401).json({ message: "Not Authenticated!" })
    }
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SIGNATURE)
    } catch (error) {
        res.status(500);
    }
    if(!decodedToken){
        res.status(401);
    }
    console.log(decodedToken)
    req.userId = decodedToken.userId

    next()
}