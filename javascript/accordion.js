// accordion.js v2.0
//
// Copyright (c) 2007 stickmanlabs
// Author: Kevin P Miller | http://www.stickmanlabs.com
// 
// Accordion is freely distributable under the terms of an MIT-style license.
//
// I don't care what you think about the file size...
//   Be a pro: 
//	    http://www.thinkvitamin.com/features/webapps/serving-javascript-fast
//      http://rakaz.nl/item/make_your_pages_load_faster_by_combining_and_compressing_javascript_and_css_files
//

/*-----------------------------------------------------------------------------------------------*/

if (typeof Effect == 'undefined') 
	throw("accordion.js requires including script.aculo.us' effects.js library!");

var Accordion = Class.create({
	//
	//  Setup the Variables
	//
	showAccordion : null,
	currentAccordion : null,
	duration : null,
	animating : false,
	
	//  
	//  Initialize the accordions
	//
	initialize: function(container, options) {
		if (!$(container)) {
			throw(container+" doesn't exist!");
			return false;
		}
		this.container = $(container);
		this.options = Object.extend({
			resizeSpeed : 8,
			classNames : {
				toggle : '.accordion_toggle',
				toggleActive : 'accordion_toggle_active',
				content : 'accordion_content'
			},
			defaultSize : {
				height : 30,
				width : null
			},
			onEvent : 'click'
		}, options || {});
		
    this.duration = ((11-this.options.resizeSpeed)*0.15)

		this.accordions = this.container.select(this.options.classNames.toggle); 
		this.heights = $H(); 
		this.accordions.each(function(accordion) {
			accordion.observe(this.options.onEvent, this.activate.bindAsEventListener(this, accordion));
			accordion.identify();			
			this.heights.set(accordion.id, accordion.next(0).scrollHeight)
			accordion.next(0).hide();
			
		}.bind(this));
		this.previous = null;
		this.current = this.accordions[0];
		this.handleEffect();
	},
	
	activate: function(ev, accordion){
	  ev.stop();
	  this.previous = this.current;
	  this.current = accordion;
	  this.handleEffect();
	},
	
	handleEffect: function(){
	  [this.previous, this.current].compact().invoke("toggleClassName", this.options.classNames.toggleActive)
	  effects = $A();
	  if (this.previous){ //scale previous down  
	      effects.push(new Effect.Scale(this.previous.next(0), 0, {sync: true, scaleContent: false, 
	                                      afterFinish: function(){this.previous.next(0).hide();}.bind(this),
    	                                  scaleX: false,
    	                                  transition: Effect.Transitions.sinoidal,
    	                                  duration: this.duration}));
	      
	  }
	    
	  if (this.current){ //scale current up now
	      effects.push(new Effect.Scale(this.current.next(0), 100, {sync: true, scaleContent: false, 
	                                      beforeStart: function(){this.current.next(0).show();}.bind(this),
    	                                  scaleX: false,
    	                                  scaleFrom: 0,
    	                                  scaleMode:{originalHeight: this.heights.get(this.current.id),
    	                                  transition: Effect.Transitions.sinoidal,
    	                                  duration: this.duration}}));
	  }
	  this.startEffect(effects);
	},
	
	startEffect: function(effects){
  	new Effect.Parallel(effects, {duration: this.duration});
	},
});
	