
/***************************************************************************************************************************
												- Make group public
												- Remove group members
												- Unfollow group
												- Change group URL
												- Add to security group
												- Add google drive
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
		sGrpObj:"",
		sGroup:"",
		googleDSgroup:"",
		groupNameFG:"",
		placeIDFG:"",
		objIDFG:"",
		addToGrpId:"",
		batch:50,
		unfolBatch:20,
		batchMkGrpPub:100,
		batchDelMem:20
	};
var hiveArrays =
	{
		allGroups:[],
		allSGroups:[],
		allPeople:[],
		groupMem:[],
		groupFol:[],
		sGrpData:[],
		allGUsers:[],
		allGID:[],
		allJID:[],
		allsGrpMem:[],
		sGrpDif:[],
		folGrp:[],
		grpMembers:[],
		grpStream:[],
		arrBatch:[],
		unfolArrBatch:[],
		mkGrpPubBatch:[],
		delMemBatch:[]
	};


//Get all groups
$(function()
{
		$("#LoadGroups,#LoadGroupsRGM,#LoadGroupsUG,#LoadGroupsCGU,#LoadGroupsFG").click(function()
		{
        var request = osapi.jive.corev3.groups.get({fields:'placeID,name,displayName',count:100});
		    hiveArrays.allGroups.length=0;
				nextGroups(request);
				$( "#alertUFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success,#alertFG.success" ).fadeIn();

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
	              $("#alertUFG,#alertRGM,#alertUG,#alertCGU,#alertFG").text("Loading all groups : "+hiveArrays.allGroups.indexOf(group));
	          });
	          if (response.getNextPage)
						{
	              var requestNextPage = response.getNextPage();
								nextGroups(requestNextPage);
	          }
						if(!response.getNextPage)
						{
								$("#alertUFG,#alertRGM,#alertUG,#alertCGU,#alertFG").text("Total Groups Loaded: "+hiveArrays.allGroups.length);
								//$( "#alertUFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success,#alertFG.success" ).fadeOut(2000);
								//document.getElementById("lineUpUsers").disabled = false;
								$("#lineUpUsers,#getMem,#tab3Get,#chURL,#inputFG").prop("disabled",false);

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
						}
	       });
		});

});//End validate input4

//Validate security group name
$(function()
{
		$("input[id='sGrpname']").keyup(function()
    {
			  group.sgroupName = $("#sGrpname").val();
			  $("input[id='sGrpname']").css("color", "black");

        $.each(hiveArrays.allSGroups, function(index, value)
        {
			      if(value.name == group.sgroupName)
						{
								$("input[id='sGrpname']").css("color", "green");
						  	group.sgroupName = value.name;
								group.sGrpID = value.id;
								group.sGrpObj = value;
								$("#uploadHID").prop("disabled",false);
						}
				});
		});

});//End validate security group name

//Validate group name for Follow Group
$(function()
{
		$("input[id='inputFG']").keyup(function()
    {
			  group.groupName = $("#inputFG").val();
			  $("input[id='inputFG']").css("color", "black");

        $.each(hiveArrays.allGroups, function(index, value)
        {
			      if(value.name == group.groupName)
						{
							$("input[id='inputFG']").css("color", "green");
							group.groupNameFG = value.name;
							group.placeIDFG = value.placeID;
						}
        });
				document.getElementById("uploadFG").disabled=false;
				document.getElementById("memFG").disabled=false;
		});
});//End validate group name for Follow Group


/***************************************************************************************************************************
												- Make group public
****************************************************************************************************************************/
//Get all people
$(function()
{
		$("#lineUpUsers").click(function()
		{
				var request = osapi.jive.corev3.people.getAll({count:100});
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
							if(!person.jive.externalContributor)
							{
									hiveArrays.allPeople.push(person);
									$("#alertUFG").text("Loading active users : "+hiveArrays.allPeople.indexOf(person));
									//$( "#alertUFG.success" ).fadeOut();
							}
		      });
					if (response.getNextPage)
					{
							var requestNextPage = response.getNextPage();
							nextPage(requestNextPage);
					}
					if(!response.getNextPage)
					{
							$("#alertUFG").text("Loaded all active users : "+hiveArrays.allPeople.length);
							//$( "#alertUFG.success" ).fadeOut(3000);
							document.getElementById("addAllButton").disabled = false;
							//isExternal(hiveArrays.allPeople);
							//console.log(hiveArrays.allPeople.length);
					}
	    }
	});
}
//end function get all people

