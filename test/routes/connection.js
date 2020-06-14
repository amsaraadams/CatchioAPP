var Connection = require('mysql');

/* Create Connection to Database */
var con = Connection.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "c_r"
});


 module.exports=con;



