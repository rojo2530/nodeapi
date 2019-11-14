'use strict';

const Anuncio = require('../models/Anuncio');


const tagsApiController = () => {
  return {
    /**
     * GET /apiv1/tags
     */
    index: async (req, res, next) => {
      try {
          const tags = await Anuncio.find().distinct('tags').exec();
          res.json({ sucess: true, results: tags});
          return;
  
      } catch (err) {
          next(err);
          return;
      }
    }
  }
}

module.exports = tagsApiController;