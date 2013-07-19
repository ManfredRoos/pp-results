/**ppres.load_last*/

/**status functions each represents one item of the nav */
/**default always available*/
function status_dash(){return "1";}


function status_secstruct(){//return "1";
if(M ===undefined) return "-0";
if(M.getSSComposition()===null||M.getSolvAccComposition()===null)return "0";

var ss =M.getSSComposition() //{  helix: 0,  strand: 0,   loop: 0 
var so = M.getSolvAccComposition() //{         Hydrophobic: 0,  Intermediate: 0,	Hydrophilic: 0};

if(ss.helix>0||ss.strand>0||ss.loop>0||so.Hydrophobic>0||so.Intermediate>0||Hydrophilic>0) return "1";
return "-1";

}
function status_tmh(){return "1";}
function status_disorder(){return "1";}
function status_disulphide(){return "1";}

/**get snap status from the db ... */
function status_func(){
if(SNAP_there===null){
  jQuery.get('/~roos//test/snap/?md5=' + M.getMD5Seq(),{},
	   function(data) {
	     SNAP_there=parseInt(data);
	     //       alert('page content: ' + data);
	     if(parseInt(data)>0) return "1";
	   else return "0";	     
	  }
     );
}
else {
if(parseInt(SNAP_there)>0) return "1";
else return "0";
}
//	return "2";
//
}
function status_goannotation(){//return TC(window['GOANNOT_VIEW']); if(GOANNOT_VIEW !== undefined)return "1"; else return "0";

if(M.getGOAnnotations()!==null && M.getGOAnnotations().lenght>0) return "1"; // ok lets see
if(M.getGOAnnotations()!==null &&M.getGOAnnotations().lenght==0) return "0"; // no data redo?
else return "-1"; 
}
function status_subcell(){ //return "1";
//mainObj().getSubCellLocations("bact")!==null  // do this for each domain

if(M.getSubCellLocations("bact") !==null && M.getSubCellLocations("euka") !==null && M.getSubCellLocations("arch") !==null ) return "1";
return "-1";
}
function status_binding(){
	return "1";

}
/**literature search TODO default: to under construction*/
function status_litsearch(){return "-2";}
/**default always available*/
function status_tutorial(){return "1";}

var M=null;
var SNAP_there=null;
function build_nav_all(){
	console.log("build_nav_all");
//	if(mainObj!==undefined)M=mainObj	;
//	if(!==undefined)M=PPResData();
	if(APP!==undefined && APP.getDataObj()!==undefined)M=APP.getDataObj();
	else return;
var v;
//################################################
v= navigation_items["views"][0];
v.st=status_dash();
nav_state(v,v.link);

//var e=PPResData().getSubCellLocations("euka");
//if(e!==null)console.log("euka");
//else console.log("euka --nop");


v= navigation_items["structure annotation"][0];
v.st=status_secstruct();
nav_state(v,v.link);

v= navigation_items["structure annotation"][1];
v.st=status_tmh();
//console.log(v.text);
nav_state(v,v.link);

v= navigation_items["structure annotation"][2];
v.st=status_disorder();
nav_state(v,v.link);

v= navigation_items["structure annotation"][3];
v.st=status_disulphide();
nav_state(v,v.link);


v= navigation_items["Function Annotation"][0];
v.st=status_func();
nav_state(v,v.link);

v= navigation_items["Function Annotation"][1];
v.st=status_goannotation();
nav_state(v,v.link);

v= navigation_items["Function Annotation"][2];
v.st=status_subcell();
nav_state(v,v.link);

v= navigation_items["Function Annotation"][3];
v.st=status_binding();
nav_state(v,v.link);


v= navigation_items["Additional Services"][0];
v.st=status_litsearch();
nav_state(v,v.link);

console.log(PPResData().getMD5Seq());
}

/**timeouts to rebuild the nav */
setTimeout(build_nav_all,1000);
setTimeout(build_nav_all,3000);
setTimeout(build_nav_all,10000);
setTimeout(build_nav_all,60000);





