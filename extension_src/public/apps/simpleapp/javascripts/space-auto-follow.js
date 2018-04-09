"use strict"
var spaceVar = {
    batch:50,
    unfollowBatch:25,
    emailBatch:50,
    objectSpace:null,
    spaceAssociationID:null
};
var spaceArrays = {
    spaces:[],
    folSpace:[],
    arrBatch:[],
    jiveId:[],
    arrEmailBatch:[],
    unfolSpace:[],
    unfolSpaceBatch:[]
};

//Pick a space
$ (function() {
    $ ( "#getAllspaces" ).click( function() {  
        spaceVar.objectSpace = null;
        spaceVar.spaceAssociationID = null;
        
		for ( var key in spaceArrays ) {
			spaceArrays[key].length = 0;
		}
        osapi.jive.corev3.places.requestPicker( {  
			type : "space",  
			success : function(data) {  
            // "data" will be the Space object (in this case) selected by the user 
            spaceVar.objectSpace = data;
			}  
        });
        $("#uploadSpc").prop("disabled",false);
    });
});

//Upload csv file
$("#uploadSpc").change( function( evt ) {
    $("#alertFS").text("Loading...");
    $( "#alertFS.success" ).fadeIn();
    var file = evt.target.files[0];
    var reader = new FileReader();
    var references="";
    reader.onload = function(e){
        references = e.target.result;
        var header = references.split(",");
        var j;
        spaceArrays.folSpace.length = 0;
        for(j=0;j<header.length;j++){
            spaceArrays.folSpace.push(header[j]);
        }
        var k;
        spaceArrays.arrEmailBatch.length = 0;
        for(k=0;k<spaceArrays.folSpace.length;k+=spaceVar.emailBatch){
            spaceArrays.arrEmailBatch.push(spaceArrays.folSpace.slice(k,k+spaceVar.emailBatch));
            //return hiveArrays.arrBatch;
        }
        if(spaceArrays.arrEmailBatch.length === 0){
            $("#alertFS").text("List is empty...");
        }
        else {
            var i;
            for(i=0;i<spaceArrays.arrEmailBatch.length;i++){
                (function(x){
                    setTimeout(function(){
                        $(spaceArrays.arrEmailBatch[x]).each(function(index,email){
                            osapi.jive.core.get({
                                "v":"v3",
                                "href":"/people/email/"+email,
                                "fields":"id,displayName"
                            }).execute(function(response){
                                if(response.error){
                                    var message = response.error.message;
                                    $("#alertFS").text(message);
                                }
                                else{
                                    spaceArrays.jiveId.push(response.id);
                                    $("#alertFS").text("Email identified: "+response.displayName);
                                    $("#alertFS").text("Identifying Batch: "+x+" of "+spaceArrays.arrEmailBatch.length);

                                    if(spaceArrays.arrEmailBatch.length-1 == x){
                                        $("#alertFS").text("All Batches Completed!");
                                        $("#alertFS").text("Total identified: "+spaceArrays.jiveId.length);
                                    }
                                }
                            });
                        });
                    },60000*x);
                })(i);
            }//End for loop
        }//End else
    }
    reader.readAsText(file);
    reader.onerror = function(){
        alert("Unable to read"+file.fileName);
    }
    document.getElementById("followSpace").disabled=false;
    $("#alertFS").text("Upload successful!");
});

//Follow space
$ (function() {
    $ ( "#followSpace" ).click( function() {
        if ( spaceArrays.jiveId.length === 0 ) {
            $ ( "#alertFS" ).text( "List is empty..." );
        }
        else {
            if ( ! $ ( "#checkBoxActivity" ).prop( "checked" ) && ! $ ( "#checkBoxInbox" ).prop( "checked" ) ){
                $ ( "#alertFS" ).text( "Please make a selection Inbox or Activity stream" );
            }
            else {
                $ ( "#alertFS" ).text( "Working..." );
                spaceArrays.arrBatch.length = 0;
                var j;
                for ( j = 0; j < spaceArrays.jiveId.length; j += spaceVar.batch ) {
                    spaceArrays.arrBatch.push( spaceArrays.jiveId.slice( j , j + spaceVar.batch ) );
                }
                var i;
                for ( i = 0; i < spaceArrays.arrBatch.length; i++ ) {
                    ( function(x) {
                        setTimeout( function(){ 
                        $ ( spaceArrays.arrBatch[x] ).each( function( index , member ){
                            osapi.jive.core.get( {
                                v : "v3",
                                href : "/people/" + member + "/streams"
                            } ).execute( function ( response ) {
                                if ( response.error ) {
                                    $ ( "#alertFS" ).text( response.error.message );
                                }
                                else {
                                    $ ( response.list ).each( function( index,stream ) {
                                        if ( $( "#checkBoxInbox" ).is( ":checked" ) ) {
                                            app.followStreamInbox( stream , x );
                                        }
                                        if ( $( "#checkBoxActivity" ).is( ":checked" ) ) {
                                            app.followStreamActivity( stream , x );
                                        } 
                                    });
                                }
                            });
                        });
                        },60000*x);
                    })(i);
                }//end for loop
            }//end else
        }//end else        
    });
});

//Get followers
$ ( function() {
	$ ( "#getSpaceFollowers" ).click( function() {
		if ( spaceVar.objectSpace == null ){
			alert("Please pick a space first!");
		}
		else {
			spaceArrays.unfolSpace.length = 0;
			var request = spaceVar.objectSpace.getFollowers( {fields : "@all" , count:100 } );
			getNextSpaceFollowers( request );
			$( "#alertFS" ).text( "Loading followers..." );
			$( "#alertFS.success" ).fadeIn();
		}
	});
});

