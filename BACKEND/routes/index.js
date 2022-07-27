var express = require('express');
var router = express.Router();
var Zoho = require('zoho');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Zoho APP' });
});


function zoho() {
  var crm = new Zoho.CRM({
    authtoken: 'e246911ebe9e6288ff62cae70d375e64'
  });

  crm.getRecords('userdatas', function (err, data) {
    if (err) {
      return console.log(err);
    }

    console.log(data);
  });
}



router.get('/zoho', (req, res) => {
  

})


module.exports = router;
