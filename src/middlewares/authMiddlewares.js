const adminAuth = (req, res, next) => {
    const token = req.query.token;

    if (token === 'xyz') {
        next()
    } else {
        res.status(401).send('unauthorized admin')
    }
}

const userAuth = (req, res, next) => {
    const token = req.query.token;

    if (token === 'xyz') {
        next()
    } else {
        res.status(401).send('unauthorized user')
    }
}



module.exports = {
    adminAuth,
    userAuth
}