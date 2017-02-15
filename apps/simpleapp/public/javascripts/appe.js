
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
		sGrpID:"",
		sGrpObj:""
	};
var hiveArrays = 
	{
		allGroups:[],
		allSGroups:[],
		allPeople:[],
		groupMem:[],
		groupFol:[],
		sGrpData:[]
	};

	
//Get all groups
$(function()
{
	$("#LoadGroups,#LoadGroupsRGM,#LoadGroupsUG,#LoadGroupsCGU").click(function()
	{
        var request = osapi.jive.corev3.groups.get({fields:'placeID,name,displayName',count:100});
	    hiveArrays.allGroups.length=0;
		nextGroups(request);
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
              $("#alertUFG,#alertRGM,#alertUG,#alertCGU").text("Loading all groups : "+hiveArrays.allGroups.indexOf(group));
            });
            if (response.getNextPage)
			{
                var requestNextPage = response.getNextPage();
				nextGroups(requestNextPage);
            }
			if(!response.getNextPage)
			{
				$("#alertUFG,#alertRGM,#alertUG,#alertCGU").text("Total Groups Loaded: "+hiveArrays.allGroups.length);
				$( "#alertUFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success" ).fadeOut(2000);
				//document.getElementById("lineUpUsers").disabled = false;
				$("#lineUpUsers,#getMem,#tab3Get,#chURL").prop("disabled",false);
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
				group.sGrpObj = value;
			}
	    
		});
		
	});
	
});//End validate input5
/***************************************************************************************************************************
												- Make group public
****************************************************************************************************************************/
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
              $("#alertUFG").text("Loading active users : "+hiveArrays.allPeople.indexOf(person));
			  $( "#alertUFG.success" ).fadeOut();
            });
            
			if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextPage(requestNextPage);
			}
			if(!response.getNextPage)
			{
				$("#alertUFG").text("Loaded all active users : "+hiveArrays.allPeople.length);
				$( "#alertUFG.success" ).fadeOut(3000);
				document.getElementById("addAllButton").disabled = false;
			}
        }
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
/***************************************************************************************************************************
												- Remove group members
****************************************************************************************************************************/
//Get all members
$(function()
{
	$("#getMem").click(function()
	{
		if(group.groupName == "" || group.groupName == null)
		{window.alert("Please enter a valid group name!");}
		else
		{
			for(i=0;i<hiveArrays.allGroups.length;i++)
			{
				if(group.groupName == hiveArrays.allGroups[i].name)
				{
					group.objGroup = hiveArrays.allGroups[i];
					break;
					
				}
			}
			var request = group.objGroup.getMembers({count:100});
			nextMem(request);
			hiveArrays.groupMem.length=0;
			$("#alertRGM").text("Loading...");
			$( "#alertRGM.success" ).fadeIn();
		}
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
				$("#alertRGM").text("Loading all members : "+hiveArrays.groupMem.indexOf(member));
			});
			if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextMem(requestNextPage);
			}
			if(!response.getNextPage)
			{
				$("#alertRGM").text("All members loaded : "+hiveArrays.groupMem.length);
				$( "#alertRGM.success" ).fadeOut(4000);
				document.getElementById("delMem").disabled = false;
			}
        }
		
    });
}
//End of get all members

//Delete memberships
$(function()
{
	$("#delMem").click(function()
	{
		if(hiveArrays.groupMem.length==0)
		{
			window.alert("No members found!");
		}
		else
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
				hiveArrays.groupMem = hiveArrays.groupMem.splice(hiveArrays.groupMem.indexOf(member),1);
				
			});
			batchRequests.execute(function(response)
			{
				
			});
			$("#alertRGM").text("Members remaining : "+hiveArrays.groupMem.length);
			$( "#alertRGM.success" ).fadeOut(4000);
		}
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
		if(group.groupName == "" || group.groupName == null)
		{
			window.alert("Please enter a valid group name!");
		}
		else
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
		}
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
				$("#alertUG").text("Followers loaded : "+hiveArrays.groupFol.length);
				$( "#alertUG.success" ).fadeOut(4000);
				document.getElementById("getStr").disabled = false;
			}
        }
		
    });
}
//End of get all followers

