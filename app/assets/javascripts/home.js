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

$('form').bind('ajax:success', function(e, result) {
  FB.api('/me', function(response) {
    if (response.id) {
      var post = $('<div class="post clearfix"><img src="//graph.facebook.com/' + response.id + '/picture" alt="' + response.name + '" />' + result.text + '</div>');
      
      $('#post_text').val('');
            
      post.hide().prependTo($('#updates')).slideDown('slow');
    }
  });
});


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
