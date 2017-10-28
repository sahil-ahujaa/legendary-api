var express = require('express')
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var randtoken = require('rand-token');

var app = express();

mongoose.connect('mongodb://user:pass@ds237735.mlab.com:37735/codeoff');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    // we're connected!
    console.log("Connected To MongoLab");
});

//Schema Setup
var codeSchema = mongoose.Schema({
    code: String
});

var Code = mongoose.model('codecollections', codeSchema);

app.use(require('body-parser').urlencoded({
    extended: true
}));

app.set('port', process.env.PORT || 3000);


app.route('/api/v1/:tokenKey/:type/generate')
    .get(function(req, res) {
    var typeOfCode = req.params.type;
    var genCode;
    if(typeOfCode==1)
    	genCode = generateCode1(); 
    else if(typeOfCode==2)
    	genCode = generateCode2(); 
    else if(typeOfCode==3)
    	genCode = generateCode3();
    else
    	genCode = generateCode();
    
    var newCode = new Code({ code: genCode });
    newCode.save(function (err, result) {
	if (err) return console.error(err);
	console.log("Saved");
		});
    res.json(newCode);
    });

app.route('/api/v1/:tokenKey/validate')
    .post(function(req, res) {
                Code.findOne({
                    code: req.body.codeStr
                }, function(err, successStatus) {
                    if (err)
                        res.send({
                            status: "Error"
                        });
                    else{
                    	if(successStatus!=null)
                    		res.send({
                            status: "success"
                        });
                        else
                        	res.send({
                            status: "failed"
                        });
                    }
                });
        });

var generateCode = function() {
    var generatedCode = randtoken.generate(4) + "-" + randtoken.generate(4) + "-" + randtoken.generate(4);
    generatedCode = generatedCode.toUpperCase();
    return generatedCode;
}
var generateCode1 = function() {
    var generatedCode = randtoken.generate(2) + "-" + randtoken.generate(2) + "-" + randtoken.generate(2) + "-" + randtoken.generate(2) + "-" + randtoken.generate(2);
    generatedCode = generatedCode.toUpperCase();
    return generatedCode;
}
var generateCode2 = function() {
    var generatedCode = randtoken.generate(10);
    generatedCode = generatedCode.toUpperCase();
    return generatedCode;
}
var generateCode3 = function() {
    var generatedCode = randtoken.generate(4) + "-" + randtoken.generate(2) + "-" + randtoken.generate(4);
    generatedCode = generatedCode.toUpperCase();
    return generatedCode;
}
app.listen(app.get('port'), function() {
    console.log('server started')
});