
/***************************************************************************************************************************
- Make group public 
- Remove group members 
- Unfollow group 
- Change group URL 
- Add to security group
****************************************************************************************************************************/
var group=
	{
		groupID:"",
		groupName:"",
		sgroupName:"",
		displayName:"",
		placeID:"",
		groupURI:"",
		groupURL:"",
		groupTypeCGU:"",
		groupTypeNew:"",
		location:"",
		objGroup:"",
		objSGroup:"",
		objID:"",
		sGrpID:""
	};
var hiveArrays = 
	{
		allGroups:[],
		allSGroups:[],
		allPeople:[],
		groupMem:[],
		groupFol:[],
		lines:[]
	};

	
//Get all groups
$(function()
{
	$("#LoadGroups,#LoadGroupsRGM,#LoadGroupsUG,#LoadGroupsCGU").click(function()
	{
        var request = osapi.jive.corev3.groups.get({fields:'placeID,name,displayName',count:100});
	    nextGroups(request);
		hiveArrays.allGroups.length=0;
		$( "#alertUFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success" ).fadeIn();
		
	});
});
//end function get all groups

function nextGroups(request)
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
			$(response.list).each(function(index,group)
			{
			  hiveArrays.allGroups.push(group);
              
              //document.getElementById("lGrps").innerHTML = "Loading: "+hiveArrays.allGroups.indexOf(group);
              //document.getElementById("progress").value = hiveArrays.allGroups.indexOf(group);
              //document.getElementById("progress").max = response.list.length;
              $("#alertUFG,#alertRGM,#alertUG,#alertCGU").text("Loading all groups : "+hiveArrays.allGroups.indexOf(group));
            });
            
			if (response.getNextPage)
			{
                var requestNextPage = response.getNextPage();
				nextGroups(requestNextPage);
                
			}
			if(!response.getNextPage)
			{
				//document.getElementById("lGrps").innerHTML = "Loaded: "+hiveArrays.allGroups.length;
				$("#alertUFG,#alertRGM").text("Total Groups Loaded: "+hiveArrays.allGroups.length);
				document.getElementById("lineUpUsers").disabled = false;
				$( "#alertUFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success" ).fadeOut(2000);

				
			}
		}
		
    });
	
}
//end get all groups

/***************************************************************************************************************************
Group validations
****************************************************************************************************************************/

//Validate group name
$(function()
{
	$("input[id='addAll']").keyup(function()
    {
	  group.groupName = $("#addAll").val();
	  $("input[id='addAll']").css("color", "black");
		
        $.each(hiveArrays.allGroups, function(index, value)
        {
	      if(value.name == group.groupName)
			{
				$("input[id='addAll']").css("color", "green");
		        
				return group.groupName;
			}
	    
       });
		
	});
	
});//End validate group name

//Validate input2
$(function()
{
	$("input[id='input2']").keyup(function()
    {
	  group.groupName = $("#input2").val();
	  $("input[id='input2']").css("color", "black");
		
        $.each(hiveArrays.allGroups, function(index, value)
        {
	      if(value.name == group.groupName)
			{
				$("input[id='input2']").css("color", "green");
		  		return group.groupName;
			}
	    
       });
		
	});
	
});//End validate input2

//Validate input3
$(function()
{
	$("input[id='input3']").keyup(function()
    {
	  group.groupName = $("#input3").val();
	  $("input[id='input3']").css("color", "black");
		
        $.each(hiveArrays.allGroups, function(index, value)
        {
	      if(value.name == group.groupName)
			{
				$("input[id='input3']").css("color", "green");
                group.groupName = value.name;
                group.placeID = value.placeID;
		  		
			}
	    
       });
		
	});
	
});//End validate input3

//Validate input4
$(function()
{
	$("#typeFormCGU input").on("change", function()
	{
		group.groupTypeCGU=$("input[name=Formtype]:checked", "#typeFormCGU").val();
	});
	
	$("input[id='input4']").keyup(function()
    {
      	group.groupName = $("#input4").val();
		$("input[id='input4']").css("color", "black");
      	
      	$.each(hiveArrays.allGroups, function(index, value)
        {
	      if(value.name == group.groupName)
			{
				$("input[id='input4']").css("color", "green");
                group.placeID = value.placeID;
                //group.groupType = value.groupType;
                //group.groupName = value.name;	
			}
	    
       });  
		
	});
	
});//End validate input4

