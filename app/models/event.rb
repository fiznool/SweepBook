class Event < ActiveRecord::Base
  validates :name, :presence => true
  validates :date, :presence => true
  validates :info, :presence => true
end
