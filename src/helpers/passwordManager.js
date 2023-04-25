const bcrypt = require('bcryptjs');

const passwordManager = {
    encryptPassword: (password) => {
        return bcrypt.hashSync(password, 10);
    },
    comparePassword: (password, receivedPassword) => {
        return bcrypt.compareSync(password, receivedPassword);
    }

}

module.exports = passwordManager;