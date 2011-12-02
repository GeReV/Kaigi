class FixUsers < ActiveRecord::Migration
  def up
    
    add_column(:users, :profile_name, :string, :null => false)
    
    remove_index(:users, :profile_id)
    add_index(:users, :profile_id, :unique => true)
  end

  def down
    
    remove_column(:users, :profile_name)
    
    remove_index(:users, :profile_id)
    add_index(:users, :profile_id)
  end
end
