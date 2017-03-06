import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './Panel.jsx';
import BubbleGenerator from './plugins/Bubble.js';

class BubbleExperiment extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
    }
    //--------------------------------- declareConstants
    declareConstants(){
        this.IDLE_LEFT                  = "100%";
        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        this.STYLE                      = {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%'
        };
    }
    //--------------------------------- render
    render(){
        //want to start th eplugin 
        //combine props style with 
        //the style constant
        var style = Object.assign({}, this.STYLE);

        return(
            <Panel  data={this.props.data} 
                    is_active={this.props.is_active} 
                    is_previous={this.props.is_previous} 
                    show={this.props.show} 
                    hide={this.props.hide}
                    direction={this.props.panel_direction} 
                    show_on_active={false}
                    stage_width={this.props.stage_width}
                    stage_height={this.props.stage_height}>
                <div ref="experimentHolder"></div> 
            </Panel>         
        );
    }
    //--------------------------------- componentDidMount
    componentDidMount(){
        //want the plugin to be handled outside
        //of react  - so add it here -
        //so that react doesnt know about it
        this.createPlugin();
        this.initPlugin();

        //listen for idle event
        //move this component off the stage when 
        //the panel is idle
        this.handlePanelIdle();
    }
    //--------------------------------- createPlugin
    createPlugin(){
        var experiment_holder_el = $(ReactDOM.findDOMNode(this.refs.experimentHolder));
        var plugin_el = $('<div id="bubble-generator" />');
        plugin_el.css({
            width: this.props.data.width, 
            height: this.props.data.height,
            background: '-webkit-radial-gradient(circle, rgba(237,220,138,1) 10%, rgba(226,207,122,1) 30%, rgba(204,184,86,1) 60%)',
            background: '-o-radial-gradient(circle, rgba(237,220,138,1) 10%, rgba(226,207,122,1) 30%, rgba(204,184,86,1) 60%)',
            background: '-moz-radial-gradient(circle, rgba(237,220,138,1) 10%, rgba(226,207,122,1) 30%, rgba(204,184,86,1) 60%)',
            background: 'radial-gradient(circle, rgba(237,220,138,1) 10%, rgba(226,207,122,1) 30%, rgba(204,184,86,1) 60%)'
        });
        experiment_holder_el.append(plugin_el);
    }
    //--------------------------------- initPlugin
    initPlugin(){
        //initialize the plugin
        BubbleGenerator.init({
            html: [ 
                '<img style="width:138px; height:138px;" src="/assets/img/experiments/bubble-01-steak.svg" />',
                '<img style="width:146px; height:135px;" src="/assets/img/experiments/bubble-02-kabobs.svg" />',
                '<img style="width:170px; height:148px;" src="/assets/img/experiments/bubble-03-ketchup.svg" />',
                '<img style="width:103px; height:109px;" src="/assets/img/experiments/bubble-04-flame.svg" />',
                '<img style="width:115px; height:115px;" src="/assets/img/experiments/bubble-05-saltpepper.svg" />',
                '<img style="width:158px; height:142px;" src="/assets/img/experiments/bubble-06-hotsauce.svg" />',
                '<img style="width:134px; height:130px;" src="/assets/img/experiments/bubble-07-steakwfat.svg" />',
                '<img style="width:172px; height:145px;" src="/assets/img/experiments/bubble-08-grill.svg" />',
                '<img style="width:146px; height:151px;" src="/assets/img/experiments/bubble-09-dots.svg" />',
                '<img style="width:130px; height:130px;" src="/assets/img/experiments/bubble-10-dots.svg" />'
            ],
            num_max: 30,
            num_min: 20
        });
    }
    //--------------------------------- handlePanelIdle
    handlePanelIdle(){
        var self = this;
        var el = $(ReactDOM.findDOMNode(this));
        $(el).on("idle", function(){
            self.setState({left: self.IDLE_LEFT});
        });
    }
    //--------------------------------- componentDidUpdate
    componentDidUpdate(prevProps, prevState){  
        //don't want to keep calling 
        //start and clear
        if(this.props.is_active && this.props.show){
            if(!prevProps.show){
                var start_timeout = setTimeout(function(){
                    BubbleGenerator.start();
                }, 100);
            }
        } 
        else BubbleGenerator.clear();

        if( this.props.stage_width != prevProps.stage_width || 
            this.props.stage_height != prevProps.stage_height ){
            BubbleGenerator.reset();
        }
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){ 
        //for now just call onImgsLoaded Method
        //immediately -- think about setting up
        //Bubbles to dynamically load
        if(!this.props.load_imgs & nextProps.load_imgs) this.props.onImgsLoaded();
    }
}

export default BubbleExperiment;
