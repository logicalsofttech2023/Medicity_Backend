const express=require('express');
const router=express();
const adminController=require("./../controllers/adminControllers");
const upload=require("./../middlewares/fileUpload");

// Middleware to parse JSON


//set up url
router.post("/addPackageCategory",upload.single('image'),adminController.addPackageCategory);
router.post("/addPackage",upload.single('image'),adminController.addPackage);
router.get('/getAllPackages',adminController.getAllPackages);
  router.get('/getAllPackageCategories',adminController.getAllPackageCategories);
 router.post('/getSinglePackageCategory',adminController.getSinglePackageCategory);
 router.post('/getSinglePackage',adminController.getSinglePackage);
 router.post('/updatePackageCategory',upload.single('image'),adminController.updatePackageCategory);
 router.post('/updatePackage',upload.single('image'),adminController.updatePackage);
 router.post('/deletePackage',adminController.deletePackage);
 router.post('/adminLogin',adminController.adminLogin);
  router.post('/addCheckupRoutine',upload.single('image'),adminController.addCheckupRoutine);
 router.get('/getAllCheckupRoutines',adminController.getAllCheckupRoutines);
 router.post('/getSingleCheckupRoutine',adminController.getSingleCheckupRoutine);
 router.post('/updateCheckupRoutine',upload.single('image'),adminController.updateCheckupRoutine);
 router.post('/deleteCheckupRoutine',adminController.deleteCheckupRoutine);
  router.post('/userList',adminController.userList);
 router.post('/addFaq',adminController.addFaq);
 router.post('/updateFaq',adminController.updateFaq);
 router.post('/deleteFaq',adminController.deleteFaq);
 router.post('/getFaq',adminController.getFaq);
 router.get('/faqList',adminController.faqList);
 router.post('/deleteAboutus',adminController.deleteAboutus);
 router.post('/addAboutus',adminController.addAboutus);
 router.post('/updateAboutus',adminController.updateAboutus);
 router.get('/getAllAboutus',adminController.getAllAboutus);
 router.post('/getAboutusById',adminController.getAboutusById);
 router.post('/addContactus',adminController.addContactus);
 router.post('/getContactus',adminController.getContactus);
  router.post('/createService',upload.single('image'),adminController.createService);
 router.get('/getAllService',adminController.getAllService);
   router.get('/getAllOrders',adminController.getAllOrders);
 router.get('/getAllApointments',adminController.getAllApointments);
   router.get('/reportsList',adminController.reportsList);
 router.post('/getByIdApointments',adminController.getByIdApointments);
 router.post('/getByIdOrders',adminController.getByIdOrders);
   router.get('/allPrescriptionFiles',adminController.allPrescriptionFiles);
 router.post('/addReports',upload.single('file'),adminController.addReports);
  router.post('/createBlogCategory',adminController.createBlogCategory);
 router.get('/blogCategoryList',adminController.blogCategoryList);
 router.post('/deleteBlogCategory',adminController.deleteBlogCategory);
 router.post('/createBlogPost',upload.single('image'),adminController.createBlogPost);
 router.post('/updateBlog',upload.single('image'),adminController.updateBlog);
 router.post('/getBlog',adminController.getBlog);
 router.get('/getAllBlog',adminController.getAllBlog);
  router.get('/bookingOrderList',adminController.bookingOrderList);
 router.post('/bookingOrderDetails',adminController.bookingOrderDetails);
router.post('/bookingOrderStatusChange',adminController.bookingOrderStatusChange);

 
  
    






//exporting router
module.exports=router;
