import React from 'react';
import ReactDOM from 'react-dom';
import COLORS from './style/COLORS.jsx';

class Panel extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
        this.setInitialState();
    }
    //--------------------------------- declareConstants
    declareConstants(){
        this.ANIM_OFFSET                = 0.1;
        //this.IDLE                       = "idle";
        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        this.STYLE                      = {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%'
                                            //!!!!!!!!!!!!!!!!
                                            //perhaps put a loader gif
                                            //as the bgImage
                                            //!!!!!!!!!!!!!!!!
        };
        this.CHILD_STYLE                = {
                                            position: 'absolute',
                                            opacity: 0
        };
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            is_showing: false,
            show: this.props.show,
            hide: this.props.hide,
            is_active: this.props.is_active,
            is_previous: this.props.is_previous,
            //should show it on active
            //(instead of waiting for show)
            show_on_active: this.props.show_on_active,
            child_top: '100%',
            child_opacity: 0,
            child_y: 0
        };
    }
    //--------------------------------- render
    render(){
        var self = this;
        var style = Object.assign({}, this.STYLE);
        style.width = this.props.stage_width;
        style.height = this.props.stage_height;
        style.top = this.state.child_top;

        var child_style;
        //set the translate property  of 
        //children according to
        //prop is_active && is_showing
        var children = React.Children.map(this.props.children, function(child, i) {
            child_style = self.getChildStyle();
            return React.cloneElement(child, {style: child_style});
        }, this)
        
        return (<div style={style} >{children}</div>);
    }
    //--------------------------------- getChildStyle
    getChildStyle(){
        var child_style = Object.assign({}, this.CHILD_STYLE);
        child_style.width = this.props.data.width; 
        child_style.height = this.props.data.height;
        child_style = this.addChildTween(child_style); 

        //consider that width and height
        //may be 100%
        var to_x = 0;
        var to_y = this.state.child_y;
        //set the translateX value 
        //to be centerd horizontallly
        if(child_style.width != '100%') to_x = (this.props.stage_width - parseInt(child_style.width))/2;

        child_style.opacity = this.state.child_opacity;        

        //set the transform property
        child_style.WebkitTransform = 'translate3d(' + to_x + 'px, ' + to_y + 'px, 0)';
        child_style.MozTransform = 'translate3d(' + to_x + 'px, ' + to_y + 'px, 0)';
        child_style.OTransform = 'translate3d(' + to_x + 'px, ' + to_y + 'px, 0)';
        child_style.transform = 'translate3d(' + to_x + 'px, ' + to_y + 'px, 0)';

        return child_style;
    }
    //--------------------------------- addChildTween
    addChildTween(child_style, opacity_delay){
        if(!opacity_delay) opacity_delay = '';
        //set the transition to 
        //tween w/ easeOutExpo
        var css_transition = ' 2s cubic-bezier(0.190, 1.000, 0.220, 1.000)';
        var opacity_transition = 'opacity 0.5s';
        css_transition = css_transition + ', ' + opacity_transition;
        child_style.WebkitTransition = '-webkit-transform' + css_transition;
        child_style.MozTransition = '-moz-transform' + css_transition;
        child_style.OTransition = '-o-transform' + css_transition;
        child_style.transition = 'transform' + css_transition;
        return child_style;
    }
    //--------------------------------- componentWillMount
    componentDidMount(){
        var self = this;
        this.checkActiveState(null);
        this.determineChildStyleState();
        //add listeners here
        //for transitionend events
        //of the child
        var el = $(ReactDOM.findDOMNode(this));
        //get the first child of el
        //listen for transitionend on it
        $($(el).children()[0]).on(
            "transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd",
            function(event){
                if(this.style.opacity == 0) self.setState({child_top: '100%', show_on_active:false});
            }
        );
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var state = {
            is_active: nextProps.is_active, 
            is_previous: nextProps.is_previous,
            show: nextProps.show,
            hide: nextProps.hide
        }; 

        //set show on active only aplies to the first
        //activation - so to false once it has
        //been deactivated
        if(this.state.show_on_active && !nextProps.is_active){
            state.show_on_active = false;   
        }

        //react bundles setState calls
        //within their lifecycle events
        //before rendering  --
        //so calling setState multiple
        //times won't hurt
        this.checkActiveState(nextProps);
        this.setState(state);
        this.determineChildStyleState();
    }
    //--------------------------------- checkActiveState
    checkActiveState(nextProps){
        //determine if is_showing
        var is_active = nextProps ? nextProps.is_active : this.props.is_active;
        var show = nextProps ? nextProps.show : this.props.show;

        if(is_active && !this.state.show && show){
            this.setState({show:true, is_showing:true});
            this.setToAnimate();
        }
    }
    //--------------------------------- determineChildStyleState
    determineChildStyleState(){
        var state = {};
        var to_y = 0;
        var new_y = 0;
        //if  data.width == '100%'
        //set the translate property to 
        //be centered vertically
        if(this.props.data.height != '100%'){
            to_y = (this.props.stage_height - parseInt(this.props.data.height))/2; 
        }

        if(this.state.is_active && this.state.show){
            if(this.state.is_showing && !this.state.show_on_active){
                new_y = (to_y!=0) ? (to_y*this.ANIM_OFFSET) : this.props.stage_height*this.ANIM_OFFSET;
                to_y += new_y;
                state.child_opacity = 0;
            } 
            else state.child_opacity = 1;
        }
        else{          
            new_y = (to_y!=0) ? (to_y*this.ANIM_OFFSET) : this.props.stage_height*this.ANIM_OFFSET;
            to_y += new_y;
            state.child_opacity = 0;
        }

        //override default show
        //bahavior to show on active
        //rather than on show 
        if(this.state.is_active && this.state.show_on_active){
            state.child_opacity = 1;
            to_y = 0;
        } 

        state.child_y = to_y;
        if(this.state.is_active) state.child_top = 0;

        this.setState(state);
    }
    //--------------------------------- setToAnimate
    setToAnimate(){
        var self = this;
        //setTimeout to 
        //update the position of
        //the project holder
        setTimeout(function(){
            self.setState({is_showing:false});
            self.determineChildStyleState();
        }, 100);
    }
}

export default Panel;
