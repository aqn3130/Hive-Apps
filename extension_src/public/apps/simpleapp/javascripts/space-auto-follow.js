var spaceVar =
{
    batch:50,
    emailBatch:50,
    objectSpace:null,
    spaceAssociationID:null
};
var spaceArrays =
{
    spaces:[],
    folSpace:[],
    arrBatch:[],
    jiveId:[],
    arrEmailBatch:[],
    unfolSpace:[],
    unfolSpaceBatch:[]
};

//Pick a space
$(function()
{
    $("#getAllspaces").click(function()
    {  
        spaceVar.objectSpace=null;
        spaceVar.spaceAssociationID=null;
        
		for(var key in spaceArrays)
		{
			spaceArrays[key].length=0;
		}
        osapi.jive.corev3.places.requestPicker({  
			type : "space",  
			success : function(data) {  
            // "data" will be the Space object (in this case) selected by the user 
            spaceVar.objectSpace=data;
			}  
        });
        $("#uploadSpc").prop("disabled",false);
    });
});

//Upload csv file
$("#uploadSpc").change(function(evt)
{
    $("#alertFS").text("Loading...");
    $( "#alertFS.success" ).fadeIn();
    var file = evt.target.files[0];
    var reader = new FileReader();
    var references="";
    reader.onload = function(e)
    {
        references = e.target.result;
        var header = references.split(",");
        for(i=0;i<header.length;i++)
        {
            spaceArrays.folSpace.push(header[i]);
        }

        for(i=0;i<spaceArrays.folSpace.length;i+=spaceVar.emailBatch)
        {
            spaceArrays.arrEmailBatch.push(spaceArrays.folSpace.slice(i,i+spaceVar.emailBatch));
            //return hiveArrays.arrBatch;
        }
        if(spaceArrays.arrEmailBatch.length==0)
        {
            $("#alertFS").text("List is empty...");
        }
        else {

            for(i=0;i<spaceArrays.arrEmailBatch.length;i++)
            {
                (function(x)
                {
                    setTimeout(function()
                    {
                        $(spaceArrays.arrEmailBatch[x]).each(function(index,email)
                        {
                            osapi.jive.core.get(
                            {
                                "v":"v3",
                                "href":"/people/email/"+email,
                                "fields":"id,displayName"
                            }).execute(function(response)
                            {
                                if(response.error)
                                {
                                    var message = response.error.message;
                                    $("#alertFS").text(message);
                                }
                                else
                                {
                                    spaceArrays.jiveId.push(response.id);
                                    $("#alertFS").text("Email identified: "+response.displayName);
                                    $("#alertFS").text("Completed Batch: "+x+" of "+spaceArrays.arrEmailBatch.length);

                                    if(spaceArrays.arrEmailBatch.length-1 == x)
                                    {
                                        $("#alertFS").text("All Batches Completed!");
                                        $("#alertFS").text("Total identified: "+spaceArrays.jiveId.length);
                                    }
                                    //console.log(response);
                                    //console.log(spaceArrays.jiveId);
                                }
                            });
                        });
                    },60000*x);
                })(i);
            }//End for loop
        }//End else
    }
    reader.readAsText(file);
    reader.onerror = function()
    {
        alert("Unable to read"+file.fileName);
    }
    document.getElementById("followSpace").disabled=false;
    $("#alertFS").text("Upload successful!");
});

