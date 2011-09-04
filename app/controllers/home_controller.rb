class HomeController < ApplicationController
  def index
    @event_id = 1
    @event = Event.find(@event_id)
    @competitors = @event.competitors.sort_by { |c| c.id }
  end

end
