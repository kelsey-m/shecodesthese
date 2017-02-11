import React from 'react';
import ReactDOM from 'react-dom';
import COLORS from './style/COLORS.jsx';

class MainInfo extends React.Component {
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
        this.EASE_OUT_TRANS             = 'all <%TIME%> cubic-bezier(0.190, 1.000, 0.220, 1.000) <%DELAY%>';        
        this.DEFAULT_TRANS_TIME         = '1900ms';
        this.STYLE                      = {
                                            color: COLORS.DRK_GRAY,
                                            backgroundColor: COLORS.LT_PINK,
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            zIndex: 100,
                                            width: '50%', 
                                            height: '100%',
                                            margin: 0,
                                            paddingLeft: '4em',
                                            paddingRight: '4em',
                                            boxSizing: 'border-box',
                                            //tween w/ easeOutExpo
                                            WebkitTransition: this.easeOutTrans(this.DEFAULT_TRANS_TIME),
                                            MozTransition: this.easeOutTrans(this.DEFAULT_TRANS_TIME),
                                            OTransition: this.easeOutTrans(this.DEFAULT_TRANS_TIME),
                                            transition: this.easeOutTrans(this.DEFAULT_TRANS_TIME)
        };
        this.LOGO_PADDING_SMALL         = 10;
        this.LOGO_STYLE                 = {
                                            width: 138,
                                            height: 138,
                                            opacity: 0,
                                            paddingBottom: 40,
                                            WebkitTransform: 'scale3d(1,1,1)',
                                            MozTransform: 'scale3d(1,1,1)',
                                            OTransform: 'scale3d(1,1,1)',
                                            transform: 'scale3d(1,1,1)',
                                            WebkitTransition: this.easeOutTrans('0.5s'),
                                            MozTransition: this.easeOutTrans('0.5s'),
                                            OTransition: this.easeOutTrans('0.5s'),
                                            transition: this.easeOutTrans('0.5s') 
        };
        this.HEADER_STYLE               = {
                                            width: '90%',
                                            fontWeight: 'lighter',
                                            fontStyle: 'italic',
                                            paddingBottom: 12,
                                            fontSize:  '1.8em'                                            
        };
        this.SECTION_LINK_STYLE         = {
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
        };
        this.CONNECT_LINK_STYLE         = {
                                            textDecoration: 'underline',
                                            color: COLORS.DRK_GRAY,
                                            fontSize: '0.85em'
        };
        this.LIST_STYLE                 = {
                                            margin: 0,
                                            listStyle: 'none',
                                            WebkitPaddingStart: 0,
                                            MozPaddingStart: 0
        };
        this.TAB_HEIGHT                 = 130;
        this.TAB_HEIGHT_SMALL           = 160;
        this.TAB_WIDTH                  = 48;
        this.DEFAULT_TAB_SX             = 0.3333;        
        this.DEFAULT_TAB_TX             = -this.TAB_WIDTH;
        //decomposed matrix interpolation 
        //cant invert the scale 0 keyframe
        //so don't use matrix3d
        //this.TAB_TRANSFORM            = 'matrix3d(<%SX%>,0,0,0,0,<%SY%>,0,0,0,0,1,0,<%TX%>,<%TY%>,0,1)';
        this.TAB_TRANSFORM              = 'translate3d(<%TX%>px,<%TY%>px,0) scale3d(<%SX%>,<%SY%>,1)';
        this.CLOSED_TAB_TRANSFORM       = 'none';
        this.TAB_TRANSFORM_ORIGIN       = '100% 50% 0';
        this.DEFAULT_TAB_TRANS_TIME     = this.DEFAULT_TRANS_TIME;
        this.FAST_TAB_TRANS_TIME        = '500ms';
        this.DEFAULT_TAB_TRANS          = this.easeOutTrans(this.DEFAULT_TAB_TRANS_TIME);
        this.TAB_STYLE                  = {
                                            width: this.TAB_WIDTH,
                                            height: this.TAB_HEIGHT,
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            //use translate instead of
                                            //top and left to efficiently
                                            //animate
                                            backgroundColor: COLORS.DRK_GRAY,
                                            display: 'block',                                                                               
                                            WebkitTransformOrigin: this.TAB_TRANSFORM_ORIGIN,
                                            MozTransformOrigin: this.TAB_TRANSFORM_ORIGIN,
                                            OTransformOrigin: this.TAB_TRANSFORM_ORIGIN,
                                            transformOrigin: this.TAB_TRANSFORM_ORIGIN,
                                            cursor: 'pointer'
        };
        this.OPEN_ICON_ANIM_IN_TRANS    = 'opacity 250ms linear 400ms';
        this.OPEN_ICON_ANIM_OUT_TRANS   = 'opacity 150ms linear';
        this.OPEN_ICON_STYLE            = {
                                            position: 'absolute',
                                            bottom: 12,
                                            left: 17,
                                            color: COLORS.LT_PINK,
                                            opacity: 0,
                                            WebkitTransform: 'scale3d(1,1,1)',
                                            MozTransform: 'scale3d(1,1,1)',
                                            OTransform: 'scale3d(1,1,1)',
                                            transform: 'scale3d(1,1,1)'
        };
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        var tab_height = this.getTabHeight();
        var tab_ty = (this.props.screen_height - tab_height)/2;
        this.state = { 
            is_open: this.props.is_open,
            padding_top: '12%',
            is_over_tab: false,
            tab_sx: this.DEFAULT_TAB_SX,
            tab_sy: 1,
            tab_tx: this.DEFAULT_TAB_TX,
            tab_ty: tab_ty,
            tab_height: tab_height,
            tab_on_stage: true,
            tab_at_closed_ty: false,
            tab_trans: this.DEFAULT_TAB_TRANS,
            tab_is_settled: true,
            default_tab_ty: tab_ty,
            closed_tab_ty: this.props.screen_height - tab_height,
            logo_opacity: 0
        };
    }
    //--------------------------------- render
    render(){
        var self = this;
        var style = this.determineStyleByScreenSize();
        var logo_style = this.determineLogoStyle();
        var tab_style = this.determineTabStyle();
        var open_icon_style = this.determineOpenIconStyle();

        return (
            <div style={style}>
                <div ref="mainInfoContent">
                    <img ref="logo" style={logo_style} src="assets/img/she-codes-these@2x.png"/>
                    <h1 style={this.HEADER_STYLE}>
                        <a style={this.SECTION_LINK_STYLE} 
                        onClick={this.onExperimentsClick}>Experiments</a> and <a 
                        style={this.SECTION_LINK_STYLE} 
                        onClick={this.onProjectsClick}>Projects</a> of Software Developer, Kelsey Motley
                    </h1>
                    <ul style={this.LIST_STYLE}>
                        <li>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://www.linkedin.com/in/kelseyvaughn">
                            https://www.linkedin.com/in/kelseyvaughn
                            </a>
                        </li>
                        <li>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://github.com/kelsey-m">
                            https://github.com/kelsey-m
                            </a>
                        </li>
                        <li>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://twitter.com/_kelseyvaughn">
                            https://twitter.com/_kelseyvaughn
                            </a>
                        </li>
                        <li>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="mailto:kelsey@shecodesthese.com">
                            kelsey@shecodesthese.com
                            </a>
                        </li>
                    </ul>
                </div>
                <div 
                    ref="tab"  
                    onMouseOver={function(){self.onTabMouseOver();}} 
                    onMouseOut={function(){self.onTabMouseOut();}} 
                    onClick={function(){self.onTabClick();}}
                    style={tab_style}>
                        <div style={open_icon_style}>&#x2190;</div>
                </div>
            </div>
        );
    }
    //--------------------------------- onTabMouseOver
    onTabMouseOver(){
        //also need to update tab style states here
        if(!this.state.tab_is_settled || !this.state.is_open) return;
        var state = {
            is_over_tab: true,
            tab_sx: 1
        };
        this.setState(state);
    }
    //--------------------------------- onTabMouseOut
    onTabMouseOut(){
        //also need to update tab style states here
        if(!this.state.tab_is_settled || !this.state.is_open) return;
        var state = {
            is_over_tab: false,
            tab_sx: this.DEFAULT_TAB_SX
        };
        this.setState(state);
    }
    //--------------------------------- onTabClick
    onTabClick(){
        //set to whatever it currently is not
        var is_open = !this.state.is_open;
        if(is_open) this.open();
        else this.close();

        this.onTabMouseOut();
        this.setState({is_open: is_open});
        return false;
    }
    //--------------------------------- open
    open(){
        var el = $(ReactDOM.findDOMNode(this));
        $(el).trigger("open");
    }
    //--------------------------------- close
    close(){
        var el = $(ReactDOM.findDOMNode(this));
        $(el).trigger("close");
    }
    //--------------------------------- determineLogoStyle
    determineLogoStyle(){
        var logo_style = Object.assign({}, this.LOGO_STYLE);
        logo_style.opacity = this.state.logo_opacity;
        if(this.props.screen_width < 500){
            logo_style.paddingBottom = this.LOGO_PADDING_SMALL;   
        }
        return logo_style;
    }
    //--------------------------------- determineTabStyle
    determineTabStyle(){ 
        var tab_style = Object.assign({}, this.TAB_STYLE);
        var tab_translate = this.getTabTranslate(this.state.tab_sx, 1, this.state.tab_tx, this.state.tab_ty);
        tab_style.WebkitTransform = tab_translate;
        tab_style.MozTransform = tab_translate;
        tab_style.OTransform = tab_translate;
        tab_style.transform = tab_translate;
        //tab_trans
        tab_style.WebkitTransition = this.state.tab_trans;
        tab_style.MozTransition = this.state.tab_trans;
        tab_style.OTransition = this.state.tab_trans;
        tab_style.transition = this.state.tab_trans;

        tab_style.height = this.state.tab_height;

        return tab_style;
    }
    //--------------------------------- determineOpenIconStyle
    determineOpenIconStyle(){
        var open_icon_style = Object.assign({}, this.OPEN_ICON_STYLE);
        if(this.state.is_over_tab || !this.state.is_open) {
            //set a delay on the animation
            open_icon_style.WebkitTransition = this.OPEN_ICON_ANIM_IN_TRANS;
            open_icon_style.MozTransition = this.OPEN_ICON_ANIM_IN_TRANS;
            open_icon_style.OTransition = this.OPEN_ICON_ANIM_IN_TRANS;
            open_icon_style.transition = this.OPEN_ICON_ANIM_IN_TRANS;
            //set opacity to 1
            open_icon_style.opacity = 1;
        }
        else{
            //use anim out transition 
            open_icon_style.WebkitTransition = this.OPEN_ICON_ANIM_OUT_TRANS;
            open_icon_style.MozTransition = this.OPEN_ICON_ANIM_OUT_TRANS;
            open_icon_style.OTransition = this.OPEN_ICON_ANIM_OUT_TRANS;
            open_icon_style.transition = this.OPEN_ICON_ANIM_OUT_TRANS;
            //set opacity to 0
            open_icon_style.opacity = 0;

        }
        return open_icon_style;
    }
    //--------------------------------- determineStyleByScreenSize
    determineStyleByScreenSize(){
        var style = Object.assign({}, this.STYLE);
        //sey default width to 50% 
        var to_width = '50%';
        //determine the width based upon the screen size
        //for all widths <= 700 ---- 90%
        if(this.props.screen_width <= 700) to_width = '90%';
        //for all widths <= 1100 && > 700
        //75%
        else if(this.props.screen_width <= 1100 && this.props.screen_width > 700) to_width = '75%';
        //for all widths > 1100 ---- 50% (by default)
        style.width = to_width;
        style.paddingTop = this.state.padding_top;
        //padding left for smaller screens
        if(this.props.screen_width <= 500) style.paddingLeft = style.paddingRight = '2em';

        //updated the translate3d styles
        var to_x = ((100 - parseInt(to_width))*this.props.screen_width)/100;
        to_x = this.state.is_open ? to_x+'px' : this.props.screen_width+'px';
        
        //always want it to be at right 0 essentially
        style.WebkitTransform = 'translate3d(' + to_x + ', 0, 0)';
        style.MozTransform = 'translate3d(' + to_x + ', 0, 0)';
        style.OTransform = 'translate3d(' + to_x + ', 0, 0)';
        style.transform = 'translate3d(' + to_x + ', 0, 0)';

        return style;
    }
    //--------------------------------- componentWillMount
    componentDidMount(){
        var self =  this;
        var offset;
        this.updatePaddingTop();

        this.tab_el = $(ReactDOM.findDOMNode(this.refs.tab));
        $(this.tab_el).on(
            "transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", 
            function(){
                //if tab is at its full width
                //&& !state.is_open
                //----> scale to full width animation finished
                //so move off the stage
                //have is_settled considered here
                //b/c the width will be at 100%
                //on a mouse over event, but 
                //do not want to continue the animation 
                //as do here on close
                //width is not a reliable property 
                //b/c even jquery's width() method is 
                //inconsistent --- when scale is non zero
                //width() returns the expected (computed value)
                //when it is zero, it returns the value that is 
                //not relative to the scale (non-computed value)
                //could use getComputedStyle().getProperty()
                //---- but getting the style will be less 
                //expensive
                var style = this.style.webkitTransform;
                var parsed_style;
                var sx = 1;
                if(!style) style = this.style.mozTransform;
                if(!style) style = this.style.oTransform;
                if(!style) style = this.style.transform;

                if(style){
                    parsed_style = style;
                    var scale_str = "scale3d(";
                    var ind = parsed_style.indexOf(scale_str);
                    if(ind) parsed_style = parsed_style.slice(ind);
                    parsed_style = parsed_style.replace(scale_str, "");
                    parsed_style = parsed_style.split(",");
                    sx = parsed_style[0];
                }

                if( parseInt(sx) === 1 && !self.state.is_open && 
                    !self.state.tab_is_settled && self.state.tab_on_stage ){
                        self.setState({tab_trans: self.easeOutTrans(self.DEFAULT_TAB_TRANS_TIME, '500ms')});
                        self.moveTabOffStage();   
                        return;
                }
                else if( parseInt(sx) === 0 && self.state.is_open &&
                    !self.state.tab_is_settled ){
                    //not going into here
                    self.setState({
                        tab_trans: self.CLOSED_TAB_TRANSFORM, 
                        tab_ty: self.state.default_tab_ty,
                        tab_at_closed_ty: false
                    });
                    return;
                }

                //update the tab transition state
                //and the tab_ty state
                //and it will cause a rerender which will 
                //move the tab to the correct ty 
                // ------
                //you want to have the moveTabOnStage to  
                //happen on the next render
                // ------
                //if x value is off the stage
                //if offset.left is greater than 
                //or equal to the stage width
                //----> move off stage animation has finished  
                //use the style here too              
                offset = $(this).offset();
                if( offset.left >= self.props.screen_width && !
                    self.state.tab_on_stage && !self.state.is_open ){
                    //remove the transition property
                    //if closed move the tab to the bottom of the screen                
                    self.setState({
                        tab_trans: self.CLOSED_TAB_TRANSFORM, 
                        tab_ty: self.state.closed_tab_ty,
                        tab_at_closed_ty: true
                    });
                } 
        });

        var logo = $(ReactDOM.findDOMNode(this.refs.logo));
        if(logo.complete) this.onLogoLoaded();
        $(logo).on("load",function(event){
            self.onLogoLoaded();
        });
    }
    //--------------------------------- onLogoLoaded
    onLogoLoaded(){
        var self = this;
        setTimeout(function(){
            self.setState({logo_opacity: 1});
        }, 60);
    }
    //--------------------------------- moveTabOffStage
    moveTabOffStage(){
        //set the translate x state
        this.setState({tab_tx: 0, tab_on_stage: false});
    }
    //--------------------------------- moveTabOnStage
    moveTabOnStage(){
        //set the translate x state
        this.setState({tab_tx: this.DEFAULT_TAB_TX, tab_on_stage: true});
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var self = this;
        var tab_height = this.getTabHeight();
        var state = {is_open: nextProps.is_open, tab_height: tab_height};

        //if opened from closed
        if(nextProps.is_open && !this.state.is_open){
            //move off stage
            //this.moveTabOffStage();
            //instead want to scale x to 0
            //but setting this to 0 causes 
            //the whole thing to whig out
            //see https://bugs.chromium.org/p/chromium/issues/detail?id=535094#c6
            state.tab_trans = this.easeOutTrans(this.FAST_TAB_TRANS_TIME);
            state.tab_sx = 0;
            state.tab_is_settled = false;
        }
        //else if closed from open
        else if(!nextProps.is_open && this.state.is_open){
            state.tab_trans = this.DEFAULT_TAB_TRANS;
            state.tab_sx = 1;
            state.tab_is_settled = false;
        }

        //ty is going to be based upon screen 
        //height but is also going to update 
        //based upon animation state
        //so we'll have a default_tab_ty state
        state.default_tab_ty = (nextProps.screen_height - tab_height)/2;
        state.closed_tab_ty = nextProps.screen_height - tab_height;

        //update ty to account for 
        //screen dimension changes
        if(this.state.tab_at_closed_ty) state.tab_ty = state.closed_tab_ty;
        else state.tab_ty = state.default_tab_ty;

        this.setState(state);
        this.updatePaddingTop();
    }
    //--------------------------------- componentDidUpdate
    componentDidUpdate(prevProps, prevState){
        var self = this;
        //want to check if need to moveTabOnStage
        //could check the position of the tab
        //but we know that when tab_trans == the closed state
        //we are ready to move the tab onto the stage
        //& it is a less expensive check
        if(this.state.tab_trans == this.CLOSED_TAB_TRANSFORM){
            if(!this.state.is_open){
                //update the tab_trans
                this.moveOnStageTimeout = setTimeout(function(){
                    self.setState({tab_trans: self.DEFAULT_TAB_TRANS, tab_is_settled: true});
                    self.moveTabOnStage();
                }, 100);
            }
            else{
                this.moveOnStageTimeout = setTimeout(function(){
                    self.setState({
                        tab_trans: self.DEFAULT_TAB_TRANS, 
                        tab_sx: self.DEFAULT_TAB_SX, 
                        tab_is_settled: true
                    });
                }, 100);
            }
        }
    }
    //--------------------------------- updatePaddingTop
    updatePaddingTop(){
        var padding_top = (this.props.screen_height - $(ReactDOM.findDOMNode(this.refs.mainInfoContent)).height())/2.5 + "px";
        this.setState({padding_top: padding_top});
    }
    //--------------------------------- onExperimentsClick
    onExperimentsClick(){
        //!!!!!!!!!!!!!!!!!!!!
        //set scrollY position
        return false;
    }
    //--------------------------------- onProjectsClick
    onProjectsClick(){
        //!!!!!!!!!!!!!!!!!!!!
        //set scrollY position
        return false;
    }
    //--------------------------------- easeOutTrans    
    easeOutTrans(time, delay){
        if(!delay) delay = '0s';
        var trans = this.EASE_OUT_TRANS; 
        trans = trans.replace('<%TIME%>', time);
        trans = trans.replace('<%DELAY%>', delay);
        return trans;
    }
    //--------------------------------- getTabTranslate    
    getTabTranslate(sx,sy,tx,ty){
        var trans_str = this.TAB_TRANSFORM;
        trans_str = trans_str.replace("<%SX%>", String(sx));
        trans_str = trans_str.replace("<%SY%>", String(sy));
        trans_str = trans_str.replace("<%TX%>", String(tx));
        trans_str = trans_str.replace("<%TY%>", String(ty));
        return trans_str;
    }
    //--------------------------------- getTabHeight
    getTabHeight(){
        var height_by_width = 0;
        height_by_width = (this.props.screen_width <= 615) ? 
        this.TAB_HEIGHT_SMALL : this.TAB_HEIGHT;
        return height_by_width;
    }
}

export default MainInfo;
