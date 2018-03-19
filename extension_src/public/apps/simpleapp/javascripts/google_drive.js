/***************************************************************************************************************************
Add google drive
****************************************************************************************************************************/

var group = {
	googleDSgroup:undefined
};

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

// //Download Jive ID
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