//Follow space
$(function()
{
    $("#followSpace").click(function()
    {
        if(spaceArrays.jiveId.length === 0)
        {
            $("#alertFS").text("List is empty...");
        }
        else
        {
            if(spaceArrays.jiveId.length>50){
                for(i=0;i<spaceArrays.jiveId.length;i+=spaceVar.batch)
                {
                    spaceArrays.arrBatch.push(spaceArrays.jiveId.slice(i,i+spaceVar.batch));
                    //return hiveArrays.arrBatch;
                }
            }
            else{
                spaceArrays.arrBatch.push(spaceArrays.jiveId);
            }
            
            for(i=0;i<spaceArrays.arrBatch.length;i++)
            {
                (function(x)
                {
                    setTimeout(function()
                    {
                    $(spaceArrays.arrBatch[x]).each(function(index,member)
                    {
                        osapi.jive.core.get(
                        {
                            v:"v3",
                            href:"/people/"+member+"/streams"
                        }).execute(function(response)
                        {
                            $(response.list).each(function(index,stream)
                            {
                                if($("#checkBoxInbox").is(":checked"))
                                {
                                    if(stream.source == "connections")
                                    {
                                        var conType = stream.id;
                                        osapi.jive.core.post(
                                        {
                                            "v":"v3",
                                            "href":"/streams/"+conType+"/associations",
                                            "body":["/places/"+spaceVar.objectSpace.placeID]

                                        }).execute(function(response)
                                        {
                                            if(response.error)
                                            { 
                                                if(response.error.code === "409"){
                                                    $("#alertFS").text("Already following in Inbox!");
                                                }
                                                else{
                                                    var message = response.error.message;
                                                    $("#alertFS").text("Error: "+message);
                                                }
                                                
                                            }
                                            else {
                                                if(response.status === 204){
                                                    $("#alertFS").text("Completed Batch: "+x+" of "+spaceArrays.arrBatch.length);
                                                }
                                                else{
                                                    $("#alertFS").text(JSON.stringify(response));
                                                }
                                                if(spaceArrays.arrBatch.length-1 == x)
                                                {
                                                    $("#alertFS").text("Completed!");
                                                }
                                            }
                                        });
                                    }
                                    else
                                    {
                                        $("#alertFS").text("Stream not found!");

                                    }
                                }
                                else if($("#checkBoxActivity").is(":checked"))
                                {
                                    if(stream.source == "communications")
                                    {
                                        var conTypeComms = stream.id;
                                        osapi.jive.core.post(
                                        {
                                            "v":"v3",
                                            "href":"/streams/"+conTypeComms+"/associations",
                                            "body":["/places/"+spaceVar.objectSpace.placeID]

                                        }).execute(function(response)
                                        {
                                            if(response.error)
                                            {
                                                if(response.error.code === "409"){
                                                    $("#alertFS").text("Already following in Activity Stream!");
                                                }
                                                else{
                                                    var message = response.error.message;
                                                    $("#alertFS").text("Error: "+message);
                                                }
                                                
                                            }
                                            else
                                            {
                                                // $("#alertFS").text(JSON.stringify(response));
                                                // $("#alertFS").text("Completed Batch: "+x+" of: "+spaceArrays.arrBatch.length);

                                                // if(spaceArrays.arrBatch.length-1 == x)
                                                // {
                                                //     $("#alertFS").text("Completed!");
                                                // }
                                                if(response.status === 204){
                                                    $("#alertFS").text("Completed Batch: "+x+" of "+spaceArrays.arrBatch.length);
                                                }
                                                else{
                                                    $("#alertFS").text(JSON.stringify(response));
                                                }  
                                                if(spaceArrays.arrBatch.length-1 == x)
                                                {
                                                    $("#alertFS").text("Completed!");
                                                }

                                            }
                                        });
                                    }
                                    else
                                    {
                                        $("#alertFS").text("Stream not found!");

                                    }
                                }  
                                else
                                {
                                    $("#alertFS").text("Make a selection please Inbox or Activity!");
                                }
                            });
                        });
                    });
                    },60000*x);
                })(i);
            }//end for loop
        }//end else
    });
});

//Get followers
$(function()
{
	$("#getSpaceFollowers").click(function()
	{
		if(spaceVar.objectSpace == null)
		{
			alert("Please pick a space first!");
		}
		else
		{
			spaceArrays.unfolSpace.length=0;
			var request = spaceVar.objectSpace.getFollowers({fields:"@all",count:100});
			getNextSpaceFollowers(request);
			$("#alertFS").text("Loading followers...");
			$( "#alertFS.success" ).fadeIn();
		}
	});
});

function getNextSpaceFollowers(request)
{
	request.execute(function(response)
	{
		if(response.error)
		{
			var code = response.error.code;
			var message = response.error.message;
		}
		else if (!response.list)
		{
			alert("Error: response is not a list");
		}
		else
		{
			$(response.list).each(function(index,follower)
			{
				spaceArrays.unfolSpace.push(follower);
				$("#alertFS").text("Loading followers  : "+spaceArrays.unfolSpace.indexOf(follower));
			});
			if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				getNextSpaceFollowers(requestNextPage);
			}
			if(!response.getNextPage)
			{
				$("#alertFS").text("Followers loaded : "+spaceArrays.unfolSpace.length);
				//$( "#alertFS.success" ).fadeOut(4000);
				// document.getElementById("getStr").disabled = false;
				// document.getElementById("downFol").disabled = false;
				// getStream();
			}
		}
    });
}

