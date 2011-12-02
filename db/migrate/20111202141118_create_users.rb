class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.integer :profile_id, :null => false
      t.string :profile_link, :null => false
      t.string :profile_pic, :null => false
      t.string :country
      
      t.float :last_known_lat, :null => false
      t.float :last_known_long, :null => false
      t.datetime :last_seen_time, :null => false
      
      t.timestamps
    end
    
    add_index :users, :profile_id
    add_index :users, :last_seen_time
  end
end
