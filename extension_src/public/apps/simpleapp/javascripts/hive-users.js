var staff =
{
    inActive:[],
    jInActive:[],
    reminder:[],
    jActive:[],
    reminderActive:[],
    usersByEmail:[],
    syncBatch:[]
};
var hUsers =
{
    jiveInactive:"",
    jiveActive:"",
    batch:50,
    count:0
};

/*
$(function()
{
    setTimeout(syncHive,8.64e7);
});
*/
$(function()
{
    $("#getInActives").click(function()
    {
          $.getJSON("https://sidm.springernature.com/api/v2.0/users?filter[where][and][0][services]=605&filter[where][and][1][userstate]=0&fields=email",function(data)
          {
                $(data.info).each(function(index,id)
                {
                    staff.inActive.push(id.email);
                });
                //console.log(staff.inActive);
                getHiveActiveUsers();
          }).fail(function(data)
          {
              alert(data);
          });
    });
});


//Get all Hive active users
function getHiveActiveUsers()
{
    hUsers.jiveActive = osapi.jive.core.get(
    {
        "v":"v3",
        "href":"/people/@all",
        "count":100,
        "fields":"email"
    });
    getActive(hUsers.jiveActive);
}
function getActive(request)
{
    request.execute(function(response)
    {
        if(response.error)
        {
            var message = response.error.message;

        }
        else if (!response.list)
        {
            alert("Response is not a list!")
        }
        else
        {
            $(response.list).each(function(index,person)
            {
                staff.jActive.push(person.emails[0].value);
            });
            if(response.getNextPage)
            {
                var nextRes = response.getNextPage();
                getActive(nextRes);
            }
            else
            {
                staff.reminderActive = staff.inActive.filter(function(data)
                {
                    return staff.jActive.includes(data);
                });
                console.log("total active users: "+staff.jActive.length);
                getUsersByEmail();

            }
        }
    });
}
//End get all Hive active users

//Get Hive users by email
function getUsersByEmail()
{
    for(i=0;i<staff.reminderActive.length;i+=hUsers.batch)
    {
        staff.syncBatch.push(staff.reminderActive.slice(i,i+hUsers.batch));
        //return hiveArrays.arrBatch;
    }

    for(i=0;i<staff.syncBatch.length;i++)
    {
        (function(x)
        {
            setTimeout(function()
            {
                $(staff.syncBatch[x]).each(function(index,email)
                {
                    osapi.jive.core.get(
                    {
                        "v":"v3",
                        "href":"/people/email/"+email
                    }).execute(function(response)
                    {
                        if(response.error)
                        {
                            var message = response.error;
                        }
                        else if(x == staff.syncBatch.length-1 && hUsers.count == 0)
                        {
                            sync_hive_inactive();
                        }
                        else
                        {
                          staff.usersByEmail.push(response);
                        }
                    });
                });
            },60000*x);
        })(i);
    }
}
//End get Hive users by email

//Disable users in Hive
function sync_hive_inactive()
{
    hUsers.count = 1;
    console.log("total to sync : "+staff.usersByEmail.length);
    if(staff.usersByEmail.length>0)
    {
        $(staff.usersByEmail).each(function(index,user)
        {
            console.log(user.displayName+" : "+user.jive.enabled);
            user.jive.enabled=false;
            user.update().execute(function(response)
            {
                //console.log(response);
            });
            console.log(user.displayName+" : "+user.jive.enabled);
        });
    }
    else {
      console.log("All is in sync");
    }

}
//End disable Hive users