//Get associations
$(function(){
	$("#getSpaceStream").click(function()
	{
		$("#alertFS").text("Loading streams...");
		if(spaceArrays.unfolSpace.length>0)
		{
			osapi.jive.core.get(
			{
				v:"v3",
				href:"/people/"+spaceArrays.unfolSpace[0].id+"/streams"
			}).execute(function(response)
			{
				$(response.list).each(function(index,stream)
				{
					stream.getAssociations({type:"space",fields:"@all"}).execute(function(response)
					{
						$(response.list).each(function(index, association)
						{
							if(association.name === spaceVar.objectSpace.name || association.placeID === spaceVar.objectSpace.placeID)
							{
								spaceVar.spaceAssociationID = association.id;
								$("#alertFS").text("Association found  : "+association.id);
								// unfollow();
							}
						});
					});
				});
			});
		}//End if
		else
		{
			$("#alertFS").text("There are no followers in this group!");
	
		}
	});
});

//Unfollow Space
$(function(){
	$("#unfollowSpace").click(function()
	{
        if(spaceArrays.unfolSpace.length>0)
        {
            $("#alertFS").text("Unfollowing...");
            for(i=0;i<spaceArrays.unfolSpace.length;i+=spaceVar.batch)
            {
                spaceArrays.unfolSpaceBatch.push(spaceArrays.unfolSpace.slice(i,i+spaceVar.batch));
            }
            for(j=0;j<spaceArrays.unfolSpaceBatch.length;j++)
            {
                (function(y)
                {
                    setTimeout(function()
                    {
                        if(spaceVar.spaceAssociationID == null || spaceVar.spaceAssociationID == "")
                        {
                            window.alert("Group association not found! Load Followers again");
                        }
                        else
                        {
                            $(spaceArrays.unfolSpaceBatch[y]).each(function(index,member)
                            {
                                osapi.jive.core.get(
                                {
                                    v:"v3",
                                    href:"/people/"+member.id+"/streams"
                                }).execute(function(response)
                                {
                                    $(response.list).each(function(index,stream)
                                    {
                                        if(stream.source == "connections")
                                        {
                                            var connStream = stream.id;
                                            osapi.jive.core.delete(
                                            {
                                                v:"v3",
                                                href:"/streams/"+connStream+"/associations/spaces/"+spaceVar.spaceAssociationID
                                            }).execute(function(response)
                                            {
        
                                                if(response.error)
                                                {
                                                    var message = response.error.message;
                                                    $("#alertFS").text(message);
                                                }
                                                else if(spaceArrays.unfolSpaceBatch.length-1 == y)
                                                {
                                                    $("#alertFS").text("Unfollow Completed!");
                                                }
                                                else
                                                {
                                                    $("#alertFS").text("Unfollowed Batch : "+y+" of: "+spaceArrays.unfolSpaceBatch.length);
                                                }
        
                                            });
                                        }
                                        else if(stream.source == "communications")
                                        {
                                            var commStream = stream.id;
                                            osapi.jive.core.delete(
                                            {
                                                v:"v3",
                                                href:"/streams/"+commStream+"/associations/spaces/"+spaceVar.spaceAssociationID
                                            }).execute(function(response)
                                            {
        
                                                if(response.error)
                                                {
                                                    var message = response.error.message;
                                                    $("#alertFS").text(message);
                                                }
                                                else if(spaceArrays.unfolSpaceBatch.length-1 == y)
                                                {
                                                    $("#alertFS").text("Unfollow Completed!");
                                                }
                                                else
                                                {
                                                    $("#alertFS").text("Unfollowed Batch: "+y+" of: "+spaceArrays.unfolSpaceBatch.length);
        
                                                }
        
                                            });
                                        }
                                        else
                                        {
                                            $("#alertFS").text("No Streams found!");
        
                                        }
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
$(function()
{
	$("#downloadSpaceFollowers").click(function()
	{
		var folArr=[];
		for(i=0;i<spaceArrays.unfolSpace.length;i++)
		{
			folArr.push(spaceArrays.unfolSpace[i].displayName)
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