
/***************************************************************************************************************************
												- Make group public
												- Remove group members
												- Unfollow group
												- Change group URL
												- Add to security group
												- Add google drive
****************************************************************************************************************************/
var group = {
	sgroupName:undefined,
	objID:undefined,
	sGrpID:undefined,
	sGrpObj:undefined,
	batch:50,
	unfolBatch:20,
	batchMkGrpPub:100,
	batchDelMem:20,
	objectGroup:undefined
};
var hiveArrays = {
	allSGroups:[],
	allPeople:[],
	groupMem:[],
	groupFol:[],
	sGrpData:[],
	folGrp:[],
	grpMembers:[],
	arrBatch:[],
	unfolArrBatch:[],
	mkGrpPubBatch:[],
	delMemBatch:[],
	folGrpBatch:[],
	folGrpId:[],
	sGrpId:[],
	allActiveUsers:[]
};

//Get all groups
$(function(){
	$("#LoadGroups,#LoadGroupsRGM,#LoadGroupsUG,#LoadGroupsCGU,#LoadGroupsFG").click(function(){
		osapi.jive.corev3.places.requestPicker({  
			type : "group",  
			success : function(data) {  
			// "data" will be the Space object (in this case) selected by the user 
				group.objectGroup = data;
				if(group.objectGroup !== undefined){
					$("#lineUpUsers,#getMem,#tab3Get,#chURL,#inputFG,#uploadFG,#memFG,#follow").prop("disabled",false);
					$( "#alertUFG.success,#alertFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success,#alertASG.success" ).fadeIn();
					$("#alertFG,#alertUFG,#alertRGM,#alertUG,#alertCGU,#alertASG").text( "Group selected: " + group.objectGroup.name );
				}
			}  
		});
		// group.objectGroup = app.getPlace("group");
	});
});
//end function get all groups

/***************************************************************************************************************************
													Group validations
****************************************************************************************************************************/

//Validate security group name
$(function(){
	$("input[id='sGrpname']").keyup(function(){
		group.sgroupName = $("#sGrpname").val();
		$("input[id='sGrpname']").css("color", "black");
        $.each(hiveArrays.allSGroups, function(index, value){
			if(value.name == group.sgroupName){
				$("input[id='sGrpname']").css("color", "green");
				group.sgroupName = value.name;
				group.sGrpID = value.id;
				group.sGrpObj = value;
				$("#uploadHID").prop("disabled",false);
			}
		});
	});
});//End validate security group name

/***************************************************************************************************************************
												- Make group public
****************************************************************************************************************************/
//Get all people
$(function(){
	$("#lineUpUsers").click(function(){
		var request = osapi.jive.corev3.people.getAll({count:100});
		nextPage(request);
		hiveArrays.allPeople.length=0;
		$("#alertUFG").text("Loading...");
		// $( "#alertUFG.success" ).fadeIn();
	});
});
function nextPage(request){
	request.execute(function(response){
		if(response.error){
			var code = response.error.code;
			var message = response.error.message;
			$("#alertUFG").text(message);
		}
		else if (!response.list){
			$("#alertUFG").text("Error: response is not a list");
		}
		else{
			$(response.list).each(function(index,person){
				if(!person.jive.externalContributor){
					hiveArrays.allPeople.push(person);
					$("#alertUFG").text("Loading active users : "+hiveArrays.allPeople.indexOf(person));
				}
			});
			if (response.getNextPage){
				var requestNextPage = response.getNextPage();
				nextPage(requestNextPage);
			}
			else{
				$("#alertUFG").text("Loaded all active users : "+hiveArrays.allPeople.length);
				document.getElementById("addAllButton").disabled = false;
			}
		}
	});
}
//end function get all people

//check externals
function isExternal(data){
    $(data).each(function(index,user){
        if(user.jive.externalContributor){
            console.log(user.displayName+" external: "+user.jive.externalContributor)
        }
        else {
          console.log("No externals in this list!");
        }
    });
}
//End check external

