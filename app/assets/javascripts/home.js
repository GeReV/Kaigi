(function(document) {
  
  var myOptions = {
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  },
  map = new google.maps.Map(document.getElementById("map"), myOptions),
  watchId;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {  
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          name;
          
      setPositionFields(position);
      
      FB.api('/me', function(response) {
        var infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          maxWidth: 60,
          content: '<img src="//graph.facebook.com/' + response.id + '/picture" alt="' + response.name + '" />'
        });
        
        map.setCenter(pos);
      });
    });
    
    watchId = navigator.geolocation.watchPosition(function(position) {
      setPositionFields(position);
    });
    
    function setPositionFields(position) {
      $('#post_lat').val(position.coords.latitude);
      $('#post_long').val(position.coords.longitude);
    }
  }
}(document));

$('form').bind('ajax:success', function(result) {
  FB.api('/me', function(response) {
    $('#posts').append('<div class="post"><img src="//graph.facebook.com/' + response.id + '/picture" alt="' + response.name + '" /><p>' + result.text + '</p></div>');
  });
});
