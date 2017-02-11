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
        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        //ease out expo
        this.TRANS                      = 'all 1200ms cubic-bezier(0.190, 1.000, 0.220, 1.000)';
        this.COPY_TRANS                 = ' 1500ms cubic-bezier(0.190, 1.000, 0.220, 1.000)';
        this.OPACITY_COPY_TRANS         = 'opacity 250ms linear';
        this.ANIM_OFFSET                = 40;
        this.TITLE_Y                    = 24;
        this.HIDDEN_TITLE_Y             = this.TITLE_Y + this.ANIM_OFFSET;
        this.DESC_Y                     = 62;
        this.HIDDEN_DESC_Y              = this.DESC_Y + this.ANIM_OFFSET;
        this.STYLE                      = {
                                            position: 'fixed',
                                            //bottom: 0,
                                            top: 0,
                                            width: '100%',
                                            zIndex: 3,
                                            backgroundColor: COLORS.LT_PINK,
                                            color: COLORS.DRK_GRAY,
                                            padding: '0 24px',
                                            WebkitTransition: this.TRANS,
                                            MozTransition: this.TRANS,
                                            OTransition: this.TRANS,
                                            transition: this.TRANS,
                                            WebkitTransform: 'translateZ(0)',
                                            MozTransform: 'translateZ(0)',
                                            OTransform: 'translateZ(0)',
                                            transform: 'translateZ(0)',
                                            boxSizing: 'border-box'
        };
        //position these with 
        //translate for smooth anim
        this.TITLE_STYLE                = {
                                            position: 'absolute', 
                                            margin: 0,
                                            WebkitTransition: '-webkit-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            MozTransition: '-moz-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            OTransition: '-o-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            transition: 'transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            fontStyle: 'italic',
                                            fontSize: '1.85em'
        };            
        this.DESC_STYLE                 = {  
                                            position: 'absolute',
                                            maxWidth: 600,
                                            margin: 0,
                                            lineHeight: 1.1,
                                            fontSize: '0.85em',
                                            WebkitTransition: '-webkit-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            MozTransition: '-moz-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            OTransition: '-o-transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS,
                                            transition: 'transform' + this.COPY_TRANS + ',' + this.OPACITY_COPY_TRANS
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
            desc_ty: this.HIDDEN_DESC_Y,
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
            height: this.props.height
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
                    &nbsp; <a style={this.LINK_STYLE} href={this.state.cur_link} >{this.state.cur_link_copy}</a>
                </p>
            </div>
        );
    }
    //--------------------------------- determineStyle
    determineStyle(){
        var style = Object.assign({}, this.STYLE);
        var to_height = 0;

        if(this.state.is_open) to_height = this.state.height;
        style.height = to_height;

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
        else delay = '0s';

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

        if(this.props.screen_width <= 700) style.maxWidth = '80%';        

        style.opacity = this.state.desc_opacity;

        //set tranistion delay for a hide
        if(this.state.desc_opacity == 0) delay = '0s'; 
        //set transition delay for a show
        else delay = '0.1s';  

        style.WebkitTransitionDelay = delay;
        style.MozTransitionDelay = delay;
        style.OTransitionDelay = delay;
        style.transitonDelay = delay;

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
                if( this.style.opacity == 0 && !self.state.desc_is_hiding){
                    self.onHideInfoComplete();
                } 

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
                //the transition is a tranform
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
                if( this.style.opacity == 0 && !self.state.title_is_hiding ){
                    self.onHideInfoComplete();
                } 

                //if opacity is 1, 
                //need to see if needs to be hidden
                //and updated then reshown
                else if(this.style.opacity == 1) self.onShowInfoComplete();
        });
    }
    //--------------------------------- onHideInfoComplete
    onHideInfoComplete(){
        var state = {};
        state.cur_title = this.state.title;
        state.cur_section = this.state.section;
        state.cur_desc = this.state.desc;
        state.cur_link = this.state.link;
        state.cur_link_copy = this.state.link_copy;
        state.desc_is_hiding = false;
        state.title_is_hiding = false;

        //if different
        //also want to set is showing to true
        if( state.cur_title != this.state.cur_title && 
            state.cur_desc != this.state.cur_desc ) {
            this.showInfo(); 
        }

        this.setState(state);
    }
    //--------------------------------- onShowInfoComplete
    onShowInfoComplete(){
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

        //first time section is set
        //set the cur_section
        if(this.state.section == "" && nextProps.section != "") state.cur_section = nextProps.section;
        //first time title is set
        //set the cur_title
        if(this.state.title == "" && nextProps.title != "") state.cur_title = nextProps.title;
        //first time desc is set
        //set the cur_desc
        if(this.state.desc == "" && nextProps.desc != "") state.cur_desc = nextProps.desc;

        //delay setting is open
        if(!this.state.is_open && nextProps.is_open) {
            this.isOpenTimeout = setTimeout(function(){
                self.setState({is_open: true});
            }, 300);
        }
        else if(!nextProps.is_open) {
            clearTimeout(this.isOpenTimeout);
            state.is_open = nextProps.is_open;
        }

        //keep track of the opacity and the ty
        //states of the title and the desc
        //that way we know when for certain 
        //a transition will begin

        //do not want to show if hiding
        //if( this.state.is_open && nextProps.show && 
        if( nextProps.is_open && nextProps.show && 
            !this.state.desc_is_hiding && !this.state.title_is_hiding ){
            this.showInfo();
        }
        //but do want to hide if showing
        else if( nextProps.hide || 
            (this.state.title != "" && nextProps.title != this.state.title) ) {
            this.hideInfo();
        }

        console.log("nextProps.show = " + nextProps.show);
        console.log("nextProps.is_open = " + nextProps.is_open);
        console.log("this.state.desc_is_hiding = " + this.state.desc_is_hiding);
        console.log("this.state.title_is_hiding = " + this.state.title_is_hiding);
        //also want to check if the title 
        //or desc has changed --->
        //if so, set hiding state to true
        this.setState(state);
    }
    //--------------------------------- hideInfo
    hideInfo(){
        var state = {};
        state.title_opacity = 0;
        state.title_ty = this.HIDDEN_TITLE_Y; 

        state.desc_opacity = 0;
        state.desc_ty = this.HIDDEN_DESC_Y;

        //if properties are different
        //we know that a transition will begin
        if( this.state.title_opacity != state.title_opacity 
            || this.state.title_ty != state.title_ty ) state.title_is_hiding = true;

        if( this.state.desc_opacity != state.desc_opacity 
            || this.state.desc_ty != state.desc_ty ) state.desc_is_hiding = true;

        this.setState(state);            
    }
    //--------------------------------- showInfo
    showInfo(){
        var state = {};

        //update the copy
        //before showing
        state.cur_title = this.state.title;
        state.cur_section = this.state.section;
        state.cur_desc = this.state.desc;
        state.cur_link = this.state.link;
        state.cur_link_copy = this.state.link_copy;

        //and not currently hiding
        //set the title and the desc properties 
        //to show 
        state.title_opacity = 1;
        state.title_ty = this.TITLE_Y; 

        state.desc_opacity = 1;
        state.desc_ty = this.DESC_Y;

        state.title_is_hiding = false;
        state.desc_is_hiding = false;

        this.setState(state);
    }
}



export default PanelInfo;
