const Product = require('../routes/models/product')
const mongoose = require ('mongoose');





//////////////////////////////////////////////////////////

exports.product_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        const response = {
            count : doc.length,
            products: doc.map(doc => {
                return {
                    name : doc.name,
                    price  : doc.price,
                    productImage : doc.productImage,
                    _id  :doc._id,
                    rqeuest : {
                        type  : 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
     //   if (doc.length >0) {
            res.status(200).json(response);
     //   } else {
         //   res.status(404).json({
          //      message : "No entry Found"
          //  })
      //  }
    })

    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })

    })
}



//////////////////////////////////////////////////////////


exports.product_create_product = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    })

    product.save()
    .then(result => {console.log(result);
        res.status(201).json({
            message : 'Created Product Successflly',
            createdProduct : {
                name  : result.name,
                price : result.price,
                _id : result._id,
                request : {
                    type : 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })

    })
}

//////////////////////////////////////////////////////////


exports.products_get_product = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .select('name price _id productImage')
    .exec().then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json({
                product : doc,
                request : {
                    type : "GET",
                    description : 'Get_All_Products',
                    url: 'http://localhost:3000/products' 
                }
            })
        } else {
            res.status(404).json({
                message: 'No valid entry found'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })

    })
}


///////////////////////////////////////////////////////////

exports.product_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id : id}, {$set : updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Prduct Updated',
            url: 'http://localhost:3000/products/' + id
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
}


/////////////////////////////////////////////////////////



exports.product_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id : id})
    .exec()
    .then(result => {
            res.status(200).json({
                message : 'Product Deleted',
                request : {
                    type : "POST",
                    url: 'http://localhost:3000/products',
                    body : {name : "String ", price : 'Number'}
                }

                
            });
    })

    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })

    })

}


/////////////////////////////////////////////////////////


exports.product_delete_all_products = (req, res, next) => {
    Product.remove()
    .exec()
    .then(result => {
            res.status(200).json({
                message : '#DELETED_ALL_PRODUCTS',
                request : {
                    type : "POST",
                    url: 'http://localhost:3000/products',
                    body : {name : "String ", price : 'Number'}
                }
            });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
}


//////////////////////////////////////////////////////////