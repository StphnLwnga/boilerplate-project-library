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
        await Book.find({}, (err, data) => {
          if (err) throw { error: 'no data' }
          return res.json(data);
        })
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

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany({});
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        let bookid = req.params.id;

        if (!bookid) throw new Error('no book exists');

        let book = await Book.findById({ _id: bookid }).orFail('no book exists');
        res.json(book);
      } catch (error) {
        console.log(error);
        return error.name === 'CastError' ? res.send(error.message) : res.send(error);
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      try {
        // console.log(req.body)

        if (!comment) throw 'missing required field comment';

        let book = await Book.findOneAndUpdate(
          { _id: bookid },
          {
            $push: { "comments": comment },
            $inc: {
              "commentcount": 1,
              "__v": 1
            }
          },
          { new: true }
        );

        if (book === null) throw 'no book exists'
        // let data = await book.save();
        console.log(book)

        res.json(book);
      } catch (error) {
        console.log(error);
        return error.name === 'CastError' ? res.send('no book exists') : res.send(error);
      }

    })

    .delete(async function (req, res) {
      try {
        let bookid = req.params.id;
        if (!bookid) throw 'no book exists'
        let book = await Book.findByIdAndRemove(bookid);

        if (book === null) throw 'no book exists';
        console.log(book)

        return res.send('delete successful');
      } catch (error) {
        console.log(error);
        return error.name === 'CastError' ? res.send('no book exists') : res.send(error);
      }
    });

};
