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
	app.resize();
} // end function

function onViewer(viewer) {
	console.log("onViewer",viewer);
	$("#currentUser").html("<pre>"+JSON.stringify(viewer,null,2)+"</pre>");
	
} // end function

function onView(context) {
  console.log("onView",context);

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
	groupData:""
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

var opts = {
  lines: 13 // The number of lines to draw
, length: 28 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
/*
$(function()
{
	document.getElementById("toHDM").addEventListener("click", toHDMDiv);
	document.getElementById("menu").addEventListener("click", toMenu);
});
*/

$(function()
{
		
	$("#toHDM").click(function()
	{
		$("#menu").hide();
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
		$("#menu").show();
		$("#input2").val("");
		$("#addAll").val("");
		$("#res").val("");
		$("#alertUFG,#alertRGM").text("Loading...");
		
		app.resize();
		
	});
	$("#toUFG").click(function()
	{
		$("#menu").hide();
		$("#ufg").show();
		app.resize();
		
	});
	$("#toRGM").click(function()
	{
		$("#menu").hide();
		$("#rgm").show();
		app.resize();
		
	});
	$("#toUG").click(function()
	{
		$("#menu").hide();
		$("#ug").show();
		app.resize();
		
	});
	$("#toCGU").click(function()
	{
		$("#menu").hide();
		$("#cgu").show();
		app.resize();
		
	});
});

//Get all groups
$(function()
{
	$("#loadGroupsHDM").click(function()
	{
		allGroupsHDM.length=0;
		//var target = document.getElementById('loader');
		//var spinner = new Spinner(opts).spin(target);
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
				//document.getElementById("loadG").innerHTML = "Loading: "+allGroupsHDM.indexOf(group);
				$("#alertHDM").text("Loading all groups : "+allGroupsHDM.indexOf(group));
            });
            if (response.getNextPage)
			{
				var requestNextPage = response.getNextPage();
				nextGroupsHDM(requestNextPage);
			}
			if(!response.getNextPage)
			{
				//document.getElementById("loader").style.display = "none";	
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
				//console.log("Response is: " + JSON.stringify(response));
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
		//var target2 = document.getElementById('loader2');
		//var spinner2 = new Spinner(opts).spin(target2);
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
              //document.getElementById("loader2").style.display = "none";
              //spinner.stop(target);
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
		//document.getElementById("loader2").style.display = "block";
		var request = osapi.jive.corev3.people.getAll({fields:'@all',count:100});
	    peopleInThisLocation.length=0;
		//document.getElementById("infoT2").value = "Finding employees in this location...";
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
			  //document.getElementById("loader2").style.display = "none";
			  //document.getElementById("infoT2").value = "Employees found: "+peopleInThisLocation.length;
			  
			  //alert("People found: "+peopleInThisLocation.length);
			  //document.getElementById("infoT2").value = "Loading...";
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
			//console.log(JSON.stringify(response));
		});
		$( "#alertHDM.success" ).fadeOut();
		window.alert("A total of "+peopleInThisLocation.length+" added to group "+groupHDM.groupName);
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
				//console.log("groupFollowers: "+JSON.stringify(groupMembers));
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
				var data="";
				var reply="";
				var authName="";
				$("#res").val("");
				replyArray.length=0;
				$(replies).each(function(index,response)
				{
					if(response.author.displayName != response.parentPlace.name && $("#res").val().search(response.author.displayName) == -1 )
					{
						reply = $(response.content.text).text();
						authName = response.author.displayName;
						
						data += authName+" : "+reply+"\n";
						//reply += $(response.content.text).text()+"\n";

						$("#res").val(data);
						//$("#res").val(response.author.displayName+" : "+reply+"\n");
						var comments = response.author.displayName+" : "+reply;
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
			console.log("uploaded file: "+lines);
			reader.readAsText(file);
			reader.onerror = function()
			{
				alert("Unable to read"+file.fileName);
			}
		}
	}
});
//End upload references
