var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');


/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.user_id){
var num=1;
    if ( typeof(req.query['Page']) !== 'undefined'){
        num=parseInt(req.query['Page']);
      }
    var mess="nothing";
    if ( typeof(req.query['Message']) !== 'undefined'){
        mess=req.query['Message'];
      }
      console.log(mess)
	//const messageS="the action is executed with success";
  mysqlpool.getConnection(function(err, connection) {
  	var sql = "select DR_Number,year_Reported,Victim_Age,sexe.valeur,status.Status_Description,crime.Crime_Code_Description, weapon.Weapon_Description, premise.Premise_Description,area.Area_Name from premise,sexe,crime_repot,area,crime,status,weapon where crime_repot.Area_ID=area.Area_ID and crime_repot.Victim_Sex=sexe.id and crime_repot.Premise_Code =premise.Premise_Code and crime_repot.Crime_Code=crime.Crime_Code AND crime_repot.Status_Code=status.Status_Code and crime_repot.Weapon_Used_Code=weapon.Weapon_Used_Code order by year_Reported DESC limit "+((num-1)*30)+","+30+" ;"
    +"SELECT count(*) as number FROM crime_repot;";
    connection.query(sql,[1,2], function(err, results) {
	  if (err) throw err;
      connection.release();
    //console.log(results[0]);
      //console.log(results);
      res.render('reports', {result:results[0],
                            number:results[1],
                            user_name:req.session.User_name,
                            Message:mess
                            });
     });
  });
  }else{
    res.redirect("/login");
  }
});

router.get("/delete/:id",function(req, res, next) {
 mysqlpool.getConnection(function(err, connection) {
  	var id = req.params.id;
  	var sql = "DELETE FROM crime_repot WHERE DR_Number="+id;
    connection.query(sql,[1], function(err, results) {
	  if (err) throw err;
      connection.release();
      console.log(results);
      //req.flash('notify', 'This is a test notification.')
      res.redirect('/reports');
     });

  });
});


/*app.get('/', function( req, res ) {
   //req.flash('message', 'This is a flash message using the express-flash module.');
    //res.redirect(301, '/');
//req.//flash('message', 'This is a test notification.');
      //res.redirect('/users');

});*/ 

module.exports = router;
