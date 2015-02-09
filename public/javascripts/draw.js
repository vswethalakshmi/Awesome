
$('body').append(' <div class="header">    <h2>Awesomeness!</h2>  <a href="#" id="skype"  title="call"><img src="/stylesheets/video.png" style="  width: 29px;    margin-left: 4px;"></a>  <a href="#" id="board" title="doodle"><img src="/stylesheets/brush.png" style="    width: 73%;    margin-left: 4px;"></a></div><div class="container">  <div class="chat-box">    <div class="msg-list"></div><div class="enter-message"><input type="text" id="m" onkeypress="return runScript(event)" placeholder="Enter your message.."/><a href="#" class="send"  >Fly!</a></div> </div></div'+
'  <div class="video-call pure-u-1-3" style="display: block;">                              <!-- Make calls to others -->      <div id="step2" style="margin-top:60px;">          <p>Your id: <span id="my-id">vx8ozqxor0pmn29</span></p>          <p>Share this id with others so they can call you.</p>          <h3>Make a call</h3>          <div class="pure-form">            <input type="text" placeholder="Call user id..." id="callto-id">            <a class="pure-button pure-button-success" id="make-call">Call</a>          </div>        </div>        <!-- Call in progress -->        <div id="step3">          <p>Currently in call with <span id="their-id">...</span></p>          <p><a class="pure-button pure-button-error" id="end-call">End call</a></p>        </div>      </div><div class="pure-g">      <!-- Video area -->      <div class="pure-u-2-3 video-call" id="video-container">        <video id="their-video" autoplay=""></video>        <video id="my-video" muted="true" autoplay=""></video>      </div>      ');

$('#board').click(function(){
	if($("#draw").css('display') == 'inline-block'){
     $('.container').show();  
$(".video-call").hide();  
$("#draw").hide();   
}
else{
$("#draw").show();
	$(".video-call").hide();
	$('.container').hide(); 
}
$('.container').toggleClass("push");
})
$('#skype').click(function(){
if($(".video-call").css('display') == 'block'){
     $('.container').show();  
$("video-call").hide();  
$("#draw").show();   
}
else{
$("#draw").hide();
	$(".video-call").show();
	$('.container').hide(); 
}
//$('#draw').toggle();
})

// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger than this


tool.maxDistance = 10;
function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	
	var usr=getParameterByName('user');

// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
function randomColor() {
var color={
    red: 0,
    green: 204,
    blue: 255,
    alpha: 0.9
  }


  return color;

}


// every time the user drags their mouse
// this function will be executed
function onMouseDrag(event) {

  // Take the click/touch position as the centre of our circle
  var x = event.middlePoint.x;
  var y = event.middlePoint.y;
  
  // The faster the movement, the bigger the circle
  var radius = event.delta.length / 2;
  
  // Generate our random color
  var color = randomColor();

  // Draw the circle 
  drawCircle( x, y, 8, color );
  
   // Pass the data for this circle
  // to a special function for later
  emitCircle( x, y, 8, color );

}


function drawCircle( x, y, radius, color ) {

  // Render the circle with Paper.js
  var circle = new Path.Circle( new Point( x, y ), radius );
  circle.fillColor = new RgbColor( color.red, color.green, color.blue, color.alpha );

  // Refresh the view, so we always get an update, even if the tab is not in focus
  view.draw();
} 
  

// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function emitCircle( x, y, radius, color ) {
	
 
  // Each Socket.IO connection has a unique session id
  var sessionId = io.socket.sessionid;
  
  // An object to describe the circle's draw data
  var data = {
    x: x,
    y: y,
    radius: radius,
    color: color
  };

  // send a 'drawCircle' event with data and sessionId to the server
  io.emit( 'drawCircle', data, sessionId )

  // Lets have a look at the data we're sending
  console.log( data )

}


