const {
  packagecategoryModel,
  checkupRoutineModel,
  faqModel,
  aboutUsModel,
  contactUsModel,
  servicesModel,
  reportsModel,
  blogCategoryModel,
  blogModel,
  packageModel,
  blogViewModel,
} = require("./../models/adminModel");

const {
  userModel,
  bookingOrderModel,
  appointmentModel,
  prescriptionModel,
} = require("./../models/userModel");

const addPackageCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name and image are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "image is required" });
    }
    // exist package category
    if (await packagecategoryModel.findOne({ name: name, type })) {
      return res.status(400).json({ message: "Category already exist" });
    }

    const packageCategory = new packagecategoryModel({
      name,
      type,
      image: req.file.filename,
    });
    await packageCategory.save();
    res
      .status(200)
      .json({ result: true, message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all package categories
const getAllPackageCategories = async (req, res) => {
  try {
    const packageCategories = await packagecategoryModel.find({});
    if (!packageCategories.length) {
      return res.status(404).json({ message: "No package categories found" });
    }

    res.status(200).json({ result: true, data: packageCategories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get SINGLE packages
const getSinglePackageCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({ message: "categoryId is required" });
    }
    const packageCategory = await packagecategoryModel.findById(categoryId);
    if (!packageCategory) {
      return res.status(404).json({ message: "Package category not found" });
    }
    res.status(200).json({ result: true, data: packageCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//UPDAte package category
const updatePackageCategory = async (req, res) => {
  try {
    const { categoryId, type } = req.body;
    if (!categoryId) {
      return res
        .status(400)
        .json({ message: "categoryId name,image are  required" });
    }
    const packageCategory = await packagecategoryModel.findById(categoryId);
    if (!packageCategory) {
      return res.status(404).json({ message: "Package category not found" });
    }
    const obj = {
      name: req.body.name,
      type,
    };
    if (req.file) {
      obj.image = req.file.filename;
    }
    await packagecategoryModel.findByIdAndUpdate({ _id: categoryId }, obj, {
      new: true,
    });
    res
      .status(200)
      .json({ result: true, message: "Data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//add package
const addPackage = async (req, res) => {
  console.log(req.body);

  try {
    const {
      title,
      actual_price,
      price,
      discount_price,
      report_time,
      fasting_time,
      gender,
      ageGroup,
      interoduction,
      packageType,
      description,
      total_test,
      package_categoryId,
      test,
      offer,
    } = req.body;
    if (!gender || !interoduction) {
      return res.status(400).json({
        message:
          "title,actual_price,price,discount_price,report_time,fasting_time,gender,ageGroup, interoduction,total_test,package_categoryId",
      });
    }

    // Convert `offer` safely (only parse if it's a string)
    let offerArray = [];
    if (offer) {
      if (typeof offer === "string") {
        try {
          offerArray = JSON.parse(offer);
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid JSON format for offer" });
        }
      } else if (Array.isArray(offer)) {
        offerArray = offer;
      } else {
        return res.status(400).json({ message: "Offer must be an array" });
      }
    }

    // Convert `test` safely
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }
    let testArray = [];
    if (test) {
      if (typeof test === "string") {
        try {
          testArray = JSON.parse(test);
        } catch (err) {
          return res.status(400).json({ message: "Invalid test format" });
        }
      } else if (Array.isArray(test)) {
        testArray = test;
      } else {
        return res.status(400).json({ message: "Test must be an array" });
      }
    }

    const package = new packageModel({
      title: title,
      actual_price: actual_price,
      price: price,
      discount_price: discount_price,
      report_time: report_time,
      fasting_time: fasting_time,
      gender: gender,
      ageGroup: ageGroup,
      interoduction: interoduction,
      total_test: total_test,
      package_categoryId: package_categoryId || null,
      test: testArray,
      offer: offerArray,
      packageType,
      description,
      image,
    });

    await package.save();
    res
      .status(200)
      .json({ result: true, message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await packageModel.find({}).populate("package_categoryId");
    if (!packages.length) {
      return res.status(404).json({ message: "No packages found" });
    }
    res.status(200).json({ result: true, data: packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get SINGLE packages
const getSinglePackage = async (req, res) => {
  try {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ message: "packageId is required" });
    }
    const package = await packageModel.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ result: true, data: package });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//UPDAte package
const updatePackage = async (req, res) => {
  try {
    const { packageId, offer, test } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: "packageId is required" });
    }

    // Handle `offer` parsing
    let offerArray = [];
    if (offer) {
      if (typeof offer === "string") {
        try {
          offerArray = JSON.parse(offer);
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid JSON format for offer" });
        }
      } else if (Array.isArray(offer)) {
        offerArray = offer;
      } else {
        return res.status(400).json({ message: "Offer must be an array" });
      }
    }

    // Handle `test` parsing
    let testArray = [];
    if (test) {
      if (typeof test === "string") {
        try {
          testArray = JSON.parse(test);
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid JSON format for test" });
        }
      } else if (Array.isArray(test)) {
        testArray = test;
      } else {
        return res.status(400).json({ message: "Test must be an array" });
      }
    }

    const obj = {
      title: req.body.title,
      actual_price: req.body.actual_price,
      price: req.body.price,
      discount_price: req.body.discount_price,
      report_time: req.body.report_time,
      fasting_time: req.body.fasting_time,
      gender: req.body.gender,
      ageGroup: req.body.ageGroup,
      interoduction: req.body.interoduction,
      total_test: req.body.total_test,
      test: testArray,
      offer: offerArray,
      packageType: req.body.packageType,
      description: req.body.description,
    };

    // If image uploaded
    if (req.file) {
      obj.image = req.file.filename;
    }

    await packageModel.findByIdAndUpdate(packageId, obj, { new: true });

    res
      .status(200)
      .json({ result: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Update package error:", error);
    res.status(500).json({ error: error.message });
  }
};

//DELETE package
const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ message: "packageId is required" });
    }
    await packageModel.findByIdAndDelete(packageId);
    res
      .status(200)
      .json({ result: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }
    const admin = await userModel.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res
      .status(200)
      .json({ result: true, message: "Admin login successfully", data: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//add checkup routine api
const addCheckupRoutine = async (req, res) => {
  try {
    const { name, gender, age1, age2 } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "name,gender,age1,age2 and image are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "image is required" });
    }
    const checkupRoutine = new checkupRoutineModel({
      name,
      age1,
      age2,
      gender,
      image: req.file.filename,
    });
    await checkupRoutine.save();
    res
      .status(200)
      .json({ result: true, message: "Checkup routine added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

//get SINGLE checkup routine
const getSingleCheckupRoutine = async (req, res) => {
  try {
    const { checkupRoutineId } = req.body;
    if (!checkupRoutineId) {
      return res.status(400).json({ message: "checkupRoutineId is required" });
    }
    const checkupRoutine = await checkupRoutineModel.findById({
      _id: checkupRoutineId,
    });
    if (!checkupRoutine) {
      return res.status(404).json({ message: "Checkup routine not found" });
    }
    res.status(200).json({ result: true, data: checkupRoutine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update checkup routine
const updateCheckupRoutine = async (req, res) => {
  try {
    const { name, gender, age1, age2, checkupRoutineId } = req.body;
    if (!checkupRoutineId) {
      return res.status(400).json({ message: "checkupRoutineId is required" });
    }
    const obj = {
      name,
      gender,
      age1,
      age2,
    };
    if (req.file) {
      obj.image = req.file.filename;
    }
    await checkupRoutineModel.findByIdAndUpdate(
      { _id: checkupRoutineId },
      obj,
      { new: true }
    );
    res
      .status(200)
      .json({ result: true, message: "Checkup routine updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete checkup routine
const deleteCheckupRoutine = async (req, res) => {
  try {
    const { checkupRoutineId } = req.body;
    if (!checkupRoutineId) {
      return res.status(400).json({ message: "checkupRoutineId is required" });
    }
    await checkupRoutineModel.findByIdAndDelete({ _id: checkupRoutineId });
    res
      .status(200)
      .json({ result: true, message: "Checkup routine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//user  list
const userList = async (req, res) => {
  try {
    const users = await userModel.find().sort({ _id: -1 });
    if (users.length === 0) {
      return res.status(404).json({ result: false, message: "No users found" });
    }

    res.status(200).json({
      result: true,
      message: "Users list got successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//add faq
const addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "question and answer are required" });
    }
    const faq = new faqModel({ question, answer });
    await faq.save();
    res.status(200).json({ result: true, message: "Faq added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//faq list
const faqList = async (req, res) => {
  try {
    const faqs = await faqModel.find().sort({ _id: -1 });
    if (faqs.length === 0) {
      return res.status(404).json({ result: false, message: "No faqs found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Faq list got successfully", data: faqs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//faq delete
const deleteFaq = async (req, res) => {
  try {
    const { faqId } = req.body;
    if (!faqId) {
      return res
        .status(404)
        .json({ result: false, message: "faqId is required" });
    }
    await faqModel.findByIdAndDelete({ _id: faqId });

    res.status(200).json({ result: true, message: "Faq deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET singgle faq
const getFaq = async (req, res) => {
  try {
    const { faqId } = req.body;
    const faq = await faqModel.findById({ _id: faqId });
    if (!faq) {
      return res.status(404).json({ result: false, message: "Faq not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Faq got successfully", data: faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update faq
const updateFaq = async (req, res) => {
  try {
    const { faqId } = req.body;
    const { question, answer } = req.body;
    const faq = await faqModel.findByIdAndUpdate(
      { _id: faqId },
      { question, answer },
      {
        new: true,
      }
    );
    if (!faq) {
      return res.status(404).json({ result: false, message: "Faq not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Faq updated successfully", data: faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// addAboutus api
const addAboutus = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        result: false,
        message: "Please fill all the fields  title,description",
      });
    }

    const aboutus = new aboutUsModel({ title, description });
    const result = await aboutus.save();
    res.status(200).json({
      result: true,
      message: "About us added successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get all aboutus list
const getAllAboutus = async (req, res) => {
  try {
    const aboutus = await aboutUsModel.find();
    if (!aboutus) {
      return res
        .status(404)
        .json({ result: false, message: "About us not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "About us list", data: aboutus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update aboutus
const updateAboutus = async (req, res) => {
  try {
    const { title, description, aboutusId } = req.body;
    if (!aboutusId) {
      return res.status(400).json({
        result: false,
        message: "Please fill aboutusId,title,description",
      });
    }
    await aboutUsModel.findByIdAndUpdate(
      { _id: aboutusId },
      { title, description },
      { new: true }
    );

    res
      .status(200)
      .json({ result: true, message: "About us updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get single about us data
const getAboutusById = async (req, res) => {
  try {
    const { aboutusId } = req.body;
    const aboutus = await aboutUsModel.findById({ _id: aboutusId });
    if (!aboutus) {
      return res
        .status(404)
        .json({ result: false, message: "About us not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "About us data", data: aboutus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete about us data
const deleteAboutus = async (req, res) => {
  try {
    const { aboutusId } = req.body;
    const aboutus = await aboutUsModel.findByIdAndDelete({ _id: aboutusId });
    if (!aboutus) {
      return res
        .status(404)
        .json({ result: false, message: "About us not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "About us deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//add contactus
const addContactus = async (req, res) => {
  try {
    const { name, email, phone, whatsapp } = req.body;
    if (!email || !phone || !whatsapp) {
      return res.status(400).json({
        result: false,
        message: "Please fill name,email,phone,whatsapp",
      });
    }

    const exists = await contactUsModel.findOne();
    if (exists) {
      await contactUsModel.findOneAndUpdate(
        {},
        { whatsapp, email, phone, name },
        { new: true }
      );
      return res
        .status(200)
        .json({ result: true, message: "Contact us updated successfully" });
    }
    const data = new contactUsModel({ name, email, phone, whatsapp });
    await data.save();
    res
      .status(200)
      .json({ result: true, message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get contactus data
const getContactus = async (req, res) => {
  try {
    const contactus = await contactUsModel.findOne();
    if (!contactus) {
      return res
        .status(404)
        .json({ result: false, message: "Contact us not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Contact us data", data: contactus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create service api
const createService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        result: false,
        message: "Please fill name, description, and price,image,duration",
      });
    }

    const exists = await servicesModel.findOne({ name });

    if (exists) {
      return res.status(400).json({
        result: false,
        message: "This service already exists",
      });
    }

    const obj = {
      name,
      description,
      price,
      duration,
      image: req.file ? req.file.filename : null,
    };

    const data = await servicesModel.create(obj);

    res.status(200).json({
      result: true,
      message: "Service created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getAllService = async (req, res) => {
  try {
    const services = await servicesModel.find();

    if (!services || services.length === 0) {
      return res.status(404).json({
        result: false,
        message: "No services found",
      });
    }

    res.status(200).json({
      result: true,
      message: "All services data",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//all order booking list
const getAllOrders = async (req, res) => {
  try {
    const orders = await bookingOrderModel
      .find()
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
    if (!orders || orders.length === 0) {
      return res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    } else {
      res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    }
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

//all order booking list
const getAllApointments = async (req, res) => {
  try {
    const orders = await appointmentModel
      .find()
      .populate({
        path: "userId",
        model: "user",
      })

      .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    } else {
      res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    }
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

//prescription file list
const allPrescriptionFiles = async (req, res) => {
  try {
    const prescriptions = await prescriptionModel
      .find({})
      .populate("userId memberId");
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

//add reports
const addReports = async (req, res) => {
  try {
    const { userId, testName, recordFor, comment } = req.body;
    if (!userId) {
      return res.status(400).json({
        result: false,
        message: "userId,testName,recordFor,comment are required",
      });
    }
    const obj = {
      userId,
      testName,
      recordFor,
      comment,
      date: new Date(),
      reprotId: Math.floor(Math.random() * 100000),
    };
    if (req.file) {
      obj.file = req.file.filename ? req.file.filename : null;
    }
    const data = new reportsModel(obj);
    await data.save();
    res.status(200).json({ result: true, message: "Data added successfully" });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

// reports list
const reportsList = async (req, res) => {
  try {
    const data = await reportsModel
      .find()
      .populate("userId")
      .sort({ createdAt: -1 });
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

const getByIdApointments = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res
        .status(400)
        .json({ result: false, message: "appointmentId is required" });
    }
    const orders = await appointmentModel
      .findById({ _id: appointmentId })
      .populate({
        path: "userId",
        model: "user",
      })

      .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    } else {
      res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    }
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const getByIdOrders = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res
        .status(400)
        .json({ result: false, message: "bookingId is required" });
    }
    const orders = await bookingOrderModel
      .findById({ _id: bookingId })
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
    if (!orders || orders.length === 0) {
      return res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    } else {
      res
        .status(200)
        .json({ result: true, message: "All orders data", data: orders });
    }
  } catch (err) {
    res.status(500).json({
      result: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const createBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ result: false, message: "name is required" });
    }
    const existData = await blogCategoryModel.findOne({ name: name });
    if (existData) {
      await blogCategoryModel.findOneAndUpdate(
        { name: name },
        { $set: { name: name } },
        { new: true }
      );
      return res
        .status(200)
        .json({ result: true, message: "Updated successfully" });
    }

    const blogCategory = new blogCategoryModel({
      name,
    });
    await blogCategory.save();
    res
      .status(200)
      .json({ result: true, message: "Blog Category created successfully" });
  } catch (err) {
    res.status(500).json({ result: false, message: err.messag });
  }
};

const blogCategoryList = async (req, res) => {
  try {
    const blogCategories = await blogCategoryModel
      .find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      result: true,
      message: "Blog Category list",
      data: blogCategories,
    });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

const deleteBlogCategory = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res
        .status(400)
        .json({ result: false, message: "id is required " });
    }
    const blogCategory = await blogCategoryModel.findByIdAndDelete(id);
    if (!blogCategory) {
      return res
        .status(400)
        .json({ result: false, message: "Blog Category not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Blog Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

//create blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, description, categoryName } = req.body;
    if (!title || !description || !categoryName) {
      return res
        .status(400)
        .json({ result: false, message: "All fields are required" });
    }

    const blogPost = new blogModel({
      title,
      description,
      categoryName,
      image: req.file.filename,
    });
    await blogPost.save();
    res
      .status(200)
      .json({ result: true, message: "Blog Post created successfully" });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

//update blog
const updateBlog = async (req, res) => {
  try {
    const { title, description, categoryName, blogId } = req.body;
    if (!blogId) {
      return res
        .status(400)
        .json({ result: false, message: "blogId and all fields are required" });
    }
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(400).json({ result: false, message: "Blog not found" });
    }
    blog.title = title;
    blog.description = description;
    blog.categoryName = categoryName;
    blog.image = req.file.filename;
    await blog.save();
    res
      .status(200)
      .json({ result: true, message: "Blog updated successfully" });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

//delete blog
const getBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!blogId) {
      return res
        .status(400)
        .json({ result: false, message: "blogId is required" });
    }
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(400).json({ result: false, message: "Blog not found" });
    }
    res
      .status(200)
      .json({ result: true, message: "Blog list is..", data: blog });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

//all blog list
const getAllBlog = async (req, res) => {
  try {
    const blog = await blogModel.find();
    res
      .status(200)
      .json({ result: true, message: "Blog list is..", data: blog });
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
};

const bookingOrderList = async (req, res) => {
  try {
    const bookings = await bookingOrderModel
      .find()
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

const bookingOrderDetails = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    if (!orderId) {
      return res
        .status(400)
        .json({ result: false, message: "orderId is required." });
    }
    const bookings = await bookingOrderModel
      .find({ _id: orderId })
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
      });
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

const bookingOrderStatusChange = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({
        result: false,
        message:
          "orderId ,status(1 for completed and 2 for cancelled) is required.",
      });
    }
    await bookingOrderModel.findByIdAndUpdate(
      { _id: orderId },
      { bookingStatus: status },
      { new: true }
    );
    res.status(200).json({ result: true, message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};

const dashboardCount = async (req, res) => {
  try {
    const totalBooking = await bookingOrderModel.countDocuments();
    const totalUser = await userModel.countDocuments();
    const totalAppointment = await appointmentModel.countDocuments();
    const totalPrescription = await prescriptionModel.countDocuments();
    const totalReport = await reportsModel.countDocuments();
    const totalBlogs = await blogModel.countDocuments();
    const totalBlogView = await blogViewModel.countDocuments();

    res.status(200).json({
      success: true,
      message: "Dashboard count",
      data: {
        totalBooking,
        totalUser,
        totalAppointment,
        totalPrescription,
        totalReport,
        totalBlogs,
        totalBlogView,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};

module.exports = {
  addPackageCategory,
  addPackage,
  getAllPackages,
  getAllPackageCategories,
  getSinglePackageCategory,
  getSinglePackage,
  updatePackageCategory,
  updatePackage,
  deletePackage,
  adminLogin,
  addCheckupRoutine,
  getAllCheckupRoutines,
  getSingleCheckupRoutine,
  updateCheckupRoutine,
  deleteCheckupRoutine,
  userList,
  addFaq,
  updateFaq,
  getFaq,
  deleteFaq,
  faqList,
  deleteAboutus,
  addAboutus,
  getAllAboutus,
  updateAboutus,
  getAboutusById,
  addContactus,
  getContactus,
  createService,
  getAllService,
  getAllOrders,
  getAllApointments,
  allPrescriptionFiles,
  addReports,
  reportsList,
  getByIdApointments,
  getByIdOrders,
  createBlogCategory,
  blogCategoryList,
  deleteBlogCategory,
  createBlogPost,
  updateBlog,
  getBlog,
  getAllBlog,
  bookingOrderList,
  bookingOrderDetails,
  bookingOrderStatusChange,
  dashboardCount,
};
