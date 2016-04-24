var fs = require('fs');

var port = 9494;
var server = require('webserver').create();

var webPage = require('webpage');
var page = webPage.create();
var url = 'file:///' + fs.absolute('./index.html');

function parseGET(url){
  var query = url.substr(url.indexOf("?")+1);
  var result = {};
  query.split("&").forEach(function(part) {
    var e = part.indexOf("=")
    var key = part.substr(0, e);
    var value = part.substr(e+1);
    result[key] = decodeURIComponent(decodeURIComponent(value));
  });
  return result;
}

var service = server.listen(port, function (request, response) {
  var args = parseGET(request.url);
  var g = '';
  if (args['g']) g = args['g'];
  console.log(g);
  page.open(url, function (status) {
    var ret = page.evaluate(function(g) {
      document.getElementById('inputString').innerHTML = g;
      WaveDrom.ProcessAll();
      return document.getElementById('WaveDrom_Display_0').innerHTML;
    }, g);
    response.statusCode = 200;
    response.setHeader("Content-Type", "image/svg+xml");
    response.write(ret);
    response.close();
  });
});



if (service) {
  console.log('Web server running on port ' + port);
} else {
  console.log('Error: Could not create web server listening on port ' + port);
  phantom.exit();
}