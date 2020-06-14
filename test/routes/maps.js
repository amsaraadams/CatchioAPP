var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');
var path = require('path');
router.use(express.static(path.join(__dirname, 'public')));

router.get('/', function(req, res, next) {
  if(req.session.user_id){

	//const messageS="the action is executed with success";
  mysqlpool.getConnection(function(err, connection) {
    var sql = "select * from area_loc"
    connection.query(sql,[1], function(err, results) {
	  if (err) throw err;
      connection.release();
      // console.log(results);
      rows=JSON.parse(JSON.stringify(results));
      var num=[]
      var area=[]
      var lat=[]
      var lon=[]
      rows.forEach(element => {
        num.push(element['count']);
        area.push(element['Area_Name']);
        lat.push(element['lat']);
        lon.push(element['lon']);
      });
         d={'count':num,'lat':lat,'lon':lon,
         'area':area,'user_name':req.session.User_name
       };
         console.log(d);
      res.render('maps', d);
     });
  });
  }else{
    res.redirect("/login");
  }
});


module.exports = router;
