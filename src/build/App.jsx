import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import MainInfo from './MainInfo.jsx';
import PanelView from './PanelView.jsx';
import PanelInfo from './PanelInfo.jsx';
import COLORS from './style/COLORS.jsx';

class App extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
        this.setInitialState();
    }
    //--------------------------------- declareConstants
    declareConstants(){
        this.SMALL_MAX_WIDTH            = 600;
        this.X_SMALL_MAX_WIDTH          = 400;
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            screen_width: window.innerWidth,
            screen_height: window.innerHeight,
            panel_view_is_open: false,
            scroll_y: window.scrollY,
            info_is_min: false,
            cur_info: {},
            info_show: false,
            info_hide: false,
            info_section: "",
            info_title: "",
            info_desc: "",
            info_link: "",
            info_link_copy: ""        
        };
    }  
    //--------------------------------- render    
    render(){
        console.log("this.state.screen_width = " + this.state.screen_width);
        console.log("this.state.screen_height = " + this.state.screen_height);
        return (
            <div>
                <MainInfo ref="mainInfo" 
                    screen_width={this.state.screen_width} 
                    screen_height={this.state.screen_height} 
                    is_open={!this.state.panel_view_is_open}
                    is_min={this.state.info_is_min}
                    onOpen={this.onPanelViewClose.bind(this)}
                    onClose={this.onPanelViewOpen.bind(this)}
                    onMin={this.onInfoMin.bind(this)}
                    onMax={this.onInfoMax.bind(this)}
                    onSectionClick={this.showSection.bind(this)} />
                <PanelView ref="panelView" 
                    screen_width={this.state.screen_width} 
                    screen_height={this.state.screen_height} 
                    is_open={this.state.panel_view_is_open}
                    onOpen={this.onPanelViewOpen.bind(this)}
                    onPanelShow={this.onPanelShow.bind(this)}
                    onPanelHide={this.onPanelHide.bind(this)}
                    onPanelChange={this.onPanelChange.bind(this)}
                    section={this.state.section} />  
                <PanelInfo 
                    is_open={this.state.panel_view_is_open}
                    screen_width={this.state.screen_width}
                    screen_height={this.state.screen_height}
                    section={this.state.info_section}
                    title={this.state.info_title} 
                    desc={this.state.info_desc} 
                    link={this.state.info_link} 
                    link_copy={this.state.info_link_copy}
                    show={this.state.info_show}
                    hide={this.state.info_hide}                                        
                    is_min={this.state.info_is_min} />                  
            </div>  
        );
    }
    //--------------------------------- componentDidMount
    componentDidMount() {
        this.initWindow();
    }
    //--------------------------------- initWindow
    initWindow() {
        var self = this;

        this.onWindowResize();
        window.addEventListener("resize", function(){
            self.onWindowResize();
        });
    }
    //--------------------------------- onPanelViewOpen
    onPanelViewOpen() {
        this.setState({
            panel_view_is_open: true, 
            info_show: true, 
            info_hide: false
        });
    }
    //--------------------------------- onPanelViewClose
    onPanelViewClose() {
        this.setState({panel_view_is_open: false});
    }
    //--------------------------------- onInfoMin
    onInfoMin() {
        this.setState({info_is_min: true});
    }
    //--------------------------------- onInfoMax
    onInfoMax() {
        this.setState({info_is_min: false});
    }
    //--------------------------------- onPanelShow
    onPanelShow() {
        this.setState({info_show: true, info_hide: false});
    }
    //--------------------------------- onPanelHide
    onPanelHide() {
        this.setState({info_hide: true, info_show: false});
    }
    //--------------------------------- onInfoChange
    onPanelChange(info) {
        var state = {};
        //need to ensure info contains
        //all required data
        //-------
        //section
        state.info_section = info.section_name ? info.section_name : "";
        //title
        state.info_title = info.title ? info.title : "";
        //desc
        state.info_desc = info.desc ? info.desc : "";
        //link
        state.info_link = info.link ? info.link : "";
        //link_copy
        state.info_link_copy = info.link_copy ? info.link_copy : "";

        this.setState(state);
    }
    //--------------------------------- onWindowResize
    onWindowResize() {
        //set the state of screen_width to 
        //rerender all children upon resize
        this.setState({
            screen_width: window.innerWidth, 
            screen_height: window.innerHeight
        });

        //adhust overall font size
        if(window.innerHeight < this.X_SMALL_MAX_WIDTH) {            
            document.body.style.fontSize = "12px";
        }
        else if( window.innerWidth < this.SMALL_MAX_WIDTH || 
            window.innerHeight < this.SMALL_MAX_WIDTH ) {
            document.body.style.fontSize = "13px";
        }
        else document.body.style.fontSize = "16px";
    }
    //--------------------------------- showSection
    showSection(section) {
        this.setState({section: section});
    }
}

export default App;