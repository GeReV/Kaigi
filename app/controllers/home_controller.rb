class HomeController < ApplicationController
  
  respond_to(:html, :json)
  
  def index
    
    last = params[:last].to_i || 0
    
    @posts = Post.where(['id > ?', last]).limit(15).order('id DESC')
    
    @post = Post.new
  end
  
  def get_users_and_posts
    users = User.where(['last_seen_time > ? AND profile_id <> ?', Time.now - 24.hours, @user_info["id"]])
    posts = Post.where(['created_at > ?', Time.now - 3.hours])
    
    posts.map! do |p| 
        hash = {
          :id => p.id,
          :text => p.text,
          :lat => p.lat,
          :long => p.long,
        }
        
        hash.merge!({
          :image_thumb => p.image.url(:thumbnail),
          :image_url => p.image.url(:normal)
        }) if p.image.file?
        
        return hash
    end
    
    @response = { 
      :users => users, 
      :posts => posts } 
    }
    
    respond_to do |format|
      format.json { render(:json => @response) }
    end
  end
  
  def update_location
    if (@user_info)
      lat = params[:lat].to_f
      long = params[:long].to_f
      create_or_update_user(lat, long)
      
      lat_long = { :lat => lat, :long => long }
      
      respond_to do |format|
        format.json { render(:json => lat_long) }
      end
    else
      respond_to do |format|
        format.json { render(:json => :nothing) }
      end
    end
  end
end