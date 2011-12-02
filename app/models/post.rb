class Post < ActiveRecord::Base
  has_attached_file(:image, :styles => {:thumbnail => ["75x75>", :jpg], :normal => ["1200x1200>", :jpg]})
  belongs_to(:user)
end
