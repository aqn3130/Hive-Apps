/************************************************************************
  STEP 1 - Update Your Action IDs to Match your app.xml
  See: /apps/simpleapp/public/app.xml
************************************************************************/
var ACTION_IDS = [
  "example.app.content.all.action",
  "example.app.content.document.action",
  "example.app.content.discussion.action",
  "example.app.content.question.action",
  "example.app.content.document.binary.action",
  "example.app.content.blogpost.action",
  "example.app.content.idea.action",
  "example.app.content.event.action",
  "example.app.content.poll.action",
  "example.app.content.video.action",
  "example.app.createmenu.action",
  "example.app.places.all.action",
  "example.app.places.space.action",
  "example.app.places.project.action",
  "example.app.places.group.action",
  "example.app.places.settings.all.action",
  "example.app.places.settings.space.action",
  "example.app.places.settings.project.action",
  "example.app.places.settings.group.action",
  "example.app.rte.action"
];
function onReady(env) {
  //console.log('onReady',env);
  var jiveURL = env["jiveUrl"];

  //TODO: ADD IN UI INIT STUFF

	$("#hdm").hide();
	$("#ufg").hide();
	$("#rgm").hide();
	$("#ug").hide();
	$("#cgu").hide();
	$("#asg").hide();
  $("#gDri").hide();
  $("#fGrp").hide();
  $("#fSpc").hide();
	app.resize();
} // end function

function onViewer(viewer) {
	//console.log("onViewer",viewer);
	$("#currentUser").html("<pre>"+JSON.stringify(viewer,null,2)+"</pre>");

} // end function

function onView(context) {
  //console.log("onView",context);

  if (context["currentView"]) {
    $('span.viewContext').append('<em>'+context["currentView"]+"</em>");
  } // end if

  if (context["params"]) {
    $('#paramsContext').html('<pre>'+JSON.stringify(context["params"],null,2)+"</pre>");
  } else {
    $('#paramsContext').html('No Params Found');
  } // end if

  if (context["object"]) {
    $("#currentViewContext").append("<pre>"+JSON.stringify(context["object"],null,2)+"</pre>");
  } // end if

  $('#paramsSampleLink').click(function() {
    gadgets.views.requestNavigateTo(context["currentView"], { timestamp: new Date().toString() });
  });

} // end function

/**********************************************************************
								HDM
***********************************************************************/
var groupHDM =
{
	groupObj:"",
	groupID:"",
	groupName:"",
	groupURI:"",
	groupURL:"",
	groupType:"",
	location:"",
	groupTab4:"",
	groupReps:"",
	groupData:"",
  data:"",
  authName:"",
  reply:""

};

var allGroupsHDM=[],
	peopleInLocation=[],
	peopleInThisLocation=[],
	allLocs=[],
	uniqueLocs=[],
	replies=[],
	groupMembers=[],
	dmsArray=[],
	dmIDArray=[],
	uniqueReplies=[],
	replyArray=[],
	lines = [];


$(function()
{

	$("#toHDM").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#tabs").tabs({active:0});
		$("#hdm").show();
    app.resize();

	});
	$("#icons").click(function()
	{

		$("#hdm").hide();
		$("#ufg").hide();
		$("#rgm").hide();
		$("#ug").hide();
		$("#cgu").hide();
		$("#asg").hide();
    $("#gDri").hide();
    $("#fGrp").hide();
    $("#fSpc").hide();

        for(var key in group)
        {
            group[key]="";
        }
        for(var key in hiveArrays)
        {
            if(hiveArrays[key]!=hiveArrays.allGroups){
                hiveArrays[key].length=0;
            }

        }
        $("#lineUpUsers,#getMem,#tab3Get,#chURL").prop("disabled",true);

        $("#input2,#input5,#addAll,#res,#uploadHID,#input4,#grpURL,#input3,#uploadFG,#inputFG").val("");
        $( "#alertGoogleDri.success,#alertUFG.success,#alertRGM.success,#alertUG.success,#alertCGU.success,#alertFG.success,#alertASG.success" ).fadeOut();
        $("#menu").show();
        $("#info").show();
		app.resize();

	});
	$("#toUFG").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#ufg").show();
		app.resize();

	});
	$("#toRGM").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#rgm").show();
		app.resize();

	});
	$("#toUG").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#ug").show();
		app.resize();

	});
	$("#toCGU").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#cgu").show();
		app.resize();

	});
	$("#toASG").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#asg").show();
		app.resize();

	});

  $("#toGD").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#gDri").show();
		app.resize();

	});

  $("#toFG").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#fGrp").show();
		app.resize();

	});
  $("#toFS").click(function()
	{
		$("#menu").hide();
		$("#info").hide();
		$("#fSpc").show();
		app.resize();

	});

	$("#toHDM").mouseenter(function(){$("#info").text("Disaster Management");});
	$("#toUFG").mouseenter(function(){$("#info").text("Make a group public by adding all active users as members");});
	$("#toRGM").mouseenter(function(){$("#info").text("Remove group membership");});
	$("#toUG").mouseenter(function(){$("#info").text("Unfollow a group");});
	$("#toCGU").mouseenter(function(){$("#info").text("Change group URL");});
	$("#toASG").mouseenter(function(){$("#info").text("Add members to a security group");});
  $("#toGD").mouseenter(function(){$("#info").text("Add google drive as external storage");});
  $("#toFG").mouseenter(function(){$("#info").text("Follow a social group");});
  $("#toFS").mouseenter(function(){$("#info").text("Follow a Space");});
	$("#toHDM,#toUFG,#toRGM,#toUG,#toCGU,#toASG,#toGD,#toFG,#toFS").mouseleave(function(){$("#info").text("Hover over an App for more information");});
});

