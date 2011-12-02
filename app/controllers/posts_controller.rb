class PostsController < ApplicationController
  
  respond_to(:json)
  
  def index
    last = params[:last].to_i || 0
    
    @posts = Post.joins(:users).includes(:users).where(['id > ?', last]).limit(15).order('id DESC')
    
    respond_with(@posts)
  end
  
  def create
    puts @current_user
    
    user_details = @graph.get_object('me')
    
    @user = User.find_by_profile_id(user_details['id']);
    if @user
      @user.update_attributes({
        :last_known_lat => params[:post][:lat],
        :last_known_long => params[:post][:long],
        :last_seen_time => Time.now
      })
    else      
      @user = User.new({
        :profile_id => user_details['id'],
        :profile_link => user_details['link'],
        :profile_name => user_details['name'],
        :profile_pic => "//graph.facebook.com/#{user_details[id]}/picture",
        :country => user_details['hometown']['name'].split.last.strip,
        :last_known_lat => params[:post][:lat],
        :last_known_long => params[:post][:long],
        :last_seen_time => Time.now
      })
    end
    
    @user.save
    
    @post = Post.new(params[:post])
    @post.user = @user
    
    if (@post.save)
      respond_with(@post) do |format|
        format.json { render(:json => @post) }
      end
    else
      
    end
  end
end
