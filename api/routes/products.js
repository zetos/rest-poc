const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(response => {
        console.log('Product get response:', response);
        res.status(200).json(response);
    })
    .catch(error => {
        console.error('Product get error:', error)
        res.status(500).json({
            error: error
        })
    })
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save()
    .then(result => {
        console.log('result:', result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: result
        });
    })
    .catch(error => {
        console.error('Products post error:', error);
        res.status(500).json({error: error})
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(response => {
        console.log('Products get:', response);
        if(response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({message: `No valid entry for provided id: ${id}`});
        }
    })
    .catch(error => {
        console.error('Products get error:', error);
        res.status(500).json({error: error})
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, {$set: updateOps})
    .exec()
    .then(result => {
        console.log('Product patch:', result);
        res.status(200).json(result);
    })
    .catch(error => {
        console.error('Product patch error:', error);
        res.status(500).json({
            error: error
        })
    })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        console.error('Product delete error:', error);
        res.status(500).json({
            error: error
        })
    });
});

module.exports = router;