//Get all groups
$(function()
{
	$("#loadGroupsHDM").click(function()
	{
		allGroupsHDM.length=0;
		var request = osapi.jive.corev3.groups.get({fields:'placeID,name,displayName',count:100});
		nextGroupsHDM(request);
		$("#tabs-1:input").attr("disabled",true);
		$( "#alertHDM.success" ).fadeIn();
	});
});
//end function get all groups

function nextGroupsHDM(request)
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
				allGroupsHDM.push(group);
				$("#alertHDM").text("Loading all groups : "+allGroupsHDM.indexOf(group));
            });
            if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextGroupsHDM(requestNextPage);
			}
			if(!response.getNextPage)
			{
				document.getElementById("addGroup").disabled = false;
				//$("#tabs").tabs("enable",0);
				$("#alertHDM").text("Loaded all groups : "+allGroupsHDM.length);
				$( "#alertHDM.success" ).fadeOut(2000);
			}
		}
		//console.log("All Groups are" + JSON.stringify(group.objGroup));
    });
}
//end get all groups

//Tabs function
$(function(){
	$("#tabs").tabs();
    //$("#tabs").tabs({disabled:[0,1,2,3]});
    //app.resize();
});

//Sync text fields function
function sync()
{
	var n1 = document.getElementById("name");
	var n2 = document.getElementById("dName");
	n2.value = n1.value;
	n2.style.textTransform="lowercase";
}

//Validate group name
$(function()
{
	$("input[id='name']").keyup(function()
    {
		groupHDM.groupName = $("#name").val();
		groupHDM.groupURL = $("#dName").val();
		$("input[id='name']").css("color", "black");
		$("input[id='dName']").css("color", "black");
		document.getElementById("validName").innerHTML = "";

        $.each(allGroupsHDM, function(index, value)
        {
			if(value.name == groupHDM.groupName)
			{
				$("input[id='name']").css("color", "red");
				groupHDM.groupName = null;
				document.getElementById("validName").innerHTML = "This name is taken";
				return;
			}
			return groupHDM.groupName;
		});
	});

    $("#dName").on('input',function()
    {
		groupHDM.groupURL = $("#dName").val();
		$("input[id='dName']").css("color", "black");

        $.each(allGroupsHDM, function(index, value)
        {
			if(value.displayName == groupHDM.groupURL)
			{
				$("input[id='dName']").css("color", "red");
				groupHDM.groupURL = null;
				return;
			}
			return groupHDM.groupURL;
		});
	});
});
//End validate group name

//Create Group function
$(function()
{
	$("#typeForm input").on("change", function()
	{
		groupHDM.groupType=$("input[name=Formtype]:checked", "#typeForm").val();
	});
	$("#addGroup").click(function()
    {
	  	if(	groupHDM.groupType =="" || groupHDM.groupURL=="" || groupHDM.groupName=="" || groupHDM.groupName==null || groupHDM.groupURL==null)
		{
			alert(" Please provide valid group name, URL and Type");
			return false;
		}
		else
		{
			osapi.jive.corev3.groups.create(
			{
				"displayName":groupHDM.groupURL,
				"name":groupHDM.groupName,
				"groupType":groupHDM.groupType
			}).execute(function(response)
			{
				groupHDM.groupObj = response;
			});
			$("#tabs").tabs("enable",1);
			$("#tabs").tabs({active:1});
		}
    });
});
//End of Create Group function

