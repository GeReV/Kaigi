class HomeController < ApplicationController
  
  respond_to(:json)
  
  def index
    
    last = params[:last].to_i || 0
    
    @posts = Post.where(['id > ?', last]).limit(15).order('id DESC')
    
    @post = Post.new
  end
  
  def get_users_and_posts
    users = User.where(['last_seen_time > ? AND profile_id <> ?', Time.now - 24.hours, @user_info["id"]])
    posts = Post.where(['created_at > ?', Time.now - 3.hours])
    
    @response = { 
      :users => users, 
      :posts => posts.map {|p| {
          :id => p.id,
          :text => p.text,
          :lat => p.lat,
          :long => p.long,
          :image_thumb => p.image.url(:thumbnail),
          :image_url => p.image.url(:normal)
<<<<<<< HEAD
        }) if p.image.file?
        
        return hash
    end
    
    response = { 
      :users => users, 
      :posts => posts
=======
        } } 
>>>>>>> parent of 9e8b679... Finishing touches before demo
    }
    
    respond_to(response) do |format|
      format.json { render(:json => @response ) }
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