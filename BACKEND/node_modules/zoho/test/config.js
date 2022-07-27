var config = require('rc')('test', {
  creator: {
    authtoken: process.env.ZOHO_CREATOR_TOKEN || 'YouCanPutYourZohoInvoiceTokenHere',
    scope: 'creatorapi'
  },
  crm: {
    authtoken: process.env.ZOHO_CRM_TOKEN || 'YouCanPutYourZohoInvoiceTokenHere',
    scope: 'crmapi',
    wfTrigger: true
  },
  invoice: {
    authtoken: process.env.ZOHO_INVOICE_TOKEN || 'YouCanPutYourZohoInvoiceTokenHere'
  },
  support: {
    authtoken: process.env.ZOHO_SUPPORT_TOKEN || 'YouCanPutYourZohoSupportTokenHere',
    portal: '4yopping',
    department: '4yopping'
  }
});

module.exports = config;
