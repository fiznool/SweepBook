class JsController < ApplicationController
  layout false
  before_filter :js_content_type

  def js_content_type
    response.headers['Content-type'] = 'text/javascript; charset=utf-8'
  end

  def slider
    @values = Array.new
    @event = Event.first
    @i = @event.time_min
    while @i < @event.time_max do
      @values.push(@i)
      @i = @i + @event.time_interval
    end 
  end

end
