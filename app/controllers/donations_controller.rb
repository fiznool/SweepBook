class DonationsController < ApplicationController
  def create 

    donations= Array.new
    donation_ids = Array.new

    if( params.has_key?('json') )
      @json = ActiveSupport::JSON.decode(params[:json])
      @json.each do |c|
        d = Donation.new( :event_id => params[:event_id],
                          :competitor_id => c['competitor_id'],
                          :choice => c['choice'] );
        if d.errors.any?
          render :json => d.errors, :status => 400
          return
        else
          donations.push(d)
        end    
      end
    else
      d = Donation.new( :event_id => params[:event_id],
                        :competitor_id => params[:competitor_id],
                        :choice => params[:choice] )
      if d.errors.any?
        return :json => d.errors, :status => 400 
      end
    end

    donations.each do |don|
      if don.save
        donation_ids.push(don.id)
      else
        render :json => don.errors, :status => 400
        return
      end
    end 
    render :json => donation_ids , :status => :ok
  end

  def confirm
  end

  def publish
    @donation = Donation.find(params[:donation_id])
    @post = Mogli::Post.new( :message => "I just guessed #{@donation.competitor.name}" + \
                                         " will run the GNR in #{Time.at(@donation.choice.to_i*60).gmtime.strftime('%R')}" + \
                                         " using Sweep on Facebook", :link => 'http://apps.facebook.com/155060017912139/' ) 
    if current_facebook_user
      current_facebook_user.fetch
      current_facebook_user.feed_create( @post )
    end
    render :json => @post, :status => :ok
  end

  def destroy
    @d = Donation.find(params[:id])
    @d.destroy
  end
end

