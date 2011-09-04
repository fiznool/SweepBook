class HomeController < ApplicationController
  def index
    @event = Event.first
    @event_id = @event.id
    @competitors = @event.competitors.sort_by { |c| c.id }
  end

end
