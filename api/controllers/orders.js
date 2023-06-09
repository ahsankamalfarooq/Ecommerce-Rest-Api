const Order = require('../routes/models/order')
 const Product = require('../routes/models/product')
const mongoose = require ('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return {
                 _id : doc._id,
                 product : doc.product,
                 quantity : doc.quantity,
                 request : {
                 type : 'GET',
                 url : 'http://localhost:3000/orders/' + doc._id

                }
            }
            })

        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

////////////////////////////////////////////////////////

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message : "Product Not Found"
            })
        }
        const order = new Order ({
            _id : mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            product : req.body.productId
        });

       return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message : 'Order Stored',
            createdOrder : {
                _id : result._id,
                product : result.product,
                quantity : result.quantity
            },
            request : {
                type : 'GET',
                url : 'http://localhost:3000/orders/' + result._id
            }
        });
    })


    .catch(err => {
        res.status(500).json({
            message : 'Product Not Found',
            error : err
        });
    });

};



/////////////////////////////////////////////////////////



exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .populate('product')
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message : "No order Found"
            })
        }
        res.status(200).json({
            order : order, 

                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/orders/'
                }
             } )
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })

};




//////////////////////////////////////////////////////////


exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId
    Order.remove({_id : id})
    .exec()
    .then(result => {

        //ASK MUN WHY IF BLK IS NOT WORKING
        // if (!order) {
        //     return res.status(404).json({
        //         message : "No order to Delete"
        //     })
        // }
        res.status(200).json({
            message : "Order Deleted Successfully", 

                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/orders/',
                    body : {productId : "ID" , quantity : "Number" }
                }
             } )
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}



/////////////////////////////////////////////////////////


exports.delete_all_orders =  (req, res, next) => {

    Order.remove()
    .exec()
    .then(result => {
        
        res.status(200).json({
            message : "ALL_Order_Deleted", 

                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/orders/',
                    body : {productId : "ID" , quantity : "Number" }
                }
             } )
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}