import React from 'react';
import Panel from './Panel.jsx';

class Project extends React.Component {
    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
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
    }
    //--------------------------------- render
    render(){
        var content_style = Object.assign({}, this.CONTENT_STYLE);
        content_style.backgroundImage = 'url("' + this.props.data.src +'")';
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
            </Panel>
        );
    }
}

export default Project;