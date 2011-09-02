class HomeController < ApplicationController
  def index
    @event_id = 1
    @event = Event.find(@event_id)
    @competitors = @event.competitors
  end

end
