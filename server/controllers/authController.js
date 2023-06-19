const userDB = require("../models/userModel");
const tokenDB = require("../models/tokenModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const crypto = require('crypto')
const client = require("twilio")(process.env.TWILIOACCOUNTSID, process.env.TWILIOAUTHTOKEN)
const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Auth routes established');
})

const createUser = asynchandler(async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;

    if (!name || !phoneNumber || !email || !password) {
        return response.validationError(res, 'All fields are required');

    }
    const findUser = await userDB.findOne({ phone: phoneNumber });
    if (findUser) {
        return response.errorResponse(res, 'User already exists. Please login', 400)
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = new userDB({
        name: name,
        phone: phoneNumber,
        email: email,
        password: hashedPassword,
        communities: [],
        followers: [],
        followings: []
    })
    const savedUser = await newUser.save();
    var status;
    function set(phoneNumber) {
        status = phoneNumber;
    }
    await client.verify.v2.services(process.env.TWILIOSERVICEID).verifications.create({ to: phoneNumber, channel: 'sms' }).then(verifications => set(verifications.status))
    if (savedUser) {
        if (status == 'pending') {

            response.successResponse(res, savedUser, "Saved user successfully");
        }
        else {
            response.successResponse(res, savedUser, 'Saved User Successfully but failed to send otp')
        }
    }

    else {
        response.internalServerError(res, 'Failed to saved the user');

    }



})
//login
const loginUser = asynchandler(async (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return response.validationError(req, "Enter all the details properly");
    }
    const findUser = await userDB.findOne({ phone: phone });
    if (findUser) {
        if (findUser.blocked) {
            return response.errorResponse(res, "User blocked. Cannot login", 400)
        }
        const comparePassword = await bcrypt.compare(password, findUser.password);
        if (comparePassword) {
            response.successResponse(res, findUser, 'Logged in successfully')
        }
        else {
            response.errorResponse(res, 'Password incorrect', 400);
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the user. Please sign up');
    }
})
//change password
//reset password
//forget password
//resend otp
const resendOTP = asynchandler(async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return response.validationError(res, 'Cannot send otp without phone number')
    }
    var status;
    function set(phoneNumber) {
        status = phoneNumber;
    }
    await client.verify.v2.services(process.env.TWILIOSERVICEID).verifications.create({ to: phoneNumber, channel: 'sms' }).then(verifications => set(verifications.status))
    if (status == 'pending') {
        response.successResponse(res, '', "Resent the otp successfully");
    }
    else {
        response.internalServerError(res, "Failed to resend the otp")
    }

})
//verify otp
const verifyOTP = asynchandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    var status;
    function set(phoneNumber) {
        status = phoneNumber;
    }
    if (!phoneNumber || !otp) {
        return response.validationError(res, 'Cannot verify otp without the number')
    }

    const findUser = await userDB.findOne({ phone: phoneNumber })
    if (findUser) {
        await client.verify.v2.services(process.env.TWILIOSERVICEID).verificationChecks.create({ to: phoneNumber, code: otp }).then(verification_check => { set(verification_check.status) });
        if (status == "approved") {
            const updatedUser = await userDB.findOneAndUpdate({ phone: phoneNumber }, {
                isVerified: true
            }, { new: true });
            if (updatedUser) {
                response.successResponse(res, updatedUser, "Verified and updated the user")
            }
            else {
                response.successResponse(res, updatedUser, "Verified but cannot update the user contact admin");
            }
        }
        else {
            response.errorResponse(res, 'Verification failed', 400)
        }
    }
    else {
        response.notFoundError(res, "Cannot find the specified user");
    }

})


module.exports = { test, createUser, loginUser, resendOTP,verifyOTP }