/*
var http = require('http');
var fs = require('fs');
var send = require('send');
var url = require('url');
var express = require('express');
var router = express.Router();

http.createServer(function (req, res) {
	var q = url.parse(req.url, true).query;
	console.log(req.url);
	console.log(q);
	if(req.url == '/'){
		fs.readFile('w.html', function(err, data) {
			if(err){
				res.writeHead(500);
				res.end();
			}else{
		    	res.writeHead(200, {'Content-Type': 'text/html'});
		    	res.write(data);
		    	res.end();
	    	}
	    
	    });
	}else if(req.url.indexOf('/main') >= 0){
		res.render("user.html", {name:q.uname});
		//res.write('hello '+q.uname);
		//res.end();
	}
	else{
		fs.readFile(req.url, function(err, data) {
			if(err){
				res.writeHead(500);
				res.end();
			}else{
		    	res.writeHead(200, {'Content-Type': 'image/png'});
		    	res.write(data);
		    	res.end();
	    	}
	    
	    });	
	}

}).listen(8080, "127.0.0.1");
*/
var pg = require('pg') 
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var app = express();
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1377@localhost:5432/users'

    app.set('view engine', 'ejs');  //tell Express we're using EJS
    app.set('views', __dirname);  //set path to *.ejs files
    //app.use(app.router);
    //put your static files (js, css, images) into /public directory


app.get('/', function (req, res) {
   res.sendFile("/home/ali/Desktop/nodejs-server/w.html");
})
app.get('/avatar.png', function (req, res) {
   res.sendFile("/home/ali/Desktop/nodejs-server/avatar.png");
})

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//app.use(express.bodyParser());

app.post('/main',function (req, res) {
	//var q = url.parse(req.url, true).query;
	console.log(req.body.uname)

	const client = new pg.Client(connectionString)
	client.connect();
	client.query('SELECT * FROM users WHERE username = $1', [req.body.uname], (err, result) => {
  		/* etc, etc */
  		if(result.rows.length == 0){
  			res.redirect('/');
  		}
  		result.rows.forEach(row=>{
  			console.log(row['password'])
    		if (row['password'] != req.body.psw){
				res.redirect('/');
			}else{
				client.query('UPDATE users SET is_login=\'TRUE\' WHERE username=\''+req.body.uname+'\'');
				var string = encodeURIComponent(req.body.uname);
  				res.redirect('/home_page?username=' + string);			
			}
		});
	})
	//client.end()
	/*query.on("row", function (row, result) {
    	result.addRow(row);
    	if (result.rows[0].password != req.body.psw){
			res.redirect('/');
		}
	});*/
	//if (result.rows[0].password != req.body.psw){
	//	res.redirect('/');
	//}

	
    //res.render("user",{name:req.body.uname});
    //res.send('hello '+ q.uname)
    //res.sendFile("/home/ali/Desktop/nodejs-server/user.html",{name:req.body.uname})
})

app.post('/searching', function(req, res){
	console.log('searching : '+ req.body.search)

	const client = new pg.Client(connectionString)
	client.connect();
	client.query('SELECT * FROM users WHERE username = $1', [req.body.search], (err, result) => {
  		/* etc, etc */
  		if(result.rows.length == 0){
  			console.log('Ok!');
  			res.send('Ok!');
  		}else{
  			console.log('I find this username . please change your username!');
  			res.send('I find this username . please change your username!');
  		}
  		
	})
	//client.end()	
 	//res.send("WHEEE");
})

app.post('/logingOut', function(req, res){
	console.log('logingout : '+ req.body.user)
	const client = new pg.Client(connectionString)
	client.connect();

    // SQL Query > Insert Data
    client.query('UPDATE users SET is_login=\'FALSE\' WHERE username=\''+req.body.user+'\'');
})

