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
    end
  end
end