//check externals
function isExternal(data)
{
    $(data).each(function(index,user)
    {
        if(user.jive.externalContributor)
        {
            console.log(user.displayName+" external: "+user.jive.externalContributor)
        }
        else {
          console.log("No externals in this list!");
        }
    });
}
//End check external

//Add member function
$(function()
{

	  $("#addAllButton").click(function()
	  {
				$("#alertUFG").text("Loading...");
				var x = 0;
		    for(i=0;i<hiveArrays.allGroups.length;i++)
				{
						if(group.groupName == hiveArrays.allGroups[i].name)
						{
		            group.addToGrpId = hiveArrays.allGroups[i].placeID;
		            x = 1;
		            //console.log(JSON.stringify(group.objGroup));
						}
				}
				if(x != 1 || group.addToGrpId == null || group.addToGrpId == "")
		    {
			      window.alert("Group not found, enter a valid group name");
		    }
		    else
		    {

					for(i=0;i<hiveArrays.allPeople.length;i+=group.batchMkGrpPub)
					{
							hiveArrays.mkGrpPubBatch.push(hiveArrays.allPeople.slice(i,i+group.batchMkGrpPub));

					}

					for(i=0;i<hiveArrays.mkGrpPubBatch.length;i++)
					{
							(function(x)
							{
									setTimeout(function()
									{
											$(hiveArrays.mkGrpPubBatch[x]).each(function(index,person)
											{
													osapi.jive.core.post(
														{
																"v":"v3",
																"href":"/members/places/"+group.addToGrpId,
																"body":{
																	"person":person.toURI(),
																	"state":"member"
																}

														}
													).execute(function(response)
													{
															if(response.error)
															{
																	var message = response.error.message;
																	$("#alertUFG").text(message);
															}
															else if(x == hiveArrays.mkGrpPubBatch.length-1) {
																	$("#alertUFG").text("All members created : "+hiveArrays.allPeople.length);
															}
															else {
																$("#alertUFG").text("Completed batch: "+x+" of "+hiveArrays.mkGrpPubBatch.length);
															}

													});

											});
									},30000*x);

							})(i);

					}
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
				{
						window.alert("Please enter a valid group name!");
				}
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
								//$( "#alertRGM.success" ).fadeOut(4000);
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
					for(i=0;i<hiveArrays.groupMem.length;i+=group.batchDelMem)
					{
							hiveArrays.delMemBatch.push(hiveArrays.groupMem.slice(i,i+group.batchDelMem));

					}
					for(i=0;i<hiveArrays.delMemBatch.length;i++)
					{
							(function(x)
							{
									setTimeout(function()
									{
											$(hiveArrays.delMemBatch[x]).each(function(index,member)
											{
													osapi.jive.core.delete(
														{
																"v":"v3",
																"href":"/members/"+member.id

														}
													).execute(function(response)
													{
															if(response.error)
															{
																	var message = response.error.message;
																	$("#alertRGM").text(message);
															}
															else if(x == hiveArrays.delMemBatch.length-1) {
																	$("#alertRGM").text("All members removed : "+hiveArrays.groupMem.length);
															}
															else {
																$("#alertRGM").text("Completed batch: "+x+" of "+hiveArrays.delMemBatch.length);

															}

													});

											});
									},30000*x);

							})(i);

					}
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
								//$( "#alertUG.success" ).fadeOut(4000);
								document.getElementById("getStr").disabled = false;
								document.getElementById("downFol").disabled = false;
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

		    if(hiveArrays.groupFol.length>0)
				{
						osapi.jive.core.get(
						{
							v:"v3",
							href:"/people/"+hiveArrays.groupFol[0].id+"/streams"
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
		                            return false;
														}
												});
										});
								});
						});
				}//End if
				else
				{
					$("#alertUG").text("There are no followers in this group!");

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
				$("#alertUG").text("Loading...");
				for(i=0;i<hiveArrays.groupFol.length;i+=group.unfolBatch)
				{
						hiveArrays.unfolArrBatch.push(hiveArrays.groupFol.slice(i,i+group.unfolBatch));
				}
				for(j=0;j<hiveArrays.unfolArrBatch.length;j++)
				{
						(function(y)
						{
								setTimeout(function()
								{
									if(group.objID == null || group.objID == "")
									{
											window.alert("Group association not found! Load Followers again");
									}
									else
									{

											$(hiveArrays.unfolArrBatch[y]).each(function(index,member)
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
																						href:"/streams/"+connStream+"/associations/groups/"+group.objID
																				}).execute(function(response)
																				{

																						if(response.error)
																						{
																								var message = response.error.message;
																								$("#alertUG").text(message);
																						}
																						else if(hiveArrays.unfolArrBatch.length-1 == y)
																						{
																								$("#alertUG").text("Unfollow Completed!");
																						}
																						else
																						{
																								$("#alertUG").text("Unfollowed Batch : "+y+" of: "+hiveArrays.unfolArrBatch.length);
																						}

																				});
																		}
																		else if(stream.source == "communications")
																		{
																			var commStream = stream.id;
																			osapi.jive.core.delete(
																			{
																					v:"v3",
																					href:"/streams/"+commStream+"/associations/groups/"+group.objID
																			}).execute(function(response)
																			{

																					if(response.error)
																					{
																							var message = response.error.message;
																							$("#alertUG").text(message);
																					}
																					else if(hiveArrays.unfolArrBatch.length-1 == y)
																					{
																							$("#alertUG").text("Unfollow Completed!");
																					}
																					else
																					{
																							$("#alertUG").text("Unfollowed Batch: "+y+" of: "+hiveArrays.unfolArrBatch.length);

																					}

																			});
																		}
																		else
																		{
																				$("#alertUG").text("No Streams found!");

																		}
															});
													});
											});
									}//end else
								},30000*y);
						})(j);
				}

		});
});
//End unFollow members

