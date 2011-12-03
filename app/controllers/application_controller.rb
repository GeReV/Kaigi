class ApplicationController < ActionController::Base
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE #TODO: remove it to enable ssl v3 
  
  protect_from_forgery
  
  before_filter(:init_fb)
  
protected
  
  def init_fb
    @oauth = Koala::Facebook::OAuth.new(APP_CONFIG['app_id'], APP_CONFIG['app_secret'], APP_CONFIG['callback_url']) 
    
    user_info = @oauth.get_user_info_from_cookies(cookies)
    
    if (user_info)
      @graph = Koala::Facebook::API.new(user_info['access_token'])
      
      @current_user = @oauth.get_user_info_from_cookies(cookies)
      
      @user_info = session[:user_info] || @graph.get_object('me')
      
      session[:user_info] = @user_info
    end
  end
  
  def create_or_update_user(lat, long)
    @user = User.find_by_profile_id(@user_info['id']);
    if @user
      @user.update_attributes({
        :last_known_lat => lat,
        :last_known_long => long,
        :last_seen_time => Time.now
      })
    else      
      @user = User.new({
        :profile_id => @user_info['id'],
        :profile_link => @user_info['link'],
        :profile_name => @user_info['name'],
        :profile_pic => "//graph.facebook.com/#{@user_info["id"]}/picture",
        :country => @user_info['hometown']['name'].split.last.strip,
        :last_known_lat => lat,
        :last_known_long => long,
        :last_seen_time => Time.now
      })
    end
  end
end
