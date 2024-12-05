# WellNessZ-Assignment

NOTE* Install node modules

url : https://localhost:3000
{
  route -> url/api/register
  This route is to create an admin 
  In the body we have to pass (name, email, password)
  eg. {
        "name" : "Admin",
        "email" : "admin@gamil.com",
        "password" : "AdminPassword"
      }
}

{
  route -> url/api/login
  This route is to login to the website
  As anybody login with proper information jwt token is created
  In the body we have to pass (email, plainPassword)
  eg.{
        "email" : "Admin",
        "plainPassword" : "AdminPassword"
      }
}

{
  route -> url/api/coaches
  This route is to create new coaches
  Only Admin can create new coaches, for that is done jwt authentication
  In the body we have to pass (name, email, plainPassword, specialization)
  eg.{
        "name" : "Coach1", 
        "email" : "coach1@gmail.com", 
        "plainPassword" : "Coach1Password", 
        "specialization" : "Cardio"
      }
}

{
  route -> url/api/coaches/:coachId/clients
  This is to get clients of a specific coach
  Admin can access clients of all coaches and Coaches have access to only their clients
}

{
  route -> url/api/clients
  This is to create new client
  Admin can create new client for any coach and Coach can create client for themselfs only
  If Admin then in the body we have to pass (name, email, coachId, phone, age, goal)
  eg.{
        "name" : "Client1Coach1", 
        "email" : "client1coach1@gamil.com", 
        "coachId" : "_id of coach"
        "phone" " 9876543210,
        "age" : 21,
        "goal" : "fat loss"
      }
  If login as Coach then in the body we do not need coachId
  eg.{
        "name" : "Client1Coach1", 
        "email" : "client1coach1@gamil.com", 
        "coachId" : "_id of coach"
        "phone" " 9876543210,
        "age" : 21,
        "goal" : "fat loss"
      }
}

{
  route -> url/api/clients/:id
  This is to delete client
  Only Admin can delete client
}

{
  route -> url/api/clients/:id/progress
  This is to add progress notes of client
  Only coach of the client can add progress note
  In the body we have to pass ( progressNotes, weight, bmi )
  eg.{ 
        "progressNotes" : "noted the progress of the client", 
        "weight" : 75, 
        "bmi" : 70
      }
}

{
  route -> url/api/admin/dashboard
  This is to get the data for admin dashboard
  This will give the coach count and client count 
  The data is cache for 5 minits and then refreshed
}

{
  route -> url/api/clients/:id/schedule
  This is to schedule a session with the client
  Once sheduled a mail will be send to the client one day before
  NOTE* edit user to company email id, form to company email id and pass to generated password in clientSchedule function in controller.js file
  In the body we have to pass ( date, time, sessionType )
  eg.{  
        "date" : "5/12/24", 
        "time" : "5:30", 
        "sessionType" : "Upper Body Workout" 
      }
}

{
  route -> url/api/logout
  This is to stop refreshing cache after every 5 minutes for admin dashboard page
}
