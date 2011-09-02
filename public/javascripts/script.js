/* Author: 

*/

(function( $, undefined ) {
  $("#donate_btn").click(function(){
		$("#donate_modal").show();
		$("#modal_fade_overlay").show();
	});
	
	$("#donate_modal_close").click(function(){
		$("#donate_modal").hide();
		$("#modal_fade_overlay").hide();
	});
	
	$(document).ready(function() {
    $(".sweep-dragger").draggable({ axis: 'y', containment: '#sweep_table'});
		$(".sweep-free-cell").droppable({
      drop: function() { $(this).addClass( "sweep-active-cell" ); },
			out: function() { $(this).removeClass( "sweep-active-cell" ); },
			hoverClass: 'sweep-hover-cell'
    });
		
		var slider_vals = [
			"Over 3 hrs",
			"2:50:00 to 2:59:59",
			"2:40:00 to 2:49:59",
			"2:30:00 to 2:39:59",
			"2:20:00 to 2:29:59",
			"2:10:00 to 2:19:29",
			"2:00:00 to 2:09:29",
			"1:50:00 to 1:59:59",
			"1:40:00 to 1:49:59",
			"1:30:00 to 1:39:59",
			"Less than 1hr 30 mins"
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























