document.observe("dom:loaded", function() {
	var bottomAccordion = new Accordion('vertical_container');
	height = $("scale_box").scrollHeight;
	$("scale_trigger_down").observe("click", function(){
	  new Effect.Scale("scale_box", 0, {scaleContent: false, afterFinish: function(){$("scale_box").hide();},
	                                    scaleX: false})
	});
	$("scale_trigger_up").observe("click", function(){
	  new Effect.Scale("scale_box", 100, {scaleContent: false, afterFinish: function(){$("scale_box").show();},
	                                      scaleX: false, scaleMode: {originalHeight: height}, scaleFrom: 0})
	});
	
	
});
