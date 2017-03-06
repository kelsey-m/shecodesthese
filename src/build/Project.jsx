import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './Panel.jsx';

class Project extends React.Component {
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
        this.STYLE                      = {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%'

        };
        this.CONTENT_STYLE              = {
                                            width: '100%',
                                            height: '100%',
                                            backgroundSize: 'cover'
        };
        this.HIDDEN_IMG_STYLE           = {
                                            opacity: 0,
                                            position: 'absolute',
                                            left: '100%'
        };
    }
    //--------------------------------- setInitialState    
    setInitialState(){
        this.state = { 
            img_src: ""
        };
    }
    //--------------------------------- render
    render(){
        var content_style = Object.assign({}, this.CONTENT_STYLE);
        content_style.backgroundImage = 'url("' + this.state.img_src +'")';
        content_style.backgroundPosition = this.props.data.position;
        
        return(
            <Panel  data={this.props.data} 
                    is_active={this.props.is_active} 
                    is_previous={this.props.is_previous} 
                    show={this.props.show} 
                    hide={this.props.hide}
                    direction={this.props.panel_direction}
                    title={this.props.data.title}
                    desc={this.props.data.desc}
                    show_on_active={false}
                    stage_width={this.props.stage_width}
                    stage_height={this.props.stage_height}>
                <div>
                    <div style={content_style}></div>
                </div>
                <img ref="hiddenImg" style={this.HIDDEN_IMG_STYLE} src={this.state.img_src} />
            </Panel>
        );
    }
    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        if(!this.props.load_imgs && nextProps.load_imgs) this.loadImg();
    }
    //--------------------------------- loadImg
    loadImg(){
        this.initHiddenImg();
    }
    //--------------------------------- createHiddenImg
    initHiddenImg(){
        var self = this;

        //listen for loaded event
        var img = $(ReactDOM.findDOMNode(this.refs.hiddenImg));
        if(img.complete) this.onHiddenImgLoaded(img);
        $(img).on("load",function(event){
            self.onHiddenImgLoaded(img);
        });

        this.setState({img_src: this.props.data.src}); 
    }
    //--------------------------------- onHiddenImgLoaded
    onHiddenImgLoaded(img){
        img.remove();
        this.props.onImgsLoaded();
    }
}

export default Project;