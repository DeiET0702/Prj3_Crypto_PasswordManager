const SharedPasswords = require('../models/shared_passwords');
const User = require("../models/user");
const Items = require("../models/items");
const { decryptMasterKey, wrapKey, decryptPassword } = require('../utils/cryptoUtils'); // decrypt and wrapkey functions

const sharePassword = async (req, res) => {
    const { sender_id, username, item_id, master_password } = req.body;
    try{
        // verify item exists and sender owns it
        const item = await Items.findOne({item_id, owner_id: sender_id});
        if (!item){
            return res.status(403).json({message: "No authorized to share this credential"});
        }

        // Verify receiver exists
        const Receiver = await User.findOne({ username });
        if (!Receiver){
            return res.status(404).json({message: "Receiver not found"});
        }

        // check if already shared with receiver
        const existingShare = await SharedPasswords.findOne({item_id: item_id, receiver_id: Receiver.user_id});
        if (existingShare) {
            return res.status(400).json({message: "Credential already shared with this receiver"});
        }


        // Decrypt the site key for the sender
        const senderMasterKey = await decryptMasterKey(sender_id, master_password); // get the sender's master key
        const siteKey = decryptPassword(item.encryptedPassword, item.iv, item.tag, senderMasterKey);// decrypt the password for sender
        // siteKey is the password that will be shared

        // Wrap the site key with the receiver's master key 
        const receiverMasterKey = await decryptMasterKey(Receiver.receiver_id); // get the receiver's master key
        const wrappedKeyForReceiver = wrapKey(siteKey, receiverMasterKey); // reencrypt the password for the receiver

        // Save the wrapped key and other details in the database for sharing
        const newSharedItem = new SharedPasswords({
            item_id: item_id,
            sender_id,
            receiver_id: Receiver.user_id,
            encrypted_password: wrappedKeyForReceiver,

        });

        await newSharedItem.save();

        res.status(200).json({message: "Password shared successfully."});

    }catch (error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const viewSharedPassword = async (req, res) => {
    try{
        const credentials = await SharedPasswords.find();
        console.log("All shared passwords: ", credentials);
        res.status(200).json({data: credentials, message: "success"});
    }catch (error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

// Delete shared password only used for sender and receiver
const deleteSharedPassword = async (req, res) => {
    try{
        const { share_id } = req.params;

        // Find and delete the sharedPassword by share_id
        const deleteSharedPasswords = await SharedPasswords.findOne({ share_id });
        if (deleteSharedPasswords) {
            return res.status(404).json({message: "sharedPassword not found", status: "error"});
        }
        res.status(200).json({message: "Delete shared password successfully", status: "success"});
    }catch (error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = {
    sharePassword,
    viewSharedPassword,
    deleteSharedPassword
}