const { v4: uuidv4 } = require('uuid');
const SharedPasswords = require('../models/shared_passwords');
const { decryptMasterKey, wrapKey } = require('../utils/cryptoUtils');

const sharePassword = async (req, res) => {
    const { sender_id, receiver_id, item_id } = req.body;
    try{
        const sharedCredential = await SharedPasswords.findOne({share_id: item_id});
        if (!sharedCredential){
            return res.status(404).json({message: "Credential not found"});
        }

        // Decrypt the site key for the sender
        const senderMasterKey = await decryptMasterKey(sender_id); // get the sender's master key
        const siteKey = decryptPassword(sharedCredential.encrypted_password, senderMasterKey);// decrypt the password for sender

        // Wrap the site key with the receiver's master key 
        const receiverMasterKey = await decryptMasterKey(receiver_id); // get the receiver's master key
        const wrappedKeyForReceiver = wrapKey(siteKey, receiverMasterKey); // reencrypt the password for the receiver

        // Save the wrapped key and other details in the database for sharing
        const newSharedItem = new SharedPasswords({
            share_id: uuidv4(),
            sender_id,
            receiver_id,
            encrypted_password: wrappedKeyForReceiver,
        });

        await newSharedItem.save();

        res.status(200).json({message: "Password shared successfully."});

    }catch (error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {
    sharePassword,
}