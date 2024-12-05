import jwt from "jsonwebtoken";

export default function authenticateJWT(req, res, next){
  const tokenWithBearer = req.header('Authorization');
  if(tokenWithBearer){
    const token = tokenWithBearer.split(" ")[1];
    if (token) {
      jwt.verify(token, "SecretKey", (err, user) => {
        if (err) {
          return res.send({tokenExpiredMessage:'Token expired'});
        }
        req.user = user.user;
        next();
      });
    } else {
      res.send({unauthorizedMessage : 'LogIn first'});
    }
  }
  else{
    res.send({unauthorizedMessage : 'LogIn first'});
  }
};