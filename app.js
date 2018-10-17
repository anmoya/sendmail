const express       = require('express');
const bodyParser    = require('body-parser');
const exphbs        = require('express-handlebars');
const nodemailer    = require('nodemailer');
const path          = require('path');

const app = express();

// View Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// BodyParser
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

// Contenido Estatico
app.use( '/public' , express.static( path.join(__dirname, 'public') ) );

app.get('/', (req, res) => {
    res.render('contactform');
});

app.post('/send', (req, res) => {
    //console.log(req.body);
    const output = `
        <p>Tienes un nuevo correo</p>
        <h3>Detalles:</h3>
        <ul>
            <li>Nombre: ${req.body.name}</li>
        </ul>
        <h3>Mensaje</h3>
        <p>${req.body.message}</p>
    `;

    let account = nodemailer.createTestAccount( (err, account) => account );
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls : {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'amoyach@gmail.com', // list of receivers
        subject: 'New Contact', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });

    res.render('contactform', { mssg : 'mail sended '});

});

app.listen(3000, () => console.log('Corriendo...'));


