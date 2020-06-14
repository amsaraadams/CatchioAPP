var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');
var path = require('path');
const session = require('express-session')
router.use(express.static(path.join(__dirname, 'public')));
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("here \n ");
    if(req.session.user_id){
    mysqlpool.getConnection(function(err, connection) {
    	var sql = "SELECT * from premise;SELECT * from sexe;SELECT MAX(DR_Number) as DR_Number FROM crime_repot;"+
    	"SELECT * FROM area;"+
    	"SELECT * FROM crime;"+
    	"SELECT * FROM status;"+
    	"SELECT * FROM weapon;";
      connection.query(sql,[1,2,3,4,5,6,7], function(err, results) {
  	  if (err) throw err;
  	  //console.log(results[0]); // [{1: 1}]
  	 // [{2: 2}
        connection.release();
        res.render('create', { sexe:results[1],
        						 premise:results[0],
        						 id:results[2],
        						 area:results[3],
        						 crime:results[4],
        						 status:results[5],
        						 weapon:results[6],
                     user_name:req.session.User_name

        						});
       });
    });
  }else{
    res.redirect("/login");
  }
});


router.post('/', function(req, res) {

console.log(req.body);

const Date_Reported=new Date(req.body["Date_Reported"]).toISOString().slice(0,10);
var resDate = Date_Reported.split("-");
const Date_Occurred=new Date(req.body["Date_Occurred"]).toISOString().slice(0,10);
var resDateO = Date_Occurred.split("-");

delete req.body["Date_Reported"];
delete req.body["Date_Occurred"];

req.body["year_Reported"]=parseInt(resDate[0]);
req.body["month_Reported_1"]=parseInt(resDate[1]);
req.body["day_Reported_2"]=parseInt(resDate[2]);
req.body["Year_Occurred"]=parseInt(resDateO[0]);
req.body["month_Occurred_1"]=parseInt(resDateO[1]);
req.body["day_Occurred_2"]=parseInt(resDateO[2]);

console.log(req.body);

mysqlpool.getConnection(function(err, connection) {
  var sql = 'INSERT INTO crime_repot SET ?'; 
  connection.query(sql,req.body,function (err, data) {
      if (err) throw err;
        console.log("report  is inserted successfully ");
        connection.release();
        res.redirect("/reports?Message='The_report_created_successfully'");
       });  
  }); 
});

router.get('/update/:id', function(req, res, next) {
  if(req.session.user_id){
  //console.log(" \n  hi motherf \n ");
  const id = req.params.id;
   mysqlpool.getConnection(function(err, connection) {
    var sql = "SELECT * from premise;SELECT * from sexe;"+
    "SELECT * FROM area;"+
    "SELECT * FROM crime;"+
    "SELECT * FROM status;"+
    "SELECT * FROM weapon;"+ "SELECT * FROM crime_repot  where  crime_repot.DR_Number="+id+";";
  
    connection.query(sql,[1,2,3,4,5,6,7], function(err, results) {
    if (err) throw err;
    //console.log(results[0]); // [{1: 1}]
    
    var Date_Reported=String(results[6][0]["year_Reported"])+"-"+String(results[6][0]["month_Reported_1"])+"-"+String(results[6][0]["day_Reported_2"]);
    var Date_Occurred=String(results[6][0]["Year_Occurred"])+"-"+String(results[6][0]["month_Occurred_1"])+"-"+String(results[6][0]["day_Occurred_2"]);
    results[6][0]["Date_Reported"]=Date_Reported;
    results[6][0]["Date_Occurred"]=Date_Occurred;
    connection.release();
    console.log(results[6]); 
    res.render('update', { sexe:results[1],
                 premise:results[0],
                 idR:id,
                 area:results[2],
                 crime:results[3],
                 status:results[4],
                 weapon:results[5],
                 all:results[6],
                 user_name:req.session.User_name
                });
     });
  });
 }else{
    res.redirect("/login");
  }
});

router.post('/update/:id', function(req, res) {

console.log(req.body);
const id = req.params.id;
const Date_Reported=new Date(req.body["Date_Reported"]).toISOString().slice(0,10);
var resDate = Date_Reported.split("-");
const Date_Occurred=new Date(req.body["Date_Occurred"]).toISOString().slice(0,10);
var resDateO = Date_Occurred.split("-");

delete req.body["Date_Reported"];
delete req.body["Date_Occurred"];

req.body["year_Reported"]=parseInt(resDate[0]);
req.body["month_Reported_1"]=parseInt(resDate[1]);
req.body["day_Reported_2"]=parseInt(resDate[2]);
req.body["Year_Occurred"]=parseInt(resDateO[0]);
req.body["month_Occurred_1"]=parseInt(resDateO[1]);
req.body["day_Occurred_2"]=parseInt(resDateO[2]);
console.log(req.body);
mysqlpool.getConnection(function(err, connection) {
  var sql = ' UPDATE crime_repot SET ? WHERE DR_Number='+id; 
  connection.query(sql,req.body,function (err, data) {
      if (err) throw err;
      console.log(req.baseUrl);
        console.log("report  is updated successfully ");
       res.redirect("/reports?Message='The_report_updated_successfully'");
       });  
  }); 

//res.render('tabels');
});
router.get("/show/:id",function(req, res, next) {
  if(req.session.user_id){
  mysqlpool.getConnection(function(err, connection) {
    var id = req.params.id;
    var sql = "select DR_Number,year_Reported,lat,lng,month_Reported_1,day_Reported_2,Time_Occurred,Year_Occurred,month_Occurred_1,day_Occurred_2, Victim_Age,sexe.valeur,status.Status_Description,crime.Crime_Code_Description, weapon.Weapon_Description, premise.Premise_Description,area.Area_Name from premise,sexe,crime_repot,area,crime,status,weapon where  crime_repot.DR_Number="+id+" and crime_repot.Area_ID=area.Area_ID and crime_repot.Victim_Sex=sexe.id and crime_repot.Premise_Code =premise.Premise_Code and crime_repot.Crime_Code=crime.Crime_Code AND crime_repot.Status_Code=status.Status_Code and crime_repot.Weapon_Used_Code=weapon.Weapon_Used_Code ;";
    connection.query(sql,[1], function(err, results) {
    if (err) throw err;
      connection.release();
      console.log(results);
      var Date_Reported=String(results[0]["year_Reported"])+"-"+String(results[0]["month_Reported_1"])+"-"+String(results[0]["day_Reported_2"]);
      var Date_Occurred=String(results[0]["Year_Occurred"])+"-"+String(results[0]["month_Occurred_1"])+"-"+String(results[0]["day_Occurred_2"]);
      results[0]["Date_Reported"]=Date_Reported;
      results[0]["Date_Occurred"]=Date_Occurred;
      console.log(results);
      //res.send("hi");
      res.render('show', {id:results,user_name:req.session.User_name});
     });
  });
}else{
    res.redirect("/login");
  }
});
router.get("/delete/:id",function(req, res, next) {
   if(req.session.user_id){
 mysqlpool.getConnection(function(err, connection) {
    var id = req.params.id;
    var sql = "DELETE FROM crime_repot WHERE DR_Number="+id;
    connection.query(sql,[1], function(err, results) {
    if (err) throw err;
      connection.release();
      console.log(results);
      //req.flash('notify', 'This is a test notification.')
      res.redirect("/reports?Message=The_report_deleted_successfully");
     });
  });
}else{
    res.redirect("/login");
  }
});

module.exports = router;
