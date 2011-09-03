class JsController < ApplicationController
  layout false
  before_filter :js_content_type

  def js_content_type
    response.headers['Content-type'] = 'text/javascript; charset=utf-8'
  end

  def slider
    @values 	= Array.new
    @event 	= Event.first
    @donations  = Array.new
    @data       = Hash.new

    @competitors = @event.competitors

    @competitors.each do |c|
      @data[c.id] = Hash.new 
      @i = @event.time_min
      while @i < @event.time_max do
        @data[c.id][@i] = 'false'
        @i = @i + @event.time_interval
      end
      Donation.where( "event_id = ? AND competitor_id = ?", @event.id,c.id).each do |d|
        @data[c.id][d.choice.to_i] = 'true'; 
      end
    end

    @i = @event.time_min
    while @i < @event.time_max do
      @values.push(@i)
      @i = @i + @event.time_interval
    end 
  end

end
