/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const ObjectID = require('mongoose').ObjectID;
const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        await Book.find({}).orFail('no data');
      } catch (error) {
        console.log(error)
      }
    })

    .post(async function (req, res) {
      try {
        if (!req.body.title || req.body.title === '') throw 'missing required field title';

        let { title } = req.body;

        const book = new Book({ title });

        const data = await book.save();
        // console.log(data);

        res.json({
          comments: data.comments,
          _id: data._id,
          title: data.title,
          commentcount: data.commentcount,
          __v: data.__v
        });
      } catch (error) {
        console.error(error);
        return res.send(error);
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        let bookid = req.params.id;

        if (!bookid) throw 'no book exists';

        let book = await Book.findById({ _id: bookid }).orFail('no book exists');
        res.json(book);
      } catch (error) {
        console.log(error);
        return error.name === 'CastError' ? res.send('no book exists') : res.send(error);
      }
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
