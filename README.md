[![Build Status](https://travis-ci.org/healeycodes/order-tracking-microservice.svg?branch=master)](https://travis-ci.org/healeycodes/order-tracking-microservice)

## Order Tracking Microservice :hamburger::fries::beer:

Node/Express/Firebase microservice for sending users an auto-updating delivery tracking page, controlled via RESTful API.

- Vanilla JS
- Mobile first
- Tested by Mocha
- Continuous integration by Travis CI

<br>

### UI

![Desktop](https://github.com/healeycodes/order-tracking-microservice/blob/master/preview.png)

<br>

### Workflow

Create an order and get its ID:
```
GET: /private/orders
-> 261df5c4-9d57-4d87-9323-fb995faa6cd5
```

<br>

Send that user to `/?orderId=261df5c4-9d57-4d87-9323-fb995faa6cd5`

<br>

Set their order's stage:
```
PUT: /private/orders
{
  orderId: 261df5c4-9d57-4d87-9323-fb995faa6cd5,
  stage: /* 1-5 */
}
-> OK
```

<br>

Their tracking page will update without a refresh.

<br>

### UI on an old iPhone

![Mobile](https://github.com/healeycodes/order-tracking-microservice/blob/master/mobile.png)

<br>

### Install

`npm install`

### Test

`$env:KEY='./path_to_serviceAccountKey.json'`

`$env:DB='https://your-firebase-test-db.firebaseio.com'`

`npm test`

### Run

`$env:KEY='./path_to_serviceAccountKey.json'`

`$env:DB='https://your-firebase-prod-db.firebaseio.com'`

`npm start`

<br>

Firebase uses a simple data store:

```
orders: {
  id: {
    started: Date.now(),
    stage: 1 
  }
}
```

<br>

- MIT License, contributions welcome :heart:
