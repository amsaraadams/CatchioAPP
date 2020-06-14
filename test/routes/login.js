var express = require('express');
const session = require('express-session');
//onst FileStore = require('session-file-store')(session);

var router = express.Router();
var mysqlpool = require('../dbconfig');
var path = require('path');
router.use(express.static(path.join(__dirname, 'public')));

// get function 
router.get('/', function(req, res, next) {
  res.render("login");
});
//
router.post('/', function(req, res) {

mysqlpool.getConnection(function(err, connection) {
  	var sql = "SELECT * from  users where  user_id='"+req.body["user_id"]+"' and password='"+req.body["password"]+"';";
    connection.query(sql,[1], function(err, results) {
	  if (err) throw err;
	  if(results.length){
		  console.log(results); // [{2: 2}
		  connection.release();
		  req.session.user_id = results[0].user_id;
		  req.session.User_name = results[0].User_name;
		  req.session.save();
		  res.redirect("./reports");
       }else{
       res.render("login",{ Message:"UserID or Password isn't correct"});
   	}
     }); 
    });

});
module.exports = router;