class Donation < ActiveRecord::Base
  validates_uniqueness_of :choice, :scope => [:event_id, :competitor_id]
  belongs_to :event
  belongs_to :competitor
end
