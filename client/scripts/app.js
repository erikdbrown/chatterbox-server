var app = {
  server: 'http://127.0.0.1:3000',

  rooms: [],

  friends: [],

  addFriend: function(username) {
    app.friends.push(username);
  },

  handleSubmit: function() {

    var message = {
      username: window.location.search.split('=')[1],
      text: $('#message').val(),
      roomname: $('#roomName').text() ? $('#roomName').text() : "All Messages"
    };

    $('#message').val("What do you want to say?");
    app.send(message)
  }, 
  
  selectRoom: function(roomName) {
    // change the location to ?roomname=roomName
    $('#roomName').text(roomName);
    $('#roomSelect option').text(roomName)
    console.log(roomName + ' selected')
    // change the messages displayed
    app.clearMessages();
    app.fetch();
  },


  send: function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.clearMessages()
        app.fetch();
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {

    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        app.clearMessages();
        for (var i = 0; i < data.results.length; i++) {
          app.addMessage(data.results[i]);
        }
        console.log("success")
      },
      error: function() {
        console.log("You've errored")
      }

    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(message) {

    var roomName = message.roomname;
    var origText = message.text;
    var origUsername = message.username;
    if (origText !== '') {
      if ($('#roomName').text() === roomName || $('#roomName').text() === "All Messages") {
        var $message = $('<div>').text(origText);
        if (app.friends.indexOf(origUsername) >= 0) {
          var $username = $('<span class="chat username friend">').text(origUsername);
        } else {
          var $username = $('<span class="chat username">').text(origUsername);
        }
        var $messageDiv = $('<div>').append($username).append($message)
        $messageDiv.appendTo('#chats');
      }
    }
    app.addRoom(roomName);
  },

  addRoom: function(roomName) {
    
    if (app.rooms.indexOf(roomName) < 0) {
      if (roomName) {
        app.rooms.push(roomName);
      }
    }
    
    app.rooms.sort(function(a,b) {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      } else if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    $('#roomSelect').empty();

    for (var i = 0; i < app.rooms.length; i++ ) {
      $('<option class="room">').text(app.rooms[i]).appendTo('#roomSelect')
    }
  },

  init: function() {

    $('#message').val("What do you want to say?");
    
    $('#chats').on('click', '.username', function() {
      var username = $(this).text();
      $(this).addClass('friend');
      app.addFriend(username);
    })

    $('#message').on('focus', function(event) {
      $('#message').val('');
    })

    $('#send').on('submit', function(event) {
      event.preventDefault();
      app.handleSubmit();
    })

    $('#roomSelect').change(function(event) {
      console.log('hello')
      var roomName = $(this).val();
      app.selectRoom(roomName);
    })

    $('#addRoom').on('click', function(event) {
      var newRoom = prompt("Your new room name:");
      app.addRoom(newRoom);
      $('#roomName').text(newRoom);
      app.clearMessages();
      app.fetch();
    })

  }

};

setInterval(app.fetch, 1000);
app.init();




