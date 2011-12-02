class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter(:init_fb)
  
protected
  
  def init_fb
    @oauth = Koala::Facebook::OAuth.new(APP_CONFIG['app_id'], APP_CONFIG['app_secret'], APP_CONFIG['callback_url']) 
    @graph = Koala::Facebook::API.new(@oauth.get_user_info_from_cookies(cookies)['access_token'])
  end
end