//Download Followers
$(function()
{
		$("#downFol").click(function()
		{
				var folArr=[];
				for(i=0;i<hiveArrays.groupFol.length;i++)
				{
						folArr.push(hiveArrays.groupFol[i].displayName)
				}
				var csvCont = "data:text/csv;charset=utf-8,";
				dataString = folArr.join(",");
				csvCont += dataString;

				var encodedUri = encodeURI(csvCont);
				var link = document.createElement("a");

				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "Group Followers.csv");
				document.body.appendChild(link);
				link.click();
		});
});
//End download Followers

/***************************************************************************************************************************
Change group URL
****************************************************************************************************************************/

//Change group URL
$(function()
{
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
	$("#loadSGrp,#loadSGrpGD").click(function()
    {
        var request = osapi.jive.corev3.securityGroups.get({fields:'placeID,name,displayName',count:100});
		    nextSGroups(request);
				hiveArrays.allSGroups.length=0;
				$("#alertASG,#alertGoogleDri").text("Loading...");
	      $( "#alertASG.success,#alertGoogleDri" ).fadeIn();
    });
});

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
							  $("#alertASG,#alertGoogleDri").text("Loading: "+hiveArrays.allSGroups.indexOf(group));

	          });
            if (response.getNextPage)
						{
                var requestNextPage = response.getNextPage();
								nextSGroups(requestNextPage);
            }
						if(!response.getNextPage)
						{
							  //document.getElementById("tab5a").innerHTML = "Loaded: "+hiveArrays.allSGroups.length;
							  $("#alertASG,#alertGoogleDri").text("Loaded: "+hiveArrays.allSGroups.length);
								$("#sGrpname").prop("disabled",false);
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
		 		if(hiveArrays.sGrpData.length == 0)
				{
					alert("The list is empty!")
				}
				else
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
	 		             $("#alertASG").text("Error: "+group.sg_message);
	 		         }
	 		         else
	 		         {
	 		             $("#alertASG").text("Added Members: "+hiveArrays.sGrpData.length);

	 		         }
	 		     });
				}//End else
	   });
});
//End add members to security group

/***************************************************************************************************************************
Add google drive
****************************************************************************************************************************/
//Get all Google Drive group members
$(function()
{
		$("#getGoogleUsers").click(function()
		{
				var sGrpRes = osapi.jive.core.get(
				{
						"v":"v3",
						"href":"/securityGroups/1059/members",
						"count":100
				});
				getGDMem(sGrpRes);
				$("#alertGoogleDri").text("Loading...");
				$( "#alertGoogleDri.success" ).fadeIn();
		});
});

