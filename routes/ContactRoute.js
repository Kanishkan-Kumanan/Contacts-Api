const express = require('express')
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const Contact = require("../models/contactSchema");
const validateToken = require('../middleWares/accesstokenValidation');

router.use(validateToken);

// get all Contacts

router.get("/",expressAsyncHandler(async (req,res)=>{
    const contacts = await Contact.find({user_id : req.user.id});
    res.status(200).json(contacts);
}))

// create contacts

router.post("/",expressAsyncHandler(async (req,res)=>{
    console.log(req.body)
    const {name,email,phone} = req.body
    if(!name || !phone || !email){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const contact = await Contact.create({
        name : name,
        email : email,
        phone : phone,
        user_id : req.user.id,
    });
    res.status(200).json(contact);
}))


// get specific contact

router.get("/:id",expressAsyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404)
        throw new Error("No such contact found")
    }
    
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User is not authorized")
    }

    res.status(200).json(contact)
}))


// update specific id

router.put("/:id",expressAsyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404)
        throw new Error("No such contact found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User is not authorized to update this contact")
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json(updatedContact);
}))


// delete specific id

router.delete("/:id",expressAsyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404)
        throw new Error("No such contact found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User is not authorized to delete this contact")
    }

    await Contact.findByIdAndRemove(req.params.id)
    res.status(200).json(contact);
}))

module.exports = router