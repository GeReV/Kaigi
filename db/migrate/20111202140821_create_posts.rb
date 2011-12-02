class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.references :user, :null => false
      t.text :text
      t.float :lat, :null => false
      t.float :long, :null => false
      
      t.timestamps
    end
    
    add_index :posts, :user_id
  end
end
