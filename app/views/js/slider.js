/* Author: 

*/


(function( $, undefined ) {

	var DonationChoice = function(competitor_id, choice) {
		this.competitor_id = competitor_id;
		this.choice = choice;
	}

	DonationChoice.prototype = {
		toString: function() { return this.competitor_id + " with time " + this.choice; }
	}

	var DonationStatus = function(donationText, donationValue, choiceTaken) {
		this.donationText = donationText;
		this.donationValue = donationValue;
		this.choiceTaken = choiceTaken;
	}

	DonationStatus.prototype = {
		toString: function() { return "choice: " + this.donationText + ", taken = " + this.choiceTaken; }
	}
	
	
	
	$(document).ready(function() {
		
		var competitors = new Array();
                var donations;

		<% @competitors.each do |c| %>
		competitors["<%= c.id %>"] = new Array();
		<% @data[c.id].sort.reverse.each do |value,taken| %>
		competitors["<%= c.id %>"].push(new DonationStatus("<%= Time.at(value*60).gmtime.strftime('%R') %>", <%= value %>, <%= taken %>));
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

				// Fill in choices
				$("#donation-modal-choices-list").empty();
				$(".sweep-slider").each(function(i) {
					if (!$(this).hasClass("ui-state-disabled")) {
						var c_id = $(this).data("competitor-id");
						$("#donation-modal-choices-list").append("<li><em>" + $("#slider-label-"+c_id+" span").text() + "</em> for " + $("#competitor-name-"+c_id).text() + "</li>");
					}
				});
				$("#donate-action-next-btn").text("Confirm Choices");

				$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
				$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");

				break;

				case 2:

				$("#donate-action-next-btn").text("Next");
				$("#donate-action-next-btn").hide();

				show_spinner();

				// Submit choices to server

				var choicesArray = new Array();
				$(".sweep-table-competitor-name").each(function(i) {
					var id = $(this).data("competitor-id");
					//	choicesArray[i] = new DonationChoice(id, $("#slider-label-"+id).text());
					choicesArray[i] = new DonationChoice(id, $("#slider-label-"+id).data("donation-value"));
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

						// TODO change this to real error handling
						$("#donate-label-step"+donate_action_current_step).removeClass("donate-step-current");
						$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");

						donate_action_current_step = move_to;
						$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
						$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");
					}
				});


				break;
				case 3:
                               
                                for ( var i = 0; i < donations.length; i++) 
                                {
                                  $.ajax({
                                           type: 'GET',
                                           url: "events/<%= @event.id %>/donations/"+donations[i]+"/publish",
                                           success: function() {},
                                           failure: function() {}});
                                }
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

		$("#donate_btn").click(function() {
			
			var cidTaken = new Array();
			var atLeastOneSliderIsActive = false;
			
			// Check that both selected choices haven't yet been taken, provided they are active
			$(".sweep-slider").each(function(i) {
				if (!$(this).hasClass("ui-state-disabled")) {
					atLeastOneSliderIsActive = true;
					var cid = $(this).data("competitor-id");
					var sliderIndex = $(this).slider("value");
					var donationStatus = competitors[cid][sliderIndex];
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
				for ( var i=cidTaken.length-1; i>=0; --i ){
				  $("#slider-label-"+cidTaken[i]).effect("bounce", { times:3 }, 300);
				}
			} else {
				$("#warning-alert:visible").hide();
				// Show modal
				$("#donate-action-next-btn").show();
				$("#donation-external-btn").show();
				move_donate_step(1);

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

		$(".modal-dismiss").click(function() {
			hide_spinner();
			$("#donate-action-finish-btn").hide();
		});
		
		$("#warning-alert-close").click(function() {
			$("#warning-alert:visible").hide("blind", { direction: "vertical" }, 200);
		});

		$(".sweep-dragger").draggable({ axis: 'y', containment: '#sweep_table'});
		$(".sweep-free-cell").droppable({
			drop: function() { $(this).addClass( "sweep-active-cell" ); },
			out: function() { $(this).removeClass( "sweep-active-cell" ); },
			hoverClass: 'sweep-hover-cell'
		});

		


		var slider_min = 0;
		var slider_max = <%= @values.length %> -1;
		var slider_step = 1;

		var updateSliderLabel = function(index, sliderEl) {
			var slider_id = sliderEl.data("competitor-id");
			var donationStatus = competitors[slider_id][index];
			var donationText = donationStatus.donationText;
			var choiceTaken = donationStatus.choiceTaken;
			var sliderLabelEl = $("#slider-label-"+slider_id);
			sliderLabelEl.data('donation-value',donationStatus.donationValue);
			if (choiceTaken) {
				sliderLabelEl.html("<span>" + donationText + "</span> is taken");
				sliderLabelEl.addClass("slider-label-taken");
			} else {
				sliderLabelEl.html("<span>" + donationText + "</span> is free");
				sliderLabelEl.removeClass("slider-label-taken");
			}
		}

		$(".sweep-slider").slider( {
			orientation: 'vertical',
			value: slider_max,
			min: slider_min,
			max: slider_max,
			step: slider_step,
			slide: function(event, ui) {
				updateSliderLabel(ui.value, $(this));
			}
		}).each(function(i) {
			updateSliderLabel(slider_max, $(this));
		});
		
		$('.add-on :checkbox').click(function() {
			if ($(this).attr('checked')) {
				$(this).parents('.add-on').addClass('active');
				var cid = $(this).parents('.sweep-table-competitor-name').data("competitor-id");
				$("#slider-"+cid).slider('enable');
				$("#slider-label-"+cid).css("visibility", "visible");
			} else {
				$(this).parents('.add-on').removeClass('active');
				var cid = $(this).parents('.sweep-table-competitor-name').data("competitor-id");
				$("#slider-"+cid).slider('disable');
				$("#slider-label-"+cid).css("visibility", "hidden");
			}
		});



	});

})(jQuery);























