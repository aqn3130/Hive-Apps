

var fileUrl;
var hostUrl="https://portal-dordrecht.springer-sbm.com/IT/IT/BI/PR/ProdReports_2007/Book%20Look%20Up.xlsm";
var hUrl = "https://portal-dordrecht.springer-sbm.com/IT/IT/BI/PR/_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('/ProdReports_2007/Book%20Look%20Up.xlsm')/$value"
var hiveUrl="https://hive.springernature.com/resources/statics/183441/860_eCard_20.jpg?a=1479905150978"
$(function()
{
$("#getSharepoint").click(function()
{

    var xhr = new XMLHttpRequest();

    xhr.open('GET',hiveUrl , true);

    xhr.responseType = 'blob';

    xhr.onload = function(e) {
      if (this.status == 200) {
        var data = this.response;
        console.log(data);
        fileUrl = data;
      }
      if (!this.status == 200) {
        var data = this.response;

        console.log(data);
      }
    }

    xhr.send();






});

});


//Upload files in to Hive
var documentJSON = {
    "content":
    {
        "type": "text/html",
        "text": "Some interesting text"
    },
    "type":"file",
    "parent": "https://hive.springernature.com/api/core/v3/places/159716",
    "subject": "03",
    "attachments": [
        {
            "doUpload": true,
            "url": fileUrl
        }
     ]
};
$(function()
{
    $("#uploadFile").click(function()
    {
        var request = osapi.jive.corev3.contents.create(documentJSON);

        request.execute(function(data) {
            console.log(data);
        });
    });
});
