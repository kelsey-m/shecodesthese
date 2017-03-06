/**
	Bubble Experiment
	Dependencies: GSAP, jquery
**/

var mouse_x = 0;
var mouse_y = 0;
var stage_w = 0;
var stage_h = 0;
var stage;

//------------------ initStage
function initStage(){
	stage = document.getElementById("bubble-generator");
	addStageMouseListeners();
	stage_w = $(stage).width();
    stage_h = $(stage).height();

    window.addEventListener("resize", function(){
        //self.onWindowResize();
        stage_w = $(stage).width();
        stage_h = $(stage).height();
    });
}
//------------------ addStageMouseListeners
function addStageMouseListeners(){
	if(!stage) return;
	mouse_x = $(stage).width()*0.5;
	mouse_y = $(stage).height()*0.75;
	//need to force a difference
	//in mouse pos in cae the
	//user doesnt move their mouse
	stage.addEventListener('mousemove', function(event) {
	    mouse_x = event.clientX;
	    mouse_y = event.clientY;
	}, false);
}

// ----------------------- Bubble
function Bubble(){}

Bubble.prototype = {
	EDGE_PADDING_X: 170,
	EDGE_PADDING_Y: 70,
	//the bubble  DOM element
	el: null,
	//velocities
	vx: 13,
	vy: 32,
	//deltas
	ds: 150,
	dx: 500,
	dy: 500,
	//scales
	width_perc: (20 + 130*Math.random()),
	height_perc: (20 + 130*Math.random()),
	xscale: 1,
	yscale: 1,
	//positions
	x: 500,
	y: 200,
	numBubbles: 0,
	is_paused: false,
	is_loaded: false,
	//------------------ init
	init: function(stage, html, z_index){
		this.create(stage, html, z_index);
	},
	//------------------ create
	create: function(stage, html, z_index){
		var self = this;
		this.el = document.createElement("div");
		this.el.style.position = "absolute";
		this.el.style.opacity = 0;
		this.el.style.zIndex = z_index;
		this.el.innerHTML = html;

		this.stage = stage;
		this.createTimeout = setTimeout(function(){			
			//add to the stage element			
			self.stage.appendChild(self.el);
			self.initImg();
		}, 500);

		this.reset();
		this.addMouseListeners();
	},
	//------------------ dispose
	dispose: function(){
		var img = this.el.getElementsByTagName("IMG");
		if(img.length) $(img[0]).off();
		this.removeMouseListeners();
		clearTimeout(this.createTimeout);
		TweenLite.killTweensOf(this.el);		
	},
	//------------------ reset
	reset: function(){
		this.vx = 32;
		this.vy = 12;
		this.x = $(this.stage).width()/2;
		this.y = $(this.stage).height()/2;
		this.dx = $(this.stage).width()/4 + (Math.random()*$(this.stage).width()/4);
		this.dy = $(this.stage).height()/4 + (Math.random()*$(this.stage).height()/4);
		this.ds = $(this.stage).height()/4;

		if(parseInt(this.el.style.width)) {
			var to_x = ($(this.stage).width() - $(this.el).width())/2;
			var to_y = ($(this.stage).height() - $(this.el).height())/2;
			this.el.style.top = to_y + "px";
			this.el.style.left = to_x + "px";
		}
	},
	//------------------ destroy
	destroy: function(){
		//dispose
		this.dispose();
		//and remove from 
		var stage = this.el.parentElement;
		if(stage) stage.removeChild(this.el);
	},
	//------------------ initImg
	initImg: function(){
		var self = this;
		//check for img load complete
		var img = this.el.getElementsByTagName("IMG");
		if(img.length){
			if(img[0].complete) this.onImgLoadComplete($(img[0]));
			else{
				$(img[0]).on("load", function(event){
					self.onImgLoadComplete($(this));
				});
			}
		}
		else this.is_loaded = true;
	},
	//------------------ onImgLoadComplete
	onImgLoadComplete: function(img){
		//get the width and the height
		this.el.style.width = img.width() + "px";
		this.el.style.height = img.height() + "px";

		//intially set the x and y
		//positions to the center of the stage
		var to_x = ($(this.stage).width() - parseInt(this.el.style.width))/2;
		var to_y = ($(this.stage).height() - parseInt(this.el.style.height))/2;
		this.el.style.top = to_y + "px";
		this.el.style.left = to_x + "px";

		//fade in intitally
		TweenLite.to(this.el, 0.15, {opacity:1, delay:0.15});
		this.is_loaded = true;
	},
	//------------------ addMouseListeners
	addMouseListeners: function(){
		var self = this;
		$(this.el).on("mouseover", function(){ self.focus(); });
		$(this.el).on("mouseout", function(){ self.unfocus(); });
	},
	//------------------ removeMouseListeners
	removeMouseListeners: function(){
		$(this.el).off();
	},
	//------------------ focus
	focus: function(){
		//pause anim
		//enlarge
		//and move toward center
		//if along edge
		this.moveTowardCenter();
		this.moveToTop();
		this.is_paused = true;
	},
	//------------------ moveToTop
	moveToTop: function(){
		//set the z-index
		//to the topmost in the 
		//bubble stack
		//-----
		//find the current topmost
		//z-index
		var bubbles = this.stage.childNodes;
		var highest_z_index = 0;
		var z_index = 0;
		for(var i=0;i<bubbles.length;i++){
			z_index = parseInt(bubbles[i].style.zIndex);
			if(highest_z_index < z_index) highest_z_index = z_index;
		}
		this.el.style.zIndex = highest_z_index+1;
	},
	//------------------ unfocus
	unfocus: function(){
		//set back to previous scale
		//resume anim
		//scale to 1
		var self = this;
		TweenLite.to(this.el, 0.25, {
			scale:1.0, 
			ease:Back.easeOut, 
			delay: 0.1, 
			onComplete: function(){self.is_paused = false;} 
		});
	},
	//------------------ moveTowardCenter
	moveTowardCenter: function(){
		var delta_x = this.getCenterDeltas().delta_x;
		var delta_y = this.getCenterDeltas().delta_y;

		TweenLite.to(this.el, 0.5, {x:delta_x, y:delta_y, ease:Back.easeOut});
		//enlarge with an easeOutBack
		TweenLite.fromTo(this.el, 0.5,
			{scale: 0.6}, 
			{scale:2.0, 
			ease:Back.easeOut, 
			delay: 0.1
		});
	},
	//------------------ getCenterDeltas
	getCenterDeltas: function() {
		var to_x, to_y;
		var delta_x, delta_y;

		//check current x and y position if close to edge move toward center
		if(this.x < this.EDGE_PADDING_X){
			//move right -- smaller the x larger the move
			to_x = this.x + ($(this.stage).width()/2 - this.x)/2;
		}
		else if(this.x > ($(this.stage).width() - this.EDGE_PADDING_X)){
			//move left
			to_x = this.x - (this.x - $(this.stage).width()/2)/2;
		}
		
		if(this.y < this.EDGE_PADDING_Y){
			//move right -- smaller the x larger the move
			to_y = this.y + ($(this.stage).height()/2 - this.y)/2;
		}
		else if(this.y > ($(this.stage).height() - this.EDGE_PADDING_Y)){
			//move left
			to_y = this.y - (this.y - $(this.stage).height()/2)/2;
		}
		delta_x = this.x - to_x;
		delta_y	= this.y - to_y;

		return {delta_x: delta_x, delta_y: delta_y};
	},
	//------------------ move
	move: function() {
		//actually move this
		var Transform_str = "translate3d(" + this.vx + "px," + this.vy + "px, 0)";
		this.vx *= 0.88;
		this.vy *= 0.88;
		return Transform_str;
	},
	//------------------ work 
	work: function() {
		//actually scale this
		this.x = $(this.el).position().left;
		this.y = $(this.el).position().top;

		/*this.vx += (this.dx-this.x)/15;
		this.vy += (this.dy-this.y)/15;*/
		this.vx += (this.dx-this.x)/35;
		this.vy += (this.dy-this.y)/35;
		
		this.width_perc += Math.round((this.ds-this.width_perc)/50);
		this.height_perc += Math.round((this.ds-this.height_perc)/50);

		this.xscale = this.width_perc/100;
		this.yscale = this.height_perc/100;

		var Transform_str = "scale3d(" 
						+ this.xscale + "," 
						+ this.xscale + ","
						+ this.xscale + ")";
		return Transform_str;
	},
	//------------------ seek
	seek: function(newDx, newDy, newDs) {
		this.dx = newDx;
		this.dy = newDy;
		this.ds = newDs;
	},
	//------------------ seek
	animate: function() {
		if(this.is_paused || !this.is_loaded) return;
		if (!(Math.floor(Math.random()*7))) {		
			var this_w = $(this.el).width();	
			var this_h = $(this.el).height();
			var cr = Math.abs(mouse_x - (stage_w/2));

			//scatter factor x
			var ix = (stage_w-this_w)/2 
					+ (Math.round(Math.random()*parseInt(1800+cr-this.width_perc))
					- (1800+cr-this.width_perc)/2)/2;				
			//scatter factor y
			var iy = (stage_h-this_h)/2 
					+ (Math.round(Math.random()*parseInt(1500+cr-this.height_perc))
					-(1500+cr-this.height_perc)/2)/2;

			//the general size of the bubble is determined by the position of the mouse
			var cs = 1500 + mouse_y;
			var is = 10 + Math.round(Math.random()*(10 + Math.abs(parseInt(cs - (stage_h/2))/8)));
			
			this.seek(ix, iy, is);
		}
		var work_trans = this.work();
		var move_trans = this.move();
		var trans = work_trans + " " + move_trans;

		this.el.style.transform = trans;
		this.el.style.webkitTransform = trans;
		this.el.style.msTransform = trans;
		this.el.style.oTransform = trans;
	}
};

