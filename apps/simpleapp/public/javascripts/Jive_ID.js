var jiveIdArr=
{
    jiveId:[],
    udeId:[]
};

$(function()
{
    $("#getJiveId").click(function()
    {
          $("#alertGoogleDri").text("Loading from UDE...");
          $( "#alertFS.success" ).fadeIn();
          $.getJSON('https://sidm.springernature.com/api/v2.0/users?filter[where][busunitid]=31?fields=empid',function(data)
          {
              if(data.info.length ==0)
              {
                  $("#uploadJIDs").prop("disabled",false);
                  $("#alertGoogleDri").text("No IDs found in UDE...");

              }
              else
              {
                  $(data.info).each(function(index,id)
                  {
                      jiveIdArr.udeId.push(id.empid);
                      $.getJSON('https://sidm.springernature.com/api/v2.0/modules/jive/external/jive/search/'+id.empid,function(data)
                      {
                          jiveIdArr.jiveId.push(data.id);
                          $("#alertGoogleDri").text("Identifying Jive ID: "+data.id);
                      });
                  });
                  $("#alertGoogleDri").text("Identified IDs: "+hiveArrays.allJID.length);
                  $("#alertGoogleDri").text("Downloading Jive IDs...");

                  var csvCont = "data:text/csv;charset=utf-8,";
              		dataString = jiveIdArr.jiveId.join(",");
              		csvCont += dataString;

              		var encodedUri = encodeURI(csvCont);
              		var link = document.createElement("a");

              		link.setAttribute("href", encodedUri);
              		link.setAttribute("download", "Jive IDs.csv");
              		document.body.appendChild(link);
              		link.click();
              }

          }).fail(function(data)
          {
              alert("Error occured reading from UDE: "+data);
          });
    });
});
