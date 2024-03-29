# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

timeNow = Time.now
e = Event.create(:name => 'Great North Run 2011', :date => timeNow, :info => 'Joe and Spens amazing GNR 2011', :forcewallpostsoff => false, :forceanonymousdonations => false, :time_min => 120, :time_max => 180, :time_interval => 1, :donation_link => 'http://www.justgiving.com/geeksgorunning')
Competitor.create( :event_id => e.id, :facebook_id => '193109466', :name => 'Joe', :image_url => 'joe-mugshot.png') 
Competitor.create( :event_id => e.id, :facebook_id => '193107061', :name => 'Tom', :image_url => 'tom-mugshot.png')
