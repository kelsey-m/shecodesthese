import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './Panel.jsx';
import BubbleGenerator from './plugins/Bubble.js';

class ImageExplosionExperiment extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
    }
    //--------------------------------- declareConstants
    declareConstants(){
        this.IMG_SRC                    = "/assets/img/experiments/car-book-map.jpg";
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
        //var style = Object.assign(this.props.style, this.STYLE);
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
    //--------------------------------- componentDidMount
    componentDidMount(){
        var self = this;
        //want the plugin to be handled outside
        //of react  - so add it here -
        //so that react doesnt know about it
        var experiment_holder_el = $(ReactDOM.findDOMNode(this.refs.experimentHolder));
        var plugin_el = $('<div id="image-explosion-experiment" />');
        plugin_el.css({width: this.props.data.width, height: this.props.data.height});
        experiment_holder_el.append(plugin_el);

        //initialize the plugin
        //may need to set small timeout 
        setTimeout(function(){
            //for now just add an image to it
            self.createImg(plugin_el);
        }, 1000);
    }
    //--------------------------------- createImg
    createImg(plugin_el){
        var self = this;
        var img_el = document.createElement("div");
        img_el.style.backgroundSize = 'cover';
        img_el.style.width = '100%';
        img_el.style.height = '100%';
        img_el.style.opacity = 0; 
        var css_transition = 'opacity 0.5s';
        img_el.style.webkitTransition = css_transition;
        img_el.style.mozTransition = css_transition;
        img_el.style.oTransition = css_transition;
        img_el.style.transition = css_transition;
        img_el.style.webkitTransform = "translateZ(0)";
        img_el.style.mozTransform = "translateZ(0)";
        img_el.style.oTransform = "translateZ(0)";
        img_el.style.transform = "translateZ(0)";
        plugin_el.append($(img_el));

        var img = document.createElement("img");
        img.src = this.IMG_SRC;
        img.style.opacity = 0;
        plugin_el.append($(img));

        if(img.complete) this.onImgLoaded(img, img_el);
        $(img).on("load",function(event){
            self.onImgLoaded(img, img_el);
        });
    }
    //--------------------------------- onImgLoaded
    onImgLoaded(img,img_el){
        var src = img.src;
        $(img).remove();
        img_el.style.backgroundImage = 'url("' + src + '")';
        img_el.style.backgroundSize = 'cover';
        img_el.style.backgroundPosition = 'center';
        setTimeout(function(){
            img_el.style.opacity = 1;
        }, 60);
    }
}

export default ImageExplosionExperiment;
