const express = require("express");
const router = express();
const userController = require("./../controllers/userControllers");
const auth = require("./../middlewares/userAuth");
const upload = require("./../middlewares/fileUpload");
const { createRazorpayOrder } = require("../utils/paymentRoutes");

// Middleware to parse JSON

//set up url
router.post(
  "/userSignup",
  upload.single("userProfile"),
  userController.userSignup
);
router.post("/getUser", userController.getUser);
router.post("/deleteUser", userController.deleteUser);
router.post(
  "/updateUser",
  upload.single("userProfile"),
  userController.updateUser
);
router.post("/userLogin", userController.userLogin);
router.post("/userVerify", userController.userVerify);
router.post("/resendOtp", userController.resendOtp);
router.post("/packageList", userController.packageList);
router.get("/packageCategoryList", userController.packageCategoryList);
router.post("/getPackageDetails", userController.getPackageDetails);
router.get("/familyCarepackageList", userController.familyCarepackageList);
router.get(
  "/tophealthCheckuppackageList",
  userController.tophealthCheckuppackageList
);
router.post(
  "/filterPackagesByAgeAndGender",
  userController.filterPackagesByAgeAndGender
);
router.get("/bestPackageCategoryList", userController.bestPackageCategoryList);
router.get("/getAllCheckupRoutines", userController.getAllCheckupRoutines);
router.post("/addViewsToPackage", userController.addViewsToPackage);
router.post(
  "/getRecentlyViewedPackages",
  userController.getRecentlyViewedPackages
);
router.post("/addToCart", userController.addToCart);
router.post("/getCartItems", userController.getCartItems);
router.post("/deleteFromCart", userController.deleteFromCart);
router.get("/getAllPackageList", userController.getAllPackageList);

// Address routes
router.post("/address", userController.createAddress);
router.post("/getAddressesByUser", userController.getAddressesByUser);
router.post("/updateAddress", userController.updateAddress);
router.post("/deleteAddress", userController.deleteAddress);
router.post("/getAddress", userController.getAddress);

// Member routes
router.post("/member", userController.createMember);
router.post("/getMembersByUser", userController.getMembersByUser);
router.post("/updateMember", userController.updateMember);
router.post("/deleteMember", userController.deleteMember);
router.post("/getMember", userController.getMember);
router.post("/bookedOrder", userController.bookedOrder);
router.post("/bookingOrder_list", userController.bookingOrder_list);
router.get("/allServices_list", userController.allServices_list);
router.post(
  "/addAppointment",
  upload.single("image"),
  userController.addAppointment
);
router.post("/getAllAppointments", userController.getAllAppointments);

router.post("/getPrescriptionFiles", userController.getPrescriptionFiles);
router.post(
  "/addPrescription",
  upload.array("files"),
  userController.addPrescription
);
router.post("/deletePrescriptionFile", userController.deletePrescriptionFile);
router.post("/getByIdPrescriptionFile", userController.getByIdPrescriptionFile);
router.post("/getbookingOrder", userController.getbookingOrder);
router.post("/userReportsList", userController.userReportsList);
router.post("/reportsDetails", userController.reportsDetails);
router.post("/reportsDelete", userController.reportsDelete);
router.post("/addViewUser", userController.addViewUser);
router.get("/blogList", userController.blogList);
router.get("/blogCategoryList", userController.blogCategoryList);

router.post("/createRazorpayOrder", createRazorpayOrder);

//exporting router
module.exports = router;
