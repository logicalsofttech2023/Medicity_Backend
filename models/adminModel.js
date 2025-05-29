
const mongoose= require('mongoose');
const packageCategorySchema=new mongoose.Schema({
    name:{type:String},
    image:{type:String},
    type:String,
   
},{timestamps:true});


const packageSchema=new mongoose.Schema({
    title:{type:String},
    price:{type:Number},
    actual_price:Number,
    discount_price:Number,
    test:Array,
    report_time:String,
    fasting_time:String,
    gender:String,
    ageGroup:String,
    interoduction:String,
    total_test:Number,
   image:String,
    packageType:String,
    description:String,
    offer:[{
        disc_percantage:Number,
        offerPrice:Number,
        price:Number,
        no_patient:Number,

    }],
    package_categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'packagecategory'
    },

   
},{timestamps:true});

  const checkupRoutineSchema=new mongoose.Schema({
    image:{type:String},
    name:String,
    gender:String,
    age1:Number,
   age2:Number,
   
},{timestamps:true});


   //faq schema
const faqSchema=new mongoose.Schema({
    question:{type:String},
    answer:{type:String},
},{timestamps:true});

//about us schema
const aboutUsSchema=new mongoose.Schema({
    title:{type:String},
    description:{type:String},
    },{timestamps:true});

    //contactus schema
    const contactUsSchema=new mongoose.Schema({
        name:{type:String},
        email:{type:String},
        phone:{type:String},
        whatsapp:{type:String},
        });


   //services Schema
const servicesSchema=new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    image:{type:String},
    price:{type:Number},
    duration:String,
    status:{
        type:Boolean,
        default:false
        },

    },{timestamps:true});

    
 //report schema
      const reportSchema=new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        testName:String,
        reportId:String,
        date:String,
        recordFor:String,
        file:String,
        comment:String,

      },{timestamps:true});

      const blogCategorySchema=new mongoose.Schema({
        name:{type:String},

      });
      const blogSchema=new mongoose.Schema({
        title:{type:String},
        description:{type:String},
        image:{type:String},
        categoryName:String,
        status:{
            type:Boolean,
            default:false
            },
            },{timestamps:true});


            const blogViewSchema=new mongoose.Schema({
                userId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
                blogId:{type:mongoose.Schema.Types.ObjectId,ref:'blog'},
                viewedOn:{type:Date,default:Date.now},
                },{timestamps:true});
                

      

const packagecategoryModel= mongoose.model('packagecategory',packageCategorySchema);
const packageModel= mongoose.model('package',packageSchema);
  const checkupRoutineModel= mongoose.model('checkuproutine',checkupRoutineSchema);
  const faqModel= mongoose.model('faq',faqSchema);
const aboutUsModel= mongoose.model('aboutus',aboutUsSchema);
const contactUsModel= mongoose.model('contactus',contactUsSchema);
  const servicesModel= mongoose.model('services',servicesSchema);
    const reportsModel = mongoose.model('report', reportSchema);
    const blogCategoryModel = mongoose.model('blogcategory', blogCategorySchema);
const blogModel = mongoose.model('blog', blogSchema);
const blogViewModel = mongoose.model('blogview', blogViewSchema);


module.exports = {
    packagecategoryModel,
    packageModel,
    checkupRoutineModel,
    faqModel,
    aboutUsModel,
    contactUsModel,
   servicesModel,
   reportsModel,
   blogCategoryModel,
    blogModel,
    blogViewModel,

}