//Validate input5
$(function()
{
	$("input[id='input5']").keyup(function()
    {
	  group.sgroupName = $("#input5").val();
	  $("input[id='input5']").css("color", "black");
		
        $.each(hiveArrays.allSGroups, function(index, value)
        {
	      if(value.name == group.sgroupName)
			{
				$("input[id='input5']").css("color", "green");
		  		group.sgroupName = value.name;
				group.sGrpID = value.id;
			}
	    
       });
		
	});
	
});//End validate input5

//Get all people
$(function()
{
	$("#lineUpUsers").click(function()
	{
		var request = osapi.jive.corev3.people.getAll({fields:'@all',count:20});
		nextPage(request);
		hiveArrays.allPeople.length=0;
		$("#alertUFG").text("Loading...");
		$( "#alertUFG.success" ).fadeIn();
	});
});
function nextPage(request)
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
			$(response.list).each(function(index,person)
			{
			  hiveArrays.allPeople.push(person);
              //document.getElementById("lUsers").innerHTML = "Loading: "+hiveArrays.allPeople.indexOf(person);
              $("#alertUFG").text("Loading all groups : "+hiveArrays.allPeople.indexOf(person));
			  $( "#alertUFG.success" ).fadeOut();
            });
            /*
			if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextPage(requestNextPage);
			}
			if(!response.getNextPage)
			{
				//document.getElementById("lUsers").innerHTML = "Loaded: "+hiveArrays.allPeople.length;
				document.getElementById("addAllButton").disabled = false;
				
			}*/
        }
		//console.log("hiveArrays.allPeople is now " + JSON.stringify(hiveArrays.allPeople));
    });
	
}
//end function get all people

//Add member function
$(function()
{

  $("#addAllButton").click(function()
  {
    var x = 0;
    for(i=0;i<hiveArrays.allGroups.length;i++)
	{
		if(group.groupName == hiveArrays.allGroups[i].name)
		{
            group.objGroup = hiveArrays.allGroups[i];
            x = 1;
            //console.log(JSON.stringify(group.objGroup));
		}
	}
		
	if(x != 1 || group.objGroup == null || group.objGroup == "")
    {
      window.alert("Group not found, enter a valid group name");
    }
    else
    {
      var batchRequests = osapi.newBatch();
      $("#alertUFG").text("Loading...");
      $( "#alertUFG.success" ).fadeIn();
	  $(hiveArrays.allPeople).each(function(index,person)
	   {
		  batchRequests.add
			(
			person,group.objGroup.createMember({
			person:person.toURI(),
			state:"member"})
			)
          //document.getElementById("memCreated").innerHTML = "Members Created: "+hiveArrays.allPeople.indexOf(person);
	   });
		batchRequests.execute(function(response)
		{
			//console.log(JSON.stringify(response));
		});
		$("#alertUFG").text("All members created : "+hiveArrays.allPeople.length);
		$( "#alertUFG.success" ).fadeOut(4000);
		
    }   
  });
});
//end of add member

//Get all members
$(function()
{
	$("#getMem").click(function()
	{
		for(i=0;i<hiveArrays.allGroups.length;i++)
		{
			if(group.groupName == hiveArrays.allGroups[i].name)
			{
				group.objGroup = hiveArrays.allGroups[i];
				break;
				//console.log(JSON.stringify(group.objGroup));
			}
		}
		var request = group.objGroup.getMembers({count:100});
		nextMem(request);
		hiveArrays.groupMem.length=0;
		$("#alertRGM").text("Loading...");
		$( "#alertRGM.success" ).fadeIn();
	});
});

function nextMem(request)
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
			$(response.list).each(function(index,member)
			{
				hiveArrays.groupMem.push(member);
				//document.getElementById("members").innerHTML = "Loading: "+hiveArrays.groupMem.indexOf(member);
				//document.getElementById("tab3a").innerHTML = "Loading: "+hiveArrays.groupMem.indexOf(member);
				$("#alertRGM").text("Loading all members : "+hiveArrays.groupMem.indexOf(member));
			});
			if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextMem(requestNextPage);
			}
			if(!response.getNextPage)
			{
				//document.getElementById("members").innerHTML = "Loaded: "+hiveArrays.groupMem.length;
				//document.getElementById("tab3a").innerHTML = "Loading: "+hiveArrays.groupMem.length;
				//document.getElementById("memDel").innerHTML = "";
				$("#alertRGM").text("All members loaded : "+hiveArrays.groupMem.length);
				$( "#alertRGM.success" ).fadeOut(4000);
			}
        }
		//console.log("hiveArrays.allPeople is now " + JSON.stringify(hiveArrays.allPeople));
    });
}
//End of get all members

