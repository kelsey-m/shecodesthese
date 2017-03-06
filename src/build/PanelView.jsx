import React from 'react';
import ReactDOM from 'react-dom';
import Project from './Project.jsx';
import BubbleExperiment from './BubbleExperiment.jsx';
import ImageExplosionExperiment from './ImageExplosionExperiment.jsx';
import COLORS from './style/COLORS.jsx';

class PanelView extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
        this.setInitialState();
    }
    //--------------------------------- declareConstants
    declareConstants(){
        this.EXPERIMENT                 = "Experiment";
        this.PROJECT                    = "Project";
        this.MIN_DELTA_FOR_SWIPE        = 40;
        this.MIN_SHOW_TIME_DELTA        = 1000;

        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        //easeOutQuad
        this.EASE_OUT_TRANS             = 'opacity 450ms cubic-bezier(0.250, 0.460, 0.450, 0.940)';
        this.PANEL_VIEW_STYLE           = {
                                            position: 'fixed',
                                            zIndex: 2,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: COLORS.LT_PINK
        };
        this.OVERLAY_STYLE              = {
                                            position: 'fixed',
                                            zIndex: 4,
                                            backgroundColor: COLORS.DRK_GRAY,
                                            opacity: 0,
                                            width: '100%',
                                            height: '100%',
                                            //tween animation
                                            //for smooth transition 
                                            //add 3d styles to
                                            //force hardware accel
                                            WebkitTransform: 'translateZ(0)',
                                            MozTransform: 'translateZ(0)',
                                            OTransform: 'translateZ(0)',
                                            transform: 'translateZ(0)',
                                            WebkitTransition: this.EASE_OUT_TRANS,
                                            MozTransition: this.EASE_OUT_TRANS,
                                            OTransition: this.EASE_OUT_TRANS,
                                            transition: this.EASE_OUT_TRANS
        };
        this.PANEL_CONTAINER_STYLE      = {
                                            position: 'absolute',
                                            zIndex: 2,
                                            top: 0,
                                            height: '100%',
                                            width: '100%'
        };                                   
        this.SCROLL_CONTENT_EL_STYLE      = {
                                            position: 'relative',
                                            width: '100%',
                                            zIndex: 1                              
        };
        this.PROJECTS_SRC               = '/assets/data/projects.json'; 
        this.INACTIVE_Y                 = '100%';   
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            is_open: this.props.is_open,
            prev_panel_num: -1,
            cur_panel_num: 0,
            cur_show_num: -1,
            cur_hide_num: -1,
            panel_direction: 1,
            projects: [],
            experiments: [
                {   ref: ImageExplosionExperiment,
                    title: "Image Explosion",
                    desc: "Bitmap manipulation experiment.  Technologies: Javascript, ES7, HTML5, CSS3",
                    link: "",
                    link_copy: "View on Codepen",
                    width: "100%",
                    height: "100%"
                },
                {   ref: BubbleExperiment,
                    title: "Bubble Motion",
                    desc: "Animation experiment.  Technologies: Javascript, HTML5, CSS3, GSAP",
                    link: "",
                    link_copy: "View on Codepen",
                    width: "100%",
                    height: "100%"
                }
            ],
            overlay_opacity: 0,
            overlay_left: '100%',
            panel_info: [],
            section_name: this.EXPERIMENT,
            touch_start_y: -1,
            show_time: null,
            loading_panel_num: -1
        };    
    }
    //--------------------------------- render
    render(){
        //describe experiments jsx
        var experiments = this.describeExperiments();
        //describe projects.jsx
        var projects = this.describeProjects();
        //set style of the hidden element
        //that is forcing the scroll behavior
        var scroll_content_el_style = Object.assign({}, this.SCROLL_CONTENT_EL_STYLE);
        scroll_content_el_style.height = this.state.total_scroll_height;
        //set style of the overlay according 
        //to the current state
        var overlay_style = Object.assign({}, this.OVERLAY_STYLE);
        overlay_style.opacity = this.state.overlay_opacity; 
        overlay_style.left = this.state.overlay_left;

        var panel_container_style = Object.assign({}, this.PANEL_CONTAINER_STYLE);

        return (
            <div style={{width:'100%',height:'100%'}}>
                <div ref="panelView" style={this.PANEL_VIEW_STYLE}>
                    <div style={panel_container_style}>                
                        {experiments}
                        {projects}
                    </div>
                    <div ref="overlay" style={overlay_style}></div>
                </div>
                <div style={scroll_content_el_style} />
            </div>
        );
    }
    //--------------------------------- componentDidMount
    componentDidMount(){
        var self = this;
        this.serverRequest = $.get(this.PROJECTS_SRC, function (result) {
            self.onProjectDataLoaded(result); 
        }.bind(this));    

        this.setWindowListeners();
        this.setCurrentPanelState();
        this.handleOverlayAnimState(); 
        //!!!!!!!!!!!!!!!!!!!!!!!
        //may need to set a timeout here
        //!!!!!!!!!!!!!!!!!!!!!!!
        this.loadNextPanelImgs();
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var state = { is_open: nextProps.is_open };

        //if opened from closed
        if(!this.state.is_open && nextProps.is_open) this.open();

        if(nextProps.section != this.props.section) this.scrollToSection(nextProps.section);   

        this.setState(state);
    }
    //--------------------------------- setWindowListeners
    setWindowListeners(){
        //want to basically simulate
        //vertical swipes - so we need

        //touchstart and touchend
        //for touch UIs
        window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        //and wheel scroll for both
        //browser events
        window.addEventListener("mousewheel", this.onMouseWheel.bind(this), false);
        window.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), false);
    }
    //--------------------------------- describeExperiments
    describeExperiments(){
        var self = this;
        var experiments = this.state.experiments.map(function(obj, index){
            var is_active = index==self.state.cur_panel_num;
            var is_previous = index==self.state.prev_panel_num;
            var show = index == self.state.cur_show_num;
            var hide = index == self.state.cur_hide_num;
            var key = "experiment_" + index;
            var load_imgs = index==self.state.loading_panel_num;

            var data = {
                width: obj.width,            
                height: obj.height,
                title: obj.title, 
                desc: obj.desc
            };

            //link is optional
            if(obj.link) data.link = obj.link;
            if(obj.link_copy) data.link_copy = obj.link_copy;
            var Experiment = obj.ref;
            return (
                <Experiment
                    key={key} 
                    data={data} 
                    is_active={is_active} 
                    is_previous={is_previous} 
                    show={show}
                    hide={hide}
                    direction={self.state.panel_direction}
                    stage_width={self.props.screen_width}
                    stage_height={self.props.screen_height} 
                    offset_y={0}
                    onImgsLoaded={self.onPanelImgsLoaded.bind(self)}
                    load_imgs={load_imgs} />
            );
        });
        return experiments;
    }
    //--------------------------------- describeProjects
    describeProjects(){
        var self = this;
        var projects = this.state.projects.map(function(data, index){
            var is_active = (self.state.experiments.length + index)==self.state.cur_panel_num;
            var is_previous = (self.state.experiments.length + index)==self.state.prev_panel_num;
            var show = (self.state.experiments.length + index) == self.state.cur_show_num;
            var hide = (self.state.experiments.length + index) == self.state.cur_hide_num;
            var key = "project_" + index;  
            var load_imgs = (self.state.experiments.length + index)==self.state.loading_panel_num;
            
            return(
                <Project  
                    key={key} 
                    data={data} 
                    is_active={is_active} 
                    is_previous={is_previous} 
                    show={show}
                    hide={hide}
                    direction={self.state.panel_direction}
                    stage_width={self.props.screen_width}
                    stage_height={self.props.screen_height} 
                    offset_y={0}
                    onImgsLoaded={self.onPanelImgsLoaded.bind(self)}
                    load_imgs={load_imgs} />
            );
        });
        return projects;
    }
    //--------------------------------- onTouchStart
    onTouchStart(event){
        //save the start pos
        this.setState({touch_start_y: event.touches[0].clientY});
    }
    //--------------------------------- onTouchEnd
    onTouchEnd(event){
        //check the delta of start pos
        //if greater than MIN_DELTA_FOR_SWIPE
        //change panels
        var delta_y = event.changedTouches[0].clientY - this.state.touch_start_y;
        if(Math.abs(delta_y) < this.MIN_DELTA_FOR_SWIPE) return;

        //swipe up
        if(delta_y < 0) this.onSwipeUp();
        //swipe down
        else this.onSwipeDown();
    }
    //--------------------------------- onMouseWheel
    onMouseWheel(event){
        //cross browser wheel delat
        //event = event ? event : window.event;
        event = event || window.event;
        //check the delta
        //if greater than MIN_DELTA_FOR_SWIPE
        //change panels
        var delta_y = (event.wheelDelta || -event.detail);

        if(Math.abs(delta_y) < this.MIN_DELTA_FOR_SWIPE) return;

        //swipe up
        if(delta_y < 0) this.onSwipeUp();
        //swipe down
        else this.onSwipeDown();
    }
    //--------------------------------- onProjectDataLoaded
    onProjectDataLoaded(result){
        this.setState({projects:result.projects});
    }
    //--------------------------------- onSwipeUp
    onSwipeUp(){
        if(!this.state.is_open) this.open();
        else this.showNextPanel();
    }
    //--------------------------------- onSwipeDown
    onSwipeDown(){
        if(this.state.is_open) this.showPrevPanel();
    }
    //--------------------------------- showNextPanel
    showNextPanel(){
        var cur_panel_num = this.state.cur_panel_num+1;
        var total_panels = this.state.experiments.length + this.state.projects.length;                       
        //if cur_panel_num >= num_panels --> set to 0
        if(cur_panel_num >= total_panels) cur_panel_num = 0;

        this.showPanel(cur_panel_num);
    }
    //--------------------------------- showPrevPanel
    showPrevPanel(){
        var cur_panel_num = this.state.cur_panel_num-1;
        var total_panels = this.state.experiments.length + this.state.projects.length;                       
        //if cur_panel_num > 0 --> set to total_panels - 1
        if(cur_panel_num < 0) cur_panel_num = total_panels - 1;

        this.showPanel(cur_panel_num);
    }
    //--------------------------------- showPanel
    showPanel(num){
        var self = this;
        var total_panels = this.state.experiments.length + this.state.projects.length;                       
        //if cur_panel_num >= num_panels --> set to 0
        if(num < 0) num = total_panels - 1;

        var prev_panel_num = this.state.cur_panel_num;
        var section_name = (num < this.state.experiments.length) ? 
                        this.EXPERIMENT : this.PROJECT;

        var time = new Date();
        time = time.getTime(); 

        //if attaempting to show before  
        //the time since the last show 
        //is less than the min_showm_delta
        //do not show => do nothing
        if(this.state.show_time && (time - this.state.show_time) < this.MIN_SHOW_TIME_DELTA) return;                       

        clearTimeout(this.showPanelTimeout);
        this.setState({
            cur_hide_num: prev_panel_num,
            cur_panel_num: num,
            prev_panel_num: prev_panel_num,
            section_name: section_name,
            show_time: time,
            overlay_left: 0,
            overlay_opacity: 1
        });

        this.setCurrentPanelState();
        this.props.onPanelHide();

        this.showPanelTimeout = setTimeout(function(){
            self.setState({
                cur_show_num: self.state.cur_panel_num,
                overlay_opacity: 0
            });
            self.props.onPanelShow();
        }, 800);
    }
    //--------------------------------- open
    open(){
        //need to set show_time here
        //too b/c the open is a type of show
        //--> we don't want an open to show the 
        //next panel, but rather the current 
        //one with its panel info
        var time = new Date();
        time = time.getTime(); 

        this.setState({
            is_open: true,
            cur_show_num: this.state.cur_panel_num,
            show_time: time
        });
        this.setCurrentPanelState(); 

        this.props.onOpen();
    }
    //--------------------------------- setCurrentPanelState
    setCurrentPanelState(){ 
        //call the onchange function 
        //with the current data as an arg
        var state = {};
        var cur_panel;
        if(this.state.cur_panel_num > (this.state.experiments.length-1)){
            cur_panel = this.state.projects[this.state.cur_panel_num - this.state.experiments.length]; 
        }          
        else cur_panel = this.state.experiments[this.state.cur_panel_num];

        state.section_name = this.state.section_name;
        state.title = cur_panel.title; 
        state.desc = cur_panel.desc; 
        if(cur_panel.link) state.link = cur_panel.link;
        if(cur_panel.link_copy) state.link_copy = cur_panel.link_copy;

        this.props.onPanelChange(state);
    }
    //--------------------------------- handleOverlayAnimState
    handleOverlayAnimState(){
        //set listener for anim complete
        //so that we can set the overlay
        //to display none 
        var self = this;
        this.overlay_el = $(ReactDOM.findDOMNode(this.refs.overlay));
        $(this.overlay_el).off();
        $(this.overlay_el).on(
            "transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", 
            function(){
                if(this.style.opacity == 0) self.setState({overlay_left: '100%'});
        });
    }
    //--------------------------------- loadNextPanelImgs
    loadNextPanelImgs(){
        var loading_panel_num = this.state.loading_panel_num + 1;
        //set back to -1 if greater than num panels
        if( loading_panel_num > (this.state.experiments.length + this.state.projects.length) ){
            loading_panel_num = -1;
        }
        //upadate the loading_panel_num
        this.setState({loading_panel_num: loading_panel_num});
    }
    //--------------------------------- onPanelImgsLoaded
    onPanelImgsLoaded(){
        //update the currently loading image
        this.loadNextPanelImgs();
    }
}

export default PanelView;
