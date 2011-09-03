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

ActiveRecord::Schema.define(:version => 20110903174539) do

  create_table "competitors", :force => true do |t|
    t.integer  "event_id"
    t.string   "facebook_id"
    t.string   "donation_link"
    t.integer  "time_result"
    t.text     "result_story"
    t.integer  "result_option_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "donations", :force => true do |t|
    t.integer  "event_id"
    t.integer  "competitor_id"
    t.string   "donator_id"
    t.string   "external_uid"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "choice"
    t.string   "status",        :default => "unconfirmed"
  end

  create_table "events", :force => true do |t|
    t.string   "name"
    t.datetime "date"
    t.text     "info"
    t.boolean  "forcewallpostsoff"
    t.boolean  "forceanonymousdonations"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "time_min"
    t.integer  "time_max"
    t.integer  "time_interval",           :default => 5
  end

end
