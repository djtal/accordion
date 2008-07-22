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
	effects : [],
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
				height : null,
				width : null
			},
			direction : 'vertical',
			onEvent : 'click'
		}, options || {});
		this.duration = ((11-this.options.resizeSpeed)*0.15);
		
		if (this.options.direction == 'horizontal') {
			this.scaling = $H({
				scaleX: true,
				scaleY: false,
				sync: true,
				scaleContent: true,
				transition: Effect.Transitions.sinoidal,
				duration: this.duration,
				restoreAfterFinish: true,
			});
		} else {
			this.scaling = $H({
				scaleX: false,
				scaleY: true,
				sync: true,
				scaleContent: true,
				transition: Effect.Transitions.sinoidal,
				duration: this.duration,
				restoreAfterFinish: true,
			});			
		}

		this.accordions = this.container.select(this.options.classNames.toggle); 
		
		this.accordions.each(function(accordion) {
			accordion.observe(this.options.onEvent, this.activate.bindAsEventListener(this, accordion));
			if (this.options.direction == 'horizontal') {
				var options = $H({width: '0px'});
			} else {
				var options = $H({height: '0px'});			
			}	
			accordion.next(0).setStyle(options).hide();			
		}.bind(this));
		
	},
	
	//
	//  Activate an accordion
	//
	activate : function(ev, accordion) {
		if (this.animating) {
			return false;
		}
		ev.stop();
		
		this.effects = [];
	
		this.currentAccordion = $(accordion.next(0));
		this.currentAccordion.setStyle({
			display: 'block'
		});		
		
		this.currentAccordion.previous(0).addClassName(this.options.classNames.toggleActive);
			
		if (this.currentAccordion == this.showAccordion) {
		  this.deactivate();
		} else {
		  this._handleAccordion();
		}
	},
	// 
	// Deactivate an active accordion
	//
	deactivate : function() {
		options = $H({
			queue: {
				position: 'end', 
				scope: 'accordionAnimation'
			},
			scaleMode: { 
				originalHeight: this.options.defaultSize.height ? this.options.defaultSize.height : this.currentAccordion.scrollHeight,
				originalWidth: this.options.defaultSize.width ? this.options.defaultSize.width : this.currentAccordion.scrollWidth
			},
			afterFinish: function() {
				this.showAccordion.setStyle({height: 'auto', display: 'none'});				
				this.showAccordion = null;
				this.animating = false;
			}.bind(this)
		}).merge(this.scaling);    
		
		this.showAccordion.previous(0).removeClassName(this.options.classNames.toggleActive);
		new Effect.SlideDown(this.showAccordion, 0, options);
	},

  //
  // Handle the open/close actions of the accordion
  //
	_handleAccordion : function() {
		options = $H({
			scaleMode: { 
				originalHeight: this.options.defaultSize.height ? this.options.defaultSize.height : this.currentAccordion.scrollHeight,
				originalWidth: this.options.defaultSize.width ? this.options.defaultSize.width : this.currentAccordion.scrollWidth
			}
		}).merge(this.scaling);
		
		this.effects.push(new Effect.SlideUp(this.currentAccordion, 100, options));

		if (this.showAccordion) {
			this.showAccordion.previous(0).removeClassName(this.options.classNames.toggleActive);
			this.effects.push(new Effect.SlideDown(this.showAccordion, 0, this.scaling));				
		}
		
		new Effect.Parallel(this.effects, {
			duration: this.duration, 
			queue: {
				position: 'end', 
				scope: 'accordionAnimation'
			},
			beforeStart: function() {
				this.animating = true;
			}.bind(this),
			afterFinish: function() {
				if (this.showAccordion) {
					this.showAccordion.setStyle({
						display: 'none'
					});				
				}
				$(this.currentAccordion).setStyle({
				  height: 'auto'
				});
				this.showAccordion = this.currentAccordion;
				this.animating = false;
			}.bind(this)
		});
	}
});
	