var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');
var path = require('path');
router.use(express.static(path.join(__dirname, 'public')));

// const d={}

router.get('/', function(req, res, next) {
  if(req.session.user_id){

	//const messageS="the action is executed with success";
  mysqlpool.getConnection(function(err, connection) {
    var sql = "SELECT count(*) as number, year_Reported FROM  crime_repot group by year_Reported;"
    +"select count(*) as count,c.Crime_Code_Description as Crime_name from crime c,crime_repot cr where c.Crime_Code=cr.Crime_Code group by c.Crime_Code;"
    +"SELECT Victim_Age,count(*) as countage FROM crime_repot group by Victim_Age;"
    +"select * from forcastmysql";
    connection.query(sql,[1,2,3,4], function(err, results) {
	  if (err) throw err;
      connection.release();
      area='Central';
      rows0=JSON.parse(JSON.stringify(results[0]));
      rows1=JSON.parse(JSON.stringify(results[1]));
      rows2=JSON.parse(JSON.stringify(results[2]));
      rows3=JSON.parse(JSON.stringify(results[3]));
      var num=[]
      var yr=[]
      var cc=[]
      var numCC=[]
      var vage=[]
      var agecc=[]
      var day=[]
      var pred=[]
      rows0.forEach(element => {
        num.push(element['number'])
        yr.push(element['year_Reported'])
      });
      rows1.forEach(element => {
        cc.push(element['count'])
        numCC.push(element['Crime_name'])
      });
      rows2.forEach(element => {
        vage.push(element['Victim_Age'])
        agecc.push(element['countage'])
      });
      rows3.forEach(element => {
        day.push(element['day'])
        pred.push(element[area])
      });
      d={'number':num,'year_Reported':yr,
      'countC':cc,'Crime_code':numCC,'victim_age':vage,
      'countage':agecc ,
      'day':day,'pred':pred, 'user_name':req.session.User_name};
      res.render('charts', d);
     });
  });
}else{
    res.redirect("/login");
  }
});


// 	//const messageS="the action is executed with success";
//   mysqlpool.getConnection(function(err, connection) {
// var sql ='SELECT count(*),Crime_Code FROM crime_repot group by Crime_Code'
// connection.query(sql,[1], function(err, results) {
// 	  if (err) throw err;
//       connection.release();
//       rows=JSON.parse(JSON.stringify(results));
//             console.log(results);
//       res.render('charts', d);
      
//      });
//   });
// });

module.exports = router;
