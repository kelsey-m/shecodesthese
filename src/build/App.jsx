import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import MainInfo from './MainInfo.jsx';
import PanelView from './PanelView.jsx';
import COLORS from './style/COLORS.jsx';

var app = document.getElementById('app');
setBaseStyles();

class App extends React.Component {
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
        /*this.STYLE                      = {
                                            position: 'fixed',
                                            width: '100%'
        };*/
        this.TEST_EL_STYLE              = {
                                            position: 'fixed',
                                            top: 50,
                                            left: 50,
                                            width: 300,
                                            height: 400,
                                            backgroundColor: COLORS.DRK_GRAY,
                                            zIndex: 900
        };
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            screen_width: window.innerWidth,
            screen_height: window.innerHeight,
            panel_view_is_open: false,
            scroll_y: window.scrollY
        };
    }  
    //--------------------------------- render    
    render(){
        return (
            <div>
                <MainInfo ref="mainInfo" 
                    screen_width={this.state.screen_width} 
                    screen_height={this.state.screen_height} 
                    is_open={!this.state.panel_view_is_open} />
                <PanelView ref="panelView" 
                    screen_width={this.state.screen_width} 
                    screen_height={this.state.screen_height} 
                    is_open={this.state.panel_view_is_open}
                    scroll_y={this.state.scroll_y} />                    
            </div>  
        );
    }
    //--------------------------------- componentDidMount
    componentDidMount() {
        var self = this;

        this.onWindowResize();
        window.addEventListener("resize", function(){
            self.onWindowResize();
        });
        window.addEventListener("scroll", function(){
            console.log("window.scrollY = " + window.scrollY);
            //update a scroll_y state here
            self.setState({scroll_y: window.scrollY});
        });

        //when a user is at scrollY > 0
        //need to make sure the mainView
        //is closed
        var panel_view_el = $(ReactDOM.findDOMNode(this.refs.panelView));
        $(panel_view_el).on("open", function(event){
            self.setState({panel_view_is_open: true});
        });

        var main_info_el = $(ReactDOM.findDOMNode(this.refs.mainInfo));
        $(main_info_el).on("open", function(event){
            //close the panelView
            self.setState({panel_view_is_open: false});
        });
        $(main_info_el).on("close", function(event){
            //open the panelView 
            self.setState({panel_view_is_open: true});
        });
    }
    //--------------------------------- onWindowResize
    onWindowResize() {
        //set the state of screen_width to 
        //rerender all children upon resize
        this.setState({screen_width: window.innerWidth, screen_height: window.innerHeight});
        //adhust overall font size
        if(window.innerWidth < 600){
            document.body.style.fontSize = "14px";
        } 
    }
}

ReactDOM.render(<App/>, app);

FastClick.attach(document.body);

//--------------------------------- setBaseStyles
//go ahead and set base
//styles here since we are
//not using external css for 
//this project
function setBaseStyles(){
    document.body.style.margin = 0;
    document.body.style.fontFamily = "Helvetica, Arial, sans-serif";
    document.body.style.fontSize = "16px";
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.color = COLORS.DRK_GRAY;
    //document.body.style.height = document.documentElement.style.height = '100%';
    document.body.style.width = document.documentElement.style.width = '100%';
    //document.body.style.position = document.documentElement.style.position = 'fixed';
    //document.body.style.overflow = document.documentElement.style.overflow = 'hidden';
    /*app.style.position = 'fixed';
    app.style.overflow = 'hidden';*/
    //app.style.position = 'relative';
    app.style.width = '100%';
}