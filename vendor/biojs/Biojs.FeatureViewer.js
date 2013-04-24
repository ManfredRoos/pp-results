
Biojs.FeatureViewer=Biojs.extend({raphael:'',connections:[],zoomSlider:'',slider_stop:0,slider_start:0,context:'',_UP:"up",_DOWN:"down",_MIDDLE:"middle",_CENTERED:"centered",_ROWS:"rows",_NON_OVERLAPPING:"nonOverlapping",_GRID_OPACITY:0.3,_LIME:"#00ff00",_DARK_ORANGE:"#ff8c00",_originalColor:"",_previousClickedColor:"",_previousClickedShape:"",_previousClickedFeature:"",_clickCounter:0,constructor:function(options){jQuery.noConflict();this.initRaphael();if(!Biojs.Utils.isEmpty(this.opt.json)){this.paintFeatures(this.opt.json)}},opt:{target:"YourOwnDivId",json:{},showSlider:true,showPrintButton:true,showFeatureTooltipOnMouseOver:true,highlightFeatureOnMouseOver:true,selectFeatureOnMouseClick:true,dragSites:true,selectionColor:"#ff8c00",featureImageWebService:"http://localhost:8080/image"},eventTypes:["onFeatureClick","onFeatureOn","onFeatureOff","onFeatureSelected","onFeatureUnselected"],setSelectionColor:function(newSelectionColor){this.opt.selectionColor=newSelectionColor;},customize:function(selectedStyle,paintHorizontalGrid,paintVerticalGrid){var config=this.opt.json.configuration;if((selectedStyle=="")||((selectedStyle!="")&&(selectedStyle==config.style))){if(paintVerticalGrid!=config.verticalGrid){config.verticalGrid=paintVerticalGrid;if(paintHorizontalGrid!=config.horizontalGrid){config.horizontalGrid=paintHorizontalGrid;if(paintVerticalGrid&&paintHorizontalGrid){this._paintVerticalGridLines(config.verticalGridLineLength,config.requestedStop,config.requestedStart,config.rulerLength,config.rulerY,config.pixelsDivision,config.leftMargin,this.raphael);this._paintHorizontalGridLines(config.horizontalGrid,config.horizontalGridNumLines,config.gridLineHeight,config.nonOverlapping,config.leftMargin,config.rightMargin,config.sequenceLineY,config.rulerY,config.sizeX,this.raphael);}else{this._repaint('withoutZoom');}}else{if(paintVerticalGrid){this._paintVerticalGridLines(config.verticalGridLineLength,config.requestedStop,config.requestedStart,config.rulerLength,config.rulerY,config.pixelsDivision,config.leftMargin,this.raphael);}else{this._repaint('withoutZoom');}}}else{if(paintHorizontalGrid!=config.horizontalGrid){config.horizontalGrid=paintHorizontalGrid;if(paintHorizontalGrid){this._paintHorizontalGridLines(config.horizontalGrid,config.horizontalGridNumLines,config.gridLineHeight,config.nonOverlapping,config.leftMargin,config.rightMargin,config.sequenceLineY,config.rulerY,config.sizeX,this.raphael);}else{this._repaint('withoutZoom');}}}}else{config.style=selectedStyle;config.horizontalGrid=paintHorizontalGrid;config.verticalGrid=paintVerticalGrid;this._updateFeaturesToStyle(selectedStyle);var holder=document.getElementById("uniprotFeaturePainter-holder");holder.innerHTML="";holder.style.height=(config.sizeY+config.sizeYKey)+"px";holder.style.width=config.sizeX+"px";this.raphael=Raphael("uniprotFeaturePainter-holder",config.sizeX,config.sizeY+config.sizeYKey);this._repaint('withoutZoom');}},paintFeatures:function(json){if(json)
{this.opt.json=json;}
this._init();this._paintSlider();this._repaint();},exportFeaturesToImage:function(){var config=this.opt.json.configuration;var dataURL="";if(jQuery.browser.msie){var arguments="segment="+this.opt.json.segment;if((config.requestedStart!=0)&&(config.requestedStop!=0)){arguments=arguments+":"+config.requestedStart+","+config.requestedStop;}
arguments=arguments+"&dasReference="+config.dasReference+"&dasSources="+config.dasSources+"&width="+config.sizeX+"&option=image"+"&hgrid="+config.horizontalGrid+"&vgrid="+config.verticalGrid+"&style="+config.style;dataURL=this.opt.featureImageWebService+"?"+arguments;window.open(dataURL);}else{svg=document.getElementById('uniprotFeaturePainter-holder').innerHTML;var canvas=document.createElement("canvas");canvg(canvas,svg);dataURL=canvas.toDataURL();this.$imageExported=jQuery('<div id="uniprotFeaturePainter-imageExportedDiv"></div>').html('<img id="uniprotFeaturePainter-imageExported" alt="exported image" src="'+dataURL+'"/>').dialog({autoOpen:true,title:'Exported image',modal:true,width:config.sizeX+20});}},showGeneralLegend:function(){var config=this.opt.json.configuration;var dataURL=this.opt.featureImageWebService+"?";window.open(dataURL);},zoom:function(init,end){var config=this.opt.json.configuration;var sequenceLength=config.sequenceLength;if((init>=1)&&(end<=sequenceLength)){this._repaint(undefined,init,end);}},_init:function(){Biojs_FeatureViewer_myself=this;var config=this.opt.json.configuration;var painter_div=jQuery("#"+this.opt.target);painter_div.text('');if(this.opt.showSlider&&this.opt.showPrintButton){painter_div.append(this._withSliderAndButton(config.sizeX,config.sizeY,config.sizeYKey));}else if(this.opt.showPrintButton){painter_div.append(this._withButtonOnly(config.sizeX,config.sizeY,config.sizeYKey));}else if(this.opt.showSlider){painter_div.append(this._withSliderOnly(config.sizeX));}
painter_div.append('<br/>');painter_div.append('<div id="uniprotFeaturePainter-holder"></div>');var holder=document.getElementById("uniprotFeaturePainter-holder");if(!holder){this.$errorMsg=jQuery('<div id="uniprotFeaturePainter-errorInit"></div>').html('There was an unexpected failure, the image cannot be displayed.').dialog({autoOpen:true,title:'Error',modal:true});throw"Error";}
holder.innerHTML="";holder.style.height=(config.sizeY+config.sizeYKey)+"px";holder.style.width=config.sizeX+"px";this.raphael=Raphael("uniprotFeaturePainter-holder",config.sizeX,config.sizeY+config.sizeYKey);},_clear:function(withoutZoom){this.raphael.clear();this.connections=[];if(!withoutZoom){var keyShapes=this.opt.json.legend.key;if(keyShapes){for(var i=0;i<keyShapes.length;i++){keyShapes[i].label.total=0;}}}},_paintJson:function(withoutZoom){var config=this.opt.json.configuration;for(var i=0;i<this.opt.json.featuresArray.length;i++){var elem=this.opt.json.featuresArray[i];if(!((elem.featureEnd<config.requestedStart)||(elem.featureStart>config.requestedStop))){this._paint(elem,config.sequenceLineY);if(!withoutZoom){this._increaseKeyTotal(elem.typeLabel);}}}},_paintKey:function(){var legend=this.opt.json.legend;var keySegment=legend.segment
var font={'text-anchor':'start'};var shape=this.raphael.text(keySegment.xPos,keySegment.yPos,keySegment.text).attr(font);shape.attr({"stroke":"black","stroke-width":0.1});var keyShapes=legend.key;for(var i=0;i<keyShapes.length;i++){this._paint(keyShapes[i].shape);var shapeText=keyShapes[i].label;var font={'text-anchor':'start'};var shape=this.raphael.text(shapeText.xPos,shapeText.yPos,shapeText.text+' ('+shapeText.total+')').attr(font);shape.attr({"stroke":"black","stroke-width":0.1});}},_paintRuler:function(){var config=this.opt.json.configuration;var ruler=this.raphael.path("M"+config.leftMargin+" "+config.rulerY+"L"+(config.sizeX-config.rightMargin)+" "+config.rulerY);ruler.attr({fill:"black",stroke:"black","fill":1,"stroke-width":1});var divisions=1.0*config.rulerLength/config.pixelsDivision;var divisionValue=1.0*(config.requestedStop-config.requestedStart+1)/divisions;var divisionSize=config.rulerLength/(divisions*10);divisions=Math.round(divisions);divisionValue=Math.round(divisionValue);for(var i=1;i<divisions*10;i++){var posX=Math.round(i*divisionSize+config.leftMargin);if((divisionValue*i/10)<config.requestedStop){if(i%10==0){var line=this.raphael.path("M"+posX+" "+(config.rulerY-6)+"L"+posX+" "+(config.rulerY+6));line.attr({fill:"black",stroke:"black","fill":1,"stroke-width":1});var text=this.raphael.text(posX,config.aboveRuler,""+((divisionValue*i/10)+config.requestedStart-1));text.attr({fill:"black"});if((config.verticalGrid=='true')||(config.verticalGrid==true)){var line=this.raphael.path("M"+posX+" "+(config.rulerY+6)+"L"+posX+" "+config.verticalGridLineLength);line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}}else if(i%5==0){var line=this.raphael.path("M"+posX+" "+(config.rulerY-4)+"L"+posX+" "+(config.rulerY+4));line.attr({fill:"grey",stroke:"grey","fill":1,"stroke-width":1});}}}
var text=this.raphael.text(config.leftMargin,config.belowRuler,""+config.requestedStart);text.attr({fill:"blue"});var text=this.raphael.text(config.rulerLength+config.leftMargin,config.belowRuler,""+config.requestedStop);text.attr({fill:"blue"});if((config.verticalGrid=='true')||(config.verticalGrid==true)){var line=this.raphael.path("M"+config.leftMargin+" "+(config.rulerY+6)+"L"+config.leftMargin+" "+config.verticalGridLineLength);line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});var line=this.raphael.path("M"+(config.rulerLength+config.leftMargin)+" "+(config.rulerY+6)+"L"+(config.rulerLength+config.leftMargin)+" "+config.verticalGridLineLength);line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}
var sequenceLine=this.raphael.path("M"+config.leftMargin+" "+config.sequenceLineY+"L"+(config.sizeX-config.rightMargin)+" "+config.sequenceLineY);sequenceLine.attr({fill:"blue",stroke:"blue","fill":1,"stroke-width":1});this._paintHorizontalGridLines(config.horizontalGrid,config.horizontalGridNumLines,config.gridLineHeight,config.nonOverlapping,config.leftMargin,config.rightMargin,config.sequenceLineY,config.rulerY,config.sizeX,this.raphael);},_paintSlider:function(){if(this.opt.showSlider==true){var config=this.opt.json.configuration;var start=config.requestedStart;var stop=config.requestedStop;var sequenceLength=config.sequenceLength;if(!document.getElementById("uniprotFeaturePainter-slider")){return;}
this.slider_start=start;this.slider_stop=stop;var slider_div=jQuery("#uniprotFeaturePainter-slider");slider_div.text('');slider_div.append('<label for="uniprotFeaturePainter-slider-values"></label>');slider_div.append('<div type="text" id="uniprotFeaturePainter-slider-values" style="margin-bottom:5px" />');var myself=this;this.zoomSlider=jQuery('<div id="uniprotFeaturePainter-slider-bar" style="width:300px"></div>').appendTo(slider_div);jQuery('#uniprotFeaturePainter-slider-bar').slider({range:true,min:1,max:sequenceLength,values:[start,stop],slide:function(event,ui){jQuery('#uniprotFeaturePainter-slider-values').html('Zoom - Start: '+ui.values[0]+', End: '+ui.values[1]);slider_start=ui.values[0];slider_stop=ui.values[1];},change:function(event,ui){myself._repaint(undefined,ui.values[0],ui.values[1]);}});jQuery('#uniprotFeaturePainter-slider-values').html('Zoom - Start:'+start+', End:'+stop);}},_repaint:function(withoutZoom,newStart,newStop){var config=this.opt.json.configuration;if(newStart&&newStop){this.slider_start=newStart;this.slider_stop=newStop;}
if((this.slider_start!=0)&&(this.slider_stop!=0)){config.requestedStart=this.slider_start;config.requestedStop=this.slider_stop;}
config.unitSize=config.rulerLength/(config.requestedStop-config.requestedStart+1);this._clear(withoutZoom);this._paintRuler();if(!withoutZoom){for(var i=0;i<this.opt.json.featuresArray.length;i++){var elem=this.opt.json.featuresArray[i];if(!((elem.featureEnd<config.requestedStart)||(elem.featureStart>config.requestedStop))){this._applyZoomToFeature(elem);}}}
this._paintJson(withoutZoom);this._paintKey();},_withSliderAndButton:function(sizeX,sizeY,sizeYKey){var text='<table width="'+sizeX+'px">'+'<tr>'+'<td width="75%">'+'<div  id="uniprotFeaturePainter-slider" style="margin-left: 10px;"></div>'+'</td>'+'<td valign="bottom" align="right">'+'<div id="uniprotFeaturePainter-printButton">'+'<input type="button" value="Export to image" onclick="Biojs_FeatureViewer_myself.exportFeaturesToImage();"/>'+'</div> '+'</td>'+'</tr>'+'</table>'+'<br/>'+'<div id="uniprotFeaturePainter-divimage" style="display: none;">'+'<img id="uniprotFeaturePainter-image" alt="Features image">'+'</div>'+'<div id="uniprotFeaturePainter-divcanvas" style="display: none;">'+'<canvas id="uniprotFeaturePainter-canvas" '+'height="'+(sizeY+sizeYKey)+'" width="'+sizeX+'" style="width: '+sizeX+'px; '+'height: '+sizeX+'px;">'+'</canvas>'+'</div>';return text;},_withSliderOnly:function(sizeX){var text='<table width="'+sizeX+'px">'+'<tr>'+'<td width="75%">'+'<div  id="uniprotFeaturePainter-slider" style="margin-left: 10px;"></div>'+'</td>'+'</tr>'+'</table>'+'<br/>';return text;},_withButtonOnly:function(sizeX,sizeY,sizeYKey){var myself=this;var text='<table width="'+sizeX+'px">'+'<tr>'+'<td valign="bottom" align="right">'+'<div id="uniprotFeaturePainter-printButton">'+'<input type="button" value="Export to image" onclick="Biojs_FeatureViewer_myself.exportFeaturesToImage();"/>'+'</div> '+'</td>'+'</tr>'+'</table>'+'<br/>'+'<div id="uniprotFeaturePainter-divimage" style="display: none;">'+'<img id="uniprotFeaturePainter-image" alt="Features image">'+'</div>'+'<div id="uniprotFeaturePainter-divcanvas" style="display: none;">'+'<canvas id="uniprotFeaturePainter-canvas" '+'height="'+(sizeY+sizeYKey)+'" width="'+sizeX+'" style="width: '+sizeX+'px; '+'height: '+sizeX+'px;">'+'</canvas>'+'</div>';return text;},_raiseEvent:function(myself,shapeRectangle,obj,eventName){connection=myself.connections[shapeRectangle.connectionIndex-1];if(connection){try{shapeRectangle=connection.from;}catch(error){}}
myself.raiseEvent(eventName,{featureId:obj.featureId,featureLabel:obj.featureLabel,featureStart:obj.featureStart,featureEnd:obj.featureEnd,featureTypeLabel:obj.featureTypeLabel,typeCode:obj.typeCode,typeCategory:obj.typeCategory,evidenceText:obj.evidenceText,evidenceCode:obj.evidenceCode,shape:shapeRectangle});},_featureClick:function(onlySelect,myself,raphaelObj,featureObj){myself._clickCounter=myself._clickCounter+1;if(onlySelect){myself._originalColor=raphaelObj.attrs.stroke;}else{if(myself._clickCounter>1){myself._originalColor=raphaelObj.attrs.stroke;}}
raphaelObj.animate({"fill-opacity":1.0},500);if(raphaelObj==myself._previousClickedShape){if(myself._originalColor==myself.opt.selectionColor){myself._originalColor=myself._previousClickedColor;raphaelObj.attr({stroke:myself._previousClickedColor,fill:myself._previousClickedColor});featureObj.isSelected=false;myself._raiseEvent(myself,raphaelObj,featureObj,'onFeatureUnselected');}else{if(onlySelect||(myself._clickCounter%2!=0)){raphaelObj.attr({stroke:myself.opt.selectionColor,fill:myself.opt.selectionColor});raphaelObj.animate({"fill-opacity":1.0},500);}
featureObj.isSelected=true;myself._raiseEvent(myself,raphaelObj,featureObj,'onFeatureSelected');}}else{if(myself._previousClickedShape&&(myself._previousClickedShape!="")){try{myself._previousClickedShape.attr({stroke:myself._previousClickedColor,fill:myself._previousClickedColor});myself._previousClickedShape.animate({"fill-opacity":.5},500);myself._previousClickedFeature.isSelected=false;myself._raiseEvent(myself,myself._previousClickedShape,featureObj,'onFeatureUnselected');}catch(error){Biojs.console.log(error);}}
myself._previousClickedColor=myself._originalColor;myself._previousClickedShape=raphaelObj;myself._previousClickedFeature=featureObj;if(onlySelect){raphaelObj.attr({stroke:myself.opt.selectionColor,fill:myself.opt.selectionColor});raphaelObj.animate({"fill-opacity":1.0},500);}
featureObj.isSelected=true;myself._raiseEvent(myself,raphaelObj,featureObj,'onFeatureSelected');}
myself._raiseEvent(myself,raphaelObj,featureObj,'onFeatureClick');},_paint:function(obj,sequenceLineY){var dotRadius=1;var shape;if(obj.type=="path"){if(obj.featureId||!sequenceLineY){shape=this.raphael.path(obj.path);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}else{var path=this.raphael.path(obj.path);path.attr({"fill":obj.fill,"stroke":obj.stroke,"stroke-width":obj.strokeWidth});}}else if(obj.type=="text"){if(obj.featureId||!sequenceLineY){shape=this.raphael.text(obj.x,obj.y,obj.text);shape.attr({"stroke":obj.stroke,"fill-opacity":obj.fillOpacity,"stroke-width":2});}else{var text=this.raphael.text(obj.x,obj.y,obj.text);text.attr({"fill":obj.fill});}}else if(obj.type=="circle"){shape=this.raphael.circle(obj.cx,obj.cy,obj.r);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}else if(obj.type=="rect"){if(obj.width==0){obj.width=1;}
shape=this.raphael.rect(obj.x,obj.y,obj.width,obj.height);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}else if(obj.type=="diamond"){shape=this.raphael.uniprotFeaturePainter_diamond(obj.cx,obj.cy,obj.r);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}else if(obj.type=="triangle"){shape=this.raphael.uniprotFeaturePainter_triangle(obj.cx,obj.cy,obj.r);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}else if(obj.type=="conPath"){var rad=4;var vert=8;if(obj.text=="N"){shape=this.raphael.uniprotFeaturePainter_NPath(obj.x,obj.y,rad,vert);}else if(obj.text=="O"){shape=this.raphael.uniprotFeaturePainter_OPath(obj.x,obj.y,rad,vert);}else if(obj.text=="C"){shape=this.raphael.uniprotFeaturePainter_CPath(obj.x,obj.y,rad,vert);}else{rad=2;vert=6;var space=4;shape=this.raphael.uniprotFeaturePainter_CONPath(obj.x,obj.y,rad,vert,space);}
shape.attr({"stroke":obj.stroke,"fill-opacity":obj.fillOpacity,"stroke-width":2});}else if(obj.type=="wave"){shape=this.raphael.uniprotFeaturePainter_wave(obj.cx,obj.cy,obj.r);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}else if(obj.type=="hexagon"){shape=this.raphael.uniprotFeaturePainter_hexagon(obj.cx,obj.cy,obj.r);shape.attr({"fill":obj.fill,"stroke":obj.stroke,"fill-opacity":obj.fillOpacity});}
if(obj.isSelected){this._previousClickedShape=shape;this._previousClickedColor=shape.attrs.stroke;this._previousClickedFeature=obj;shape.attr({"fill":this.opt.selectionColor,"stroke":this.opt.selectionColor,"fill-opacity":this.opt.selectionColor});}
if(sequenceLineY){var myself=this;if(this.opt.selectFeatureOnMouseClick){if(this.opt.highlightFeatureOnMouseOver){_clickedShape=false;shape.click(function(){_clickedShape=true;myself._featureClick(false,myself,this,obj);});shape.hover(function(){myself._originalColor=shape.attrs.stroke;this.attr({stroke:myself.opt.selectionColor,fill:myself.opt.selectionColor});this.animate({"fill-opacity":1.0},500);myself._raiseEvent(myself,this,obj,'onFeatureOn');},function(){if(!_clickedShape){this.attr({stroke:myself._originalColor,fill:myself._originalColor});}
_clickedShape=false;myself._clickCounter=0;this.animate({"fill-opacity":.5},500);myself._raiseEvent(myself,this,obj,'onFeatureOff');});}else{shape.click(function(){myself._featureClick(true,myself,this,obj);});shape.hover(function(){myself._raiseEvent(myself,this,obj,'onFeatureOn');},function(){this.animate({"fill-opacity":.5},500);myself._raiseEvent(myself,this,obj,'onFeatureOff');});}}else{if(this.opt.highlightFeatureOnMouseOver){shape.click(function(){myself._raiseEvent(myself,this,obj,'onFeatureClick');});shape.hover(function(){myself._originalColor=this.attrs.stroke;this.attr({stroke:myself.opt.selectionColor,fill:myself.opt.selectionColor});this.animate({"fill-opacity":1.0},500);myself._raiseEvent(myself,this,obj,'onFeatureOn');},function(){this.attr({stroke:myself._originalColor,fill:myself._originalColor});this.animate({"fill-opacity":.5},500);myself._raiseEvent(myself,this,obj,'onFeatureOff');});}else{shape.click(function(){myself._raiseEvent(myself,this,obj,'onFeatureClick');});shape.hover(function(){myself._raiseEvent(myself,this,obj,'onFeatureOn');},function(){myself._raiseEvent(myself,this,obj,'onFeatureOff');});}}
if(obj.type!="rect"){if(this.opt.dragSites){shape.drag(function(dx,dy){if(!this.attr("cx")&&!this.attr("x")){var trans_x=dx-this.ox;var trans_y=dy-this.oy;this.translate(trans_x,trans_y);this.ox=dx;this.oy=dy;}else{var att=this.type=="rect"||this.type=="text"?{x:this.ox+dx,y:this.oy+dy}:{cx:this.ox+dx,cy:this.oy+dy};this.attr(att);}
myself.raphael.uniprotFeaturePainter_connection(myself.connections[this.connectionIndex-1]);myself.raphael.safari();},function(){if(!this.attr("cx")&&!this.attr("x")){this.ox=0;this.oy=0;}else{this.ox=this.type=="rect"||this.type=="text"?this.attr("x"):this.attr("cx");this.oy=this.type=="rect"||this.type=="text"?this.attr("y"):this.attr("cy");}
this.animate({"fill-opacity":1.0},500);},function(){this.animate({"fill-opacity":.5},500);});}
var dot=this.raphael.circle(obj.x,sequenceLineY,dotRadius);dot.attr({"fill":1,stroke:obj.stroke,"stroke-width":1});try{var connectionLine=this.raphael.uniprotFeaturePainter_connection(dot,shape,"#000");this.connections.push(connectionLine);shape.connectionIndex=this.connections.length;}catch(err){Biojs.console.log(err);}}}
if(this.opt.showFeatureTooltipOnMouseOver==true){if(obj.featureId){obj.featureId=obj.featureId.replace(/:|\./g,"_");shape.node.id="uniprotFeaturePainter_"+obj.featureId;var tooltip=obj.featureLabel+" ("+obj.featureStart+", "+obj.featureEnd+"; length "+(obj.featureEnd-obj.featureStart+1)+")"+"<br/>Type: "+obj.featureTypeLabel+" - "+obj.typeCode+" - "+obj.typeCategory+"<br/>Evidence: "+obj.evidenceText+" - "+obj.evidenceCode;var myFeatureObj=jQuery("#"+"uniprotFeaturePainter_"+obj.featureId);myFeatureObj.tooltip({track:true,delay:0,showURL:false,bodyHandler:function(){return tooltip;}});}}
this.raphael.safari();},_increaseKeyTotal:function(keyName){var keyShapes=this.opt.json.legend.key;for(var i=0;i<keyShapes.length;i++){if(keyShapes[i].label.text==keyName){keyShapes[i].label.total=keyShapes[i].label.total+1;return;}}},_applyZoomToFeature:function(el){config=this.opt.json.configuration;if(config.requestedStart!=1){fstart=el.featureStart-config.requestedStart;fstop=el.featureEnd-config.requestedStart;}else{fstart=el.featureStart;fstop=el.featureEnd;}
xInit=Math.round(fstart*config.unitSize+config.leftMargin);xEnd=Math.round(fstop*config.unitSize+config.leftMargin);width=xEnd-xInit;if(el.type=='hexagon'){xInit=xInit-(el.r/2);}
el.cx=xInit;el.x=xInit;el.width=width;},_paintHorizontalGridLines:function(horizontalGrid,horizontalGridNumLines,gridLineHeight,nonOverlapping,leftMargin,rightMargin,sequenceLineY,rulerY,sizeX,raphael){if((horizontalGrid=='true')||(horizontalGrid==true)){for(i=1;i<=horizontalGridNumLines;i++){if(!nonOverlapping){var line=raphael.path("M"+leftMargin+" "+(sequenceLineY+i*gridLineHeight)
+"L"+(sizeX-rightMargin)+" "+(sequenceLineY+i*gridLineHeight));line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});var lineUp=raphael.path("M"+leftMargin+" "+(sequenceLineY-i*gridLineHeight)
+"L"+(sizeX-rightMargin)+" "+(sequenceLineY-i*gridLineHeight));lineUp.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}else{var lineUp=raphael.path("M"+leftMargin+" "+(rulerY+(i+1)*gridLineHeight)
+"L"+(sizeX-rightMargin)+" "+(rulerY+(i+1)*gridLineHeight));lineUp.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}}
if(!nonOverlapping&&(horizontalGridNumLines!=0)){var line=raphael.path("M"+leftMargin+" "+(sequenceLineY+(horizontalGridNumLines+1)*gridLineHeight)
+"L"+(sizeX-rightMargin)+" "+(sequenceLineY+(horizontalGridNumLines+1)*gridLineHeight));line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}
if(nonOverlapping&&(horizontalGridNumLines!=0)){var line=raphael.path("M"+leftMargin+" "+(rulerY+(horizontalGridNumLines+2)*gridLineHeight)
+"L"+(sizeX-rightMargin)+" "+(rulerY+(horizontalGridNumLines+2)*gridLineHeight));line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}}},_paintVerticalGridLines:function(verticalGridLineLength,stop,start,rulerLength,rulerY,pixelsDivision,leftMargin,raphael){var divisions=1.0*rulerLength/pixelsDivision;var divisionValue=1.0*(stop-start+1)/divisions;var divisionSize=rulerLength/(divisions*10);divisions=Math.round(divisions);divisionValue=Math.round(divisionValue);for(var i=1;i<divisions*10;i++){var posX=Math.round(i*divisionSize+leftMargin);if((divisionValue*i/10)<stop){if(i%10==0){var line=raphael.path("M"+posX+" "+(rulerY+6)+"L"+posX+" "+verticalGridLineLength);line.attr({stroke:"black","stroke-width":0.7,"stroke-opacity":this._GRID_OPACITY});}}}},_updateFeaturesToStyle:function(newStyle){if(newStyle==this._ROWS){this.opt.json.configuration.sequenceLineY=this.opt.json.configuration.sequenceLineYRows;this.opt.json.configuration.sizeY=this.opt.json.configuration.sizeYRows;this.opt.json.configuration.verticalGridLineLength=this.opt.json.configuration.verticalGridLineLengthRows;this.opt.json.configuration.horizontalGridNumLines=this.opt.json.configuration.horizontalGridNumLinesRows;this.opt.json.legend.segment.yPos=this.opt.json.legend.segment.yPosRows;this.opt.json.configuration.nonOverlapping=false;}else if(newStyle==this._NON_OVERLAPPING){this.opt.json.configuration.sequenceLineY=this.opt.json.configuration.sequenceLineYNonOverlapping;this.opt.json.configuration.sizeY=this.opt.json.configuration.sizeYNonOverlapping;this.opt.json.configuration.verticalGridLineLength=this.opt.json.configuration.verticalGridLineLengthNonOverlapping;this.opt.json.configuration.horizontalGridNumLines=this.opt.json.configuration.horizontalGridNumLinesNonOverlapping;this.opt.json.legend.segment.yPos=this.opt.json.legend.segment.yPosNonOverlapping;this.opt.json.configuration.nonOverlapping=true;}else{this.opt.json.configuration.sequenceLineY=this.opt.json.configuration.sequenceLineYCentered;this.opt.json.configuration.sizeY=this.opt.json.configuration.sizeYCentered;this.opt.json.configuration.verticalGridLineLength=this.opt.json.configuration.verticalGridLineLengthCentered;this.opt.json.configuration.horizontalGridNumLines=this.opt.json.configuration.horizontalGridNumLinesCentered;this.opt.json.legend.segment.yPos=this.opt.json.legend.segment.yPosCentered;this.opt.json.configuration.nonOverlapping=false;}
for(var i=0;i<this.opt.json.featuresArray.length;i++){var elem=this.opt.json.featuresArray[i];if(newStyle==this._ROWS){elem.cy=elem.rowsStyle.y;elem.y=elem.rowsStyle.y;elem.height=elem.rowsStyle.heightOrRadius;elem.r=elem.rowsStyle.heightOrRadius;}else if(newStyle==this._NON_OVERLAPPING){elem.cy=elem.nonOverlappingStyle.y;elem.y=elem.nonOverlappingStyle.y;elem.height=elem.nonOverlappingStyle.heightOrRadius;elem.r=elem.nonOverlappingStyle.heightOrRadius;}else{elem.cy=elem.centeredStyle.y;elem.y=elem.centeredStyle.y;elem.height=elem.centeredStyle.heightOrRadius;elem.r=elem.centeredStyle.heightOrRadius;}}
for(var i=0;i<this.opt.json.legend.key.length;i++){var elem=this.opt.json.legend.key[i].shape;if(newStyle==this._ROWS){this.opt.json.legend.key[i].label.yPos=this.opt.json.legend.key[i].label.yPosRows;elem.cy=elem.rowsStyle.y;elem.y=elem.rowsStyle.y;elem.height=elem.rowsStyle.heightOrRadius;elem.r=elem.rowsStyle.heightOrRadius;}else if(newStyle==this._NON_OVERLAPPING){this.opt.json.legend.key[i].label.yPos=this.opt.json.legend.key[i].label.yPosNonOverlapping;elem.cy=elem.nonOverlappingStyle.y;elem.y=elem.nonOverlappingStyle.y;elem.height=elem.nonOverlappingStyle.heightOrRadius;elem.r=elem.nonOverlappingStyle.heightOrRadius;}else{this.opt.json.legend.key[i].label.yPos=this.opt.json.legend.key[i].label.yPosCentered;elem.cy=elem.centeredStyle.y;elem.y=elem.centeredStyle.y;elem.height=elem.centeredStyle.heightOrRadius;elem.r=elem.centeredStyle.heightOrRadius;}}},initRaphael:function(){Raphael.fn.uniprotFeaturePainter_hexagon=function(x,y,size){x=x-(size/2);var path=["M",x,y];path=path.concat(["L",x-size,y+(size/2)]);path=path.concat(["L",x,y+size]);path=path.concat(["L",x+size,y+size]);path=path.concat(["L",x+size+size,y+(size/2)]);path=path.concat(["L",x+size,y]);return this.path(path.concat(["Z"]).join(" "));};Raphael.fn.uniprotFeaturePainter_triangle=function(x,y,size){var path=["M",x,y];path=path.concat(["L",(x+size/2),(y+size)]);path=path.concat(["L",(x-size/2),(y+size)]);return this.path(path.concat(["Z"]).join(" "));};Raphael.fn.uniprotFeaturePainter_wave=function(x,y,size){var path=["M",x,y];path=path.concat(["L",x-(size/2),y-size]);path=path.concat(["L",x-size,y]);path=path.concat(["L",x-size,y+size]);path=path.concat(["L",x-(size/2),y+(size/2)]);path=path.concat(["L",x,y+size]);path=path.concat(["L",x+(size/2),y+(size/2)]);path=path.concat(["L",x+size,y+size]);path=path.concat(["L",x+size,y]);path=path.concat(["L",x+(size/2),y-size]);return this.path(path.concat(["Z"]).join(" "));}
Raphael.fn.uniprotFeaturePainter_diamond=function(x,y,r){var path=["M",x,y];path=path.concat(["L",x-r,y+r]);path=path.concat(["L",x,y+(r*2)]);path=path.concat(["L",x+r,y+r]);return(this.path(path.concat(["Z"].join(" "))));}
Raphael.fn.uniprotFeaturePainter_NPath=function(x,y,width,height){var path=["M",(x-width),(y+height)];path=path.concat(["L",(x-width),y]);path=path.concat(["L",(x+width),(y+height-1)]);path=path.concat(["L",(x+width),(y-1)]);return(this.path(path));}
Raphael.fn.uniprotFeaturePainter_OPath=function(x,y,width,height){var path=["M",(x),(y)];path=path.concat(["C",(x-width),(y),(x-width),(y+height),(x),(y+height)]);path=path.concat(["M",(x),(y)]);path=path.concat(["C",(x+width),(y),(x+width),(y+height),(x),(y+height)]);return(this.path(path));}
Raphael.fn.uniprotFeaturePainter_CPath=function(x,y,width,height){var path=["M",(x+width),(y)];path=path.concat(["C",(x-width),(y),(x-width),(y+height),(x+width),(y+height)]);return(this.path(path));}
Raphael.fn.uniprotFeaturePainter_CONPath=function(x,y,width,height,space){var path=["M",(x-width-space),(y)];path=path.concat(["C",(x-width-space-(width*2)),(y),(x-width-space-(width*2)),(y+height),(x-width-space),(y+height)]);path=path.concat(["M",(x-width-space+1),(y+height/2)]);path=path.concat(["L",(x-width-1),(y+height/2)]);path=path.concat(["M",(x),(y)]);path=path.concat(["C",(x-width),(y),(x-width),(y+height),(x),(y+height)]);path=path.concat(["M",(x),(y)]);path=path.concat(["C",(x+width),(y),(x+width),(y+height),(x),(y+height)]);path=path.concat(["M",(x+width+1),(y+height/2)]);path=path.concat(["L",(x+width+space-1),(y+height/2)]);path=path.concat(["M",(x+width+space),(y+height)]);path=path.concat(["L",(x+width+space),y-2]);path=path.concat(["L",(x+width*3+space),(y+height)]);path=path.concat(["L",(x+width*3+space),(y-2)]);return(this.path(path));}
Raphael.fn.uniprotFeaturePainter_connection=function(obj1,obj2,line,bg){if(obj1.line&&obj1.from&&obj1.to){line=obj1;obj1=line.from;obj2=line.to;}
var bb1=obj1.getBBox();if((!bb1.x)&&(obj1.type=="circle")){bb1={height:obj1.attrs.r*2,width:obj1.attrs.r*2,x:obj1.attrs.cx-obj1.attrs.r,y:obj1.attrs.cy-obj1.attrs.r};}
var bb2=obj2.getBBox();if((!bb2.x)&&(obj2.type=="circle")){bb2={height:obj2.attrs.r*2,width:obj2.attrs.r*2,x:obj2.attrs.cx-obj2.attrs.r,y:obj2.attrs.cy-obj2.attrs.r};}
var p=[{x:bb1.x+bb1.width/2,y:bb1.y-1},{x:bb1.x+bb1.width/2,y:bb1.y+bb1.height+1},{x:bb1.x-1,y:bb1.y+bb1.height/2},{x:bb1.x+bb1.width+1,y:bb1.y+bb1.height/2},{x:bb2.x+bb2.width/2,y:bb2.y-1},{x:bb2.x+bb2.width/2,y:bb2.y+bb2.height+1},{x:bb2.x-1,y:bb2.y+bb2.height/2},{x:bb2.x+bb2.width+1,y:bb2.y+bb2.height/2}],d={},dis=[];for(var i=0;i<4;i++){for(var j=4;j<8;j++){var dx=Math.abs(p[i].x-p[j].x),dy=Math.abs(p[i].y-p[j].y);if((i==j-4)||(((i!=3&&j!=6)||p[i].x<p[j].x)&&((i!=2&&j!=7)||p[i].x>p[j].x)&&((i!=0&&j!=5)||p[i].y>p[j].y)&&((i!=1&&j!=4)||p[i].y<p[j].y))){dis.push(dx+dy);d[dis[dis.length-1]]=[i,j];}}}
if(dis.length==0){var res=[0,4];}else{res=d[Math.min.apply(Math,dis)];}
var x1=p[res[0]].x,y1=p[res[0]].y,x4=p[res[1]].x,y4=p[res[1]].y;dx=Math.max(Math.abs(x1-x4)/2,10);dy=Math.max(Math.abs(y1-y4)/2,10);var x2=[x1,x1,x1-dx,x1+dx][res[0]].toFixed(3),y2=[y1-dy,y1+dy,y1,y1][res[0]].toFixed(3),x3=[0,0,0,0,x4,x4,x4-dx,x4+dx][res[1]].toFixed(3),y3=[0,0,0,0,y1+dy,y1-dy,y4,y4][res[1]].toFixed(3);var path=["M",x1.toFixed(3),y1.toFixed(3),"C",x2,y2,x3,y3,x4.toFixed(3),y4.toFixed(3)].join(",");if(line&&line.line){line.bg&&line.bg.attr({path:path});line.line.attr({path:path});}else{var color=typeof line=="string"?line:"#000";return{bg:bg&&bg.split&&this.path(path).attr({stroke:bg.split("|")[0],fill:"none","stroke-width":bg.split("|")[1]||3}),line:this.path(path).attr({stroke:color,fill:"none"}),from:obj1,to:obj2};}};}});var Biojs_FeatureViewer_myself=undefined;