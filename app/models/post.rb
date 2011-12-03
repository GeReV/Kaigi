class Post < ActiveRecord::Base
  has_attached_file(:image, :styles => {:thumbnail => ["125x85>", :jpg], :normal => ["480x320", :jpg]})
  belongs_to(:user)
end
