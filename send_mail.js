const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account');
        console.error(err);
        return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
        {
            service: 'Gmail',
            auth: {
                user: 'camel.twitter.co@gmail.com', // generated ethereal user
                pass: '1234567890@A'  // generated ethereal password
            }
        }
    );

    // Message object
    let message = {
        from: 'Camel <camel.twitter.co@gmail.com>', // sender address
        to: 'ali.edalat.77@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' //HTML BODY
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
        }
        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));
        //transporter.close();
    });
});
