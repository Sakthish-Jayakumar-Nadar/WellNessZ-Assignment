import { model, Schema } from "mongoose";

const userSchema =  new Schema({
    isAdmin : {
        type : Boolean,
        default : false,
    },
    isCoach : {
        type : Boolean,
        default : false,
    },
    isClient : {
        type : Boolean,
        default : false,
    },
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
    },
    specialization : {
        type : String,
    },
    phone : {
        type : Number,
    },
    age : {
        type : Number,
    },
    goal : {
        type : String,
    },
    coachId : {
        type : Schema.Types.ObjectId,
        ref : "userModel",
    },
    progressNotes : {
        type : [String],
    },
    lastUpdated : {
        type : String,
    },
    weight : {
        type : Number,
    },
    bmi : {
        type : Number,
    },
    date : {
        type : String,
    },
    time : {
        type : String,
    },
    sessionType : {
        type : String,
    }
});

const userModel = model("WellnessZUsers", userSchema);
export default userModel;