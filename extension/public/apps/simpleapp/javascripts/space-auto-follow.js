var spaceVar =
{
    spaceName:"",
    spaceId:"",
    batch:50
};
var spaceArrays =
{
    spaces:[],
    folSpace:[],
    arrBatch:[]
};

//Get all spaces
$(function()
{
    $("#getAllspaces").click(function()
    {
        var request = osapi.jive.corev3.spaces.get();
        getSpaces(request);
        $("#alertFS").text("Loading...");
        $( "#alertFS.success" ).fadeIn();
    });

});

function getSpaces(data)
{
    data.execute(function(response)
    {
        if(response.error)
        {
            var message = response.error.message;
            $("#alertFS").text(message);
        }
        else if(!response.list)
        {
            $("#alertFS").text("Response is not a list!");
        }
        else
        {
            $(response.list).each(function(index,space)
            {
                spaceArrays.spaces.push(space);
                $("#alertFS").text("Loading space: "+space.name);
            });
            if(response.getNextPage)
            {
                var nextBatch = response.getNextPage();
                getSpaces(nextBatch);
            }
            else
            {
                $("#alertFS").text("Loaded Spaces: "+spaceArrays.spaces.length);
                $("#inputFS").prop("disabled",false);
                //console.log(spaceArrays.spaces);
            }

        }
    });
}
//End get all spaces

//Validate space name for Follow space
$(function()
{
		$("input[id='inputFS']").keyup(function()
    {
			  spaceVar.spaceName = $("#inputFS").val();
			  $("input[id='inputFS']").css("color", "black");

        $(spaceArrays.spaces).each(function(index,space)
        {
			      if(space.name == spaceVar.spaceName)
						{
  							$("input[id='inputFS']").css("color", "green");
  							spaceVar.spaceName = space.name;
  							spaceVar.spaceId = space.placeID;
						}

        });
				document.getElementById("uploadSpc").disabled=false;

		});
});//End validate space name for Follow space

$("#uploadSpc").change(function(evt)
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
					spaceArrays.folSpace.push(header[i]);
				}
			}
			reader.readAsText(file);
			reader.onerror = function()
			{
				alert("Unable to read"+file.fileName);
			}
			document.getElementById("followSpace").disabled=false;

});

$(function()
{
		$("#followSpace").click(function()
		{

					for(i=0;i<spaceArrays.folSpace.length;i+=spaceVar.batch)
					{
							spaceArrays.arrBatch.push(spaceArrays.folSpace.slice(i,i+spaceVar.batch));
							//return hiveArrays.arrBatch;
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
																	if(stream.source == "connections")
																	{
																			var conType = stream.id;
																			osapi.jive.core.post(
																			{
																					"v":"v3",
																					"href":"/streams/"+conType+"/associations",
																					"body":["/places/"+spaceVar.spaceId]

																			}).execute(function(response)
																			{
																					if(response.error)
																					{
																							var message = response.error.message;
																							$("#alertFS").text("Error: "+message);
																					}
																					else {
																							$("#alertFS").text(JSON.stringify(response));
																							$("#alertFS").text("Completed Batch: "+x+" of "+spaceArrays.arrBatch.length);

																							if(spaceArrays.arrBatch.length-1 == x)
																							{
																									$("#alertFS").text("Completed!");
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
																					"body":["/places/"+spaceVar.spaceId]

																			}).execute(function(response)
																			{
																					if(response.error)
																					{
																							var message = response.error.message;
																							$("#alertFS").text("Error: "+message);
																					}
																					else
																					{
																							$("#alertFS").text(JSON.stringify(response));
																							$("#alertFS").text("Completed Batch: "+x+" of: "+spaceArrays.arrBatch.length);

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
														});
												});
										});
									},60000*x);
							})(i);
					}
		});
});