function getGDMem(request)
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
								hiveArrays.allsGrpMem.push(member.id);
								$("#alertGoogleDri").text("Identifying member: "+response.list.indexOf(member));
						});
						if (response.getNextPage)
						{
								var NextPage = response.getNextPage();
								getGDMem(NextPage);
						}
						if(!response.getNextPage)
						{
								$("#alertGoogleDri").text("Identified : "+hiveArrays.allsGrpMem.length);
								//$( "#alertGoogleDri.success" ).fadeOut(3000);
								getSgroup();
						}
				}
		});
}
//End get all Google Drive group members
function getSgroup()
{
			$("#alertGoogleDri").text("Loading Google Drive security group...");
			//$( "#alertGoogleDri.success" ).fadeIn();
			osapi.jive.core.get(
			{
					"v":"v3",
					"href":"/securityGroups/1059"
			}).execute(function(response)
			{
					if(response.error)
					{
							var code = response.error.code;
							group.sg_message = response.error.message;
							$("#alertGoogleDri").text("Error: "+group.sg_message);
					}
					else
					{
							group.googleDSgroup = response;
							$("#alertGoogleDri").text("Loaded: "+response.name);
							//console.log(response.name);
							//$( "#alertGoogleDri.success" ).fadeOut();
							getJiD();
					}
			});
}

function getJiD()
{
			$("#alertGoogleDri").text("Loading from UDE...");
			$.getJSON('https://sidm.springernature.com/api/v2.0/users?filter[where][services]=946?fields=empid',function(data)
			{
					if(data.info.length < 4)
					{
							$("#uploadJIDs").prop("disabled",false);

							$("#uploadJIDs").change(function(evt)
							{
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
										hiveArrays.allJID = hiveArrays.sGrpData;
										getDiff();
							});
					}
					else
					{
							$(data.info).each(function(index,id)
							{
									hiveArrays.allGID.push(id.empid);
									$.getJSON('https://sidm.springernature.com/api/v2.0/modules/jive/external/jive/search/'+id.empid,function(data)
									{
											hiveArrays.allJID.push(data.id);
											$("#alertGoogleDri").text("Identifying Jive ID: "+data.id);
									});
							});
							$("#alertGoogleDri").text("Identified IDs: "+hiveArrays.allJID.length);
							$("#alertGoogleDri").text("Identifying new members...");
							setTimeout(function(){ getDiff(); }, 420000);
					}

			}).fail(function(data)
			{
					alert("Error occured reading from UDE: "+data);
			});
}
function getDiff()
{
		hiveArrays.sGrpDif = hiveArrays.allJID.filter(function(el)
		{
				return !hiveArrays.allsGrpMem.includes(el);
		});
		$("#alertGoogleDri").text("Identified members: "+hiveArrays.sGrpDif.length);
		$("#downJidDiff").prop("disabled",false);

		if(hiveArrays.sGrpDif.length == 0)
		{
			alert("The list is empty!")
		}
		else
		{
				 var batchRequests = osapi.newBatch();
				 $("#alertGoogleDri").text("Adding new members...");
				 $( "#alertGoogleDri.success" ).fadeIn();
				 $(hiveArrays.sGrpDif).each(function(index,id)
				 {
					 batchRequests.add
						(
								id,group.googleDSgroup.createMembers(["/people/"+id])
						)
				 });
				batchRequests.execute(function(response)
				 {
						 if(response.error)
						 {
								 var code = response.error.code;
								 group.sg_message = response.error.message;
								 $("#alertGoogleDri").text("Error: "+group.sg_message);
						 }
						 else
						 {
								 $("#alertGoogleDri").text("New Added Members: "+hiveArrays.sGrpDif.length);
								 //$("#alertGoogleDri.success" ).fadeOut(3000);
						 }
				 });
		}//End else
}

//Download Jive ID
$(function()
{
	$("#downJidDiff").click(function()
	{
		var csvCont = "data:text/csv;charset=utf-8,";
		dataString = hiveArrays.sGrpDif.join(",");
		csvCont += dataString;

		var encodedUri = encodeURI(csvCont);
		var link = document.createElement("a");

		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "Jive ID Difference.csv");
		document.body.appendChild(link);
		link.click();
	});
});
//End download Jive ID

