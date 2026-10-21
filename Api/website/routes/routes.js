var express = require('express');
router = express.Router();
var sampleRoutes = require('../controllers/mainCtrl');
process.env.SECRET_KEY = "thisismysecretkey";





// texturespace
router.get('/getgallery', sampleRoutes.getgalleryCtrl);
router.get('/getprojectdata', sampleRoutes.getprojectdataCtrl);
router.get('/getprojectalldata', sampleRoutes.getprojectalldataCtrl);
router.post('/contactdatapost', sampleRoutes.contactdatapostCtrl);
router.get('/getgalleryalldata', sampleRoutes.getgalleryalldataCtrl);
router.get('/getdesingdata', sampleRoutes.getdesingdataCtrl);
router.post('/getdesingalldata', sampleRoutes.getdesingalldataCtrl);



module.exports = router;
