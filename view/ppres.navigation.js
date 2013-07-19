var list_root;
var navigation_items;
var NAVIGATION = (function() {

// added
//	st: 	0=not run/reload,  1=show, 2=new data, 
// 		-0 =dont know jet ...loading, -1=zero/ flatline result,  -2 =under construction, 

	//var 
	navigation_items = {
		"views": [{
				id: "dash",
				text: "Dashboard",
				st: "1"
			}
		],
		"structure annotation": [{
				text: "Secondary Structure and Solvent Accessibility",
				id: "secstruct",
				st: "-0"
			}, {
				id: "tmh",
				text: "Transmembrane Helices",
				st: "-0"
			},
			//  {
			// 	id: "nors",
			// 	text: "Non-Regular Secondary Structure"
			// }, 
			{
				id: "disorder",
				text: "Protein Disorder and Flexibility",
				st: "-0"
			}, {
				id: "disulphide",
				text: "Disulphide Bridges",
				st: "-0"
			}
			//  {
			// 	id: "tmb",
			// 	text: "Transmembrane Beta-barrels"
			// }
		],
		
		"Function Annotation": [{
				id: "func",
				text: "Effect of Point Mutations",
				st: "-0" //HEAT_MAP.data === [] ? 0 : 1
			},

			{
				id: "goannotation",
				text: "Gene Ontology Terms",
				st: "-0" //getGOAnnotations() === {} ? 0 : 1
			},
			{
				id: "subcell",
				text: "Subcellular Localization",
				st: "-0" //getSubCellLocations() === {} ? 0 : 1
			}, {
				id: "binding",
				text: "Binding Sites",
				st: "-0"
			}
		],

		"Additional Services": [{
				id: "litsearch",
				text: "Literature Search",
				st: "-2"
			}
		],

		"Help": [{
				id: "tutorial",
				text: "Site Tutorial",
				st: "1"
			}
		]

	},
		active_item = 2;
//	var i
		list_root = jQuery('<ul>');
	list_root.attr('id', "nav_all");
	jQuery.each(navigation_items, function(key, value) {
		var item = jQuery('<li>');
		item.addClass("nav-header").text(key);
		list_root.append(item);
		jQuery.each(value, function(prop, v) {
			v.item = jQuery('<li>');
			v.item.attr('id', v.id)
/** we use a function here that provides the difrent states of a nav item*/
			var link=nav_state_link(v);
			v.item.append(link);
			list_root.append(v.item);
		});
	});

	list_root.addClass("nav nav-list bs-docs-sidenav");
	jQuery("li:nth-child(2)", jQuery(list_root)).addClass("active");
	return {
		show: function(target_div) {
			target_div.append(list_root);
		},
		setActiveItem: function(_item_number) {
			active_item =_item_number;
			jQuery('.active', jQuery(list_root)).removeClass('active');
			var _item_selector = "li:nth-child(" + _item_number + ")";
			jQuery(_item_selector, jQuery(list_root)).addClass("active");
			// _item_number = active_item;
		}
	}

})();