/***************************************************************************************************************************
Follow group
****************************************************************************************************************************/
$("#uploadFG").change(function(evt)
{
			var file = evt.target.files[0];
			var reader = new FileReader();
			var references="";
			reader.onload = function(e)
			{
				references = e.target.result;
				var header = references.split(",");
				for(i=0;i<header.length;i++)
				{
					hiveArrays.folGrp.push(header[i]);
				}
			}
			reader.readAsText(file);
			reader.onerror = function()
			{
				alert("Unable to read"+file.fileName);
			}
			document.getElementById("follow").disabled=false;

});

//Get all members
$(function()
{

		$("#memFG").click(function()
		{
				$("#alertFG").text("Loading...");
				$( "#alertFG.success" ).fadeIn();
				var grpMem = osapi.jive.core.get(
					{
						"v":"v3",
						"href":"/members/places/"+group.placeIDFG
					});
					getGrpMem(grpMem);
		});

});
function getGrpMem(request)
{
		request.execute(function(response)
		{
				if(response.error)
				{
						var message = response.error.message;
						$("#alertFG").text(message);
				}
				else if (!response.list) {
						$("#alertFG").text("Response is not a list!");

				}
				else {
					$(response.list).each(function(index,member)
					{
							hiveArrays.grpMembers.push(member);

							if(response.nextPage)
							{
									var nextRes = response.getNextPage();
									getGrpMem(nextRes);
							}
							else {
									$("#alertFG").text("Members found: "+hiveArrays.grpMembers.length);
									hiveArrays.folGrp = hiveArrays.grpMembers;
									document.getElementById("lStrFG").disabled=false;
							}
					});
				}
		});
}

$(function()
{
		$("#follow").click(function()
		{

					$("#alertFG").text("Loading...");
					$( "#alertFG.success" ).fadeIn();

					for(i=0;i<hiveArrays.folGrp.length;i+=group.batch)
					{
							hiveArrays.arrBatch.push(hiveArrays.folGrp.slice(i,i+group.batch));
							//return hiveArrays.arrBatch;
					}

					for(i=0;i<hiveArrays.arrBatch.length;i++)
					{
							(function(x)
							{
									setTimeout(function()
									{
										$(hiveArrays.arrBatch[x]).each(function(index,member)
										{
												osapi.jive.core.get(
												{
														v:"v3",
														href:"/people/"+member+"/streams"
												}).execute(function(response)
												{
														$(response.list).each(function(index,stream)
														{
																	if(stream.source == "connections")
																	{
																			var conType = stream.id;
																			osapi.jive.core.post(
																			{
																					"v":"v3",
																					"href":"/streams/"+conType+"/associations",
																					"body":["/places/"+group.placeIDFG]

																			}).execute(function(response)
																			{
																					if(response.error)
																					{
																							var message = response.error.message;
																							$("#alertFG").text("Error: "+message);
																					}
																					else {
																							$("#alertFG").text(JSON.stringify(response));
																							$("#alertFG").text("Completed Batch: "+x+" of "+hiveArrays.arrBatch.length);

																							if(hiveArrays.arrBatch.length-1 == x)
																							{
																									$("#alertFG").text("Completed!");
																							}
																					}
																			});
																	}
																	else if(stream.source == "communications")
																	{
																			var conTypeComms = stream.id;
																			osapi.jive.core.post(
																			{
																					"v":"v3",
																					"href":"/streams/"+conTypeComms+"/associations",
																					"body":["/places/"+group.placeIDFG]

																			}).execute(function(response)
																			{
																					if(response.error)
																					{
																							var message = response.error.message;
																							$("#alertFG").text("Error: "+message);
																					}
																					else
																					{
																							$("#alertFG").text(JSON.stringify(response));
																							$("#alertFG").text("Completed Batch: "+x+" of: "+hiveArrays.arrBatch.length);

																							if(hiveArrays.arrBatch.length-1 == x)
																							{
																									$("#alertFG").text("Completed!");
																							}

																					}
																			});
																	}
																	else
																	{
																			$("#alertFG").text("Stream not found!");

																	}
														});
												});
										});
									},60000*x);
							})(i);

					}
		});
});
