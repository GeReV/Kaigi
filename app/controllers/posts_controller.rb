class PostsController < ApplicationController
  
  respond_to(:json)
  
  def index
    latest = params[:latest].to_i || 0
    
    @posts = Post.joins(:user).includes(:user).where(['id > ?', latest]).limit(15).order('id DESC')
    
    respond_with(@posts)
  end
  
  def create
    
    user_details = @user_info
        
    create_or_update_user(params[:post][:lat], params[:post][:long])
    
    @user.save
    
    if request.xhr? || remotipart_submitted?
    
      @post = Post.new(params[:post])
      @post.user = @user
      
      if (@post.save)
        
        post = {
          :id => @post.id,
          :user => @post.user,
          :text => @post.text,
          :lat => @post.lat,
          :long => @post.long
        }
        
        if @post.image.file?
          post.merge!({          
            :image_thumb => @post.image.url(:thumbnail),
            :image_url => @post.image.url(:normal)
          })
        end
        
        respond_with(@post) do |format|
          format.json { render(:json => post) }
        end
      end
    end
  end
end