//Get Location
$(function()
{
    $("#Locations").on("change", function()
    {
		groupHDM.location = $("#Locations").val();
		window.alert("You have selected location: "+groupHDM.location);
		document.getElementById("addMember").disabled = false;
    });
});
//End get location

//Populate all locations
$(function()
{
	$("#loadHDMLoc").click(function()
	{
		var request = osapi.jive.corev3.people.getAll({fields:'@all',count:100});
		locs(request);
		$( "#alertHDMT2.success" ).fadeIn();
	});
});

function locs(request)
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
			  if(person.location != null)
				{
					allLocs.push(person.location);

				}
			});
            if (response.getNextPage)
			{
				var nextPageLocs = response.getNextPage();
				locs(nextPageLocs);
			}
            if(!response.getNextPage)
            {
				document.getElementById("getLocT2").disabled = false;
				//$("#tabs").tabs("enable",1);
			    $( "#alertHDMT2.success" ).fadeOut();
            }
		}
	});
}
//end populate all locations

$(function()
{
  	$("#getLocT2").click(function()
  	{

    		$.each(allLocs, function(i, el)
    		{
    			if($.inArray(el, uniqueLocs) === -1) uniqueLocs.push(el);
    		});
      	for(i=0;i<uniqueLocs.length;i++)
    		{
            var selections = document.getElementById("Locations");
    		    var option = document.createElement("option");
            if(uniqueLocs[i]!=null&&uniqueLocs[i]!="Test"&&uniqueLocs[i]!="")
    		    {
                option.text = uniqueLocs[i];
        				selections.add(option);

            }
    		}
    		var txtVal = document.getElementById("Locations");
    		option.text = "";
    		option.selected=true;
    		txtVal.add(option,0);
    		document.getElementById("getPeople").disabled = false;

  	});
});

//Get all people by location
$(function()
{
	$("#getPeople").click(function()
	{
		var request = osapi.jive.corev3.people.getAll({fields:'@all',count:100});
	    peopleInThisLocation.length=0;
		$( "#alertHDMT2.success" ).fadeIn();
		nextPagePIL(request);

	});
});
function nextPagePIL(request)
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
			  if(person.location == groupHDM.location)
              {
                peopleInThisLocation.push(person);
              }
            });
            if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextPagePIL(requestNextPage);
			}
			if(!response.getNextPage)
            {
				document.getElementById("addMember").disabled = false;
				$( "#alertHDMT2.success" ).fadeOut();
            }
        }
	});
}
//end function get all people by location

//Add member function
$(function()
{
	$("#addMember").click(function()
	{
		$( "#alertHDM.success" ).fadeIn();
		var batchRequests = osapi.newBatch();
		$(peopleInThisLocation).each(function(index,person)
		{
			batchRequests.add
			(
				person,groupHDM.groupObj.createMember(
				{
					person:person.toURI(),
					state:"member"
				})
			)
		});
		batchRequests.execute(function(response)
		{

		});
		$("#alertHDM").text("A total of "+peopleInThisLocation.length+" added to group "+groupHDM.groupName)
		$( "#alertHDM.success" ).fadeOut(3000);
		$("#tabs").tabs("enable",2);
		$("#tabs").tabs({active:2});

	});
});
//end of add member

//Get group followers
$(function()
{
	$("#getGrps").click(function()
	{
		groupMembers.length=0;
		var request = groupHDM.groupObj.getFollowers({count:100});
		getGroups(request);
	});
});

function getGroups(request)
{
	request.execute(function(response)
	{
		if(response.error)
		{
			var error = response.error.code;
			var message = response.error.message;
			alert("Get Recipients Error: "+message);
		}
		else if (!response.list)
		{
			alert("Error: Response is not a list!");
		}
		else
		{
			$(response.list).each(function(index,member)
			{
				groupMembers.push(member);
			});
			if(response.getNextPage)
			{
				var nextPageRes = response.getNextPage();
				getGroups(nextPageRes);
			}
			if(!response.getNextPage)
			{
				window.alert("All group followers for group: "+groupHDM.groupObj.name+" selected! \n Followers Found: "+groupMembers.length);

			}
		}
	});
}
//Get all group followers