// ----------------------- BubbleGenerator
// -- generator of the bubbles
function BubbleGenerator(){}

BubbleGenerator.prototype = {
	//num bubbles if not set in options
	NUM_BUBBLES: {min: 15, max:20},
	bubbles: [],
	options: {},
	is_paused: false,
	is_generating: false,
	//------------------ init
	init: function(options){
		this.options = options;
		initStage();
	},
	//------------------ start
	start: function(){
		if(!this.is_generating){	
			this.is_generating = true;	
			this.generateBubbles(this.options);
		}
	},
	//------------------ pause
	pause: function(){
		this.is_paused = true;
	},
	//------------------ clear
	clear: function(){
		if(this.is_generating){
			this.is_generating = false;
			this.is_paused = false;	
			this.clearBubbles();
		}
		clearTimeout(this.initBubbleTimeout);
		clearTimeout(this.animateBubblesTimeout);
	},
	//------------------ reset
	reset: function(){
		for(var i=0;i<this.bubbles.length;i++){
			this.bubbles[i].reset();
		}
	},
	//------------------ generateBubbles
	generateBubbles: function(options){
		//generate semi-random number of bubbles
		var min = this.NUM_BUBBLES.min;
		var max = this.NUM_BUBBLES.max;
		if(options.num_min || options.num_min == 0) min = options.num_min;
		if(options.num_max || options.num_max == 0) max = options.num_max;
		if(min && max && max < min){
			min = this.NUM_BUBBLES.min;
			max = this.NUM_BUBBLES.max;
		}
		var num_bubbles = min + Math.round(Math.random()*(max-min));

		var html_arr = options.html ? options.html : [""];
		var html = "";
		var ind = 0;
		var bubble;

		for(var i=0;i<num_bubbles;i++){
			ind = Math.round(Math.random() * (html_arr.length-1));
			if(html_arr.length>0) html = html_arr[ind];
			bubble = new Bubble();
			this.initBubble(bubble, html, i);
		}
		this.animateBubbles();
	},
	//------------------ initBubble
	initBubble: function(bubble, html, index){
		var self = this; 
		this.initBubbleTimeout = setTimeout(function(){
			bubble.init(stage, html, index+1);
			self.bubbles.push(bubble);
			bubble.animate();
		}, (100*index));
	},
	//------------------ animateBubbles
	animateBubbles: function(){
		var self = this;
		//recursively call this
		//every 60 ms
		if(!this.is_paused && this.is_generating){
			this.animateBubblesTimeout = setTimeout(function(){	
				self.animateBubbles(); 
			}, 60);
		} 
		//animate the bubbles
		for(var i=0;i<this.bubbles.length;i++){
			this.bubbles[i].animate();
		}
	},
	//------------------ clearBubbles
	clearBubbles: function(){
		//destroy each bubble
		for(var i=0;i<this.bubbles.length;i++){
			this.bubbles[i].destroy();
		}
	},
	//------------------ focus
	focus: function(){
		this.mo_bubble = this.getTopMostMouseOverBubble();
		//freeze the element
		//the mouse is over
		this.mo_bubble.focus();
	},
	//------------------ unfocus
	unfocus: function(){
		this.mo_bubble.unfocus();
		this.mo_bubble = null;
	},
	//------------------ getTopMostMouseOverBubble
	getTopMostMouseOverBubble: function(){
		//get the position of the mouse
		//traverse the bubbles
		//the first one that is 
		//under the bubble
		//is the bubble to return
		var bubble = null;
		var bubble_x;
		var bubble_y;
		var is_over = true;
		for(var i=0;i<this.bubbles.length;i++){
			is_over = true;
			bubble = this.bubbles[i];
			//get the position of the bubble
			bubble_x = $(bubble).position().left;
			bubble_y = $(bubble).position().top;
			if(bubble_x > mouse_x || (bubble_x + bubble.style.width) < mouse_x) is_over = false;
			if(bubble_y > mouse_y || (bubble_y + bubble.style.height) < mouse_y) is_over = false;
		}
	}
};

var bubbleGenerator = new BubbleGenerator();
//export the module
module.exports = bubbleGenerator;

