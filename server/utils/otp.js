const twilio = require('twilio');
;
require("dotenv").config();


async function sendOTP(clientNumber,otp) {
  const accountSid = process.env.TWILIOACCOUNTSID;
  const authToken = process.env.TWILIOACCOUNTSIDprocess.env.TWILIOACCOUNTSID;
  const fromPhoneNumber = process.env.MYPHONE;
  const toPhoneNumber = clientNumber;

  const client = twilio(accountSid, authToken);

  try {
    // Generate OTP
    // Send OTP via SMS
    console.log(fromPhoneNumber)
    console.log(toPhoneNumber)
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: fromPhoneNumber,
      to: toPhoneNumber
    });

  console.log('OTP sent successfully:', message.sid);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
  
}


module.exports={sendOTP}
