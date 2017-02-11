import React from 'react';
import ReactDOM from 'react-dom';
import PanelInfo from './PanelInfo.jsx';
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
        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        //easeOutQuad
        this.EASE_OUT_TRANS             = 'opacity 150ms cubic-bezier(0.250, 0.460, 0.450, 0.940)';
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
                                            //to (longer duration & forced)
                                            //zero opacity
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
        /*this.SCROLL_EL_STYLE            = {
                                            position: 'fixed',
                                            width: '100%',
                                            height: '100%',
                                            overflowY: 'scroll',
                                            WebkitOverflowScrolling: 'touch'
        }; */                                       
        this.SCROLL_CONTENT_EL_STYLE      = {
                                            position: 'relative',
                                            width: '100%',
                                            zIndex: 1                              
        };
        this.PROJECTS_SRC               = '/assets/data/projects.json'; 
        this.INACTIVE_Y                 = '100%';   
        this.PANEL_INFO_HEIGHT          = 200;
        this.PANEL_INFO_HEIGHT_SMALL    = 160;
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        var panel_info_height = this.getPanelInfoHeight();
        this.state = { 
            is_open: this.props.is_open,
            prev_panel_num: -1,
            cur_panel_num: 0,
            cur_show_num: -1,
            cur_hide_num: -1,
            cur_title: "",
            cur_desc: "",
            cur_link: "", 
            cur_link_copy: "",
            panel_direction: 1,
            projects: [],
            experiments: [
                {   ref: ImageExplosionExperiment,
                    title: "Image Explosion",
                    desc: "Bitmap manipulation experiment.  Technologies: Javascript, ES6, HTML5, CSS3",
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
            total_scroll_height: 0,
            overlay_opacity: 0,
            overlay_left: '100%',
            override_overlay_scroll: false,
            change_panel_scroll: 400,
            panel_info: [],
            is_showing_panel: false,
            is_hiding_panel: false,
            panel_info_height: panel_info_height,
            section: "Experiment"
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
                    <PanelInfo 
                        is_open={this.state.is_open}
                        title={this.state.cur_title} 
                        desc={this.state.cur_desc} 
                        link={this.state.cur_link} 
                        link_copy={this.state.cur_link_copy}
                        show={this.state.is_showing_panel}
                        hide={this.state.is_hiding_panel}
                        screen_width={this.props.screen_width}
                        screen_height={this.props.screen_height}
                        height={this.state.panel_info_height}
                        section={this.state.section} />
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

        //need to call the determine state functions here
        this.determineStateByScrollY();

        this.handleOverlayAnimState(); 
    }
    //--------------------------------- determineStateByScrollY
    determineStateByScrollY(){
        //var scroll_y = window.scrollY;
        // var scroll_y = this.panelView.scrollY;
        var scroll_y = this.props.scroll_y;
        console.log("scroll_y = " + scroll_y);
        this.determineCurrentPanel(scroll_y);
        this.determineOverlayOpacity(scroll_y);
        this.determineOpenState(scroll_y);
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
    //--------------------------------- determineOpenState
    determineOpenState(scroll_y){
        //if not is open
        //set to open
        var el = $(ReactDOM.findDOMNode(this));
        if(scroll_y > 0 && !this.state.is_open){
            this.setCurrentPanelState(); 
            this.setState({
                is_open: true,
                cur_show_num: this.state.cur_panel_num,
                is_showing_panel: true
            });
            $(el).trigger("open"); 
        } 
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var panel_info_height = this.getPanelInfoHeight();
        var state = {
            is_open: nextProps.is_open,
            panel_info_height: panel_info_height
        };

        this.setCurrentPanelState();
        //else if id_open from
        //!is_open
        //set the cur_show_num
        //& is_showing_panel
        if( !this.state.is_open && nextProps.is_open ||
            this.props.scroll_y != nextProps.scroll_y ) this.determineStateByScrollY();

        this.setState(state);
        //check the opacity
        //if we are going from opacity 
        //0 to opacity zero
        //set the overlay_left to 0
        this.updatePanelScroll();
    }
    //--------------------------------- getPanelInfoHeight
    getPanelInfoHeight(){
        var height_by_width = 0;
        height_by_width = (this.props.screen_width <= 615) ? 
        this.PANEL_INFO_HEIGHT_SMALL : this.PANEL_INFO_HEIGHT;
        return height_by_width;
    }
    //--------------------------------- onProjectDataLoaded
    onProjectDataLoaded(result){
        this.setState({projects:result.projects});
        this.updatePanelScroll();
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
            //to stage_width and stage_height
            /*var stage_width = self.props.screen_width;
            var stage_height = self.props.screen_height - self.state.panel_info_height;
            if(index == 0) stage_height = self.props.screen_height;*/

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
                    offset_y={self.state.panel_info_height} />
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

            //to stage_width and stage_height
            /*var stage_width = self.props.screen_width;
            var stage_height = self.props.screen_height - self.state.panel_info_height;
            var offset_y = ;*/
            
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
                    offset_y={self.state.panel_info_height} />
            );
        });
        return projects;
    }
    //--------------------------------- determineOverlayOpacity
    determineOverlayOpacity(scroll_y){
        //flucuate between 
        //0 and 1 with the absolute 
        //of a sign value relative
        //to the scroll position
        //but modify this it remain at 0 longer
        //by rounding down if determined value
        //is less than some value
        //and by adding a tween style to 
        //the opacity object so that it is smooth
        var self = this;
        var state = {};
        var to_opacity = Math.abs(Math.sin(scroll_y*(Math.PI/(this.state.change_panel_scroll*2))));

        //want to have the opacity
        //at 0 for a longer duration
        //so that the showing panel
        //reamins shown for longer
        if(to_opacity < 0.85) to_opacity = 0; 
        //scroll_y may not hit exactly at a spot
        //to equate to_opacity to 1
        //so may need to force it 
        else if(to_opacity > 0.99) to_opacity = 1;
        //else if(to_opacity > 0.96) to_opacity = 1;

        //force showing once it begins
        //need to distinguish if this
        //we are hiding or showing
        // -----> 
        //can have an override that is set here
        //to override the default scroll driven behavior
        //this will force 0 opacity  & will force 0
        //opacity for a longer duration while scrolling
        if(to_opacity == 0) state.override_overlay_scroll = false; 
        else if( (to_opacity > 0 && to_opacity < 1 && this.state.overlay_opacity == 1) 
            || this.state.override_overlay_scroll) {
            to_opacity = 0;
            state.override_overlay_scroll = true; 
        }

        if(to_opacity < 0.85){
            state.cur_show_num = this.state.cur_panel_num;
            clearTimeout(this.setPanelStateTimeout);
            self.setCurrentPanelState();
            state.is_showing_panel = true;
        } 
        else state.is_showing_panel = false;

        //want to have a cur_hide_num
        //that is set once the opacity is > 0
        if(to_opacity > 0) state.cur_hide_num = this.state.prev_panel_num;

        //set the current panel state 
        //when you know the opacity is at 1 
        if(to_opacity == 1){
            state.is_hiding_panel = true;
            this.setPanelStateTimeout = setTimeout(function(){
                self.setCurrentPanelState();
            }, 550);  
        } 
        else state.is_hiding_panel = false;  

        //check the opacity
        //instead set to 0 when going from
        //0 to non 0 
        if(to_opacity != 0) state.overlay_left = 0;
        state.overlay_opacity = to_opacity;

        this.setState(state);  
    }
    //--------------------------------- setCurrentPanelState
    setCurrentPanelState(){ 
        var state = {};
        var cur_panel;
        if(this.state.cur_panel_num > (this.state.experiments.length-1)){
            cur_panel = this.state.projects[this.state.cur_panel_num - this.state.experiments.length]; 
        }          
        else cur_panel = this.state.experiments[this.state.cur_panel_num];

        state.cur_title = cur_panel.title; 
        state.cur_desc = cur_panel.desc; 
        if(cur_panel.link) state.cur_link = cur_panel.link;
        if(cur_panel.link_copy) state.cur_link_copy = cur_panel.link_copy;

        this.setState(state);
    }
    //--------------------------------- determineCurrentPanel
    determineCurrentPanel(scroll_y){  
        //compare the new cur_panel_num
        //to this.states's cur_panel_num
        //before updating it 
        //to determine the previous panel
        //and which direction panels are moving  
        //only want to update the
        //prev_panel_num when the 
        //cur_panel_num changes 
        var prev_panel_num = this.state.prev_panel_num;
        var cur_panel_num = Math.round(scroll_y/(this.state.change_panel_scroll*2));
        if(cur_panel_num != this.state.cur_panel_num) prev_panel_num = this.state.cur_panel_num;
        var section = (cur_panel_num < this.state.experiments.length) ? "Experiment" : "Project";

        //also determine the cur_show number
        //set panel_direction to positive or negative
        var panel_direction = (cur_panel_num - prev_panel_num)>0 ? 1 : -1;

        this.setState({
            cur_panel_num: cur_panel_num, 
            prev_panel_num: prev_panel_num,
            panel_direction: panel_direction,
            section: section
        });
    }
    //--------------------------------- updatePanelScroll
    updatePanelScroll(){
        var total_panels = this.state.experiments.length + this.state.projects.length;
        var change_panel_scroll = this.props.screen_height;
        this.setState({
            change_panel_scroll: change_panel_scroll,
            //multiple by two b/c change_panel_scroll 
            //id where we are fading in the overlay
            //so change_panel_scroll*2 is where the panel
            //actually shows
            total_scroll_height: ((total_panels*2)-1)*change_panel_scroll
        });   
    }
}

export default PanelView;