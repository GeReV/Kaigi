(function(window, document) {
  
  var user_info, user_marker;
  
  var myOptions = {
    zoom: 11,
    center: new google.maps.LatLng(32.066667, 34.783333),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  },
  map = new google.maps.Map($("#map")[0], myOptions),
  watchId;
  
  Modernizr.load({
    load: '//connect.facebook.net/en_US/all.js'
  });
  
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '259252477464330',
      status     : true, 
      cookie     : true,
      xfbml      : true
    });
    
    FB.api('/me', function(response) {
      
      user_info = response;
      
      if (navigator.geolocation) {    
        //watchId = navigator.geolocation.watchPosition(function(position) {
          
          var position = { coords: { latitude: 32.066667, longitude: 34.783333 }},
          
              pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          
              icon = new google.maps.MarkerImage('//graph.facebook.com/' + user_info.id + '/picture',
                        new google.maps.Size(23, 23), // size
                        new google.maps.Point(0, 0), // origin
                        new google.maps.Point(0, 0), // anchor
                        new google.maps.Size(23, 23)); // scaledSize
          
          user_marker = user_marker || new google.maps.Marker({
            position: pos,
            map: map,
            icon: icon
          });
          
          user_marker.setPosition(pos);
          
          map.setCenter(pos);
          
          setPositionFields(position);
          updatePosition(position);
        //}, function() {
        //  alert('Couldn\'t determine location.');
        //}, { 'enableHighAccuracy': true, 'maximumAge': 30000, 'timeout': 27000 });
      }
      
      $('#post').slideDown('slow');
    });
    
    
  };
  
  $('form').bind('ajax:success', function(e, result) {
    if (user_info && user_info.id && user_info.name) {
      var post = $('<div class="post clearfix"><img src="//graph.facebook.com/' + user_info.id + '/picture" alt="' + user_info.name + '" />' + result.text + '</div>');
      
      $('#post_text').val('');
            
      post.hide().prependTo($('#updates')).slideDown('slow');
    }
  });
  
  $.getJSON('/home/get_users', function(result) {
    var i, l, user, icon, marker, pos;
    
    for (i = 0, l = result.length; i < l; i++) {
      user = result[i];
      
      icon = new google.maps.MarkerImage(user.profile_pic,
              new google.maps.Size(23, 23), // size
              new google.maps.Point(0, 0), // origin
              new google.maps.Point(0, 0),  // anchor
              new google.maps.Size(23, 23)); // scaledSize
      
      pos = new google.maps.LatLng(user.last_known_lat, user.last_known_long);
      
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: icon,
        title: user.name,
        zIndex: 2
      });
    }
  });
    
  function setPositionFields(position) {
    $('#post_lat').val(position.coords.latitude);
    $('#post_long').val(position.coords.longitude);
  }
  
  function updatePosition(position) {
    $.post('/home/update_location', {
      'lat': position.coords.latitude,
      'long': position.coords.longitude
    });
  }
}(window, document));


function reset_html(id) {
    $('#'+id).html($('#'+id).html());
}

$(document).ready(function() {

var file_input_index = 0;
    $('input[type=file]').each(function() {
        file_input_index++;
        $(this).wrap('<div id="file_input_container_'+file_input_index+'"></div>');
        $(this).after('<input type="button" value="Clear" onclick="reset_html(\'file_input_container_'+file_input_index+'\')" />');
    });
   
});
