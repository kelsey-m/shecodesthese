import React from 'react';
import ReactDOM from 'react-dom';
import COLORS from './style/COLORS.jsx';

class PanelInfo extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
        this.setInitialState();
    }
    //--------------------------------- declareConstants
    declareConstants(){
        this.SMALL_MAX_WIDTH            = 700;

        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        //ease out expo
        this.TRANS                      = 'all 1200ms cubic-bezier(0.190, 1.000, 0.220, 1.000)';
        this.COPY_TRANS                 = ' 1500ms cubic-bezier(0.190, 1.000, 0.220, 1.000)';
        this.OPACITY_COPY_TRANS         = 'opacity 250ms linear';
        this.ANIM_OFFSET                = 40;
        this.TITLE_Y                    = 44;
        this.HIDDEN_TITLE_Y             = this.TITLE_Y + this.ANIM_OFFSET;
        this.DESC_Y                     = 82;
        this.HIDDEN_DESC_Y              = this.DESC_Y + this.ANIM_OFFSET;
        this.MARGIN                     = 27;
        this.SMALL_MARGIN               = 15;
        this.X                          = this.MARGIN;
        this.SMALL_X                    = this.SMALL_MARGIN;
        this.WIDTH                      = 460;
        this.SMALL_WIDTH                = '62%';
        this.STYLE                      = {
                                            position: 'fixed',
                                            top: '6.25%',
                                            zIndex: 101,
                                            color: COLORS.DRK_GRAY,
                                            padding: '0 1.4em',
                                            boxSizing:'border-box'
        };
        //position these with 
        //translate for smooth anim
        this.TITLE_STYLE                = {
                                            position: 'absolute', 
                                            margin: 0,
                                            width: '90%',
                                            paddingBottom: 8,
                                            WebkitTransition: '-webkit-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            MozTransition: '-moz-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            OTransition: '-o-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            transition: 'transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            fontStyle: 'italic',
                                            fontSize: '1.85em'
        };       
        this.DESC_TRANSITION            =  this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS;
        this.DESC_STYLE                 = {  
                                            position: 'absolute',
                                            margin: 0,
                                            width: '85%',
                                            lineHeight: 1.1,
                                            fontSize: '0.85em'
        };
        this.LINK_STYLE                 = {
                                            color: COLORS.DRK_GRAY
        };
        this.NORMAL_FONT                = {
                                            fontWeight: 'normal'
        };
    }
    //--------------------------------- setInitialState
    setInitialState(){
        this.state = {
            is_open: this.props.is_open,
            title: this.props.title,
            desc: this.props.desc,
            cur_title: this.props.title,
            cur_desc: this.props.desc,
            title_opacity: 0,
            title_ty: this.HIDDEN_TITLE_Y,
            desc_opacity: 0,
            desc_transition: 'none',
            desc_ty: this.HIDDEN_DESC_Y,
            hidden_desc_ty: this.HIDDEN_DESC_Y,
            title_is_hiding: false,
            desc_is_hiding: false,
            link: this.props.link,
            link_copy: this.props.link_copy,
            cur_link: this.props.link,
            cur_link_copy: this.props.link_copy,
            cur_section: this.props.section,
            section: this.props.section,
            show: this.props.show,
            hide: this.props.hide,
            first_show: false,
            is_show_ready: false
        };
    }
    //--------------------------------- render
    render(){
        var style = this.determineStyle();
        var title_style = this.determineTitleStyle();
        var desc_style = this.determineDescStyle();

        return (
            <div style={style}>
                <h2 ref="title" style={title_style}>
                    {this.state.cur_section}<span style={this.NORMAL_FONT}>: {this.state.cur_title}</span>
                </h2>
                <p ref="desc" style={desc_style}>{this.state.cur_desc}
                    &nbsp; &nbsp; &rarr; <a style={this.LINK_STYLE} href={this.state.cur_link} >{this.state.cur_link_copy}</a>
                </p>
            </div>
        );
    }
    //--------------------------------- determineStyle
    determineStyle(){
        var style = Object.assign({}, this.STYLE);
        style.left = (this.props.screen_width <= this.SMALL_MAX_WIDTH) ? 
                        this.SMALL_X : this.X;

        style.width = (this.props.screen_width <= this.SMALL_MAX_WIDTH) ? 
                        this.SMALL_WIDTH : this.WIDTH;  

        style.opacity = this.state.is_open ? 1 : 0;                        

        return style;
    }
    //--------------------------------- determineTitleStyle
    determineTitleStyle(){
        var delay = 0;
        var style = Object.assign({}, this.TITLE_STYLE);

        style.opacity = this.state.title_opacity;

        //set tranistion delay for a hide
        if(this.state.title_opacity == 0) delay = '0.05s'; 
        //set transition delay for a show
        else{
            delay = '0s';   
            if(this.state.first_show) delay = '0.7s';
        }        

        style.WebkitTransitionDelay = delay;
        style.MozTransitionDelay = delay;
        style.OTransitionDelay = delay;
        style.transitonDelay = delay;

        style.WebkitTransform = 'translate3d(0, ' + this.state.title_ty + 'px, 0)';
        style.MozTransform = 'translate3d(0, ' + this.state.title_ty + 'px, 0)';
        style.OTransform = 'translate3d(0, ' + this.state.title_ty + 'px, 0)';
        style.transform = 'translate3d(0, ' + this.state.title_ty + 'px, 0)';
        return style;                                 
    }
    //--------------------------------- determineDescStyle
    determineDescStyle(){
        var style = Object.assign({}, this.DESC_STYLE);
        var delay;      

        style.opacity = this.state.desc_opacity;
        if(this.props.is_min) style.opacity = 0;

        //set tranistion delay for a hide
        if(style.opacity == 0){
            style.visibility = 'hidden';
            delay = '0s';   
        } 
        //set transition delay for a show
        else{
            style.visibility = 'visible';
            delay = '0.1s';  
            if(this.state.first_show) delay = '0.8s';  
        } 

        style.WebkitTransition = '-webkit-transform' + this.state.desc_transition;
        style.MozTransition = '-moz-transform' + this.state.desc_transition;
        style.OTransition = '-o-transform' + this.state.desc_transition;
        style.transiton = 'transform' + this.state.desc_transition;
        
        style.WebkitTransitionDelay = style.MozTransitionDelay = 
        style.OTransitionDelay = style.transitonDelay = delay;

        style.WebkitTransform = 'translate3d(0, ' + this.state.desc_ty + 'px, 0)';
        style.MozTransform = 'translate3d(0, ' + this.state.desc_ty + 'px, 0)';
        style.OTransform = 'translate3d(0, ' + this.state.desc_ty + 'px, 0)';
        style.transform ='translate3d(0, ' + this.state.desc_ty + 'px, 0)';
        return style;
    }
    //--------------------------------- componentDidMount
    componentDidMount(){
        //add transitionend listeners
        //to the title and desc elements
        this.setTitleListeners();
        this.setDescListeners();

        this.title_node = $(ReactDOM.findDOMNode(this.refs.title));
    }
    //--------------------------------- setTitleListeners
    setTitleListeners(){
        var self = this;
        var title_node = $(ReactDOM.findDOMNode(this.refs.title));
        $(title_node).on(
            "transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", 
            function(event){
                var propName = event.originalEvent.propertyName;
                if( propName != "transform" && 
                    propName != "webkitTransform" &&
                    propName != "mozTransform" && 
                    propName != "oTransform" ){ return; }

                //now not hitting this
                self.setState({title_is_hiding: false});

                //if opacity is 0
                //update the title state
                if( this.style.opacity == 0 ) self.onHideInfoComplete();

                //if opacity is 1
                //need to see if needs to be hidden
                //and updated then reshown
                else if(this.style.opacity == 1) self.onShowInfoComplete();
        });
    }
    //--------------------------------- setDescListeners
    setDescListeners(){
        var self = this;
        var desc_node = $(ReactDOM.findDOMNode(this.refs.desc));
        $(desc_node).on(
            "transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", 
            function(event){
                //only want to move forward if
                //the transition is a of tranform
                //(we know that when th etransform transition
                //is complete, that the opacity transition
                //will also be complete)
                var propName = event.originalEvent.propertyName;
                if( propName != "transform" && 
                    propName != "webkitTransform" &&
                    propName != "mozTransform" && 
                    propName != "oTransitionEnd" ){ return; }

                //trouble is we are never getting here    
                self.setState({desc_is_hiding: false});
                //if opacity is 0
                //update the desc state
                if( this.style.opacity == 0 ) self.onHideInfoComplete();

                //if opacity is 1, 
                //need to see if needs to be hidden
                //and updated then reshown
                else if( this.style.opacity == 1 ) self.onShowInfoComplete();
        });
    }
    //--------------------------------- updateInfo
    updateInfo(){
        var state = {};
        state.cur_title = this.state.title;
        state.cur_section = this.state.section;
        state.cur_desc = this.state.desc;
        state.cur_link = this.state.link;
        state.cur_link_copy = this.state.link_copy;
        state.desc_is_hiding = false;
        state.title_is_hiding = false;
        return state;
    }
    //--------------------------------- onHideInfoComplete
    onHideInfoComplete(){
        var state = this.updateInfo();
        //also want to set is showing to true
        if( this.props.is_open){
            //set a is_show_ready prop
            state.is_show_ready = true;
            this.setState(state);
        }
    }
    //--------------------------------- onShowInfoComplete
    onShowInfoComplete(){
        this.setState({ first_show: false });
        if( this.state.title != this.state.cur_title || 
            this.state.desc != this.state.cur_desc ) {
            this.hideInfo();
        }
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var self = this;

        var state = {
            title: nextProps.title, 
            desc: nextProps.desc,
            link: nextProps.link,
            link_copy: nextProps.link_copy,
            height: nextProps.height,
            section: nextProps.section,
            show: nextProps.show,
            hide: nextProps.hide
        }; 

        //delay setting is open
        if(!this.props.is_open && nextProps.is_open) {
            state.first_show = true;
            clearTimeout(this.isOpenTimeout);
            this.isOpenTimeout = setTimeout(function(){
                self.setState({is_open: true});
            }, 300);
        }
        else if(!nextProps.is_open) {
            clearTimeout(this.isOpenTimeout);
            state.is_open = nextProps.is_open;
        }

        //handle showing and hiding
        if( !this.props.is_open && nextProps.is_open && nextProps.show && 
            !this.state.desc_is_hiding && !this.state.title_is_hiding ){
            state = Object.assign(state, this.updateInfo());
            state.is_show_ready = true;
        }
        //also want to hide it on hide, if closed
        //or if info data has changed
        else if( ((!this.props.hide && nextProps.hide) && !nextProps.show) || 
            (this.props.is_open && !nextProps.is_open) ) {
            this.hideInfo();
        }
        if( this.props.screen_width != nextProps.screen_width ||
            this.props.screen_height != nextProps.screen_height){
            state.desc_ty = this.getDescTy();
            state.hidden_desc_ty = state.desc_ty + this.ANIM_OFFSET/3;
        }

        this.setState(state);

        if(!this.props.is_min && nextProps.is_min) this.minimize();
        else if(this.props.is_min && !nextProps.is_min) this.maximize();
    }
    //--------------------------------- componentDidUpdate
    componentDidUpdate(prevProps, prevState){
        if(this.state.is_show_ready) this.showInfo();

        //if copyt updated different
        if(prevState.title != this.state.title) {
            if(prevState.title != ""){
               this.hideInfo(); 
            } 
            //otherwise update the desc_ty
            else {
                this.setState({
                    desc_ty: this.getDescTy() + Math.round(this.ANIM_OFFSET/3)
                });
            }
        }
    }
    //--------------------------------- hideInfo
    hideInfo(){
        //make sure the hide isn't delayed from
        var state = {};
        clearTimeout(this.showTimeout);
        clearTimeout(this.beforeShowTimeout);

        state.title_opacity = 0;
        state.title_ty = this.HIDDEN_TITLE_Y; 

        state.desc_opacity = 0;
        state.desc_ty = this.getDescTy() +  Math.round(this.ANIM_OFFSET/3);
        state.desc_transition = this.DESC_TRANSITION;
        state.first_show = false;

        //if properties are different
        //we know that a transition will begin
        //only need to check the ty values here
        //since opacity is a secondary transition
        if( this.state.title_ty != state.title_ty ) state.title_is_hiding = true;

        if( this.state.desc_ty != state.desc_ty ) state.desc_is_hiding = true;

        this.setState(state);            
    }
    //--------------------------------- showInfo
    showInfo(){
        var self = this;
        clearTimeout(this.showTimeout);
        clearTimeout(this.beforeShowTimeout);
        //remove the transition here
        var state = {desc_transition: 'none'};
        this.setState(state);

        //need to set the ty to the hidden ty here
        //and desc opavity. to 0
        //before setting it to go to the new ty
        //(b/c we need to make sure we are at
        //the accurate hidden_desc_ty),
        //based upon the height of the new title
        state.desc_opacity = 0;
        state.desc_ty = this.getDescTy();
        state.hidden_desc_ty = state.desc_ty + Math.round(this.ANIM_OFFSET/3);
        state.desc_ty = state.hidden_desc_ty;

        state.is_show_ready = false;

        this.beforeShowTimeout = setTimeout(function(){
            self.setState(state);
        }, 100);

        this.showTimeout = setTimeout(function(){
            //re-add the transition here
            //set the opacities to 1
            //and set the translate y 
            //values to their destinations
            self.completeShowInfo();
        }, 200);
    }
    //--------------------------------- completeShowInfo
    completeShowInfo(){
        this.setState({
            desc_ty: this.getDescTy(),
            desc_opacity: 1,
            title_opacity: 1,
            title_ty: this.TITLE_Y,
            title_is_hiding: false,
            desc_is_hiding: false,
            desc_transition: this.DESC_TRANSITION
        });
    }
    //--------------------------------- minimize
    minimize(){
        var state = {desc_opacity: 0, is_show_ready: false};
        this.setState(state);
    }
    //--------------------------------- maximize
    maximize(){
        var state = {desc_opacity: 1, is_show_ready: false};
        this.setState(state);   
    }
    //--------------------------------- getDescTy
    getDescTy(){
        return (this.TITLE_Y + this.title_node.outerHeight());
    }
}



export default PanelInfo;