// Listen for 'drawCircle' events
// created by other users
io.on( 'drawCircle', function( data ) {

  console.log( 'drawCircle event recieved:', data );

  // Draw the circle using the data sent
  // from another user
  drawCircle( data.x, data.y, data.radius, data.color );
  
})


function chat(msg){
	var sessionId = io.socket.sessionid;
	var date=new Date();
	var _t=date.getHours()+":"+date.getMinutes();
        io.emit('chat', {im:msg,time:_t,user:usr},sessionId);
}
function sub(){
		var msg=$('#m').val();
	chat(msg);
var date=new Date();
	var _t=date.getHours()+":"+date.getMinutes();
        $('#m').val('');
 $('.msg-list').append('<div class="message-box right-img">      <div class="picture"> <div style="text-align:center;background-color: #40C6DA;width: 44px;height: 44px;border-radius: 48px;"><p style="padding-top: 9px;font-size: 24px;text-transform: capitalize;color: #fff;">'+usr.charAt(0)+'</p></div>   <span class="time">'+_t+'</span></div><div class="message">        <span>me</span> <p>'+msg+'</p>  </div>  </div> ');
}
function runScript(e) {
    if (e.keyCode == 13) {
        sub();
        return false;
    }
}
 $('.send').click(function(){
	sub();
        return false;
      });
     
 io.on('chat', function(data){
        $('.msg-list').append('<div class="message-box left-img">      <div class="picture"> <div style="text-align:center; width:44px;height:44px;background-color:#E4A401;border-radius:48px"><p style="padding-top: 9px;font-size: 24px;text-transform: capitalize;color: #fff;">'+data.user.charAt(0)+'</p></div>    <span class="time">'+data.time+'</span></div><div class="message">        <span style="text-transform: capitalize;">'+data.user+'</span> <p>'+data.im+'</p>  </div>  </div> ');
      });

$(document).ready(function(){
	    // Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
    // PeerJS object
    
var peer = new Peer(prompt("enter id"),{ key: 'o6ohvz49meyd5cdi', debug: 3, config: {'iceServers': [
   {
    url: 'stun:23.21.150.121'
}, {
    url: 'stun:stun.l.google.com:19302'
}, {
    url: 'stun:stun01.sipphone.com'
}, {
    url: 'stun:stun.ekiga.net'
}, {
    url: 'stun:stun.fwdnet.net'
}, {
    url: 'stun:stun.ideasip.com'
}, {
    url: 'stun:stun.iptel.org'
}, {
    url: 'stun:stun.rixtelecom.se'
}, {
    url: 'stun:stun.schlund.de'
}, {
    url: 'stun:stun.l.google.com:19302'
}, {
    url: 'stun:stun1.l.google.com:19302'
}, {
    url: 'stun:stun2.l.google.com:19302'
}, {
    url: 'stun:stun3.l.google.com:19302'
}, {
    url: 'stun:stun4.l.google.com:19302'
}, {
    url: 'stun:stunserver.org'
}, {
    url: 'stun:stun.softjoys.com'
}, {
    url: 'stun:stun.voiparound.com'
}, {
    url: 'stun:stun.voipbuster.com'
}, {
    url: 'stun:stun.voipstunt.com'
}, {
    url: 'stun:stun.voxgratia.org'
}, {
    url: 'stun:stun.xten.com'
} // Pass in optional STUN and TURN server for maximum network compatibility
    ]}});
    peer.on('open', function(){
      $('#my-id').text(peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(window.localStream);
      step3(call);
    });
    peer.on('error', function(err){
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });

    // Click handlers setup
    $(function(){
      $('#make-call').click(function(){
        // Initiate a call!
        var call = peer.call($('#callto-id').val(), window.localStream);

        step3(call);
      });

      $('#end-call').click(function(){
        window.existingCall.close();
        step2();
      });

      // Retry if getUserMedia fails
      $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
      });

      // Get things started
      step1();
    });

    function step1 () {
      // Get audio/video stream
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3 (call) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      // UI stuff
      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }
})