app.post('/signup_new_user',function (req, res) {
	//var q = url.parse(req.url, true).query;
	console.log(req.body.uname)
	const client = new pg.Client(connectionString)
	client.connect();

    // SQL Query > Insert Data
    client.query('INSERT INTO users(username, password, is_login) values($1, $2, $3)',
    [req.body.uname, req.body.psw, 1]);

    //client.end()

	var string = encodeURIComponent(req.body.uname);
  	res.redirect('/home_page?username=' + string);
    //res.render("user",{name:req.body.uname});
    //res.send('hello '+ q.uname)
    //res.sendFile("/home/ali/Desktop/nodejs-server/user.html",{name:req.body.uname})
})

app.get('/home_page' , function (req, res) {
	var passedVariable = req.query.username;
	console.log(passedVariable)
   res.render("user",{name:passedVariable});
})

app.get('/signup.html', function (req, res) {
   res.sendFile("/home/ali/Desktop/nodejs-server/signup.html");
})

app.get('/forget_pass.html', function (req, res) {
   res.sendFile("/home/ali/Desktop/nodejs-server/forget_pass.html");
})

/*app.post('/signup-user',function (req, res) {
	//var q = url.parse(req.url, true).query;
	console.log(req.body.uname)
	res.redirect('/main');
    //res.render("user",{name:req.body.uname});
    //res.send('hello '+ q.uname)
    //res.sendFile("/home/ali/Desktop/nodejs-server/user.html",{name:req.body.uname})
})*/

app.get('/login', function (req, res) {
	res.redirect('/');
    //res.sendFile("/home/ali/Desktop/nodejs-server/w.html");
})

app.get('/camel.png', function (req, res) {
   res.sendFile("/home/ali/Desktop/nodejs-server/camel.png");
})

app.post('/remember_pass', function (req, res) {
	var found_password;

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
    
    const client = new pg.Client(connectionString)
	client.connect();
	client.query('SELECT * FROM users WHERE username = $1', [req.body.uname], (err, result) => {
  		/* etc, etc */
  		if(result.rows.length == 0){
  			res.redirect('/');
  		}
  		result.rows.forEach(row=>{
  			found_password = row['password'];
  			console.log(found_password)
  			let message = {
	        from: 'Camel <camel.twitter.co@gmail.com>', // sender address
	        to: req.body.Email, // list of receivers
	        subject: 'Hello '+req.body.uname+' ✔', // Subject line
	        text: 'you can see login username and password : username : '+req.body.uname+'password : '+found_password, // plain text body
	        html: '<h1>Hello '+req.body.uname+'</h1><br><b>you can see login username and password :</b><br><b>Username : '+req.body.uname+'</b><br><b>Password : '+found_password+'</b>' //HTML BODY
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
  		})
  	})
    // Message object

    
});

	res.redirect('/');
})

app.post('/remember_username', function(req, res){
	console.log('searching : '+ req.body.search)

	const client = new pg.Client(connectionString)
	client.connect();
	client.query('SELECT * FROM users WHERE username = $1', [req.body.search], (err, result) => {
  		/* etc, etc */
  		if(result.rows.length == 0){
  			console.log('I can not find this username . please change your username!');
  			res.send('I can not find this username . please change your username!');
  		}else{
  			console.log('Ok!');
  			res.send('Ok!');
  		}
  		
	})
	//client.end()	
 	//res.send("WHEEE");
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})





/*var http = require('http')
var fs = require('fs')
var parseUrl = require('parseurl')
var send = require('send')
 
// Transfer arbitrary files from within /www/example.com/public/* 
// with a custom handler for directory listing 
var server = http.createServer(function onRequest (req, res) {
  send(req, parseUrl(req).pathname, {index: false, root: '/home/ali/Desktop/nodejs-server'})
  .once('directory', directory)
  .pipe(res)
})
 
server.listen(8080)
 
// Custom directory handler 
function directory (res, path) {
  var stream = this
 
  // redirect to trailing slash for consistent url 
  if (!stream.hasTrailingSlash()) {
    return stream.redirect(path)
  }
 
  // get directory list 
  fs.readdir(path, function onReaddir (err, list) {
    if (err) return stream.error(err)
 
    // render an index for the directory 
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8')
    res.end(list.join('\n') + '\n')
  })
}
*/