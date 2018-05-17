"use strict"
var staff = {
    inActive:[],
    jInActive:[],
    reminder:[],
    jActive:[],
    remainderActive:[],
    usersByEmail:[],
    syncBatch:[]
};
var hUsers = {
    batch:50,
    count:0
};

/*
$(function()
{
    setTimeout(syncHive,8.64e7);
});
*/
$(function(){
    $("#getInActives").click(function(){
        for( var e in staff ) {
            staff[e].length = 0;
        }
        hUsers.count = 0;
        $( "#alertUFG.success" ).fadeIn();
        
        $.getJSON("https://sidm.springernature.com/api/v2.0/users?filter[where][and][0][services]=605&filter[where][and][1][userstate]=0&fields=email",function(data){
            $(data.info).each(function( index , id ) {
                staff.inActive.push( id.email );
                $( "#alertUFG" ).text( "Loading UDE inactive user... " + staff.inActive.length );
                if( data.info.length - 1 === index ){
                     //console.log(staff.inActive);
                    getHiveActiveUsers();
                    runReport(staff.inActive,"UDE inactive report.csv");
                    $( "#alertUFG" ).text( "Total inactive from UDE : " + staff.inActive.length );
                }
            });
        }).fail(function(data){
            $( "#alertUFG" ).text( "Error reading from UDE: " + data );
        });
    });
});

//Get all Hive active users
function getHiveActiveUsers(){
    var request = osapi.jive.core.get({
        "v":"v3",
        "href":"/people/@all",
        "count":100,
        "fields":"email"
    });
    getActive( request );
}
function getActive(request){
    request.execute(function(response){
        if ( response.error ) {
            var message = response.error.message;
            $( "#alertUFG" ).text( message );
        }
        else if ( !response.list ) {
            $( "#alertUFG" ).text( " Response is not list ");
        }
        else {
            $( "#alertUFG" ).text( "Loading Hive active user: " + staff.jActive.length ); 
            $( response.list ).each( function( index , person ){
                staff.jActive.push( person.emails[0].value );
            });
            if ( response.getNextPage ) {
                var nextRes = response.getNextPage();
                getActive( nextRes );
            }
            else {
                staff.remainderActive = staff.inActive.filter(function(data){
                    return staff.jActive.includes(data);
                });
                $( "#alertUFG" ).text( "Total active users found: " + staff.remainderActive.length );
                runReport( staff.remainderActive , "Total active users found.csv" );
                getUsersByEmail();
            }
        }
    });
}
//End get all Hive active users

//Get Hive users by email
function getUsersByEmail(){
    (function(){
        var i = undefined;
        for ( i = 0; i < staff.remainderActive.length; i += hUsers.batch ) {
            staff.syncBatch.push( staff.remainderActive.slice( i , i + hUsers.batch ) );
        }
    })();
    
    (function(){
        var i = undefined;
        for ( i = 0; i < staff.syncBatch.length; i++ ) {
            (function( x ){
                setTimeout(function(){
                    $( staff.syncBatch[x] ).each( function( index , email ) {
                        osapi.jive.core.get({
                            "v":"v3",
                            "href":"/people/email/" + email
                        }).execute( function( response ){
                            if ( response.error ) {
                                $( "#alertUFG" ).text( "Error reading user's by email: " + response.error.message );
                            }
                            else {
                                staff.usersByEmail.push( response );
                                if (staff.syncBatch.length === 1){
                                    if ( index === staff.remainderActive.length - 1 && hUsers.count === 0 ){
                                        $( "#alertUFG" ).text( "Total to sync: " + staff.usersByEmail.length );
                                        sync_hive_inactive();
                                    }
                                }
                                else {
                                    if ( x === staff.syncBatch.length - 1 && hUsers.count === 0 ) {
                                        $( "#alertUFG" ).text( "Total to sync: " + staff.usersByEmail.length );
                                        sync_hive_inactive();
                                    }
                                }
                                
                            }
                        });
                    });
                } , 60000 * x );
            })( i );
        }
    })();
}
//End get Hive users by email


//Disable users in Hive
function sync_hive_inactive() {
    hUsers.count = 1;
    var report_array = [];
    if ( staff.usersByEmail.length > 0 ) {
        $( staff.usersByEmail ).each( function( index , user ) {
            console.log( user.displayName + " : " + user.jive.enabled );
            user.jive.enabled = false;
            user.update().execute(function(response){
                //console.log(response);
            });
            console.log( user.displayName + " : " + user.jive.enabled );
            report_array.push( user.displayName + ":" + user.jive.enabled );
            if(staff.usersByEmail.length - 1 === index){
                $( "#alertUFG" ).text( "Total of: " + staff.usersByEmail.length + " user accounts deactivated" );
                runReport( report_array,"SynchedUsers.csv" );
            }
        });
    }
    else {
        $( "#alertUFG" ).text( "All is in sync " );
    }
}
//End disable Hive users

//Download user sync report
function runReport(reportArray,fileName){
    var csvCont = "data:text/csv;charset=utf-8,";
    var dataString = reportArray.join(",");
    dataString = reportArray.join("\n");
    csvCont += dataString;

    var encodedUri = encodeURI(csvCont);
    var link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
}
//End download Followers