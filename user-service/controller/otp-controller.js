import { sendEmail } from '../middleware/sendEmail.js';
import OtpModel from '../model/otp-model.js';
import randomstring from 'randomstring';
import { findUserByUsernameOrEmail } from '../model/repository.js';


// Generate OTP
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

// Send OTP to the provided email
export async function sendOTP (req, res) {
    try {

        const { email } = req.body;

        const otp = generateOTP(); // Generate a 6-digit OTP

        const newOTP = new OtpModel({ email, otp });
        await newOTP.save();
        // Send OTP via email
        await sendEmail({
            to: email,
            subject: 'Your OTP',
            message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Verify OTP provided by the user
export async function verifyOTP (req, res){
    try {
        const { email, verificationCode } = req.body;
       
        const existingOTP = await OtpModel.findOneAndDelete({ email:email, otp:verificationCode });
     
        if (existingOTP) {
            // OTP is valid
            res.status(200).json({ success: true, message: 'OTP verification successful' });
        } else {
            // OTP is invalid
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};