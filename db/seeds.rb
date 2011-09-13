# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

timeNow = Time.now
Event.create(:id => 1, :name => 'GNR 2011', :date => timeNow, :info => 'Joe and Spens amazing GNR 2011', :forcewallpostsoff => false, :forceanonymousdonations => false, :created_at => timeNow, :updated_at => timeNow, :time_min => 120, :time_max => 180, :time_interval => 1)
Competitor.create(:id => 2, :event_id => 1, :facebook_id => '123456', :name => 'Joe', :donation_link => 'http://www.justgiving.com/geeksgorunning', :created_at => timeNow, :updated_at => timeNow)
Competitor.create(:id => 3, :event_id => 1, :facebook_id => 'fiznool', :name => 'Spen', :donation_link => 'http://www.justgiving.com/geeksgorunning', :created_at => timeNow, :updated_at => timeNow)