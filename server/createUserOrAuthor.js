const userAuthorModel = require('./MODELS/userAuthorModel');

async function createUserOrAuthor(req, res) {
    try {
        const newUser = req.body;
        let userInDb = await userAuthorModel.findOne({ email: newUser.email });

        if (!userInDb) {
            let userToSave = new userAuthorModel(newUser);
            let newUserOrAuthorDoc = await userToSave.save();
            return res.status(201).send({ message: newUserOrAuthorDoc.role, payload: newUserOrAuthorDoc });
        } 
        if (newUser.role === userInDb.role) {
            return res.status(200).send({ message: userInDb.role, payload: userInDb });
        } else {
            return res.send({ message: 'Invalid Role' ,payload:"Error already a role is assigned"});
        }
    } catch (error) {
        console.error('Error in createUserOrAuthor:', error);
        return res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = createUserOrAuthor;
