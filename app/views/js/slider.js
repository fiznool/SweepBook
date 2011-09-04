/* Author: 

*/


(function( $, undefined ) {

	var Competitor = function(id, name, sliderImage) {
		this.id = id;
		this.name = name;
		this.sliderImage = sliderImage;
		this.donationStatus = new Array();
	}

	Competitor.prototype = {
		toString: function() { return this.name; }
	}

	var DonationStatus = function(donationText, donationValue, choiceTaken, donatorId) {
		this.donationText = donationText;
		this.donationValue = donationValue;
		this.choiceTaken = choiceTaken;
                this.donatorId = donatorId;
	}

	DonationStatus.prototype = {
		toString: function() { return "choice: " + this.donationText + ", taken = " + this.choiceTaken; }
	}

	var DonationChoice = function(competitor_id, choice, facebook_id) {
		this.competitor_id = competitor_id;
		this.choice = choice;
		this.facebook_id = facebook_id;
	}

	DonationChoice.prototype = {
		toString: function() { return this.competitor_id + " with time " + this.choice; }
	}

        var Donator = function(facebook_id) {
                this.facebook_id = facebook_id;
                // Async, get the thumbnail
                this.facebook_data = null; 
                this.image = null;
        }

        Donator.prototype = {
                toString: function() { return this.facebook_id; }
        }


	$(document).ready(function() {

		var competitors = new Array();
                var donators    = new Array();
                var donatorIds  = new Array();

		var donations;
		<% @competitors.each do |c| %>
		competitors["<%= c.id %>"] = new Competitor("<%= c.id %>", "<%= c.name %>", "<%= c.image_url %>");
		<% @data[c.id].sort.reverse.each do |value,taken| %>
                  <% if taken.is_a?(Donation) %>
                    competitors["<%= c.id %>"].donationStatus.push(new DonationStatus("<%= Time.at(value*60).gmtime.strftime('%l hr %M min') %>", <%= value %>, true, "<%= taken.facebook_id %>"));
//                    donators[<%= taken.facebook_id %>] = 1; 
                    donators["<%= taken.facebook_id %>"] = new Donator("<%= taken.facebook_id %>");
                    donatorIds.push("<%= taken.facebook_id %>"); 
                  <% else %>
		    competitors["<%= c.id %>"].donationStatus.push(new DonationStatus("<%= Time.at(value*60).gmtime.strftime('%l hr %M min') %>", <%= value %>, false, null));
                  <% end %>
		<% end %> 
		<% end %>

		// Donation Modal logic
		var donate_action_current_step = 1;

		var move_donate_step = function(move_to) {

			switch (move_to) {
				case 1:
				$("#donate-label-step"+donate_action_current_step).removeClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");

				donate_action_current_step = move_to;

				$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");

				break;

				case 2:
				$("#donate-label-step"+donate_action_current_step).removeClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");

				donate_action_current_step = move_to;

				// Fill in choices
				$("#donation-modal-choices-list").empty();
				$(".sweep-slider").each(function(i) {
					if (!$(this).slider('option', 'disabled')) {	// Only send to server if the slider is enabled
						var cid = $(this).data("competitor-id");
						var competitor = competitors[cid];
						var donationStatus = competitor.donationStatus[$(this).slider('value')];
						if (!donationStatus.choiceTaken) {
							$("#donation-modal-choices-list").append("<li><em>" + donationStatus.donationText + "</em> for " + competitor.name + "</li>");
						}
					}
				});
				$("#donate-action-next-btn").text("Confirm Choices");

				$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");

				break;

				case 3:

				$("#donate-action-next-btn").text("Next");
				$("#donate-action-next-btn").hide();

				show_spinner();

				// Submit choices to server
				FB.api('/me', function(response) {
					var choicesArray = new Array();
					$(".sweep-slider").each(function(i) {
						if (!$(this).slider('option', 'disabled')) {	// Only send to server if the slider is enabled
							var cid = $(this).data("competitor-id");
							var competitor = competitors[cid];
							var donationStatus = competitor.donationStatus[$(this).slider('value')];
							if (!donationStatus.choiceTaken) {
								choicesArray.push(new DonationChoice(cid, donationStatus.donationValue, response.id));
							}
						}
					});


					$.ajax({
						type: 'POST',
						url: "events/<%= @event.id %>/donations",
						data:  { json: JSON.stringify(choicesArray) },
						datatype: 'JSON',
						success: function(data) {
							hide_spinner();
							donations = data;
							$("#donate-label-step"+donate_action_current_step).removeClass("donate-step-current");
							$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");

							donate_action_current_step = move_to;
							$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
							$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");
						},
						error: function() {
							hide_spinner();
							$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");
							$("#donate-action-next-btn").hide();
							$("#donate-action-ajax-error").addClass("donate-action-current-step");
						}
					});
				});


				break;
				case 4:

				$("#donate-label-step"+donate_action_current_step).removeClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");

				$("#donate-action-next-btn").hide();
				$("#donate-action-finish-btn").show();

				donate_action_current_step = move_to;

				$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");

				break;
				default:
				break;
			}


		}

		var donation_spinner;

		var show_spinner = function() {
			if (donation_spinner === undefined) {
				var opts = {
					lines: 10, // The number of lines to draw
					length: 4, // The length of each line
					width: 2, // The line thickness
					radius: 4, // The radius of the inner circle
					color: '#000', // #rbg or #rrggbb
					speed: 1, // Rounds per second
					trail: 50, // Afterglow percentage
					shadow: false // Whether to render a shadow
				};
				donation_spinner = new Spinner(opts);
			}
			$("#donate-loading-spinner").show();
			donation_spinner.spin(document.getElementById("donate-loading-spinner"));	// spin.js requires the raw DOM element, not the jQuery one
		}

		var hide_spinner = function() {
			if (donation_spinner !== undefined) {
				donation_spinner.stop();
			}
			$("#donate-loading-spinner").hide();
		}

		$("#donate-action-next-btn").click(function() {
			// Move to the next page
			move_donate_step(donate_action_current_step+1);
		});

		$(".donation-anchor").click(function() {
			$("#donation-external-btn").hide();
			$("#donate-action-next-btn").show();
		});

		$("#donate-btn").click(function() {

			var cidTaken = new Array();
			var atLeastOneSliderIsActive = false;

			// Check that both selected choices haven't yet been taken, provided they are active
			$(".sweep-slider").each(function(i) {
				// Check if the slider is enabled or not...
				if (!$(this).slider('option', 'disabled')) {
					atLeastOneSliderIsActive = true;
					var cid = $(this).data("competitor-id");
					var competitor = competitors[cid];
					var donationStatus = competitor.donationStatus[$(this).slider("value")];
					if (donationStatus.choiceTaken) {
						cidTaken.push(cid);
					}
				} 
			});

			if (!atLeastOneSliderIsActive) {
				showWarningAlert($("#warning-alert-msg-none-selected"));
			} else if (cidTaken.length > 0) {
				// Only show if not already shown
				showWarningAlert($("#warning-alert-msg-already-taken"));
				/*for ( var i=cidTaken.length-1; i>=0; --i ){
				$("#slider-label-"+cidTaken[i]).effect("bounce", { times:3 }, 300);
				}*/
			} else {
				$("#warning-alert:visible").hide();

				// Show modal, check if logged in
				FB.getLoginStatus(function(response) {
					if(response.status === 'connected'){
						$("#donate-action-next-btn").show();
						$("#donation-external-btn").show();
						move_donate_step(2);
					} else { 
						FB.Event.subscribe('auth.login', function() {
							$("#donate-action-next-btn").show();
							$("#donation-external-btn").show();
							move_donate_step(2);
						} );
						$("#donate-action-next-btn").hide();
						move_donate_step(1);
					}
				});


				$('#donate-modal-reveal').reveal({
					animation: 'fadeAndPop',					//fade, fadeAndPop, none
					animationspeed: 300,						//how fast animtions are
					closeonbackgroundclick: false,				//if you click background will modal close?
					dismissmodalclass: 'modal-dismiss'    		//the class of a button or element that will close an open modal
				});
			}

		});

		var showWarningAlert = function(msgEl) {
			$(".warning-alert-msg").hide();
			msgEl.show();
			$("#warning-alert:hidden").show("blind", { direction: "vertical" }, 500);
		}

		$("#donate-action-finish-btn").click(function() {
			$("#donate-action-finish-btn").hide();
			if ($("#wallpost-checkbox").attr('checked')) {
				show_spinner();
				var post_params = {};
				post_params['name'] = 'I Donated to Joe and Spen for the <%= @event.name %> using SweepBook';
				post_params['link'] = 'http://apps.facebook.com/155060017912139/';
				post_params['description'] = 'On SweepBook I backed Joe and Spen in the <%= @event.name %>. ' +
				'Joe and Spen are raising money for the MS Trust using Sweepbook - click above and you can '+
				'play along too!';

				FB.api('/me/feed','post',post_params,function(response) {
					// Close the modal and refresh the page
					// Simulate a modal mouse click
					$(".modal-dismiss").click();
				});
			} else {
				$(".modal-dismiss").click();
			}

		});


		$(".modal-dismiss").click(function() {
			hide_spinner();
			$("#donate-action-finish-btn").hide();

			// Refresh the page
			window.location.reload();	// This causes IE to pop up an annoying message. Need to fix
		});

		$(".warning-alert-close").click(function() {
			$(this).parent(".alert-message").hide("blind", { direction: "vertical" }, 200);
		});

		
		var slider_min = 0;
		var slider_max = <%= @values.length %> -1;
		var slider_step = 1;


		var updateSliderLabel = function(index, sliderEl, setImage) {
			var cid = sliderEl.data("competitor-id");
			var competitor = competitors[cid];
			var donationStatus = competitor.donationStatus[index];
			var donationText; 
			var sliderHandleEl = sliderEl.children(".ui-slider-handle,a");
                        var sliderContent;

			if (setImage) {
				sliderHandleEl.css("background-image", "url(../images/"+competitor.sliderImage+")");
                                /*fbEnsureInit( function() {
                                  for ( var i in donatorIds ) 
                                  {
                                    var d = donators[donatorIds[i]];

                                    if(d && !d.facebook_data)
                                    {
                                      FB.api('/'+ i + '?fields=picture,name&type=square', function(r){
                                        if(r.id && donators[r.id]){ 
                                          donators[r.id].facebook_data = r;
                                          donators[r.id].image = $('<img />').attr('src',r.picture);
                                        }else if(r.name && donators[r.name]){
                                          donators[r.name].facebook_data = r;
                                          donators[r.name].image = $('<img />').attr('src',r.picture);
                                        } 
                                      });
                                    }
                                  }
                                });*/
			}
			if (donationStatus.choiceTaken) {
                                donationText = donationStatus.donationText + ' is taken';
                                if( !donators[donationStatus.donatorId].image )
                                {
                                  FB.api('/' + donationStatus.donatorId + '?fields=picture,name&type=square', function(r){ 
                                    donators[donationStatus.donatorId].facebook_data = r;
                                    donators[donationStatus.donatorId].image = $('<img />').attr('src',r.picture);
                                  });
                                }else{
                                  donationText = donationText + ' by ' + donators[donationStatus.donatorId].facebook_data.name
                                }
                                sliderContent = '<span class="ui-slider-tooltip ui-widget-content ui-corner-all">'+donationText+'</span>';
				sliderHandleEl.html(sliderContent);
				sliderHandleEl.css("color", "red");
                                sliderHandleEl.find('span').append(donators[donationStatus.donatorId].image);
			} else {
                                donationText = donationStatus.donationText + ' is free';
				sliderHandleEl.html('<span class="ui-slider-tooltip ui-widget-content ui-corner-all">'+donationText+'</span>');
				sliderHandleEl.css("color", "");
			}
		}


		$(".sweep-slider").slider( {
			orientation: 'vertical',
			value: slider_max,
			min: slider_min,
			max: slider_max,
			step: slider_step,
			create: function(event, ui) {
				updateSliderLabel(slider_max, $(this), true);
			},
			start: function(event, ui){

			},
			slide: function(event, ui){
				updateSliderLabel(ui.value, $(this), false);
			},
			stop: function(event, ui){

			}
		});

		$('.add-on :checkbox').click(function() {
			if ($(this).attr('checked')) {
				$(this).parents('.add-on').addClass('active');
				var cid = $(this).parents('.sweep-table-competitor-name').data("competitor-id");
				$("#slider-"+cid).slider('enable');
				//$("#slider-label-"+cid).css("visibility", "visible");
				$("#competitor-name-"+cid).addClass('competitor-name-active');
			} else {
				$(this).parents('.add-on').removeClass('active');
				var cid = $(this).parents('.sweep-table-competitor-name').data("competitor-id");
				$("#slider-"+cid).slider('disable');
				//$("#slider-label-"+cid).css("visibility", "hidden");
				$("#competitor-name-"+cid).removeClass('competitor-name-active');
			}
		});

                //// Pre load some pictures!
                //var donators = new Array();
                //<% @donations.keys.each do |d| %>
                //  donators[<%= d %>] = new Donator(<%= d %>);
                //  $('body').append(donators[<%= d %>].image);
                //<% end %>

	});

})(jQuery);