//Add member function
$(function(){
	$("#addAllButton").click(function(){
		$("#alertUFG").text("Loading...");
		var x = 0;
		if(x != 1 || group.objectGroup === null){
				window.alert("Please pick a group");
		}
		else{
			var i,j;
			for(j=0;j<hiveArrays.allPeople.length;j+=group.batchMkGrpPub){
				hiveArrays.mkGrpPubBatch.push(hiveArrays.allPeople.slice(j,j+group.batchMkGrpPub));
			}
			for(i=0;i<hiveArrays.mkGrpPubBatch.length;i++){
				(function(x){
					setTimeout(function(){
						$(hiveArrays.mkGrpPubBatch[x]).each(function(index,person){
							osapi.jive.core.post({
								"v":"v3",
								"href":"/members/places/"+group.objectGroup.placeID,
								"body":{
									"person":person.toURI(),
									"state":"member"
								}
							}
							).execute(function(response){
								if(response.error){
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
$(function(){
	$("#getMem").click(function(){
		if(group.objectGroup === null){
			window.alert("Please enter a valid group name!");
		}
		else{
			var request = group.objectGroup.getMembers({count:100});
			nextMem(request);
			hiveArrays.groupMem.length=0;
			$("#alertRGM").text("Loading...");
		}
	});
});

function nextMem(request){
	request.execute(function(response){
		if(response.error){
			$("#alertRGM").text(response.error.message);
		}
		else if (!response.list){
			$("#alertRGM").text("Error: response is not a list");
		}
		else {
			$(response.list).each(function(index,member){
				hiveArrays.groupMem.push(member);
				$("#alertRGM").text("Loading all members : "+hiveArrays.groupMem.indexOf(member));
			});
			if (response.getNextPage){
				var requestNextPage = response.getNextPage();
				nextMem(requestNextPage);
			}
			else {
				$("#alertRGM").text("All members loaded : "+hiveArrays.groupMem.length);
				document.getElementById("delMem").disabled = false;
			}
        }
    });
}
//End of get all members

//Delete memberships
$(function(){
	$( "#delMem" ).click(function() {
		if( hiveArrays.groupMem.length === 0 ){
			$("#alertRGM").text("No members found!");
		}
		else {
			(function(){
				if ( hiveArrays.delMemBatch.length > 0 ){ hiveArrays.delMemBatch.length = 0; }
				var i;
				for ( i = 0; i < hiveArrays.groupMem.length; i += group.batchDelMem ){
					hiveArrays.delMemBatch.push( hiveArrays.groupMem.slice( i , i + group.batchDelMem ));
				}
				delete_members();
			})();
		}
	});
});
//End of Delete memberships

//Delete members function implementaion
function delete_members(){
	var i;
	for( i = 0; i < hiveArrays.delMemBatch.length; i++ ){
		(function(x){
			setTimeout(function(){
				$(hiveArrays.delMemBatch[x]).each(function(index,member){
					osapi.jive.core.delete({
							"v":"v3",
							"href":"/members/"+member.id
						}
					).execute(function(response){
						if(response.error){
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

/***************************************************************************************************************************
Unfollow group members
****************************************************************************************************************************/

//Get followers button pressed
$(function(){
	$("#tab3Get").click(function(){
		if(group.objectGroup == null){
			alert("Please pick a group first!");
		}
		else{
			hiveArrays.groupFol.length = 0;
			var request = group.objectGroup.getFollowers({fields:"@all",count:100});
			get_grp_followers(request);
			$("#alertUG").text( "Loading followers  : " + hiveArrays.groupFol.length );
		}
	});
});

//Get followers function logic
function get_grp_followers(request){
	request.execute(function(response){
		if(response.error){
			$("#alertUG").text( response.error.message );
		}
		else if ( !response.list ){
			$("#alertUG").text( "Response is not a list..." );
		}
		else{
			$("#alertUG").text( "Loading followers  : " + hiveArrays.groupFol.length );
			$(response.list).each(function(index,follower){
				hiveArrays.groupFol.push(follower);
			});
			if ( response.getNextPage ){
				var requestNextPage = response.getNextPage();
				get_grp_followers(requestNextPage);
			}
			else{
				$( "#alertUG" ).text( "Followers loaded : " + hiveArrays.groupFol.length );
				$( "#downFol" ).prop( "disabled",false );
			}
		}
    });
}
//End of get all followers

//Get Stream
$(function(){
	$("#getStr").click(function(){
		$("#alertUG").text("Loading streams...");
		if( hiveArrays.groupFol.length > 0 ){
			$(hiveArrays.groupFol).each(function(index,person){
				osapi.jive.core.get({
					"v" : "v3",
					"href" : "/people/" + person.id + "/streams"
				}).execute(function(response){
					$(response.list).each(function(index,stream){
						stream.getAssociations({type:"group",fields:"@all"}).execute(function(response){
							$(response.list).each(function(index, association){
								if(association.name === group.objectGroup.name && association.placeID === group.objectGroup.placeID){
									group.objID = association.id;
									$( "#alertUG" ).text( "Association found  : " + association.id );
									return false;
								}
							});
						});
					});
				});
				if( hiveArrays.groupFol.length - 1 === index && group.objID === undefined ){
					$( "#alertUG" ).text( "Association not found" );
				}
			});
		}//End if
		else{
			$("#alertUG").text("There are no followers in this group!");
		}
	});
});
//End get streams

//Unfollow members
$(function(){
	$("#unFollow").click(function(){
		$("#alertUG").text("Unfollowing...");
		(function(){
			hiveArrays.unfolArrBatch.length = 0;
			var i;
			for( i = 0; i < hiveArrays.groupFol.length; i += group.unfolBatch ){
				hiveArrays.unfolArrBatch.push(hiveArrays.groupFol.slice( i, i + group.unfolBatch ));
			}
		})();
		(function(){
			var j;
			for( j = 0; j < hiveArrays.unfolArrBatch.length; j++ ){
				(function(y){
					setTimeout(function(){
						if(group.objID === undefined){
							window.alert("Group association not found! Load Followers again");
						}
						else{
							$(hiveArrays.unfolArrBatch[y]).each(function(index,member){
								osapi.jive.core.get(
								{
									v:"v3",
									href:"/people/"+member.id+"/streams"
								}).execute(function(response){
									$(response.list).each(function(index,stream){
										if(stream.source == "connections"){
											var connStream = stream.id;
											osapi.jive.core.delete({
												v:"v3",
												href:"/streams/"+connStream+"/associations/groups/"+group.objID
											}).execute(function(response){
												if(response.error){
													if(response.error.code !== "objectInvalidURI"){
														$("#alertUG").text(response.error.message);
													}
												}
												else if(hiveArrays.unfolArrBatch.length-1 == y){
													$("#alertUG").text("Unfollow Completed!");
												}
												else{
													$("#alertUG").text("Unfollowed Batch : "+y+" of: "+hiveArrays.unfolArrBatch.length);
												}
											});
										}
										if(stream.source == "communications"){
											var commStream = stream.id;
											osapi.jive.core.delete(
											{
												v:"v3",
												href:"/streams/"+commStream+"/associations/groups/"+group.objID
											}).execute(function(response){
												if(response.error){
													if(response.error.code !== "objectInvalidURI"){
														$("#alertUG").text(response.error.message);
													}
												}
												else if(hiveArrays.unfolArrBatch.length-1 == y){
													$("#alertUG").text("Unfollow Completed!");
												}
												else{
													$("#alertUG").text("Unfollowed Batch: "+y+" of: "+hiveArrays.unfolArrBatch.length);
												}
											});
										}
									});
								});
							});
						}//end else
					},30000*y);
				})(j);
			}
		})();
	});
});
//End unFollow members

//Download Followers
$(function(){
	$("#downFol").click(function(){
		var folArr = [];
		var i;
		for( i= 0; i < hiveArrays.groupFol.length; i++ ){
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
$(function(){
	$("#chURL").click(function(){
		$("#alertCGU").text("Loading...");
		// $( "#alertCGU.success" ).fadeIn();
		var grpURL = $("#grpURL").val();
		osapi.jive.core.put({
			"v":"v3",
			"href":"/places/"+group.objectGroup.placeID,
			"body":{
			"displayName":grpURL,
			"groupType":group.objectGroup.groupType
		}
		}).execute(function(response){
			if(response.error){
				$("#alertCGU").text(response.error.message);
			}
			else{
				$("#alertCGU").text("URL changed!");
			}
		});
	});
});
//End change group URL

/***************************************************************************************************************************
Add to security group
****************************************************************************************************************************/

//Get all security groups
$(function(){
	$("#loadSGrp").click(function(){
        var request = osapi.jive.corev3.securityGroups.get({fields:'placeID,name,displayName',count:100});
		nextSGroups(request);
		hiveArrays.allSGroups.length=0;
		$("#alertASG").text("Loading...");
		// $( "#alertASG.success" ).fadeIn();
    });
});

function nextSGroups(request){
    request.execute(function(response){
		if(response.error){
			var code = response.error.code;
			var message = response.error.message;
		}
		else if (!response.list){
			alert("Error: response is not a list");
		}
		else{
			$(response.list).each(function(index,group){
				hiveArrays.allSGroups.push(group);
				//document.getElementById("tab5a").innerHTML = "Loading: "+hiveArrays.allSGroups.indexOf(group);
				$("#alertASG").text("Loading: "+hiveArrays.allSGroups.indexOf(group));
			});
			if (response.getNextPage){
				var requestNextPage = response.getNextPage();
				nextSGroups(requestNextPage);
			}
			if(!response.getNextPage){
				//document.getElementById("tab5a").innerHTML = "Loaded: "+hiveArrays.allSGroups.length;
				$("#alertASG").text("Loaded: "+hiveArrays.allSGroups.length);
				$("#sGrpname").prop("disabled",false);
			}
		}
	});
}
//end get all security groups

//Upload Hive ID
$(function(){
	document.getElementById("uploadHID").addEventListener('change', upload);
	function browserSupport(){
		var isCompatible = false;
		if(window.File && window.FileReader && window.FileList)
		{
			isCompatible = true;
		}
		return isCompatible;
	}
	function upload(evt){
		if(!browserSupport())
		{
			alert("File upload is not supported by your browser!")
		}
		else
		{
			hiveArrays.sGrpData.length = 0;
			var file = evt.target.files[0];
			var reader = new FileReader();
			var references="";
			reader.onload = function(e){
				references = e.target.result;
				var header = references.split(",");

				(function(){
					var i;
					for( i = 0; i < header.length; i++ )
					{
						hiveArrays.sGrpData.push(header[i]);
					}
				})();
				
				var sGrp_batch = [];
				(function(){
					var i;
					for( i = 0; i < hiveArrays.sGrpData.length; i += group.batch ){
						sGrp_batch.push(hiveArrays.sGrpData.slice( i, i+group.batch ));
					}
				})();
				
				if(sGrp_batch.length === 0){
					$("#alertFG").text("List is empty...");
				}
				else {
					(function(){
						var i;
						for( i = 0; i < sGrp_batch.length; i++ ){
							(function(x){
								setTimeout(function(){
									$(sGrp_batch[x]).each(function(index,email){
										osapi.jive.core.get({
											"v":"v3",
											"href":"/people/email/"+email,
											"fields":"id,displayName"
										}).execute(function(response){
											if(response.error){
												var message = response.error.message;
												$("#alertASG").text(message);
											}
											else{
												hiveArrays.sGrpId.push(response.id);
												$("#alertASG").text("Email identified: "+response.displayName);
												$("#alertASG").text("Completed Batch: "+x+" of "+sGrp_batch.length);
			
												if(sGrp_batch.length - 1 === x){
													$("#alertASG").text("All Batches Completed!");
													$("#alertASG").text("Total identified: "+hiveArrays.sGrpData.length);
												}
											}
										});
									});
								},60000*x);
							})(i);
						}//End for loop
					})();
				}//End else
			}
			reader.readAsText(file);
			reader.onerror = function(){
				alert("Unable to read"+file.fileName);
			}
			$("#addSGMem").prop("disabled",false);
		}
	}
});
//End upload references

//Add members to security group
$(function(){
	$("#addSGMem").click(function(){
		if(hiveArrays.sGrpId.length === 0){
			alert("The list is empty!")
		}
		else{
			var batchRequests = osapi.newBatch();
			$("#alertASG").text("Loading...");
			// $( "#alertASG.success" ).fadeIn();
			$(hiveArrays.sGrpId).each(function(index,id){
				batchRequests.add
				(
					id,group.sGrpObj.createMembers(["/people/"+id])
				)
			});
			batchRequests.execute(function(response){
				if(response.error){
					var code = response.error.code;
					group.sg_message = response.error.message;
					$("#alertASG").text("Error: "+group.sg_message);
				}
				else{
					$("#alertASG").text("Added Members: "+hiveArrays.sGrpId.length);

				}
			});
		}//End else
	});
});
//End add members to security group

/***************************************************************************************************************************
Follow group
****************************************************************************************************************************/
//Get all users id from uploaded file
$("#uploadFG").change(function(evt){
	$("#alertFG").text("Reading from email list...");
	var file = evt.target.files[0];
	var reader = new FileReader();
	var references="";
	if(hiveArrays.folGrpId.length > 0 ){
		hiveArrays.folGrpId.length = 0;
	}
	reader.onload = function(e){
		references = e.target.result;
		var header = references.split(",");
		(function(){
			var i;
			for( i = 0; i < header.length; i++ ){
				hiveArrays.folGrp.push(header[i]);
			}
		})();
		(function(){
			var i;
			for( i = 0; i < hiveArrays.folGrp.length; i += group.batch ){
				hiveArrays.folGrpBatch.push( hiveArrays.folGrp.slice( i,i+group.batch ) );
			}
		})();
		
		if( hiveArrays.folGrpBatch.length === 0 ){
			$("#alertFG").text("List is empty...");
		}
		else {
			(function(){
				var i;
				for( i = 0; i < hiveArrays.folGrpBatch.length; i++ ){
					(function(x){
						setTimeout(function(){
							$(hiveArrays.folGrpBatch[x]).each(function(index,email){
								osapi.jive.core.get({
									"v":"v3",
									"href":"/people/email/"+email,
									"fields":"id,displayName"
								}).execute(function(response){
									if(response.error){
										var message = response.error.message;
										$("#alertFG").text(message);
									}
									else{
										hiveArrays.folGrpId.push(response.id);
										$("#alertFG").text("Email identified: "+response.displayName);
										$("#alertFG").text( "Completed Batch: " + x + " of " + hiveArrays.folGrpBatch.length );
	
										if(hiveArrays.folGrpBatch.length - 1 === x){
											$("#alertFG").text("All Batches Completed!");
											$("#alertFG").text("Total identified: " + hiveArrays.folGrpId.length);
										}
									}
								});
							});
						},60000*x);
					})(i);
				}//End for loop
			})();
		}//End else
	}
	reader.readAsText(file);
	reader.onerror = function(){
		alert("Unable to read"+file.fileName);
	}
	document.getElementById("follow").disabled = false;
});

//Get all members
function get_grp_members(){
	if(group.objectGroup === null){
		alert("Please pick a group first");
	}
	else{
		hiveArrays.grpMembers.length = 0;
		$("#alertFG").text("Loading...");
		var grpMem = osapi.jive.core.get({
			"v":"v3",
			"href":"/members/places/"+group.objectGroup.placeID
		});
		getGrpMem(grpMem);
	}
}
			
function getGrpMem(request){
	request.execute(function(response){
		if (response.error){
			var message = response.error.message;
			$("#alertFG").text(message);
		}
		else if (!response.list){
			$("#alertFG").text("Response is not a list!");
		}
		else {
			$(response.list).each(function(index,member){
				hiveArrays.grpMembers.push(member.person.id);
			});
			if (response.getNextPage){
				var nextRes = response.getNextPage();
				getGrpMem(nextRes);
			}
			else{
				$("#alertFG").text("Members found: "+hiveArrays.grpMembers.length);
				if ( hiveArrays.grpMembers.length > 0 ) {
					hiveArrays.folGrpId = hiveArrays.grpMembers;
					set_grp_auto_follow();
				}
				if(document.getElementById("follow").disabled === true){
					document.getElementById("follow").disabled = false;
				}
			}
		}
	});
}//End get group members

//Get all active users
$(function(){
	$("#all_active_users").on("change",function(){
		if(	$("#all_active_users").prop("checked") ){
			$("#cancel_getPeople").prop("disabled",false);
			$("#follow").prop("disabled",false);
		}
	});
	$("#cancel_getPeople").click(function(){	
		app.cancelled = true;
		if ( app.jive_user_id.length > 0 && hiveArrays.folGrpId.length === 0 ) {
			hiveArrays.folGrpId = app.jive_user_id;
		}
	});
});

//Clear checkboxes
function clear_checkbox(){
	$("input").each(function(index,item){
		$(item).prop("checked",false);
	});
}
//Group auto-follow button pressed
$(function(){
	$("#follow").click(function(){
		if (!$("#checkBoxActivity_group").prop( "checked" ) && !$("#checkBoxInbox_group").prop( "checked" )){
			$("#alertFG").text("Please make a selection Inbox or Activity stream");
		}
		else if( $( "#grp_members" ).prop( "checked" ) ){
			get_grp_members();
		}
		else if( $("#all_active_users").prop("checked") ){
			var confirmed = confirm("You are about to add all Hive users to follow this group, are you sure?");
			if( confirmed == true ){
				app.getAll( "#alertFG" );
			}
			else{
				clear_checkbox();
			}
		}
		else if ( $("#uploadFG").get(0).files.length !== 0 ){
			set_grp_auto_follow();
		}
		else{
			$("#alertFG").text("Please make a selection");
		}
	});
});
//Set auto-follow function implementation	
function set_grp_auto_follow(){
	if ( hiveArrays.folGrpId.length === 0 ){
		$("#alertFG").text("List is empty!");
	}
	else{
		$("#alertFG").text(" Setting auto follow...");
		if ( hiveArrays.arrBatch.length > 0 ) {
			hiveArrays.arrBatch.length = 0;
		}
		(function(){
			var j;
			for(j = 0; j < hiveArrays.folGrpId.length; j += group.batch){
				hiveArrays.arrBatch.push(hiveArrays.folGrpId.slice(j,j+group.batch));
			}
		})();
		(function(){
			var i;
			for(i = 0; i < hiveArrays.arrBatch.length; i++){
				(function(x){
					if(app.cancelled === true){ return false;}
					setTimeout(function(){
						$(hiveArrays.arrBatch[x]).each(function(index,member){
							osapi.jive.core.get({
									v:"v3",
									href:"/people/"+member+"/streams"
							}).execute(function(response){
								$(response.list).each(function(index,stream){
									if (stream.source === "connections" && $("#checkBoxInbox_group").is(":checked")){
										var conType = stream.id;
										osapi.jive.core.post({
											"v":"v3",
											"href":"/streams/"+conType+"/associations",
											"body":["/places/"+group.objectGroup.placeID]
		
										}).execute(function(response){
											if (response.error){
												var message = response.error.message;
												$("#alertFG").text("Error: "+message);
											}
											else {
												$("#alertFG").text("Completed Batch: "+x+" of "+hiveArrays.arrBatch.length);
												if(hiveArrays.arrBatch.length - 1 === x){
													$("#alertFG").text("Completed!");
													clear_checkbox();
												}
											}
										});
									}
									if (stream.source === "communications" && $("#checkBoxActivity_group").is(":checked")){
										var conTypeComms = stream.id;
										osapi.jive.core.post({
											"v":"v3",
											"href":"/streams/"+conTypeComms+"/associations",
											"body":["/places/"+group.objectGroup.placeID]
										}).execute(function(response){
											if (response.error){
												var message = response.error.message;
												$("#alertFG").text("Error: "+message);
											}
											else{
												$("#alertFG").text("Completed Batch: "+x+" of: "+hiveArrays.arrBatch.length);
												if(hiveArrays.arrBatch.length - 1 === x){
													$("#alertFG").text("Completed!");
													clear_checkbox();
												}
											}
										});
									}
								});
							});
						});
					},60000*x);
				})(i);
			}//end for
		})();
	}
}