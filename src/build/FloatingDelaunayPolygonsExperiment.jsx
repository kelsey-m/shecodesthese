import React from 'react';
import ReactDOM from 'react-dom';
import FloatingDelaunayPolygons from 'floating-delaunay-polygons';
import Panel from './Panel.jsx';

class FloatingDelaunayPolygonsExperiment extends React.Component {

    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
        this.setInitialState();
    }

    //--------------------------------- declareConstants
    declareConstants(){
        this.IMG_SRC                    = "/assets/img/experiments/abstract-polygon.jpg";
        this.declareStyleConstants();
    }
    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        this.STYLE                      = {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%'
        };
        this.PLUGIN_STYLE               = {
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
                    show_on_active={true}
                    stage_width={this.props.stage_width}
                    stage_height={this.props.stage_height}>
                <div ref="experimentHolder"></div>
            </Panel>
        );
    }
     //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            is_showing: false
        };
    }
    //--------------------------------- componentDidMount
    componentDidMount(){
        //want the plugin to be handled outside
        //of react  - so add it here -
        //so that react doesnt know about it
        this.canvas_el = document.createElement("CANVAS");
        this.canvas_el.style.width = this.props.data.width;
        this.canvas_el.style.height = this.props.data.height;
        this.canvas_el.setAttribute("resize", "true");

        var experiment_holder_el = ReactDOM.findDOMNode(this.refs.experimentHolder);
        experiment_holder_el.style.width = this.props.data.width;
        experiment_holder_el.style.height = this.props.data.height;
        experiment_holder_el.appendChild(this.canvas_el);

        var colors = ['#cc79ad', '#b7e4fb', '#d3fbea', '#e7a789'];
        var size = 250;
        this.floatingDelaunayPolygons = new FloatingDelaunayPolygons(this.canvas_el, colors, size);
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        var self = this;

        //load the bg image
        if( this.floatingDelaunayPolygons && !this.props.load_imgs && nextProps.load_imgs )
            this.floatingDelaunayPolygons.loadBgImage(this.IMG_SRC, this.onImgsLoaded.bind(this));
    }
    //--------------------------------- onImgsLoaded
    onImgsLoaded(){
        //if(this.props.is_active){
            this.floatingDelaunayPolygons.start();
            this.setState({is_showing: true});
        //}
        
        this.props.onImgsLoaded();
    }
    //--------------------------------- componentDidUpdate
    componentDidUpdate(prevProps, prevState){  
        var self = this;
        var start_timeout, clear_timeout;

        //if window has resized
        if( prevProps.stage_width != this.props.stage_width ||
            prevProps.stage_height != this.props.stage_height ) {
            //paper js's resize handling is taking place
            //when the last dimmensions are still in place
            //so dispatch another event immediately to correct
            window.dispatchEvent(new Event('resize'));
        }

        //don't want to keep calling 
        //start and clear
        if(this.props.is_active && this.props.show){
            if(!prevProps.show && !this.state.is_showing){
                clearTimeout(this.clear_timeout);
                start_timeout = setTimeout(function(){
                    self.floatingDelaunayPolygons.reset();
                    self.floatingDelaunayPolygons.start();
                }, 100);
            }
        } 
        else{
            //only want to call clear when not active
            //and only once per deactivating
            if( (prevProps.is_active && !this.props.is_active) ){
                clearTimeout(this.start_timeout);
                this.setState({is_showing: false});
                clear_timeout = setTimeout(function(){
                    self.floatingDelaunayPolygons.clear();
                }, 500);
            }
        } 
    }
}

export default FloatingDelaunayPolygonsExperiment;
 