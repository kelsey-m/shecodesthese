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
        this.X_SMALL_MAX_WIDTH          = 400;
        this.SMALL_MAX_WIDTH            = 700;
        this.MEDIUM_MAX_WIDTH           = 1100;
        this.EXPERIMENT                 = "Experiment";
        this.PROJECT                    = "Project";

        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        this.EASE_OUT_TRANS             = 'all <%TIME%> cubic-bezier(0.190, 1.000, 0.220, 1.000) <%DELAY%>';
        this.OPACITY_COPY_TRANS         = 'opacity 250ms linear';      
        this.DEFAULT_TRANS_TIME         = '1500ms';
        this.MARGIN                     = 27;
        this.SMALL_MARGIN               = 15;
        this.MIN_HEIGHT                 = 150;
        this.MAX_HEIGHT                 = 280;
        // this.SMALL_MAX_HEIGHT           = 280;
        this.SMALL_MAX_HEIGHT           = '35%';
        this.CLOSED_WIDTH               = 460;
        this.SMALL_CLOSED_WIDTH         = '63%';
        this.CLOSED_X                   = this.MARGIN;
        this.SMALL_CLOSED_X             = this.SMALL_MARGIN;
        this.CLOSE_Y_RATIO              = 0.0625;
        this.STYLE                      = {
                                            color: COLORS.DRK_GRAY,
                                            backgroundColor: COLORS.LT_TRANSPARENT_PINK,
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            zIndex: 100,
                                            margin: 0,
                                            paddingLeft: '4em',
                                            paddingRight: '4em',
                                            boxSizing: 'border-box',
                                            minHeight: 240,
                                            //tween w/ easeOutExpo
                                            WebkitTransition: this.easeOutTrans(this.DEFAULT_TRANS_TIME),
                                            MozTransition: this.easeOutTrans(this.DEFAULT_TRANS_TIME),
                                            OTransition: this.easeOutTrans(this.DEFAULT_TRANS_TIME),
                                            transition: this.easeOutTrans(this.DEFAULT_TRANS_TIME)
        };
        this.OPACITY_CONTENT_TRANS_OUT  = 'opacity 100ms linear';  
        this.OPACITY_CONTENT_TRANS_IN   = 'opacity 250ms linear 150ms';    
        this.CONTENT_STYLE              = {
                                            opacity: 0,
                                            WebkitTransform: 'scale3d(1,1,1)',
                                            MozTransform: 'scale3d(1,1,1)',
                                            OTransform: 'scale3d(1,1,1)',
                                            transform: 'scale3d(1,1,1)'
        };
        this.LOGO_PADDING_SMALL         = 10;
        this.LOGO_WIDTH                 = 120;
        this.LOGO_HEIGHT                = 120;
        this.LOGO_WIDTH_SMALL           = 100;
        this.LOGO_HEIGHT_SMALL          = 100;
        this.LOGO_STYLE                 = {
                                            width: this.LOGO_WIDTH,
                                            height: this.LOGO_HEIGHT,
                                            opacity: 0,
                                            paddingTop: 10,
                                            paddingBottom: '20%',
                                            WebkitTransform: 'scale3d(1,1,1)',
                                            MozTransform: 'scale3d(1,1,1)',
                                            OTransform: 'scale3d(1,1,1)',
                                            transform: 'scale3d(1,1,1)',
                                            // WebkitTransition: this.easeOutTrans('0.9s', '1.2s'),
                                            // MozTransition: this.easeOutTrans('0.9s', '1.2s'),
                                            // OTransition: this.easeOutTrans('0.9s', '1.2s'),
                                            // transition: this.easeOutTrans('0.9s', '1.2s') 
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
        this.LIST_ITEM_STYLE            = {
                                            paddingBottom: '0.23em',
        };
        this.LIST_STYLE                 = {
                                            margin: 0,
                                            listStyle: 'none',
                                            WebkitPaddingStart: 0,
                                            MozPaddingStart: 0,
                                            WebkitMarginBefore: 0,
                                            WebkitMarginAfter: 0
        };
        this.OPT_MENU_STYLE              = {
                                            position: 'absolute',
                                            bottom: 0,
                                            right: '1.7em',
                                            display: 'flex',
                                            margin: 0,
                                            listStyle: 'none',
                                            WebkitPaddingStart: 0,
                                            MozPaddingStart: 0,
                                            width: '5em',
                                            WebkitAlignItems: 'center',
                                            WebkitBoxAlign: 'center',
                                            MsFlexAlign: 'center',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            WebkitMarginBefore: 0,
                                            WebkitMarginAfter: 0
        };
        this.OPT_ITEM_DISABLE_OPACITY    = 0.35;
        this.OPT_ITEM_STYLE              = {   
                                            width: 32,                                        
                                            cursor: 'pointer', 
                                            opacity: 1,
                                            WebkitTapHighlightColor: 'rgba(0,0,0,0)'                                            
        };
        this.OPT_ITEM_IMG_STYLE         = {
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
        };
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            padding_top: '12%',
            logo_opacity: 0,
            content_opacity: 0,
            width: this.dims(this.props.is_open, this.props.is_min).width,
            height: this.dims(this.props.is_open, this.props.is_min).height,
            x: this.pos(this.props.is_open, this.props.is_min).x,
            y: this.pos(this.props.is_open, this.props.is_min).y
        };
    }
    //--------------------------------- render
    render(){
        var self = this;
        var style = this.determineStyleByScreenSize();
        var content_style = this.determineContentStyle();
        var logo_style = this.determineLogoStyle();
        var list_style = this.determineListStyle();
        var arrow_style = this.determineArrowStyle();
        var next_style = this.determineNextStyle();

        return (
            <div style={style}>
                <div style={content_style} ref="mainInfoContent">
                    <img ref="logo" style={logo_style} src="assets/img/she-codes-these@2x.png"/>
                    <h1 style={this.HEADER_STYLE}>
                        <a style={this.SECTION_LINK_STYLE} 
                        onClick={this.onSectionClick.bind(this, this.EXPERIMENT)}>Experiments</a> and <a 
                        style={this.SECTION_LINK_STYLE} 
                        onClick={this.onSectionClick.bind(this, this.PROJECT)}>Projects</a> of Software Developer, Kelsey Vaughn Motley_______
                    </h1>
                    <ul style={list_style}>
                        <li style={this.LIST_ITEM_STYLE}>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://www.linkedin.com/in/kelseyvaughn">
                            https://www.linkedin.com/in/kelseyvaughn
                            </a>
                        </li>
                        <li style={this.LIST_ITEM_STYLE}>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://github.com/kelseyvaughn">
                            https://github.com/kelseyvaughn
                            </a>
                        </li>
                        <li style={this.LIST_ITEM_STYLE}>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://www.npmjs.com/~kelsey">
                            https://www.npmjs.com/~kelsey
                            </a>
                        </li>
                        <li style={this.LIST_ITEM_STYLE}>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://codepen.io/kelseyvaughn/">
                            https://codepen.io/kelseyvaughn/
                            </a>
                        </li>
                        <li style={this.LIST_ITEM_STYLE}>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="https://twitter.com/_kelseyvaughn">
                            https://twitter.com/_kelseyvaughn
                            </a>
                        </li>
                        <li style={this.LIST_ITEM_STYLE}>
                            <a 
                            style={this.CONNECT_LINK_STYLE} 
                            target="_blank" 
                            href="mailto:kelsey@shecodesthese.com">
                            kelsey@shecodesthese.com
                            </a>
                        </li>
                    </ul>
                </div>
                <ul style={this.OPT_MENU_STYLE}>
                    <li style={next_style} onClick={this.onNextClick.bind(this)}>
                        next
                    </li>                                      
                    <li style={arrow_style} onClick={this.onArrowClick.bind(this)}>
                        <h1>&rarr;</h1>
                    </li>  
                </ul>
            </div>
        );
    }
    //--------------------------------- open
    open(){
        this.props.onOpen();
    }
    //--------------------------------- close
    close(){
        this.props.onClose();
    }
    //--------------------------------- determineLogoStyle
    determineLogoStyle(){
        var logo_style = Object.assign({}, this.LOGO_STYLE);
        logo_style.opacity = this.state.logo_opacity;
        if( this.props.screen_width < 500 || 
            this.props.screen_height < this.SMALL_MAX_WIDTH ){
            logo_style.paddingBottom = this.LOGO_PADDING_SMALL;   
        }
        if( this.props.screen_width < this.SMALL_MAX_WIDTH ||
            this.props.screen_height < this.SMALL_MAX_WIDTH ){
            logo_style.width = this.LOGO_WIDTH_SMALL;
            logo_style.height = this.LOGO_HEIGHT_SMALL;
        }
        return logo_style;
    }
    //--------------------------------- determineLogoStyle
    determineContentStyle(){
        var style = Object.assign({}, this.CONTENT_STYLE);
        style.opacity = this.state.content_opacity;

        //set the correct transition - in or out
        var transition = (style.opacity == 1) ? 
            this.OPACITY_CONTENT_TRANS_IN : 
            this.OPACITY_CONTENT_TRANS_OUT;

        style.WebkitTransition = transition;
        style.MozTransition = transition;
        style.OTransition = transition;
        style.transition = transition;

        return style;
    }
    //--------------------------------- determineStyleByScreenSize
    determineStyleByScreenSize(){
        var style = Object.assign({}, this.STYLE);

        style.paddingTop = this.state.padding_top;

        //padding left for smaller screens
        if(this.props.screen_width <= 500) 
            style.paddingLeft = style.paddingRight = '2em';

        style.width = this.state.width;
        style.height = this.state.height;

        var transform = 'translate3d(' + this.state.x + ', ' + this.state.y + ', 0)'; 
        style.WebkitTransform = transform;
        style.MozTransform = transform;
        style.OTransform = transform;
        style.transform = transform;

        return style;
    }
    //--------------------------------- determineListStyle
    determineListStyle(){
        var style = Object.assign({}, this.LIST_STYLE);
        if(this.props.screen_height < this.X_SMALL_MAX_WIDTH) style.display = 'none';

        return style;
    }
    //--------------------------------- determineArrowStyle
    determineArrowStyle(){
        var style = Object.assign({}, this.OPT_ITEM_STYLE);
        //want to set the scaleY to 1 or -1
        //depending of the open state
        var transform = this.props.is_open ? 
            'rotateZ(-45deg) scaleY(-1) scaleX(-1)' : 
            'rotateZ(-45deg) scaleX(1) scaleY(1)'; 
        style.WebkitTransform = transform;
        style.MozTransform = transform;
        style.OTransform = transform;
        style.transform = transform;

        style.marginBottom = (!this.props.is_open && (this.props.screen_width <= 700 || 
            this.props.screen_heigth <= 500))  ? 
            '0.5em' : '0';

        return style;
    }
    //--------------------------------- determineNextStyle
    determineNextStyle(){
        var style = Object.assign({}, this.OPT_ITEM_STYLE);
        style.textDecoration = 'underline';

        if(this.props.is_min || this.props.is_open){
            style.opacity =  0;
            style.cursor = 'default';
        }

        return style;
    }
    //--------------------------------- componentWillMount
    componentDidMount(){
        var self =  this;
        var offset;
        setTimeout(function(){
            self.updatePaddingTop();
        }, 200);

        var logo = $(ReactDOM.findDOMNode(this.refs.logo));
        if(logo.complete) this.onLogoLoaded();
        $(logo).on("load",function(event){
            self.onLogoLoaded();
        });

        //animate in content
        setTimeout(function(){
            self.setState({content_opacity: 1});
        }, 400);
    }
    //--------------------------------- onLogoLoaded
    onLogoLoaded(){
        var self = this;
        setTimeout(function(){
            self.setState({logo_opacity: 1});
        }, 60);
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var self = this;
        var state = {};
        
        if(nextProps.is_open){
            //if opened from closed
            //animate the open
            if(!this.props.is_open) this.animateOpen(nextProps.is_open, nextProps.is_min);
            //already opened
            else{
                //so check if the screen_width or the 
                //screen_height has changed, if so 
                //update the x, y, width, and height values 
                //of the state
                //it doesn't really matter if the components
                //are in the middle of animating --->
                //just go ahead and aupdate them at this point
                if( nextProps.screen_width != this.props.screen_width ||
                    nextProps.screen_height != this.props.screen_height ){
                    this.posize(true, nextProps.is_min, nextProps.screen_width, nextProps.screen_height);  
                } 
            }
        }        
        else {
            //closed from open
            if(this.props.is_open) this.animateClose(nextProps.is_open, nextProps.is_min);
            //already closed
            else this.posize(false, nextProps.is_min, nextProps.screen_width, nextProps.screen_height);  
        }

        this.setState(state);
        this.updatePaddingTop();
    }
    //--------------------------------- posize
    posize(is_open, is_min, screen_width, screen_height){
        this.setState({
            width: this.dims(is_open, is_min, screen_width, screen_height).width,
            height: this.dims(is_open, is_min, screen_width, screen_height).height,
            x: this.pos(is_open, is_min, screen_width, screen_height).x,
            y: this.pos(is_open, is_min, screen_width, screen_height).y
        });
    }
    //--------------------------------- animateOpen
    animateOpen(is_min){
        var self = this;
        //move to the right
        //expand upon complete
        clearTimeout(this.close_timeout);
        var state = {x: this.pos(true, is_min).x};
        this.open_timeout = setTimeout(function(){        
            self.setState({
                width: self.dims(true, is_min).width,
                height: self.dims(true, is_min).height,
                y: self.pos(true, is_min).y
            });
        }, 1400);
        this.complete_open_timeout = setTimeout(function(){
            self.setState({content_opacity: 1});
        }, 2000);
        this.setState(state);
    }
    //--------------------------------- animateClose
    animateClose(is_min){
        var self = this;
        //hide content 
        //and shrink
        clearTimeout(this.open_timeout);
        clearTimeout(this.complete_open_timeout);
        var state = {content_opacity: 0};
        state.height = this.dims(false, is_min).height;
        state.width = this.dims(false, is_min).width;
        state.y = this.pos(false, is_min).y;
        this.close_timeout = setTimeout(function(){
            self.setState({x: self.pos(false, is_min).x});
        }, 600);
        this.setState(state);
    }
    //--------------------------------- updatePaddingTop
    updatePaddingTop(){
        var padding_top = ( (this.props.screen_height 
            - $(ReactDOM.findDOMNode(this.refs.mainInfoContent)).height() )/4 )
            + "px";
        this.setState({padding_top: padding_top});
    }
    //--------------------------------- onExperimentsClick
    onSectionClick(section_name, event){
        this.props.onSectionClick(section_name);
        return false;
    }
    //--------------------------------- onMinClick
    onNextClick(){
        this.props.onNext();
        return false;
    }
    //--------------------------------- onArrowClick
    onArrowClick(){
        //set to whatever it currently is not
        if(!this.props.is_open) this.open();
        else this.close();
        
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
    //--------------------------------- dims    
    dims(is_open, is_min, screen_width, screen_height){
        screen_width = screen_width ? screen_width : this.props.screen_width;
        screen_height = screen_height ? screen_height : this.props.screen_height;
        //(is_open)
        //-----------
        //determine the width & height based upon the screen size
        //LARGE (default)
        var to_width = (screen_width*0.5);
        var adjusted_to_width = to_width - this.MARGIN;
        var to_height = screen_height - (2*this.MARGIN);        

        //MEDIUM
        //for all widths <= MEDIUM && > SMALL ----- 75%
        if( screen_width <= this.MEDIUM_MAX_WIDTH && 
            screen_width > this.SMALL_MAX_WIDTH ){
            to_width = (screen_width*0.75);
            adjusted_to_width = to_width - this.MARGIN;
        } 

        //SMALL
        //for all widths <= SMALL ---- 90%
        else if(screen_width <= this.SMALL_MAX_WIDTH){
            to_width = (screen_width*0.9);
            adjusted_to_width = to_width - this.SMALL_MARGIN; 
            to_height = screen_height - (2*this.SMALL_MARGIN);            
        } 

        if(is_open) return {
            width: adjusted_to_width, 
            height:to_height, 
            outerWidth: to_width
        };

        //(closed)
        //-----------
        to_width = (screen_width <= this.SMALL_MAX_WIDTH) ? 
                    this.SMALL_CLOSED_WIDTH : this.CLOSED_WIDTH; 
        to_height = (screen_width <= this.SMALL_MAX_WIDTH || screen_height <= this.SMALL_MAX_WIDTH) ? 
                        this.SMALL_MAX_HEIGHT : this.MAX_HEIGHT;                  
        to_height = is_min ? this.MIN_HEIGHT : to_height;

        return {
            width: to_width, 
            height:to_height, 
            outerWidth: to_width
        }; 
    }
    //--------------------------------- pos    
    pos(is_open, is_min, screen_width, screen_height){
        screen_width = screen_width ? screen_width : this.props.screen_width;
        screen_height = screen_height ? screen_height : this.props.screen_height;

        var dims = this.dims(is_open, is_min, screen_width, screen_height);

        //MEDIUM & LARGE (DEFAULT)
        //updated the translate3d styles
        //want to update this to use pixels instead of percent
        var to_x = screen_width - dims.outerWidth;
        var closed_x = (screen_width <= this.SMALL_MAX_WIDTH) ? 
                        this.SMALL_CLOSED_X : this.CLOSED_X;
        to_x = is_open ? to_x+'px' : closed_x+'px';
        var to_y = (screen_width <= this.SMALL_MAX_WIDTH) ? 
                    this.SMALL_MARGIN : this.MARGIN;
        to_y = is_open ? to_y+'px' : (screen_height*this.CLOSE_Y_RATIO)+'px';

        return {x: to_x, y: to_y};
    }
}

export default MainInfo;
