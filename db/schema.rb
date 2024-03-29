# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111202193244) do

  create_table "posts", :force => true do |t|
    t.integer  "user_id",            :null => false
    t.text     "text"
    t.float    "lat",                :null => false
    t.float    "long",               :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  add_index "posts", ["user_id"], :name => "index_posts_on_user_id"

  create_table "users", :force => true do |t|
    t.integer  "profile_id",      :null => false
    t.string   "profile_link",    :null => false
    t.string   "profile_pic",     :null => false
    t.string   "country"
    t.float    "last_known_lat",  :null => false
    t.float    "last_known_long", :null => false
    t.datetime "last_seen_time",  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "profile_name",    :null => false
  end

  add_index "users", ["last_seen_time"], :name => "index_users_on_last_seen_time"
  add_index "users", ["profile_id"], :name => "index_users_on_profile_id", :unique => true

end
