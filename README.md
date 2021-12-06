# openIMIS Frontend Invoice reference module
This repository holds the files of the openIMIS Frontend Invoice reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
* **Legal and Finance** (invoice.mainMenu translation key)

  **Invoices** (invoice.menu.invoices key), displayed if user has the right `155101`

## Other Contributions
* `core.Router`: registering `invoices` routes in openIMIS client-side router

## Available Contribution Points
* `invoice.SubjectAndThirdpartyPicker` used to provide pickers for both Invoice Subject and Invoice Thirdparty; required structure:
  ```js
  [
    {
      type: <subject/thirdparty type name: string>,
      picker: <subject/thirdparty picker: picker component>,
      pickerProjection: <subject/thirdparty picker projection: Array<string>>,
    },
    ...
  ]
  ```

## Published Components
* `invoice.InvoiceStatusPicker`, picker for Invoice Status

## Dispatched Redux Actions
* `INVOICE_INVOICES_{REQ|RESP|ERR}`, fetching Invoices (as triggered by the searcher)

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
None