//Delete memberships
$(function()
{
	$("#delMem").click(function()
	{
		var batchRequests = osapi.newBatch();
		$("#alertRGM").text("Loading...");
		$( "#alertRGM.success" ).fadeIn();
		$(hiveArrays.groupMem).each(function(index,member)
		{
			batchRequests.add
			(
				member,member.destroy()
			)
			//document.getElementById("memDel").innerHTML = "Deleting members...";
			hiveArrays.groupMem = hiveArrays.groupMem.splice(hiveArrays.groupMem.indexOf(member),1);
			
		});
		batchRequests.execute(function(response)
		{
			//console.log(JSON.stringify(response));
			//document.getElementById("memDel").innerHTML = "Members remaining: "+hiveArrays.groupMem.length;
		});
		$("#alertRGM").text("Members remaining : "+hiveArrays.groupMem.length);
		$( "#alertRGM.success" ).fadeOut(4000);
	});
});
//End of Delete memberships

/***************************************************************************************************************************
Unfollow group members
****************************************************************************************************************************/

//Get followers
$(function()
{
	$("#tab3Get").click(function()
	{
		for(i=0;i<=hiveArrays.allGroups.length;i++)
		{
			if(group.groupName == hiveArrays.allGroups[i].name)
			{
				group.objGroup = hiveArrays.allGroups[i];
				break;
			}
		}
		var request = group.objGroup.getFollowers({fields:"@all",count:100});
		nextFol(request);
        hiveArrays.groupFol.length=0;
        $("#alertUG").text("Loading...");
        $( "#alertUG.success" ).fadeIn();
	});
});

function nextFol(request)
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
				hiveArrays.groupFol.push(follower);
				//document.getElementById("tab3a").innerHTML = "Loading Followers: "+hiveArrays.groupFol.indexOf(follower);
				$("#alertUG").text("Loading followers  : "+hiveArrays.groupFol.indexOf(follower));
			});
			if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextFol(requestNextPage);
			}
			if(!response.getNextPage)
			{
				//document.getElementById("tab3a").innerHTML = "Followers Loaded: "+hiveArrays.groupFol.length;
				$("#alertUG").text("Followers loaded : "+hiveArrays.groupFol.length);
				$( "#alertUG.success" ).fadeOut(4000);
			}
        }
		//console.log("hiveArrays.allPeople is now " + JSON.stringify(hiveArrays.groupFol));
		
		
    });
}
//End of get all followers

//Get Streams
$(function()
{
	
    $("#getStr").click(function()
	{
		document.getElementById("tab3b").innerHTML = "";
		$("#alertUG").text("Loading...");
        $( "#alertUG.success" ).fadeIn();
        if(hiveArrays.groupFol != null&&hiveArrays.groupFol.length>0)
		{
		$(hiveArrays.groupFol).each(function(index,member)
		{
		osapi.jive.core.get(
		{  
			v:"v3",  
			href:"/people/"+member.id+"/streams"
		}).execute(function(response)
		{  
			$(response.list).each(function(index,stream)
			{
				stream.getAssociations({type:"group",fields:"@all"}).execute(function(response)
				{
					$(response.list).each(function(index, association)
					{
						if(association.name == group.groupName || association.placeID == group.placeID)
						{
							group.objID = association.id;
							//document.getElementById("tab3b").innerHTML = "Group ID Found: "+association.id;
							$("#alertUG").text("Association found  : "+association.id);
							$( "#alertUG.success" ).fadeOut(4000);
                            return false;
							
						}
						/*
						else
						{
							document.getElementById("tab3b").innerHTML = "Group ID Not Found:";
							//return;
						}*/
					});
				});
			});
		});
		});
		}//End if
		else
		{
			//document.getElementById("tab3b").innerHTML = "There are no followers in this group:";
			$("#alertUG").text("There are no followers in this group!");
			$( "#alertUG.success" ).fadeOut(4000);

		}
		
	});	
});

