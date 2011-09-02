class Competitor < ActiveRecord::Base
  belongs_to :event
  has_one :result_option
end
