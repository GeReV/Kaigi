class HomeController < ApplicationController
  def index
    
    last = params[:last].to_i || 0
    
    @posts = Post.where(['id > ?', last]).limit(15).order('id DESC')
    
    @post = Post.new
  end
end