function getNextSpaceFollowers( request ) {
	request.execute( function( response ) {
		if(response.error) {
            $ ( "#alertFS" ).text( response.error.message );
		}
		else if ( !response.list ) {
			$ ( "#alertFS" ).text( "Reesponse is not a list..." );
		}
		else{
			$ ( response.list ).each( function( index , follower ){
				spaceArrays.unfolSpace.push(follower);
				$("#alertFS").text("Loading followers  : "+spaceArrays.unfolSpace.indexOf(follower));
			});
			if ( response.getNextPage ) {
				var requestNextPage = response.getNextPage();
				getNextSpaceFollowers(requestNextPage);
			}
			if ( !response.getNextPage ){
				$("#alertFS").text("Followers loaded : "+spaceArrays.unfolSpace.length);
			}
		}
    });
}

//Get associations
$(function(){
	$("#getSpaceStream").click(function() {
		$("#alertFS").text("Loading streams...");
		if ( spaceArrays.unfolSpace.length > 0 ) {
			osapi.jive.core.get( {
				v : "v3",
				href : "/people/" + spaceArrays.unfolSpace[0].id + "/streams"
			}).execute( function( response) {
				$ ( response.list ).each( function( index , stream ) {
					stream.getAssociations( { type : "space" , fields : "@all" } ).execute( function( response ) {
						$ ( response.list ).each( function( index , association ) {
							if ( association.name === spaceVar.objectSpace.name || association.placeID === spaceVar.objectSpace.placeID) {
								spaceVar.spaceAssociationID = association.id;
								$ ( "#alertFS" ).text( "Association found  : " + association.id );
								// unfollow();
							}
						});
					});
				});
			});
		}
		else{
			$("#alertFS").text("There are no followers in this group!");
		}
	});
});

//Unfollow Space
$(function(){
	$("#unfollowSpace").click(function(){
        if ( spaceArrays.unfolSpace.length > 0 ) {
            $ ( "#alertFS" ).text( "Unfollowing..." );
            var i;
            spaceArrays.unfolSpaceBatch.length = 0;
            for ( i = 0; i < spaceArrays.unfolSpace.length; i += spaceVar.unfollowBatch ) {
                spaceArrays.unfolSpaceBatch.push( spaceArrays.unfolSpace.slice( i , i + spaceVar.unfollowBatch ) );
            }
            var j;
            for ( j = 0; j < spaceArrays.unfolSpaceBatch.length; j++ ) {
                ( function( y ) {
                    setTimeout( function() {
                        if ( spaceVar.spaceAssociationID === null || spaceVar.spaceAssociationID === "" ) {
                            window.alert("Group association not found! Load Followers again");
                        }
                        else {
                            $ ( spaceArrays.unfolSpaceBatch[y] ).each( function( index , member ) {
                                osapi.jive.core.get({
                                    v : "v3",
                                    href : "/people/" + member.id + "/streams"
                                }).execute( function( response ) {
                                    $ ( response.list ).each( function( index , stream ){
                                        if(stream.source === "connections"){
                                            var connStream = stream.id;
                                            osapi.jive.core.delete(
                                            {
                                                v:"v3",
                                                href:"/streams/"+connStream+"/associations/spaces/"+spaceVar.spaceAssociationID
                                            }).execute(function(response){
                                                if(response.error){
                                                    if(response.error.code !== "objectInvalidURI"){
                                                        $("#alertFS").text(response.error.message);
                                                    }
                                                }
                                                else if(spaceArrays.unfolSpaceBatch.length-1 == y){
                                                    $("#alertFS").text("Unfollow Completed!");
                                                }
                                                else{
                                                    $("#alertFS").text("Unfollowed Batch : "+y+" of: "+spaceArrays.unfolSpaceBatch.length);
                                                }
                                            });
                                        }
                                        if(stream.source === "communications"){
                                            var commStream = stream.id;
                                            osapi.jive.core.delete(
                                            {
                                                v:"v3",
                                                href:"/streams/"+commStream+"/associations/spaces/"+spaceVar.spaceAssociationID
                                            }).execute(function(response){
                                                if(response.error){
                                                    if(response.error.code !== "objectInvalidURI"){
                                                        $("#alertFS").text(response.error.message);
                                                    }
                                                }
                                                else if(spaceArrays.unfolSpaceBatch.length-1 === y){
                                                    $("#alertFS").text("Unfollow Completed!");
                                                }
                                                else{
                                                    $("#alertFS").text("Unfollowed Batch: "+y+" of: "+spaceArrays.unfolSpaceBatch.length);
                                                }
                                            });
                                        }//end if
                                    });
                                });
                            });
                        }//end else
                    },30000*y);
                })(j);
            }
        }
        else{
            $("#alertFS").text("There are no followers in this group, pick space and try again!");
        }
	});
});
//Download Followers
$ ( function() {
	$ ( "#downloadSpaceFollowers" ).click( function() {
        var folArr = [];
        var i = undefined;
		for ( i = 0; i < spaceArrays.unfolSpace.length; i++ ){
            // folArr.push( spaceArrays.unfolSpace[i].displayName );
            folArr.push( spaceArrays.unfolSpace[i].emails[0].value );
		}
		var csvCont = "data:text/csv;charset=utf-8,";
		dataString = folArr.join(",");
		csvCont += dataString;

		var encodedUri = encodeURI(csvCont);
		var link = document.createElement("a");

		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "Space Followers.csv");
		document.body.appendChild(link);
		link.click();
	});
});
//End download Followers