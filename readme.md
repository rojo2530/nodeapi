# NodeAPI

## Requirements 

* MongoDB
* Node and NPM
* Git (not necessary but recommended)

## Introduction

Nodeapi is an example of API application using Node and Express, has two parts, one for the API part and one for the view.

For your data, use MongoDB , where you save a list of ads with the following Schema:

    var anuncioSchema = mongoose.Schema({     
        nombre: String,     
        venta: Boolean,     
        precio: Number, 
        foto: String,     
        tags: [String] });

**tags** only can only be work, lifestyle, mobile or motor.

Both the API and the view return a list of ads using filters that are passed as query parameters.

## Install

* Clone Repo with 
* Inside folder , execut `npm install`
* Make sure MongoDB server is running, after that execute `npm run installDB` (this command import data of ads)
* Finally execute `npm run dev` , running en dev mode, for production mode run `npm run start`

Note: By default , server is running in port 7000

## API Methods

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
* **nombre**: Filter by name, you can only filter by a tag that can be work, lifestyle, mobile or work.
* **sort**: Sory by a field, for example by price, or by name, If we put a '-' in front of it will sort in reverse order.
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



