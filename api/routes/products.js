const express = require('express');
const router = express.Router();
const ProductCOntroller = require('../controllers/products')
const checkAuth = require('../middleware/check-auth')

const multer = require ('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    
    filename: function(req, file, cb) {
        //ask mun of new Date().toISOString
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' )
   {
     //accept a file
     cb (null, true)
   } else {
        //reject a file 
        cb(null, false)
   }
}

const upload = multer({ storage: storage, limits : {
    fileSize : 1024*1024*5
}, fileFilter : fileFilter
})

//////////////////////////////////////////////////////////


router.get('/', ProductCOntroller.product_get_all)

router.post('/', checkAuth, upload.single('productImage'), ProductCOntroller.product_create_product)

router.get('/:productId', ProductCOntroller.products_get_product);

router.patch('/:productId', checkAuth, ProductCOntroller.product_update_product)

router.delete('/:productId', checkAuth, ProductCOntroller.product_delete_product)

router.delete('/', checkAuth, ProductCOntroller.product_delete_all_products)

module.exports = router;

//////////////////////////////////////////////////////////