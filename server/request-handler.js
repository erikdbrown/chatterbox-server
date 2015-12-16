var storage = {};
storage.results = [];

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.,
  "Content-Type": "application/json"
};

var sendResponse = function(response, data, code) {
  code = code || 200;

  response.writeHead(code, headers);
  response.end(JSON.stringify(data));
}

var methods = {
  "GET": function(request, response) {
    sendResponse(response, storage)
  },

  "POST": function(request, response) {
    var data = '';
    request.on('data', function(chunk) {
      data += chunk;
    });

    request.on('end', function() {
      storage.results.push(JSON.parse(data.toString('utf8')));
    });

    sendResponse(response, 201);
  },

  "OPTIONS": function(request, response) {
    sendResponse(response, null);
  }
};

exports.requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var action = methods[request.method];

  if (action) {
    action(request, response);
  } else {
    sendResponse(response, '', 404);
  }
}