//Get Streams
$(function()
{
	
    $("#getStr").click(function()
	{
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
							$("#alertUG").text("Association found  : "+association.id);
							$( "#alertUG.success" ).fadeOut(4000);
                            return false;
						}
					});
				});
			});
		});
		});
		}//End if
		else
		{
			$("#alertUG").text("There are no followers in this group!");
			$( "#alertUG.success" ).fadeOut(4000);

		}
		document.getElementById("unFollow").disabled=false;
	});	
});
//End get streams

//Unfollow members
$(function()
{
	$("#unFollow").click(function()
	{
		if(group.objID == null || group.objID == "")
		{
			window.alert("Group association not found! Load Followers again");
		}
		else
		{
			$("#alertUG").text("Loading...");
			$( "#alertUG.success" ).fadeIn();
			
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
								$("#alertUG").text("Members Unfollowed!");
								$( "#alertUG.success" ).fadeOut(4000);
							});
						}
						else
						{
							$("#alertUG").text("No members unfollowed!");
							$( "#alertUG.success" ).fadeOut(4000);
						}
						
					});
				}); 
			});
		}//end else
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
		$("#alertASG").text("Loading...");
      $( "#alertASG.success" ).fadeIn();
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
              //document.getElementById("tab5a").innerHTML = "Loading: "+hiveArrays.allSGroups.indexOf(group);
			  $("#alertASG").text("Loading: "+hiveArrays.allSGroups.indexOf(group));
			
            });
            if (response.getNextPage)
			{
                var requestNextPage = response.getNextPage();
				nextSGroups(requestNextPage);
            }
			if(!response.getNextPage)
			{
			  //document.getElementById("tab5a").innerHTML = "Loaded: "+hiveArrays.allSGroups.length;
			  $("#alertASG").text("Loaded: "+hiveArrays.allSGroups.length);
			  $( "#alertASG.success" ).fadeOut(3000);
			}
		}
	});
}
//end get all security groups

//Upload Hive ID
$(function()
{
	document.getElementById("uploadHID").addEventListener('change', upload);
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
			hiveArrays.sGrpData.length=0;
			var file = evt.target.files[0];
			var reader = new FileReader();
			var references="";
			reader.onload = function(e)
			{
				references = e.target.result;
				var header = references.split(",");
				for(i=0;i<header.length;i++)
				{
					hiveArrays.sGrpData.push(header[i]);
				}
			}
			reader.readAsText(file);
			reader.onerror = function()
			{
				alert("Unable to read"+file.fileName);
			}
		$("#addSGMem").prop("disabled",false);
		}
	}
});
//End upload references

//Add members to security group
$(function()
{
	$("#addSGMem").click(function()
	{
		var batchRequests = osapi.newBatch();
		$("#alertASG").text("Loading...");
		$( "#alertASG.success" ).fadeIn();
		$(hiveArrays.sGrpData).each(function(index,id)
		{
			batchRequests.add
			(
				id,group.sGrpObj.createMembers(["/people/"+id])
			)
		});
		
		batchRequests.execute(function(response)
		{
			if(response.error)
			{
				var code = response.error.code;
				group.sg_message = response.error.message;
				//console.log("Error: "+group.sg_message);
				$("#alertASG").text("Error: "+group.sg_message);
			}
			else
			{
				//document.getElementById("tab5a").innerHTML = "All Members added: "+hiveArrays.sGrpData.length;
				//console.log("Added to security group: "+JSON.stringify(response));
				$("#alertASG").text("All Members added: "+hiveArrays.sGrpData.length);
				$("#alertASG.success" ).fadeOut(3000);
			}
			
		});
		
	});
});
//End add members to security group
