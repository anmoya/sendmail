const express       = require('express');
const bodyParser    = require('body-parser');
const exphbs        = require('express-handlebars');
const nodemailer    = require('nodemailer');
const path          = require('path');
let   datauser      = require('./data.json');



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
        <p>Tienes un certificado vencido o por vencer.</p>
        <p style='color: red'>Esta wea está en duro.</p>
        <h3>Detalles:</h3>
        <ul>
            <li>Nombre: Cristian Tapia</li>
        </ul>
        <h3>Mensaje</h3>
        <p>Aca debería ir info de tu certificado. Obviamente, esto es una prueba, si que no webees.</p>
    `;

    //let account = nodemailer.createTestAccount( (err, account) => account );
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: datauser[0].user,
            pass: datauser[0].pass
        }
        /*host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls : {
            rejectUnauthorized: false
        }*/
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Avisos DBNeT 👻" <certificadosvencidos@dbnetcorp.com>', // sender address
        to: 'cristian.tapia@dbnetcorp.com', // list of receivers
        subject: 'Se te venció el certificado.', // Subject line
        text: 'El certificado que utilizas se encuentra vencido.', // plain text body
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


