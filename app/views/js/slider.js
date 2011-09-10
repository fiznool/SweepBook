/* Author: 

*/

(function( $, undefined ) {

	
	var donate_action_current_step = 1;
	
	function move_donate_step(move_to) {
		$("#donate-label-step"+donate_action_current_step).removeClass("donate-step-current");
		$("#donate-action-step"+donate_action_current_step).removeClass("donate-action-current-step");
		
		donate_action_current_step = move_to;
		
		$("#donate-label-step"+donate_action_current_step).addClass("donate-step-current");
		$("#donate-action-step"+donate_action_current_step).addClass("donate-action-current-step");
	}
	
	$("#donate-action-next-btn").click(function() {
		// Move to the next page
		move_donate_step(donate_action_current_step+1);
	
		if (donate_action_current_step === 3) {
			$("#donate-action-next-btn").hide();
			$("#donate-action-finish-btn").show();
		}
	});
	
	$(".modal-dismiss").click(function() {
		move_donate_step(1);
		$("#donate-action-next-btn").show();
		$("#donate-action-finish-btn").hide();
	});
	
	
	
	$(document).ready(function() {
		$(".sweep-dragger").draggable({ axis: 'y', containment: '#sweep_table'});
		$(".sweep-free-cell").droppable({
			drop: function() { $(this).addClass( "sweep-active-cell" ); },
			out: function() { $(this).removeClass( "sweep-active-cell" ); },
			hoverClass: 'sweep-hover-cell'
		});

		var slider_vals = [
		<% @values.reverse.each do |v| %>
		"<%= Time.at(60*v).gmtime.strftime('%R') %>",
		<% end %>
		];

		var slider_min = 0;
		var slider_max = slider_vals.length - 1;
		var slider_step = 1;

		$(".sweep-slider").slider( {
			orientation: 'vertical',
			value: slider_max,
			min: slider_min,
			max: slider_max,
			step: slider_step,
			slide: function(event, ui) {
				var index = ui.value;
				var slider_id = $(this).data("slider-id");

				// Update the label from the slider_vals
				var label_to_write = slider_vals[index];
				$("#slider-label-"+slider_id).html(label_to_write);
			}
		} );
	});

})(jQuery);























