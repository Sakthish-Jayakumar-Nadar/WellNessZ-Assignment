import { clientProgress, clientSchedule, createNewClientToCoach, createNewCoach, deleteClient, getClientOfCoach, getDataFromCache, loginUser, logOut, registerUser } from "../Controller/controller.js";
import authenticateJWT from "../Middleware/authenticateJWT.js";

export default function routes(app){
    app.post('/api/register' ,registerUser)
    app.post('/api/login' ,loginUser);
    app.post('/api/coaches',authenticateJWT ,createNewCoach);
    app.get('/api/coaches/:coachId/clients' ,authenticateJWT ,getClientOfCoach);
    app.post('/api/clients' ,authenticateJWT ,createNewClientToCoach);
    app.delete('/api/clients/:id' ,authenticateJWT, deleteClient);
    app.patch('/api/clients/:id/progress' ,authenticateJWT, clientProgress);
    app.post('/api/clients/:id/schedule' ,authenticateJWT, clientSchedule);
    app.get('/api/admin/dashboard' ,authenticateJWT ,getDataFromCache);
    app.get('/api/logout' ,logOut);
}