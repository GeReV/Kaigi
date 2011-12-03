(function(window, document) {
  
  var user_info, user_marker, currentWindowInfo, markersArray = [];
  
  var myOptions = {
    zoom: 10,
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
          
          var temp_city_array = [
            ['Tel Aviv', '32.067', '34.767'],
            ['Ramat Hasharon', '32.147', '34.842'],
            ['Bat Yam', '32.023', '34.75'],
            ['Holon', '32.011', '34.772'],
            ['Petach Tikva', '32.0849', '34.8884'],
            ['Rishon Le Zion', '31.964', '34.804']
          ];
          
          var city = temp_city_array[Math.round(Math.random() * temp_city_array.length)];
          
          var position = { coords: { latitude: city[1], longitude: city[2] }},
          
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
    appendPost(result);
  });
  
  $('#updates')
    .delegate('.post:not(.active)[data-post-id]', 'click', function() {
      var self = $(this),
          marker,
          windowInfo;
      
      self.parent().children().removeClass('active');
      
      self.addClass('active');
      
      marker = self.data('marker');
      windowInfo = self.data('windowInfo');
      
      marker && map.setCenter(marker.getPosition());
      
      currentWindowInfo && currentWindowInfo.close();
      
      if (windowInfo) {
        windowInfo.open(map, marker);
        currentWindowInfo = windowInfo;
      }
    })
    .delegate('.post.active', 'click', function() {
      var self = $(this).removeClass('active');
            
      currentWindowInfo && currentWindowInfo.close();
    });
  
  $.getJSON('/home/get_users_and_posts', updateMarkers);
  
  var interval = window.setInterval(function() {
    $.getJSON('/posts/index/?latest=' + $('#updates .post:first').data('post-id'), appendPost);
    $.getJSON('/home/get_users_and_posts', updateMarkers);
  }, 20 * 1000);

  function updateMarkers(users_and_posts) {
    var i, l, user, icon, marker, pos, post;
    
    deleteOverlays();
    
    for (i = 0, l = users_and_posts.users.length; i < l; i++) {
      user = users_and_posts.users[i];
      
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
      
      markersArray.push(marker);
    }
    
    for (i = 0, l = users_and_posts.posts.length; i < l; i++) {
      (function() {
        var marker, pos, post, post_update, windowInfo;
        
        post = users_and_posts.posts[i];
      
        pos = new google.maps.LatLng(post.lat, post.long);
        
        marker = new google.maps.Marker({
          'clickable': true,
          'map': map,
          'position': pos,
          'zIndex': 2,
        });
        
        markersArray.push(marker);
        
        windowInfo = new google.maps.InfoWindow({
          'content': '<img style="float: left; margin: 0 5px 5px 0;" src="' + post.image_thumb + '" alt="" />' + post.text
        });
        
        $('#updates .post[data-post-id=' + post.id + ']').data({
          'marker': marker,
          'windowInfo': windowInfo
        });
        
        google.maps.event.addListener(marker, 'click', function() {
          windowInfo.open(map, marker);
        });
      }());
    }
  }
  
  function appendPost(result) {
    if (user_info && user_info.id && user_info.name) {
      var post = $('<div class="post clearfix"><a href="' + result.user.profile_link + '"><img src="//graph.facebook.com/' + user_info.id + '/picture" alt="' + user_info.name + '" /></a>' + result.text + '</div>');
        
      if (result.image_thumb && result.image_url) {
        post.append('<div class="thumb"><a href="' + result.image_url + '"><img src="' + result.image_thumb + '" alt="" /></a></div>');
      }
      
      $('#post_text, #post_image').val('');
            
      post.hide().prependTo($('#updates')).slideDown('slow');
    }
  }
  
  function deleteOverlays() {
    if (markersArray) {
      for (i in markersArray) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
    }
  }
    
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
    
  $('.post .thumbnail').facebox(); 
});

