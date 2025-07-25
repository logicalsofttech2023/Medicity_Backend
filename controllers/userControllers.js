const {
  userModel,
  viewModel,
  cartModel,
  addressModel,
  memberModel,
  bookingOrderModel,
  appointmentModel,
  prescriptionModel,
} = require("./../models/userModel");

const {
  packagecategoryModel,
  checkupRoutineModel,
  servicesModel,
  reportsModel,
  blogCategoryModel,
  blogModel,
  blogViewModel,
  packageModel,
} = require("./../models/adminModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const mongoose = require("mongoose");
const { default: axios } = require("axios");

const generateNumericMemberId = () => {
  const number = crypto.randomInt(100000, 999999);
  return number;
};

//make reuse function
const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};
const generateUserUniqueId = () => {
  const uniqueId = Math.floor(100000 + Math.random() * 900000);
  return uniqueId;
};

// signup function
const userSignup = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "phone is required" });
    }
    const userExist = await userModel.findOne({ phone });
    if (userExist)
      return res
        .status(400)
        .json({ message: "User already exist with this phone number" });

    // Generate OTP
    const otp = generateOtp();
    const userUniqueId = "User" + generateUserUniqueId();
    let healthInsuranceMembers = req.body.healthInsuranceMembers;

    // ✅ Parse only if it's a string (form-data case)
    if (typeof healthInsuranceMembers === "string") {
      healthInsuranceMembers = JSON.parse(healthInsuranceMembers);
    }

    const user = new userModel({
      phone,
      otp,
      name: req.body.name,
      email: req.body.email,
      userProfile: req.file ? req.file.filename : "",
      preganantStatus: req.body.preganantStatus,
      address: req.body.address,
      gender: req.body.gender,
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      bloodGroup: req.body.bloodGroup,
      uniqueId: userUniqueId,
      dob: req.body.dob,
      country: req.body.country,
      pincode: req.body.pincode,
      bloodPressure: req.body.bloodPressure,
      heartRate: req.body.heartRate,
      glucoseLevel: req.body.glucoseLevel,
      alleries: req.body.alleries,
      email: req.body.email,
      fcmId: req.body.fcmId,
      userStatus: req.body.userStatus,
      preExisitingConditions: req.body.preExisitingConditions,
      currently_taking_any_medication: req.body.currently_taking_any_medication,
      pregnancyTerm: req.body.pregnancyTerm,
      healthInsuranceMembers: req.body.healthInsuranceMembers,
      cityName: req.body.cityName,
      stateName: req.body.stateName,
      healthInsuranceMembers,
    });
    const data = await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", data: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login function
const userLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(404).json({ message: "phone" });
    }
    const check = await userModel.findOne({ phone: phone });
    if (check && check.userStatus === 0) {
      return res.status(400).json({ message: "Your account has been delete" });
    }
    const otp = generateOtp();
    if (check) {
      await userModel.findOneAndUpdate({ phone }, { otp }, { new: true });
      const data = {
        _id: check._id,
        phone: phone,
        otp: otp,
      };
      return res.json({ message: "Otp generated successfully", data: data });
    }

    const user = new userModel({ phone, otp });
    const data = await user.save();
    return res.json({ message: "Otp generated successfully", data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(404).json({ message: "phone,otp" });
    }
    const check = await userModel.findOne({ phone: phone });
    if (check.userStatus === 0) {
      return res.status(400).json({ message: "Your account has been delete" });
    }
    const user = await userModel.findOne({ phone, otp });
    if (!user) return res.status(404).json({ message: "Invalid otp" });
    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.securityKey, {
      expiresIn: "1000d",
    });
    res.json({
      message: "User logged in successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//resend otp
const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(404).json({ message: "phone" });
    }
    const check = await userModel.findOne({ phone: phone });
    if (check.userStatus === 0) {
      return res.status(400).json({ message: "Your account has been delete" });
    }
    const otp = generateOtp();
    await userModel.findOneAndUpdate({ phone }, { otp }, { new: true });
    const data = {
      _id: check._id,
      phone: phone,
      otp: otp,
    };
    res.json({ message: "Otp resent successfully", data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//updateUser data
const updateUser = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      dob,
      address,
      cityName,
      pincode,
      country,
      bloodGroup,
      gender,
      stateName,
    } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const obj = {
      name,
      email,
      dob,
      address,
      cityName,
      pincode,
      country,
      bloodGroup,
      stateName,
      gender,
    };
    if (req.file) {
      obj.userProfile = req.file.filename;
    }
    const user = await userModel.findByIdAndUpdate({ _id: userId }, obj, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res
      .status(200)
      .json({ result: true, message: "User data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get user
const getUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await userModel.findById({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      result: true,
      message: "User data got successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete user account
const deleteUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId || !reason) {
      return res.status(400).json({ message: "userId,reason is required" });
    }
    const user = await userModel.findByIdAndUpdate(
      { _id: userId },
      { reason, userStatus: 0 },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res
      .status(200)
      .json({ result: true, message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//packageCategory list
const packageCategoryList = async (req, res) => {
  try {
    const categories = await packagecategoryModel.find({});
    if (!categories.length)
      return res.status(404).json({ message: "No package category found" });

    res.status(200).json({
      result: true,
      message: "Package category list",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//package list

const packageList = async (req, res) => {
  try {
    const { categoryId } = req.body;
    let packages = [];

    if (!categoryId) {
      // Find all package categories of type "Best Packages"
      const ct = await packagecategoryModel.find({ type: "Best Packages" });

      // Extract category IDs
      const ID = ct.map((item) => item._id);

      // Find packages that belong to those category IDs
      packages = await packageModel.find({ package_categoryId: { $in: ID } });
    } else {
      // Find packages for the given specific categoryId
      packages = await packageModel.find({ package_categoryId: categoryId });
    }

    // Respond based on result
    if (!packages.length) {
      return res.status(200).json({
        result: false,
        message: "No package found for this category",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      message: "Package list",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
};

const getAllPackageList = async (req, res) => {
  try {
    const packages = await packageModel.find(); // Fetch all packages

    if (!packages.length) {
      return res.status(200).json({
        result: false,
        message: "No packages found",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      message: "Package list",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//getPackage details
const getPackageDetails = async (req, res) => {
  try {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(404).json({ message: "packageId" });
    }
    const packageDetails = await packageModel.findById({ _id: packageId });
    if (!packageDetails)
      return res.status(404).json({ message: "No package found for this id" });

    res
      .status(200)
      .json({ result: true, message: "Package details", data: packageDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const familyCarepackageList = async (req, res) => {
  try {
    const packages = await packageModel.find({
      packageType: "Featured Family Care",
    });

    if (!packages.length)
      return res.status(200).json({
        message: "No package found for this category",
        data: packages,
      });

    res
      .status(200)
      .json({ result: true, message: "Package list", data: packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tophealthCheckuppackageList = async (req, res) => {
  try {
    const packages = await packageModel.find({
      packageType: "Doctors Curated Health",
    });

    if (!packages.length)
      return res.status(200).json({
        message: "No package found for this category",
        data: packages,
      });

    res
      .status(200)
      .json({ result: true, message: "Package list", data: packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bestPackageCategoryList = async (req, res) => {
  try {
    const categories = await packagecategoryModel.find({
      type: "Best Packages",
    });

    if (!categories.length) {
      return res
        .status(200)
        .json({ result: false, message: "No package found", data: [] });
    }

    res.status(200).json({
      result: true,
      message: "Package category list",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
};

// Filter packages by age and gender
const filterPackagesByAgeAndGender = async (req, res) => {
  try {
    const { age1, age2, gender } = req.body;
    let packages = [];
    if (!req.body) {
      return res.status(404).json({
        result: false,
        message: "gender,age1,age2 all pramaters are optional",
      });
    }

    if (age1 && age2 && gender) {
      packages = await packageModel.find({
        ageGroup: { $gte: age1 },
        ageGroup: { $lte: age2 },
        gender,
      });
    } else if (age1) {
      packages = await packageModel.find({ ageGroup: { $gte: age1 } });
    } else if (age2) {
      packages = await packageModel.find({ ageGroup: { $lte: age2 } });
    }

    // If no packages found, return response
    if (!packages.length) {
      return res.status(200).json({
        result: false,
        message: "No package found for this criteria",
        data: packages,
      });
    }

    // Return the packages
    res
      .status(200)
      .json({ result: true, message: "Package list", data: packages });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
};

//get all checkup routines
const getAllCheckupRoutines = async (req, res) => {
  try {
    const checkupRoutines = await checkupRoutineModel.find({});
    if (!checkupRoutines.length) {
      return res.status(404).json({ message: "No checkup routines found" });
    }
    res.status(200).json({ result: true, data: checkupRoutines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//add views to package
const addViewsToPackage = async (req, res) => {
  try {
    const { userId, packageId } = req.body;

    if (!packageId || !userId) {
      return res
        .status(400)
        .json({ message: "userId and packageId are required" });
    }

    const validation = await viewModel.findOne({ userId, packageId });

    if (validation) {
      const packageDetails = await viewModel.findOneAndUpdate(
        { packageId, userId },
        { currentDate: new Date() },
        { new: true }
      );

      return res.status(200).json({
        result: true,
        message: "Package views updated successfully",
        data: packageDetails,
      });
    }

    // If no existing view, create new
    const newData = new viewModel({
      userId,
      packageId,
      currentDate: new Date(),
    });

    const packageDetails = await newData.save();

    return res.status(200).json({
      result: true,
      message: "Package views added successfully",
      data: packageDetails,
    });
  } catch (error) {
    console.error("addViewsToPackage error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// get recently viewed packages
const getRecentlyViewedPackages = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const recentlyViewedPackages = await viewModel
      .find({ userId })
      .populate("packageId")
      .sort({ currentDate: -1 })
      .limit(10);
    if (!recentlyViewedPackages.length) {
      return res
        .status(404)
        .json({ message: "No recently viewed packages found" });
    }
    res.status(200).json({
      result: true,
      message: "Recently viewed packages",
      data: recentlyViewedPackages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add to cart
// const addToCart = async (req, res) => {
//   try {
//     const { userId, packageId } = req.body;
//     if (!userId || !packageId) {
//       return res.status(400).json({ message: "userId, packageId is required" });
//     }
//     const validation = await cartModel.findOne({
//       userId,
//       packageId,
//       cartStatus: false,
//     });
//     if (validation) {
//       return res
//         .status(400)
//         .json({ message: "This package is already in your cart" });
//     }
//     const newData = new cartModel({
//       userId,
//       packageId,
//     });
//     const packageDetails = await newData.save();
//     res.status(200).json({
//       result: true,
//       message: "Package added to cart successfully",
//       data: packageDetails,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const addToCart = async (req, res) => {
  try {
    const { userId, packageId, testDetails = [] } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Check if the same package is already in the cart
    if (packageId) {
      const existingPackage = await cartModel.findOne({
        userId,
        packageId,
        cartStatus: false,
      });

      if (existingPackage) {
        return res.status(400).json({
          message: "This package is already in your cart",
        });
      }
    }

    // Check if any of the testDetails already exist for this user
    if (testDetails.length > 0) {
      const existingCartWithTests = await cartModel.findOne({
        userId,
        cartStatus: false,
        testDetails: {
          $elemMatch: {
            test_id: { $in: testDetails.map((t) => t.test_id) },
          },
        },
      });

      if (existingCartWithTests) {
        return res.status(400).json({
          message: "One or more tests are already in your cart",
        });
      }
    }

    // Create new cart entry
    const newCartData = new cartModel({
      userId,
      packageId: packageId || null,
      testDetails,
    });

    const savedItem = await newCartData.save();

    res.status(200).json({
      result: true,
      message: "Item added to cart successfully",
      data: savedItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartTests = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const testCartItems = await cartModel.find({
      userId,
      cartStatus: false,
      testDetails: { $exists: true, $not: { $size: 0 } },
    });

    if (!testCartItems.length) {
      return res.status(404).json({ message: "No test items found in cart" });
    }

    res.status(200).json({
      result: true,
      message: "Test items in cart",
      data: testCartItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get cart items
const getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const cartItems = await cartModel
      .find({ userId, cartStatus: false })
      .populate("packageId");
    if (!cartItems.length) {
      return res.status(404).json({ message: "No cart items found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Cart items", data: cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// delete from cart
// const deleteFromCart = async (req, res) => {
//   try {
//     const { userId, packageId } = req.body;
//     if (!userId || !packageId) {
//       return res.status(400).json({ message: "userId, packageId is required" });
//     }
//     await cartModel.findOneAndDelete({ userId, packageId });
//     res.status(200).json({
//       result: true,
//       message: "Package deleted from cart successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const deleteFromCart = async (req, res) => {
  try {
    const { userId, packageId, testId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Case 1: Delete entire cart item by packageId
    if (packageId) {
      const deleted = await cartModel.findOneAndDelete({ userId, packageId });
      if (!deleted) {
        return res.status(404).json({ message: "Package not found in cart" });
      }
      return res.status(200).json({
        result: true,
        message: "Package deleted from cart successfully",
      });
    }

    // Case 2: Delete a specific test item using testId from testDetails array
    if (testId) {
      const updated = await cartModel.findOneAndUpdate(
        {
          userId,
          "testDetails.test_id": testId,
        },
        {
          $pull: { testDetails: { test_id: testId } },
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Test not found in cart" });
      }

      // If no more testDetails left and no packageId, delete entire document
      if (updated.testDetails.length === 0 && !updated.packageId) {
        await cartModel.findByIdAndDelete(updated._id);
      }

      return res.status(200).json({
        result: true,
        message: "Test deleted from cart successfully",
      });
    }

    // Case 3: Neither packageId nor testId provided
    return res.status(400).json({
      result: false,
      message: "Please provide either packageId or testId to delete from cart",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update cart item quantity

const createAddress = async (req, res) => {
  try {
    const address = await addressModel.create(req.body);
    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAddressesByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const addresses = await addressModel.find({ userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId) {
      return res.status(400).json({ message: "addressId is required" });
    }
    const updated = await addressModel.findByIdAndUpdate(
      { _id: addressId },
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId) {
      return res.status(400).json({ message: "addressId is required" });
    }
    await addressModel.findByIdAndDelete({ _id: addressId });
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId) {
      return res.status(400).json({ message: "addressId is required" });
    }
    const data = await addressModel.findById({ _id: addressId });
    res
      .status(200)
      .json({ message: "Address deleted successfully", data: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMember = async (req, res) => {
  try {
    const member = await memberModel.create(req.body);
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMembersByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const members = await memberModel.find({ userId });
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }
    const updated = await memberModel.findByIdAndUpdate(
      { _id: memberId },
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }
    await memberModel.findByIdAndDelete({ _id: memberId });
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }
    const data = await memberModel.findById({ _id: memberId });
    res.status(200).json({ message: "get successfully", data: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//booked order api
// const bookedOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       packageIds,
//       members,
//       address,
//       discountAmount,
//       totalAmount,
//       payableAmount,
//       offerAmount,
//       giftAmount,
//       paymentStatus,
//       paymentMode,
//       report,
//       sampleCollectDate,
//       sampleCollectTime,
//       bookingId,
//     } = req.body;

//     // Check if userId is provided
//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     // Process members and address fields if they're passed as comma-separated values
//     const objectMembers = members
//       ? members.split(",").map((id) => new mongoose.Types.ObjectId(id))
//       : [];
//     const objectAddress = address
//       ? address.split(",").map((id) => new mongoose.Types.ObjectId(id))
//       : [];
//     const objectPackageIds = packageIds
//       ? packageIds.split(",").map((id) => new mongoose.Types.ObjectId(id))
//       : [];
//     // Create a new booking order
//     const newBooking = new bookingOrderModel({
//       userId: new mongoose.Types.ObjectId(userId),
//       bookingDate: new Date(), // Current date as booking date
//       packageIds: objectPackageIds, // Array of ObjectIds for cartIds
//       members: objectMembers, // Array of ObjectIds for members
//       address: objectAddress, // Array of ObjectIds for address
//       discountAmount: discountAmount || 0,
//       totalAmount: totalAmount || 0,
//       payableAmount: payableAmount || 0,
//       offerAmount: offerAmount || 0,
//       giftAmount: giftAmount || 0,
//       paymentStatus: paymentStatus || false,
//       paymentMode: paymentMode || "",
//       report: report || "",
//       sampleCollectDate: sampleCollectDate || "",
//       sampleCollectTime: sampleCollectTime || "",
//       bookingId: bookingId || Math.floor(10000000 + Math.random() * 90000000), // Generate random booking ID if not passed
//     });

//     // Save the new booking order
//     const saved = await newBooking.save();

//     // Return success response
//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       data: saved,
//     });
//   } catch (err) {
//     // Return error response in case of failure
//     res.status(500).json({
//       success: false,
//       message: "Error creating booking",
//       error: err.message,
//     });
//   }
// };

const bookedOrder = async (req, res) => {
  try {
    const {
      userId,
      packageIds,
      members,
      address,
      discountAmount,
      totalAmount,
      payableAmount,
      offerAmount,
      giftAmount,
      paymentStatus,
      paymentMode,
      report,
      sampleCollectDate,
      sampleCollectTime,
      bookingId,
      paymentId,
      testDetail,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Parse packageIds (can be array, stringified array, or comma-separated)
    let parsedPackageIds = [];
    if (Array.isArray(packageIds)) {
      parsedPackageIds = packageIds;
    } else if (typeof packageIds === "string") {
      try {
        const temp = JSON.parse(packageIds);
        parsedPackageIds = Array.isArray(temp) ? temp : packageIds.split(",");
      } catch {
        parsedPackageIds = packageIds.split(",");
      }
    }

    const objectPackageIds = parsedPackageIds
      .map((id) => id?.trim())
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const objectMembers = members
      ? members
          .split(",")
          .map((id) => id.trim())
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id))
      : [];

    const objectAddress = address
      ? address
          .split(",")
          .map((id) => id.trim())
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id))
      : [];

    if (!objectMembers.length) {
      return res
        .status(400)
        .json({ message: "At least one valid member is required" });
    }

    const memberDetails = await memberModel.findOne({ _id: objectMembers[0] });
    if (!memberDetails) {
      return res.status(404).json({ message: "Member details not found" });
    }

    const packageList = objectPackageIds.length
      ? await packageModel.find({ _id: { $in: objectPackageIds } })
      : [];

    const testDetails = [];

    // Collect test details from packages
    packageList.forEach((pkg) => {
      if (Array.isArray(pkg.test)) {
        pkg.test.forEach((testItem) => {
          testDetails.push({
            test_id: String(testItem.test_id || "NA"),
            test_name: testItem.test_name || "Unknown",
            test_rate: String(Number(testItem.test_rate) || 0),
          });
        });
      }
    });

    // If `testDetail` exists in request and is a valid array, merge it
    if (Array.isArray(testDetail) && testDetail.length > 0) {
      testDetail.forEach((item) => {
        testDetails.push({
          test_id: String(item.test_id || "NA"),
          test_name: item.test_name || "Unknown",
          test_rate: String(Number(item.test_rate) || 0),
        });
      });
    }

    const orderID = bookingId || `BOOK${Date.now()}`;
    const MemberId = generateNumericMemberId();
    const labRegistrationPayload = {
      empId: "KLR099101",
      secretKey: "KLR@74123",
      patient_demographic: {
        member_id: MemberId,
        patient_name: memberDetails.fullName || "Unknown",
        gender: memberDetails.gender,
        dob: memberDetails.dob,
        phone_number: memberDetails.phone,
        email: memberDetails.email,
        father_name: memberDetails.fatherName,
        mother_name: memberDetails.motherName,
        city: memberDetails.city || "Guwahati",
      },
      investigation_billing: {
        centre_name: "Medicity",
        center_id: "C158",
        test_details: testDetails,
        order_id: orderID,
        order_status: "CONFIRMED",
        collection_date:
          sampleCollectDate || new Date().toISOString().split("T")[0],
        total_amount: totalAmount || 0,
        discount_amount: discountAmount || 0,
        paid_amount: payableAmount || 0,
        payment_mode: paymentMode || "ONLINE",
        payment_id: paymentId || "",
        payment_status: paymentStatus ? "CONFIRMED" : "PENDING",
        payment_reference_no: "",
      },
    };

    console.log(
      "Lab Registration Payload:",
      JSON.stringify(labRegistrationPayload)
    );

    let apiResponse;
    try {
      apiResponse = await axios.post(
        "https://medicityguwahati.in/klar_diag/api/labRegistration/",
        labRegistrationPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Lab API Success Response:", apiResponse);
    } catch (err) {
      console.error("Lab API Error:", err.response?.data || err.message);
      return res.status(400).json({
        message: "Failed to register with lab system",
        externalResponse: err.response?.data || err.message,
      });
    }

    if (apiResponse?.data?.status !== "success") {
      return res.status(400).json({
        message: "Failed to register with lab system",
        externalResponse: apiResponse.data,
      });
    }

    const newBooking = new bookingOrderModel({
      userId: new mongoose.Types.ObjectId(userId),
      bookingDate: new Date(),
      packageIds: objectPackageIds,
      members: objectMembers,
      address: objectAddress,
      discountAmount: discountAmount || 0,
      totalAmount: totalAmount || 0,
      payableAmount: payableAmount || 0,
      offerAmount: offerAmount || 0,
      giftAmount: giftAmount || 0,
      paymentStatus: paymentStatus || false,
      paymentMode: paymentMode || "",
      report: report || "",
      sampleCollectDate: sampleCollectDate || "",
      sampleCollectTime: sampleCollectTime || "",
      bookingId: orderID,
      testDetails: testDetail,
      bill_no: apiResponse?.data?.bill_no,
      memberId: MemberId,
    });

    const saved = await newBooking.save();

    // 🔁 Cart Cleanup Logic
    try {
      const cartQuery = { userId: new mongoose.Types.ObjectId(userId) };

      // Case 1: Remove package items from cart
      if (objectPackageIds.length > 0) {
        await cartModel.deleteMany({
          ...cartQuery,
          packageId: { $in: objectPackageIds },
        });
      }

      // Case 2: Remove booked testDetails (if testDetail is used directly)
      if (Array.isArray(testDetail) && testDetail.length > 0) {
        for (const test of testDetail) {
          await cartModel.updateMany(
            { ...cartQuery, "testDetails.test_id": test.test_id },
            { $pull: { testDetails: { test_id: test.test_id } } }
          );
        }

        // Optionally clean up empty carts after pulling testDetails
        await cartModel.deleteMany({
          ...cartQuery,
          testDetails: { $size: 0 },
          packageId: { $exists: false },
        });
      }
    } catch (cartErr) {
      console.error("Cart cleanup error:", cartErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Booking created and lab registered successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Booking Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: err.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId is required",
      });
    }

    const booking = await bookingOrderModel.findOne({ _id: bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Optional: Check if it's already cancelled
    if (booking.bookingStatus === 2) {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Update booking status
    booking.bookingStatus = 2;
    booking.cancelReason = reason;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (err) {
    console.error("Cancel Booking Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


const bookingOrder_list = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const bookings = await bookingOrderModel
      .find({ userId })
      .populate({
        path: "userId",
        model: "user",
      })
      .populate({
        path: "packageIds",
        model: "package",
      })
      .populate({
        path: "members",
        model: "member",
      })
      .populate({
        path: "address",
        model: "address",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};

//all services list
const allServices_list = async (req, res) => {
  try {
    const services = await servicesModel.find().sort({ createdAt: -1 });
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: err.message,
    });
  }
};

//add appointment api
const addAppointment = async (req, res) => {
  try {
    const {
      userId,
      appointmentDate,
      appointmentTime,
      serviceName,
      description,
      price,
      duration,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      clinicName_hpName_drName,
      testName,
    } = req.body;

    if (
      !userId ||
      !appointmentDate ||
      !appointmentTime ||
      !serviceName ||
      !customerName ||
      !customerPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const appointment = new appointmentModel({
      userId,
      appointmentDate,
      appointmentTime,
      serviceName,
      description,
      price,
      duration,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      clinicName_hpName_drName,
      testName,
      image,
      bookingId: Math.floor(Math.random() * 100),
    });

    const saved = await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment added successfully",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add appointment",
      error: err.message,
    });
  }
};

//get all appointments api
const getAllAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide userId" });
    }
    const appointments = await appointmentModel
      .find({ userId })
      .sort({ createdAt: -1 });
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get all appointments",
      error: err.message,
    });
  }
};

// Add prescription
const addPrescription = async (req, res) => {
  try {
    const { userId, memberId } = req.body;

    if (!memberId || !req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "memberId ,userId and files are required" });
    }

    // Assuming you are using multer, and files have a filename property
    const prescriptionFiles = req.files.map((file) => file.filename);

    const insert_data = new prescriptionModel({
      memberId,
      userId,
      files: prescriptionFiles,
    });

    await insert_data.save();

    return res.status(200).json({
      success: true,
      message: "Prescription added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error adding prescription",
      error: err.message,
    });
  }
};

//prescription file list
const getPrescriptionFiles = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const prescriptions = await prescriptionModel
      .find({ userId })
      .populate("memberId");
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found" });
    }

    res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescription files",
      error: err.message,
    });
  }
};

//delete prescription file
const deletePrescriptionFile = async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    if (!prescriptionId) {
      return res.status(400).json({ message: "prescriptionId is required" });
    }
    const deleted = await prescriptionModel.findByIdAndDelete(prescriptionId);
    if (!deleted) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Prescription deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete prescription file",
      error: err.message,
    });
  }
};

const getByIdPrescriptionFile = async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    if (!prescriptionId) {
      return res.status(400).json({ message: "prescriptionId is required" });
    }
    const deleted = await prescriptionModel.findById(prescriptionId);
    if (!deleted) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.status(200).json({
      success: true,
      message: "Prescription got successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete prescription file",
      error: err.message,
    });
  }
};

const getbookingOrder = async (req, res) => {
  try {
    const { bookingOrderId } = req.body;

    if (!bookingOrderId) {
      return res.status(400).json({ message: "bookingOrderId is required" });
    }

    const bookings = await bookingOrderModel
      .findById({ _id: bookingOrderId })
      .populate({
        path: "userId",
        model: "user",
      })
      .populate({
        path: "packageIds",
        model: "package",
      })
      .populate({
        path: "members",
        model: "member",
      })
      .populate({
        path: "address",
        model: "address",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};

//user reports list
const userReportsList = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ result: false, message: "userId is required" });
    }
    const data = await reportsModel.find({ userId }).sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ result: false, message: "Record no found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Data got successfully", data: data });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

const reportsDetails = async (req, res) => {
  try {
    const { reportId } = req.body;
    if (!reportId) {
      return res
        .status(400)
        .json({ result: false, message: "reportId is required" });
    }
    const data = await reportsModel.findById({ _id: reportId });
    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ result: false, message: "Record no found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Data got successfully", data: data });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

const reportsDelete = async (req, res) => {
  try {
    const { reportId } = req.body;
    if (!reportId) {
      return res
        .status(400)
        .json({ result: false, message: "reportId is required" });
    }
    const data = await reportsModel.findByIdAndDelete({ _id: reportId });
    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ result: false, message: "Record no found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

const addViewUser = async (req, res) => {
  try {
    const { userId, blogId } = req.body;

    if (!userId || !blogId) {
      return res
        .status(400)
        .json({ result: false, message: "userId and blogId are required" });
    }

    const existingView = await blogViewModel.findOne({ userId, blogId });

    if (!existingView) {
      const newView = await blogViewModel.create({ userId, blogId });

      return res.status(200).json({
        result: true,
        message: "View added successfully",
        data: newView,
      });
    }

    return res.status(200).json({
      result: true,
      message: "View already exists",
    });
  } catch (err) {
    return res.status(500).json({ result: false, message: err.message });
  }
};

//blogList
const blogList = async (req, res) => {
  try {
    const blogList = await blogModel.aggregate([
      {
        $lookup: {
          from: "blogviews",
          localField: "_id",
          foreignField: "blogId",
          as: "blogs",
        },
      },
      {
        $addFields: {
          totalViewsCount: { $size: "$blogs" }, // Count views per blog
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          title: 1,
          image: 1,
          totalViewsCount: 1,
          categoryName: 1,
          updatedAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      result: true,
      message: "Blog list fetched successfully",
      data: blogList,
    });
  } catch (err) {
    return res.status(500).json({ result: false, message: err.message });
  }
};

const blogCategoryList = async (req, res) => {
  try {
    const blogList = await blogModel.aggregate([
      {
        $group: {
          _id: "$categoryName",
          totalBlogs: { $sum: 1 },
        },
      },
      {
        $project: {
          categoryName: "$_id",
          totalBlogs: 1,
        },
      },
    ]);

    return res.status(200).json({
      result: true,
      message: "Blog categories fetched successfully",
      data: blogList,
    });
  } catch (err) {
    return res.status(500).json({ result: false, message: err.message });
  }
};

// exports  functions
module.exports = {
  userSignup,
  userLogin,
  updateUser,
  getUser,
  deleteUser,
  userVerify,
  resendOtp,
  packageList,
  packageCategoryList,
  getPackageDetails,
  familyCarepackageList,
  tophealthCheckuppackageList,
  filterPackagesByAgeAndGender,
  bestPackageCategoryList,
  getAllCheckupRoutines,
  addViewsToPackage,
  getRecentlyViewedPackages,
  addToCart,
  getCartItems,
  deleteFromCart,
  createAddress,
  getAddressesByUser,
  updateAddress,
  updateMember,
  deleteMember,
  deleteAddress,
  createMember,
  getMembersByUser,
  getAddress,
  getMember,
  bookedOrder,
  bookingOrder_list,
  allServices_list,
  addAppointment,
  getAllAppointments,
  addPrescription,
  getPrescriptionFiles,
  deletePrescriptionFile,
  getByIdPrescriptionFile,
  getbookingOrder,
  userReportsList,
  reportsDetails,
  reportsDelete,
  addViewUser,
  blogList,
  blogCategoryList,
  getAllPackageList,
  getCartTests,
  cancelBooking,
};