//Unfollow members
$(function()
{
	$("#unFollow").click(function()
	{
		$("#alertUG").text("Loading...");
        $( "#alertUG.success" ).fadeIn();
		document.getElementById("tab3c").innerHTML = "";
		$(hiveArrays.groupFol).each(function(index,member)
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
                        var conType = stream.id;
						osapi.jive.core.delete(
						{
							v:"v3",
							href:"/streams/"+conType+"/associations/groups/"+group.objID
						}).execute(function(response)
						{
							//console.log(JSON.stringify(response));
							//document.getElementById("tab3c").innerHTML = "Members Unfollowed!";
							$("#alertUG").text("Members Unfollowed!");
							$( "#alertUG.success" ).fadeOut(4000);
						});
					}
					else
					{
						//document.getElementById("tab3c").innerHTML = "No members unfollowed!";
						$("#alertUG").text("No members unfollowed!");
						$( "#alertUG.success" ).fadeOut(4000);
					}
					
				});
			}); 
		});
	});
});
//End unFollow members

/***************************************************************************************************************************
Change group URL
****************************************************************************************************************************/

//Change group URL
$(function(){
	
	$("#chURL").click(function()
	{
		$("#alertCGU").text("Loading...");
		$( "#alertCGU.success" ).fadeIn();
		var grpURL = $("#grpURL").val();
		osapi.jive.core.put(
		{
			"v":"v3",
			"href":"/places/"+group.placeID,
			"body":{
			"displayName":grpURL,
			"groupType":group.groupTypeCGU
		}
		}).execute(function(response)
		{
			//document.getElementById("tab4").innerHTML = "Group URL Changed!";
			$("#alertCGU").text("Group URL Changed!");
			$( "#alertCGU.success" ).fadeOut(4000);
		});
	});
});
//End change group URL

/***************************************************************************************************************************
Add to security group
****************************************************************************************************************************/

//Get all security groups
$(function()
{
	$("#loadSGrp").click(function()
    {
        var request = osapi.jive.corev3.securityGroups.get({fields:'placeID,name,displayName',count:100});
	    nextSGroups(request);
		hiveArrays.allSGroups.length=0;
    });
});
//end function get all groups

function nextSGroups(request)
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
			$(response.list).each(function(index,group)
			{
			  hiveArrays.allSGroups.push(group);
              document.getElementById("tab5a").innerHTML = "Loading: "+hiveArrays.allSGroups.indexOf(group);
            });
            if (response.getNextPage)
			{
                var requestNextPage = response.getNextPage();
				nextSGroups(requestNextPage);
            }
			if(!response.getNextPage)
			{
			  document.getElementById("tab5a").innerHTML = "Loaded: "+hiveArrays.allSGroups.length;
			}
		}
	});
}
//end get all security groups

//Upload refrences
$(function()
{
	document.getElementById("upload").addEventListener('change', upload);
	function browserSupport()
	{
		var isCompatible = false;
		if(window.File && window.FileReader && window.FileList)
		{
			isCompatible = true;
		}
		return isCompatible;
	}
	function upload(evt)
	{
		if(!browserSupport())
		{
			alert("File upload is not supported by your browser!")
		}
		else
		{
			hiveArrays.lines.length=0;
			var file = evt.target.files[0];
			var reader = new FileReader();
			var references="";
			reader.onload = function(e)
			{
				references = e.target.result;
				var header = references.split(",");
				for(i=0;i<header.length;i++)
				{
					hiveArrays.lines.push(header[i]);
				}
			}
			reader.readAsText(file);
			reader.onerror = function()
			{
				alert("Unable to read"+file.fileName);
			}
			
		}
	}
});
//End upload references

//Add members to security group
$(function()
{
	$("#addSGMem").click(function()
	{
		$(hiveArrays.lines).each(function(index,id)
		{			
			osapi.jive.core.post(
			{
				"v":"v3",
				"href":"/securityGroups/"+group.sGrpID+"/members",
				"body":
				{
					"members":["/people/"+id]
				}
			}).execute(function(response)
			{
				if(response.error)
				{
					var code = response.error.code;
					group.sg_message = response.error.message;
					console.log("Error: "+group.sg_message);
				}
				else
				{
					console.log("Added to security group: "+JSON.stringify(response));
				}
			});
		});
		console.log("hiveArrays.lines: "+hiveArrays.lines);
		console.log("id: "+group.sGrpID);
		
		
	});
});

//End add members to security group
