const mongoose = require('mongoose');


module.exports = async () => {
    await mongoose.connect('mongodb+srv://Namastedev:L4FNK9g6mIghkH8I@namastenode.e3qzz.mongodb.net/devTinder')
}

 