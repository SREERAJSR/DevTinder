const validator = require("validator");
const validateSignupApi = (req) => {
    const { firstName, lastName, gender, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error('Name is required')
    } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("password is not strong")
    }
}

module.exports = {
    validateSignupApi
}