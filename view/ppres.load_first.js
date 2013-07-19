/**ppres.load_first*/

function nav_elem(id,text,st){this.id=id; this.text=text; this.st=st;}

function TC(x){if (typeof(x) == 'undefined')return "1"; else return "0"; 
  //try{if(x !== undefined)return "1"; else return "0";}catch(Exception e){return "0";} return "1";
	}

function var_list(x){  for(var b in x) {  if(x.hasOwnProperty(b)) console.log(x +". "+ b +" (prop)");else  if(b!==null) console.log(x +". "+ b +" ");         }}


function nav_try(v){
   var link=nav_state_link(v);
                 
      var item = jQuery('<li>');
      item.attr('id', v.id)
      item.append(link);
	    //var list_root =document.getElementById('nav_all');
      list_root.append(item);
}

function nav_li(x){
	var item = jQuery('<li>');
	item.append(x);
	return item;
}
function nav_state_link(v){
	var link = jQuery('<a>', {
		text: v.text,
	    	title: v.text,
	    	href: '#'
	});
	nav_state(v,link);
	v.link=link;
	return link;
}

function nav_state(v,link){
//	if(v.link)v.link.empty();
	/**default all is well:*/
//	link.removeClass('icon-chevron-right text-warning nav-link muted icon-repeat pointer right align-right align-justify icon-minus-sign align-right icon-wrench');
	if(link !== undefined)	link.removeClass();
	link.attr('text',v.text);
	link.attr('title',v.text);
//	v.i=jQuery("<i/>");
	if(v.i === undefined || v.i ===null){v.i=jQuery("<i/>");	}
//	else	link.remove(v.i);
	else 	v.i.removeClass();

///###### now we can add the new classes:

	/**all is fine:*/
	if(v.st==="1"){
		link.addClass("nav-link");   
//		link.append(jQuery("<i/>").addClass("icon-chevron-right"));
		v.i.addClass("icon-chevron-right");
	}
	/**flatline result*/
	if(v.st==="-1"){
		link.addClass("nav-link muted"); 
		link.attr('title',v.text+": data is flatline / predicted but zero result ");     
//		link.append(jQuery("<i/>").addClass("icon-minus-sign align-right"));
		 v.i.addClass("icon-minus-sign align-right icon-chevron-right");
	}
	/**prediction not run / failed:*/
	if(v.st==="0"){ 
		link.addClass("text-warning nav-link");          
		link.attr('title',v.text+": prediction not run / failed ... retry? ");
//		link.append(jQuery("<i/>").addClass("icon-repeat pointer right align-right align-justify"));
		v.i.addClass("icon-repeat pointer right align-right");
	}
	/**initial loading*/
	if(v.st==="-0"){
		link.addClass("nav-link ");
		link.attr('title',v.text+": loading");
		v.i.addClass("icon-info-sign pointer right align-right icon-chevron-right");
	}

	/**under construction*/
        if(v.st==="-2"){ 
		link.addClass("muted "); 
		link.attr('title',v.text+": under construction ");
//		link.append(jQuery("<i/>").addClass("icon-wrench "));
		v.i.addClass("icon-wrench align-right icon-chevron-right");

	}
	/**new data*/
        if(v.st==="2"){
		link.addClass("nav-link text-success ");
		link.attr('title',v.text+": new data ");
        //      link.append(jQuery("<i/>").addClass("icon-star "));

	      v.i.addClass("icon-star pointer right align-right icon-chevron-right");
         
	}		

	link.append("   ");
	link.append(v.i);
	v.link=link;
}

