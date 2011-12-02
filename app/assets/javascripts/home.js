(function(document) {
  
  var myOptions = {
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {  
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          name;
      
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
  }
}(document));