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
    var sql = "select * from forcastmysql;"+"select * from forcastmysqlTrans;"+"select * from area_loc";
    connection.query(sql,[1,2,3], function(err, results) {
	  if (err) throw err;
      connection.release();
      areaName="Central";
      if ( typeof(req.query['Area']) !== 'undefined'){
        areaName=req.query['Area'];
      }
      var Date_Col='Column_2017_09_10';
      if ( typeof(req.query['Date']) !== 'undefined'){
        var Dote=req.query['Date'].split("-");
         Date_Col="Column_"+Dote[0]+"_"+Dote[1]+"_"+Dote[2];
      }
    //console.log(Date_Col);
      rowsA=JSON.parse(JSON.stringify(results[0]));
      rowsT=JSON.parse(JSON.stringify(results[1]));
      rowsLoc=JSON.parse(JSON.stringify(results[2]));
      var day=[]
      var pred=[]
      var lat=[]
      var lon=[]
      var area0=[]
      rowsA.forEach(element => {
        day.push(element['day'])
        pred.push(element[areaName])
      });
      var date=[]
  
    //   var area=[]
      rowsT.forEach(element => {

        date.push(element[Date_Col])
        // area.push(element['Column_1'])
      });
      rowsLoc.forEach(element => {
        // num.push(element['count']);
        area0.push(element['Area_Name']);
        lat.push(element['lat']);
        lon.push(element['lon']);
      });

      d={
      'day':day,'pred':pred,
      'areaName':areaName,
      'user_name':req.session.User_name,
    'area':area0,'date':date,'lat':lat,'lon':lon};
        // console.log(d);
      res.render('prediction', d);
     });
  });
 }else{
    res.redirect("/login");
  }
});




module.exports = router;
