import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import App from './App.jsx';
import COLORS from './style/COLORS.jsx';

var app = document.getElementById('app');
setBaseStyles();

ReactDOM.render(<App />, app);

//add fastclick to polyfill
//click delays on touch UIs
FastClick.attach(document.body);

//--------------------------------- setBaseStyles
//go ahead and set base
//styles here since we are
//not using external css for 
//this project
function setBaseStyles(){
    document.body.style.margin = 0;
    document.body.style.fontFamily = "Helvetica, Arial, sans-serif";
    document.body.style.fontSize = (window.innerWidth >= 600) ? "16px" : "13px";
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.color = COLORS.DRK_GRAY;
    document.body.style.width = document.documentElement.style.width = '100%';
    document.body.style.height = document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    app.style.width = '100%';
}