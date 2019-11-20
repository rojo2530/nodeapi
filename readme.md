# NodeAPI

## Requirements 

* MongoDB
* Node and NPM
* Git (not necessary but recommended)
* RabbitMQ Server (coud be local or using free account in https://www.cloudamqp.com/)
* SSL certificate, app runs in SSL mode, you could use for example https://github.com/FiloSottile/mkcert
* pm2 (optional) https://pm2.keymetrics.io/

## Configure
You have to create a .env file, the app contains .env.example like guide. 
You have to add this lines:

* MONGODB_URL : URL for MongoDB connection
* RABBITMQ_URL: URL for rabbitmq connection
* JWT_SECRET: Secret password for generate JSON web token.

You have too create a folder cert , and inside puts certs public and private key.

## Introduction

Nodeapi is an example of API application using Node and Express, has two parts, one for the API part and one for the view.
For API use JSON web token (JWT) for authentication , have to make a request to http://localhost:7000/apiv1/anuncios/login 
This endpoint return a token which use for another request.

For your data, use MongoDB , where you save a list of ads with the following Schema:

    var anuncioSchema = mongoose.Schema({     
        nombre: String,     
        venta: Boolean,     
        precio: Number, 
        foto: String,     
        tags: [String] });

### Description of fields

* **nombre**: It's the ad name.
* **venta**: if it's true then is a ad sale, if not if a buy sale.
* **precio**: The product price.
* **foto**: it's the name of picture file.
* **tags**: It may be some of these 4: work, lifestyle, mobile and motor.

**tags** only can only be work, lifestyle, mobile or motor.

Both the API and the view return a list of ads using filters that are passed as query parameters.

## Install

* Clone Repo with https://github.com/rojo2530/nodeapi.git
* Inside folder , execut `npm install`
* Make sure MongoDB server is running, after that execute `npm run installDB` (this command import data of ads)
* execute `npm run start:worker`
* Finally execute `npm run start-ssl` , running en dev mode, for production mode run `npm run prod`

Note: By default , server is running in port 7000

Another way to execute it would be through pm2:

`pm2.cmd start .\ecosystem.config.js`

## API Methods

### Login (POST)

`http://localhost:3000/apiv1/login` , by default you have to use in the body of request

user: admin@example.com
password: 1234

This request return a token which you have to use in any request.
This token can be passed on the request in the following ways:

* Body
* Query parameter , name token
* Header with name Authorization

### Tags list (GET)

`http://localhost:3000/apiv1/tags`

List unique tags across all ads, example:

```{
  "sucess": true,
  "results": [
    "lifestyle",
    "motor",
    "mobile",
    "work"
  ]
}
```

### Ads list (GET)

`http://localhost:3000/apiv1/anuncios`

List ads, by default show only first 8 ads, for example:

```
{
  "sucess": true,
  "results": [
    {
      "tags": [
        "lifestyle",
        "motor"
      ],
      "_id": "5d3ac53d194ec243ac05fdc2",
      "nombre": "Bicicleta",
      "venta": true,
      "precio": 230.15,
      "foto": "bici.jpg",
      "__v": 0
    },
    {
      "tags": [
        "lifestyle",
        "mobile"
      ],
      "_id": "5d3ac53d194ec243ac05fdc3",
      "nombre": "iPhone 7",
      "venta": false,
      "precio": 350,
      "foto": "iphone7.jpg",
      "__v": 0
    },
    ....
```

#### Query parameters: 

* **start** [Positive Integer]: It's page number, by default is 1 if it's not present, it's a positive Integer.
* **limit** [Positive Integer]: It's the number of items displayed per page, by default is 8.
* **tag:** Filter by tag, only can filter with one tag, you can only filter by a tag that can be work, lifestyle, mobile or motor.
* **nombre**: Filter by name, you can search by the beginning of a name.
* **sort**: Sort by a field, for example by price, or by name, If we put a '-' in front of it will sort in reverse order.
* **venta**[Boleean]: If the ad is sale or buy.
* **fields**: You can show only the fields you put in fields
* **precio**[Positive Integer]: It can be searched for an exact price or price range as follows:

  * 10-50 will search for ads with price included among these values - price: '$gte': '10', '$lte': '50' 
  * 10- will look for those with a price greater than 10  price: '$gte': '10' 
  * 50 will search for those with a price less than 50 s price: '$lte': '50'  
  * 50 will search for those with a price equal to 50' price: '50

For example, if we want a list of sales ads with the tag mobile, price between 50 and 500, sorted by price and name begins with 'iph' we would put the following:

`http://localhost:7000/apiv1/anuncios?venta=true&sort=precio&precio=50-500&tag=mobile&nombre=ipho`

```
{
"sucess": true,
"results": [
{
"tags": [
"lifestyle",
"mobile"
],
"_id": "5d3ac53d194ec243ac05fdc4",
"nombre": "iPhone XR",
"venta": true,
"precio": 350,
"foto": "iphonexr.jpg",
"__v": 0
}
]
}
```

#### Restrictions

The fields have a number of restrictions that we explain below:

* **start** and **limit** : It's a positive number, if not it will throw an error, for example:

```
{
"sucesss": false,
"error": {
    "message": "Not valid",
    "errors": {
        "start": {
        "value": "-5",
        "msg": "start must be a positive number",
        "param": "start",
        "location": "query"
        }
    }
    }
}
```

* **tag**: Only can be work, lifestyle , mobile or motor, if not it will throw an error, for example:

```
{
"sucesss": false,
"error": {
"message": "Not valid",
"errors": {
"tag": {
"value": "motor1",
"msg": "is not valid, only work,lifestyle,motor,mobile",
"param": "tag",
"location": "query"
}
}
}
}
```

* **venta** : Only true or false, if not it will throw an error, for example:

```
{
"sucesss": false,
"error": {
"message": "Not valid",
"errors": {
"venta": {
"value": "dos",
"msg": "must be a boleean value",
"param": "venta",
"location": "query"
}
}
}
}
```

* **precio** : You have to follow the pattern explained above otherwise you will give error, for example:

`http://localhost:7000/apiv1/anuncios?precio=50-100-3`

```
{
"sucesss": false,
"error": {
"message": "Not valid",
"errors": {
"precio": {
"value": "50-100-3",
"msg": "is not valid",
"param": "precio",
"location": "query"
}
}
}
}
```

### Ad create (POST)

http://localhost:7000/apiv1/anuncios

To create a new ad all fields are required and have to be of the following types:

* nombre: String
* venta: Boleean,
* precio: Positive Integer,
* foto: Upload File
* tags: Array of Strings: Each array's element only can be work, lifestyle, mobile or motor.

Note: If repeated tags for example, for example [work, work, mobile], only the only ones will be saved when creating the ad, i.e. it would be [work, mobile]

For example , if any field is missing it will give an error:

```
{
    "sucesss": false,
    "error": "Anuncio validation failed: venta: Path `venta` is required., precio: Path `precio` (0) is less than minimum allowed value (1)."
}
```
Upload File: upload image to folder public/images, too add task to rabbitmq for creating thumbnail. Thumnails saves in public/images too. 
A request example from Postman:

(https://file.io/hY8bYk)


## Views

The other part of the app is the front of the ads view.
Filters are the same as in the api and are made using query parameters.
For views you have to login , credentials save in sessión (with MongoDB) , credentials are:

user: admin@example.com
password: 1234

The app use i18n for languages, in front view, you chan choose language doing click in the flag. 

The only difference is the route, which in the case of the view would be:

`http://localhost:7000`

## Default Values

By default there are a number of varibles that can be configured in the lib/config.js file:

```
const config = {
    START: 1,
    LIMIT: 8
}
```

## Development Notes

At the moment the functionality of the view and the api is very similar and that is why the code is very similar, it has been preferred not to refactor the code in case in the future you have different functionalities.

You can run eslint with next script `npm run eslint`