//Send notification
$(function()
 {
    $("#sendNoti").click(function()
    {
		var notification = $("#message").val();
		var confirmation = confirm("Please confirm to send notification");

		if(confirmation == true)
		{
			$(groupMembers).each(function(index,member)
			{

				if(member != null)
				{
					osapi.jive.corev3.dms.create(
					{
						content:
						{
							type:"text/html",
							text:notification
						},
						participants:[member.toURI()]

					}).execute(function(response)
					{
						if(response.error)
						{
							var error = response.error.code;
							var message = response.error.message;
							//alert("Sending Direct Message Error: "+message);
						}
						else
						{
							groupHDM.groupReps = response;
							var responseID = groupHDM.groupReps.id;
							//alert(responseID);
							dmsArray.push(responseID);
						}
					});
				}
			});
			$("#tabs").tabs("enable",3);
			$("#tabs").tabs({active:3});
		}
		else
		{
			return false;
		}
	});
});
//End send notification

//Retrieve replies
$(function()
{
	$("#retRes").click(function()
	{
		replies.length=0;
        groupHDM.data="";
        groupHDM.reply="";
        groupHDM.authName="";
        $("#res").val("");
        replyArray.length=0;

		if(dmsArray == null || dmsArray == "")
		{
			if(lines =="" || lines == null)
			{
				alert("No reference data found, please import references first!")
				return false;
			}
			else{

				$(lines).each(function(index,id)
				{
					var request = osapi.jive.core.get(
					{
						v:"v3",
						startIndex:0,
						count:25,
						hierarchical:true,
						excludeReplies:true,
						fields:"@all",
						href:"/dms/"+id+"/comments/"

					});
					nextComments(request);
				});
			}
		}
		else
		{
			$(dmsArray).each(function(index,id)
			{
				var request = osapi.jive.core.get(
				{
					v:"v3",
					startIndex:0,
					count:25,
					hierarchical:true,
					excludeReplies:true,
					fields:"@all",
					href:"/dms/"+id+"/comments/"

				});
				nextComments(request);
			});
		}
	});
});

function nextComments(response)
{
	response.execute(function(response)
	{
        if(response.error)
		{
			var error = response.error.code;
			var message = response.error.message
            alert(message);
		}
		else if(!response.list)
		{
			alert("The response is not a list!")
		}
		else
		{
			$(response.list).each(function(index,comment)
			{
				replies.push(comment);
			});
			if(response.nextPage)
			{
				var nextPageRes = response.getNextPage();
				nextComments(nextPageRes);
			}
			if(!response.nextPage)
			{

				$(replies).each(function(index,response)
				{
					if(response.author.displayName != response.parentPlace.name && $("#res").val().search(response.author.displayName) == -1 )
					{
						groupHDM.reply = $(response.content.text).text();
						groupHDM.authName = response.author.displayName;

						groupHDM.data += groupHDM.authName+" : "+groupHDM.reply+"\n";
						//reply += $(response.content.text).text()+"\n";

						$("#res").val(groupHDM.data);
						//$("#res").val(response.author.displayName+" : "+reply+"\n");
						var comments = response.author.displayName+" : "+groupHDM.reply;
						replyArray.push(comments);
					}
				});
				//console.log("all replies: "+JSON.stringify(replyArray));
			}
		}
	});
}
//End retrieve replies

//Download responses
$(function()
{
	$("#downloadRes").click(function()
	{
		var csvCont = "data:text/csv;charset=utf-8,";
		dataString = replyArray.join(",");
		dataString = replyArray.join("\n");
		csvCont += dataString;

		var encodedUri = encodeURI(csvCont);
		var link = document.createElement("a");

		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "Responses.csv");
		document.body.appendChild(link);
		link.click();
	});
});
//End download responses

//Download References
$(function()
{
	$("#downloadRef").click(function()
	{
		var csvCont = "data:text/csv;charset=utf-8,";
		dataString = dmsArray.join(",");
		csvCont += dataString;

		var encodedUri = encodeURI(csvCont);
		var link = document.createElement("a");

		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "References.csv");
		document.body.appendChild(link);
		link.click();
	});
});
//End download refrences

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
		lines.length=0;
        if(!browserSupport())
		{
			alert("File upload is not supported by your browser!")
		}
		else
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
					lines.push(header[i]);
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
