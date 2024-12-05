import userModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import cron from "node-cron";
import nodemailer from "nodemailer"

export function registerUser(req, res){
    const {name, email, password : plainPassword} = req.body;
    bcrypt.hash(plainPassword, 10, function(err, hash) {
        if (err) return res.status(500).json({message : err.message});
        const newUser = new userModel({ name, email, password : hash, isAdmin : true });
        newUser.save().then(data => {
            if(!data){ 
                return res.status(400).json({message : "Something went wrong"});
            }
            res.send(data);
        }).catch(err => res.status(500).json({message : err.message}));
    });
}

export async function loginUser(req, res){
    try{
        const {email, plainPassword} = req.body;
        const user = await userModel.findOne({ email: email });
        if(user){
            bcrypt.compare(plainPassword, user.password, function(err, result) {
                if (err) return res.status(500).send({message : "Internal server error"}) ;
              
                if (result) {
                    const token = jwt.sign({user}, "SecretKey", { expiresIn: '15m' });
                    return res.json({ token });
                } else {
                  return res.status(400).json({invalidLoginInputMessage : "Invalid Inputs"});
                }
              });
        }
        else{
            return res.status(404).json({userNotFoundMessage : "User Not Found"});
        }
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export function createNewCoach(req, res){
    const {name, email, plainPassword, specialization} = req.body;
    const user = req.user;
    if(user.isAdmin){
        bcrypt.hash(plainPassword, 10, function(err, hash) {
            if (err) return res.status(500).json({message : err.message});
            const newUser = new userModel({ name, email, password : hash, specialization, isCoach : true });
            newUser.save().then(data => {
                if(!data){ 
                    return res.status(400).json({message : "Something went wrong"});
                }
                res.send(data);
            }).catch(err => res.status(500).json({message : err.message}));
        });
    }
    else{
        return res.status(401).json({invalidUser : "Not Allowed"})
    }
}

export function createNewClientToCoach(req, res){
    const {name, email, phone, age, goal} = req.body;
    const user = req.user;
    if(user.isAdmin){ 
        const {coachId} = req.body;
        const newUser = new userModel({ name, email, phone, age, goal, coachId, isClient : true });
        newUser.save().then(data => {
            if(!data){ 
                return res.status(400).json({message : "Something went wrong"});
            }
            res.send(data);
        }).catch(err => res.status(500).json({message : err.message}));
    }
    else if(user.isCoach){
        const coachId = user._id
        const newUser = new userModel({ name, email, phone, age, goal, coachId, isClient : true });
        newUser.save().then(data => {
            if(!data){ 
                return res.status(400).json({message : "Something went wrong"});
            }
            res.send(data);
        }).catch(err => res.status(500).json({message : err.message}));   
    }
    else{
        return res.status(401).json({invalidUser : "Not Allowed"})
    }
}

export async function getClientOfCoach(req, res) {
    try{
        const user = req.user
        const {coachId} = req.params
        if(user.isAdmin || (user.isCoach && user._id === coachId)){
            const clients = await userModel.find({coachId:coachId});
            if(clients){
                return res.send(clients);
            }
            return res.json({noClientsMesssage : "No clients"})
        }
        else{
            return res.status(401).json({invalidUser : "Not Allowed"})
        }
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export async function deleteClient(req, res){
    const { id } = req.params;
    try {
        const user = req.user;
        if(user.isAdmin){ 
            const client = await userModel.findByIdAndDelete(id);
            return res.send(client);
        }
    } catch (err) {
        res.status(500).send('Server error');   
    }
}

export async function clientProgress(req, res){
    const coach = req.user;
    const { id } = req.params;
    const { progressNotes, weight, bmi } = req.body
    try {
        const user = await userModel.findById(id);
        if (!user) {
        return res.status(404).json({clientNotFoundMessage : "Client not found"});
        }
        if(coach.isCoach && coach._id === user.coachId){
            user.progressNotes.push(progressNotes);
            user.weight = weight;
            user.bmi = bmi;
            let currentdate = new Date(); 
            let datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            user.lastUpdated = datetime;
            await user.save();
            res.send(user);
        }
        else{
            return res.status(401).json({invalidAction : "Not Allowed"})
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
}

export async function clientSchedule(req, res){
    const coach = req.user;
    const { id } = req.params;
    const {  date, time, sessionType } = req.body
    try {
        const user = await userModel.findById(id);
        if (!user) {
        return res.status(404).json({clientNotFoundMessage : "Client not found"});
        }
        if(coach.isCoach && coach._id == user.coachId){
            user.date = date;
            user.time = time;
            user.sessionType = sessionType;
            const dateArr = date.split("/")
            const schedule = `* * * ${(+dateArr[0] - 1)} ${(+dateArr[1])} *`;
            const task = cron.schedule(schedule, () => {
                if(coach.email && user.email){
                    let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'company email id',
                        pass: 'company email password'
                    }
                    });
        
                    let mailOptions = {
                    from: 'company email id',
                    to: user.email,
                    subject: 'Reminder',
                    text: 'You have session tomorrow'
                    };
        
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
                }
            });
            task.start();
            await user.save();
            res.send(user);
        }
        else{
            return res.status(401).json({invalidAction : "Not Allowed"})
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
}

const cache = new NodeCache();
const cacheKey = 'dashboard';
let cronJobStarted = false
let task;

async function fetchDashboardContent() {
    try {
        cronJobStarted = true;
        const dashboardObj = {};
        dashboardObj.coachCount  = await userModel.countDocuments({ isCoach: true });
        dashboardObj.clientCount  = await userModel.countDocuments({ isClient: true });
        cache.set(cacheKey, dashboardObj, 300);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

export function getDataFromCache(req, res) {
    const admin = req.user;
    if(admin.isAdmin){
        const dashboard = cache.get(cacheKey);
        if (dashboard) {
            console.log("came here")
            return res.send(dashboard);
        } else {
            task = cron.schedule('*/5 * * * *', fetchDashboardContent,{scheduled: false});
            task.start()
            fetchDashboardContent().then(()=>res.send(cache.get(cacheKey)))
        }
    }
    else{
        return res.status(401).json({invalidAction : "Not Allowed"})
    }
}

export function logOut(req, res) {
    if(cronJobStarted){
        task.stop();
        cronJobStarted = false;
    }
}