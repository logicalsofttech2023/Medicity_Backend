
const mongoose= require('mongoose');
const userSchema=new mongoose.Schema({
    name:{type:String},
    phone:{type:Number,required:true},
    userProfile:String,
    preganantStatus:String,
    gender:{type:String},
    age:{type:Number},
    weight:{type:Number},
    height:{type:Number},
    bloodGroup:String,
    bloodPressure:String,
    heartRate:Number,
    glucoseLevel:String,
    alleries:String,
    email:String,
    fcmId:String,
    userStatus:{type:Boolean,default:1},
    preExisitingConditions:String,
    currently_taking_any_medication:String,
    pregnancyTerm:Number,
    healthInsuranceMembers:[{
        relationName:String,
        age:Number,
        image:String
    }],
    cityName:String,
    stateName:String,
    uniqueId:String,
    dob:String,
    address:String,
    country:String,
    pincode:String,
    activeStatus:{type:Boolean,default:1},
    userType:{type:String,default:'user'},
    otp:Number,
    password:String,
    reason:String,
    

},{timestamps:true});



const viewSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    packageId:{type:mongoose.Schema.Types.ObjectId,ref:'package',required:true},
    currentDate:String,
 },{timestamps:true});


 const cartSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    packageId:{type:mongoose.Schema.Types.ObjectId,ref:'package',required:true},
    cartStatus:{
        type:Boolean,
        default:false
    },

 },{timestamps:true});


 //user address schema
 const addressSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    address:String,
    placeType:String,
    landMark:String,
    houseNo:String,
    pincode:String,
    activeStatus:{
        type:Boolean,
        default:1
        },
        },{timestamps:true});



 //member add schema
 const memberSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    fullName:String,
    relationName:String,
    age:Number,
    dob:String,
    gender:String,
    phone:String,
    email:String,
    activeStatus:{type:Boolean,default:1},
    
  
    },{timestamps:true});


    //booking order Schema
    const bookingOrderSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
      
        packageIds: [
         
          {  type:mongoose.Schema.Types.ObjectId,ref:'package',required:true}
        
        ],
      
        members: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },
        ],
      
        address: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true },
        ],
      
        discountAmount: Number,
        totalAmount: Number,
        payableAmount: Number,
        offerAmount: Number,
        giftAmount: Number,
      
        paymentStatus: {
          type: Boolean,
          default: false,
        },
      
        paymentMode: String,
        report: String,
      
        sampleCollectDate: String,  // Consider using Date type for better querying
        sampleCollectTime: String,
      
        bookingId: Number,  // Consider making it String if using custom ID format
        bookingDate: String, // Consider changing to Date type
      
        bookingStatus: {
          type: Number,
          default: 0,
        },
       
      
      }, { timestamps: true });


      //bookingAppointment schema
      const bookingAppointmentSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
          appointmentDate: String,
          appointmentTime: String, 
          appointmentStatus: {
            type: Boolean,
            default: false,
            },
            serviceName:String,
            description:String,
            price:Number,
            duration:String,
            customerName: String,
            customerPhone: String,
            customerEmail: String,
            customerAddress: String,
            clinicName_hpName_drName:String,
            testName:String,
            bookingId:Number,
            image:String,
            
            },
            { timestamps: true });



            const prescriptionSchema=new mongoose.Schema({
              memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },
              files:Array,
              userId:{
                type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true
              },
              status:{
                type:Number,
                default:0
              }

            },{timestamps:true});



     
   


const userModel= mongoose.model('user',userSchema);
const viewModel= mongoose.model('view',viewSchema);
const cartModel= mongoose.model('cart',cartSchema);
const addressModel= mongoose.model('address',addressSchema);
const memberModel= mongoose.model('member',memberSchema);
const bookingOrderModel= mongoose.model('bookingOrder',bookingOrderSchema);
const appointmentModel= mongoose.model('bookingAppointment',bookingAppointmentSchema);
const prescriptionModel = mongoose.model('prescription', prescriptionSchema);



module.exports = {
    userModel,
    viewModel,
    cartModel,
    addressModel,
    memberModel,
    bookingOrderModel,
    appointmentModel,
    prescriptionModel,
  
}