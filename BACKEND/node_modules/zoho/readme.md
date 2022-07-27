![zoho-node](https://monosnap.com/file/5S223w7651B8ksuXEFSrRH1tRwo1nS.png)

Node.js Zoho helper library for integrating Zoho Creator, CRM, Invoice and Support.

[![npm version](https://badge.fury.io/js/zoho.svg)](http://badge.fury.io/js/zoho)
[![Build Status](https://travis-ci.org/4yopping/zoho.svg)](https://travis-ci.org/4yopping/zoho)
[![Join the chat at https://gitter.im/4yopping/zoho](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/4yopping/zoho?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Inline docs](http://inch-ci.org/github/4yopping/zoho.svg?branch=master)](http://inch-ci.org/github/4yopping/zoho)
![Dependencies](https://david-dm.org/4yopping/zoho.svg)

## Installation

```bash
$ npm install zoho
```

## Features

- **Zoho Creator**
- **Zoho CRM**
- **Zoho Invoice**
- **Zoho Support**

## API

#### `Zoho`

Initialize `zoho`

```js
var Zoho = require('zoho');
```

#### `Zoho#CRM(object)`

Initialize `CRM` with an object `authtoken`

```js
var crm = new Zoho.CRM({
  authtoken: 'bad18eba1ff45jk7858b8ae88a77fa30'
});
```

##### `getRecords(<string> type, <function> callback)`:

```js
crm.getRecords('leads', function (err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});
```

#### `Zoho#Invoice(object)`

Initialize `Invoice` with an object `authtoken`

```js
var invoice = new Zoho.Invoice({
  authtoken: 'bad18eba1ff45jk7858b8ae88a77fa30'
});
```

##### `getRecords(<string> type, <function> callback)`:

```js
invoice.getRecords('contacts', function (err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});
```

#### `Zoho#Support(object)`

Initialize `Support` with an object `authtoken`

```js
var support = new Zoho.Support({
  authtoken: 'bad18eba1ff45jk7858b8ae88a77fa30'
});
```

##### `getRecords(<string> type, <function> callback)`:

```js
support.getRecords('contacts', function (err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});
```

#### `Zoho#Creator(object)`

Initialize `Creator` with an object `authtoken`

```js
var creator = new Zoho.Creator({
  authtoken: 'bad18eba1ff45jk7858b8ae88a77fa30'
});
```

##### `setCookie(<string> cookie)`

Set a cookie for "unofficial" API calls that require direct HTTP schemes.

```js
creator.setCookie('somecookie');
```

##### `viewRecordsInView(<string> applicationLinkName, <string> viewLinkName, <function> callback)`:

```js
creator.viewRecordsInView('sample','Employee_View', function (err, data) {
  if (err) {
    return console.log(err);
  }

  console.log(data);
});
```

##### `addRecords(<string> applicationLinkName, <string> formLinkName, <object> params, <function> callback)`

Add records.

See [https://www.zoho.com/creator/help/api/rest-api/rest-api-add-records.html](https://www.zoho.com/creator/help/api/rest-api/rest-api-add-records.html)

```js

```

##### `editRecords(<string> applicationLinkName, <string> formLinkName, <object> params, <function> callback)`

Edit records.

See [https://www.zoho.com/creator/help/api/rest-api/rest-api-edit-records.html](https://www.zoho.com/creator/help/api/rest-api/rest-api-edit-records.html)

```js

```

##### `deleteRecords(<string> applicationLinkName, <string> formLinkName, <object> params, <function> callback)`

Delete records.

See [https://www.zoho.com/creator/help/api/rest-api/rest-api-delete-records.html](https://www.zoho.com/creator/help/api/rest-api/rest-api-delete-records.html)

```js

```

##### `viewRecordsInView(<string> applicationLinkName, <string> formLinkName, <object> params, <function> callback)`

Get records in view.

See [https://www.zoho.com/creator/help/api/rest-api/rest-api-view-records-in-view.html](https://www.zoho.com/creator/help/api/rest-api/rest-api-view-records-in-view.html)

```js

```

##### `listFormFields(<string> applicationLinkName, <string> formLinkName, <object> params, <function> callback)`

List form fields.

See [https://www.zoho.com/creator/help/api/rest-api/rest-api-list-form-fields.html](https://www.zoho.com/creator/help/api/rest-api/rest-api-list-form-fields.html)

```js

```

##### `downloadImage(<string> endpoint, <object> params, <function> callback)`

Progmatically downloads a single image from Zoho Creator. Zoho doesn't officially provide support for downloading images or assets. However, this function will interact directly with the download endpoint.  This requires a valid cookie to be set prior to requests.

```js

creator.setCookie('somecookie');

creator.downloadImage('/DownloadFile.do', {
  filepath: '/somefilename.JPG',
  sharedBy: '',
  appLinkName: '',
  viewLinkName: '',
  recLinkID: '',
  fieldLinkName: 'Image',
  zcDownloadType: 'image'
}, function (err, data) {
  if (err) { return res.send(err); }

  res.send(new Buffer(data));

});
```

## Reference

* [Zoho Creator API](https://www.zoho.com/creator/help/api/rest-api/zoho-creator-rest-api.html)
* [Zoho CRM API](https://www.zoho.com/crm/help/api)
* [Zoho Invoice API](https://www.zoho.com/invoice/api/v3)
* [Zoho Support API Guide](https://www.zoho.com/support/help/api-guide.html)



##Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

In order to colaborate to this project, create a *.testrc* file with the contents below to run unit tests:

```
{
  "crm": {
    "authtoken": "..."
  },
  "invoice": {
    "authtoken": "..."
  },
  "support": {
    "authtoken": "..."
  }
}
```


## License

MIT
