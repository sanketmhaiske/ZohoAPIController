var express = require('express');
var router = express.Router();
const axios = require('axios')
const bodyParser = require('body-parser')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Zoho APP' });
});

// Get Records 

router.get('/leads', (req, res) => {

  function getRecords() {

    let url = 'https://www.zohoapis.in/crm/v2/Leads'

    let headers = {
      Authorization: "Zoho-oauthtoken 1000.d0658076d6887af0f719cd145342d025.e9030e4ae15e1684288e790fd436b7b8",
    }

    let parameters = {
      'approved': 'both',
      'converted': 'both',
      'cvid': '3409643000002804006',
      'ids': '3409643000002804010,3409643000002804109',
      'uid': '3409643000002804154',
      'fields': 'Last_Name,Email',
      'sort_by': 'Email',
      'sort_order': 'desc',
      'page': '1',
      'per_page': '100',
      'startDateTime': '2020-05-15T12:00:00+05:30',
      'endDateTime': '2020-10-15T12:00:00+05:30',
      'territory_id': '3409643000002804205',
      'include_child': 'false'
    }

    let requestDetails = {
      method: "GET",
      headers: headers,
      searchParams: parameters,
      throwHttpErrors: false
    }

    axios(url, requestDetails).then(response => {

      return res.status(200).json({
        message: 'success',
        result: response.data.data
      })

    }).catch(error => {
      console.log(error)
    })
  }

  getRecords()

})


// Post Records / insert Records 

router.post('/postleads', (req, res) => {


  let url = 'https://www.zohoapis.com/crm/v2/Leads'

  let headers = {
    Authorization: "Zoho-oauthtoken 1000.d0658076d6887af0f719cd145342d025.e9030e4ae15e1684288e790fd436b7b8",
  }

  let requestBody = {}
  let recordArray = []

  let recordObject1 = {
    'Company': 'Zylker',
    'Email': 'p.daly@zylker.com',
    'Last_Name': 'Daly',
    'First_Name': 'Paul',
    'Lead_Status': 'Contacted',
  }

  let recordObject2 = {
    'Last_Name': 'Dolan',
    'First_Name': 'Brian',
    'Email': 'brian@villa.com',
    'Company': 'Villa Margarita'
  }

  recordArray.push(recordObject1)
  recordArray.push(recordObject2)

  requestBody['data'] = recordArray

  let trigger = ['approval', 'workflow', 'blueprint']
  requestBody['trigger'] = trigger


  let requestDetails = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
    encoding: "utf8",
    throwHttpErrors: false
  };

  console.log(requestDetails)

  axios(url, requestDetails).then(data => {
    return res.status(200).json({
      message: 'success',
      result: 'Records has been posted'
    })
  }).catch(error => {
    return res.status(400).json({
      message: 'Error',
      result: error,
    })
  })
})

// Remove Records 

router.post('/remove_leads', (req, res) => {

  function deleteRecord() {

    let url = `https://www.zohoapis.in/crm/v2/Leads/${req.body.id}`

    let headers = {
      Authorization: "Zoho-oauthtoken 1000.d0658076d6887af0f719cd145342d025.e9030e4ae15e1684288e790fd436b7b8"
    }

    let parameters = {
      'wf_trigger': 'true'
    }

    let requestDetails = {
      method: "DELETE",
      headers: headers,
      searchParams: parameters,
      throwHttpErrors: false
    }

    axios(url, requestDetails).then(data => {
      return res.status(200).json({
        message: 'success',
        result: 'Records has been removed'
      })
    }).catch(error => {
      return res.status(400).json({
        message: 'Error',
        result: error,
      })
    })
  }

  deleteRecord()

})


// Update Records 

router.post('/update_leads', (req, res) => {

  let url = `https://www.zohoapis.in/crm/v2/Leads/369097000000243406`

  let headers = {
    Authorization: "Zoho-oauthtoken 1000.d0658076d6887af0f719cd145342d025.e9030e4ae15e1684288e790fd436b7b8"
  }

  let requestBody = {}
  let recordArray = []

  let recordObject = {
    'Phone': '9876543210',
    'Lead_Status': 'Contact in Future',
    'Email_Opt_Out': 'false'
  }

  recordArray.push(recordObject)

  requestBody['data'] = recordArray

  let trigger = ['approval', 'workflow', 'blueprint']
  requestBody['trigger'] = trigger

  let requestDetails = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(requestBody),
    encoding: "utf8",
    throwHttpErrors: false
  };

  axios(url, requestDetails).then(data => {
    return res.status(200).json({
      message: 'success',
      result: 'Record has been updated'
    })
  }).catch(error => {
    return res.status(400).json({
      message: 'Error',
      result: 'Something wents wrong'
    })
  })
})


module.exports = router;




