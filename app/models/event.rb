class Event < ActiveRecord::Base
  has_many :competitors
  validates :name, :presence => true
  validates :date, :presence => true
  validates :info, :presence => true
end
