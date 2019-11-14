'use strict';

function getPriceFilter(price) {
  //Si no incluye el guión buscamos por precio exacto
  if (!price.includes('-')) {
      return parseInt(price);
  }
  //Si comienza por un guión buscamos los articulos menores a ese precio
  if (price[0] === '-') {
      const priceNumber = parseInt(price.slice(1));
      return { '$lte': priceNumber };
  }
  //Si termina por un guión buscamos los artículos mayores a ese precio
  if (price[price.length - 1] === '-') {
      const priceNumber = parseInt(price.slice(0));
      return { '$gte': priceNumber };
  }

  const prices = price.split('-');
  return { '$gte': prices[0], '$lte': prices[1] };
}

module.exports = getPriceFilter;