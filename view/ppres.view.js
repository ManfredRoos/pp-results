var PAGE = function(argument) {

	var activeDivs = [],
		inactiveDivs = [],
		cached = {},
		pageComponents = {
			Dashboard: [{
				FeatureViewer: {
					showAlignment: true
				}
			},
				'SubcellLocViewer',
				'SummaryTable',
				'AlignmentTable',
				'AlignmentPDBTable',
				'AAConsistency',
				'SSConsistency', ],
			SecondaryStructure: [{
				FeatureViewer: {
					providers: ["PROFsec"],
					showAlignment: false
				}
			}, {
				'SSConsistency': '',

			}, 'SolvAcc'],
			Transmembrane: [{
				'FeatureViewer': {
					providers: ["PHDhtm"],
					showAlignment: false
				}
			}],
			Disorder: [{
				'FeatureViewer': {
					providers: ["PROFbval", "MD", "Ucon", "NORSnet"],
					showAlignment: false
				}
			}],
			Binding: [{
				'FeatureViewer': {
					providers: ["ISIS"],
					showAlignment: false
				}
			}],
			TMB: [{
				'FeatureViewer': {
					providers: ["PROFtmb"],
					showAlignment: false
				}
			}],
			Disulphide: [{
				'FeatureViewer': {
					providers: ["DISULFIND"],
					showAlignment: false
				}
			}],
			Heatmap: [
				'HeatmapViewer'],
			SubcellLoc: [
				"SubcellLocViewer"]
		},
		defaultPage = "Dashboard",
		currentPage,
		mainContainerDiv = jQuery("#content"),
		loadingDiv = jQuery(".loading"),
		dataObj,
		providers,
		showAlignment;
	(argument.page) ? currentPage = argument.page : currentPage = defaultPage;
	(argument.providers) ? providers = argument.providers : providers = [];
	(argument.showAlignment) ? showAlignment = argument.showAlignment : showAlignment = false;

	if (!dataObj) dataObj = argument.data;

	var isCached = function(elementName) {
		if (cached[elementName]) return true;
		return false;
	};

	var cacheFetch = function(elementName) {
		return (cached[elementName]);
	};

	var cacheStore = function(elementName, element) {
		cached[elementName] = element;
	};


	var cacheRemove = function(elementName) {
		delete(cached[elementName]);
	};

	var visualComponents = {
		drawAlignmentTable: function(argument) {
			targetDiv = argument.targetDiv;
			ALI_VIEW.draw(dataObj.getAlignmentLocations(), jQuery("#" + targetDiv));
		},

		drawAlignmentPDBTable: function(argument) {
			targetDiv = argument.targetDiv;
			ALI_VIEW.draw(dataObj.getAlignmentLocations("pdb"), jQuery("#" + targetDiv));
		},

		drawAAConsistency: function(argument) {
			targetDiv = argument.targetDiv;
			jQuery("#" + targetDiv).append("<h3>Amino Acid composition</h3>");
			PIE_CHART.toPieData(dataObj.getAAComposition()).drawPieChart(targetDiv);
		},
		drawHeatmapViewer: function(argument) {
			jQuery.getJSON('examples/CD44_HUMAN.map.json', function(arr) {
				jQuery("#heatmap").empty();
				jQuery("#zoom").empty();
				var hm = new HEAT_MAP({
					targetDiv: "heatmap",
					dataObj: arr
				});
				var increments = Math.floor((arr.length / 20) * .1);
				var start, end, zoom;

				jQuery(function() {
					jQuery("#slider").slider({
						animate: "fast",
						value: 0,
						min: 0,
						max: ((arr.length) / 20) - increments,
						step: increments,
						slide: function(event, ui) {
							start = ui.value;
							jQuery("#start").text(start);
							((start + increments) > (arr.length / 20)) ? end = arr.length / 20 : end = start + increments;
							jQuery("#end").text(end);
							jQuery("#zoom").empty();
							zoom = new HEAT_MAP({
								targetDiv: "zoom",
								dataObj: arr,
								startPoint: start,
								increments: increments
							});
						}
					});
					start = jQuery("#slider").slider("value");
					jQuery("#start").text(start);
					((start + increments) > (arr.length / 20)) ? end = arr.length / 20 : end = start + increments;
					jQuery("#end").text(end);
					zoom = new HEAT_MAP({
						targetDiv: "zoom",
						dataObj: arr,
						startPoint: start,
						increments: increments
					});
				});


			});
		},
		drawFeatureViewer: function(argument) {
			if (!argument.providers) argument.providers = APP.providers;

			var fv = new FEATURE_VIEWER({
				targetDiv: argument.targetDiv,
				dataObj: dataObj,
				providers: argument.providers,
				showAlignment: argument.showAlignment
			});
			fv.setup();
			fv.draw();
		},
		drawSSConsistency: function(argument) {
			targetDiv = argument.targetDiv;
			jQuery("#" + targetDiv).append("<h3>Secondary Structure composition</h3>");
			PIE_CHART.toPieData(dataObj.getSSComposition()).drawPieChart(targetDiv);
		},

		drawSolvAcc: function(argument) {
			targetDiv = argument.targetDiv;
			jQuery("#" + targetDiv).append("<h3>Solvent Accessibility</h3>");
			PIE_CHART.toPieData(dataObj.getSolvAccComposition()).drawPieChart(targetDiv);
		},


		drawSummaryTable: function(argument) {
			targetDiv = argument.targetDiv;

			jQuery("#" + targetDiv).append("<h3>Summary</h3>");
			var table = jQuery("<table/>");
			table.addClass("table table-striped");
			if (_rec_name = dataObj.getAlignmentsByDatabaseTopMatch('Swiss-Prot')) {
				var url = 'http://www.uniprot.org/uniprot/' + _rec_name;
				var link = jQuery('<a>', {
					text: _rec_name,
					title: _rec_name,
					href: "#",
					click: function() {
						console.log(this);
						window.open(url, '_blank');
						window.focus;
					}
				});
				table.append(jQuery('<tr/>')
					.append(jQuery('<td/>').text('Recommended Name'))
					.append(jQuery('<td/>').append(link)));
			}
			table.append("<tr><td>Sequence Length</td><td>" + dataObj.getSequence().length + "</td></tr>");
			table.append("<tr><td>Number of Aligned Proteins</td><td><a href='#aliModal' role='button' data-toggle='modal'>" + dataObj.getAlignmentsCount() + "</a></td></tr>");
			table.append("<tr><td>Number of Matched PDB Structures</td><td><a href='#pdbModal' role='button' data-toggle='modal'>" + dataObj.getAlignmentsByDatabase('pdb') + "<a/></td></tr>");
			jQuery("#" + targetDiv).append(table);

			return (jQuery("#" + targetDiv)).html();
		},

		drawSubcellLocViewer: function(argument) {
			targetDiv = argument.targetDiv;
			var nav_div = jQuery("<div id='_subcell_nav' />");

			var content_div = jQuery("<div id='_subcell_cntnt'/>");
			content_div.addClass("tab-content");
			var list = jQuery('<ul/>');
			list.addClass("nav nav-pills nav-tabs");
			list.append('<li class="disabled"><a href="#">Domains:</a> </li>')

			// var domains = ["arch", "bact", "euka", "plant", "animal", "proka"];
			var domains = ["arch", "bact", "euka"];
			for (var i in domains) {
				var _curr_div;
				var _curr_li = jQuery('<li><a data-toggle="tab" href="#' + domains[i] + '_localisation_container">' + SUBCELL_VIEW.getDomainFullName(domains[i]) + '</a></li>');
				var prediction = dataObj.getSubCellLocations(domains[i]);
				if (!prediction) _curr_div = jQuery("<div />").text("Data unavailable");
				else _curr_div = SUBCELL_VIEW.localisationDiv(prediction);
				_curr_div.addClass("tab-pane");
				list.append(_curr_li);
				content_div.append(_curr_div);
			}
			nav_div.append(list);

			// jQuery("#" + targetDiv).append("<h3> Sub-cellular Localization Prediction</h3>");
			jQuery("#" + targetDiv).append(nav_div);

			jQuery("#" + targetDiv).append(content_div);
			jQuery('#_subcell_nav a:last').tab('show');

			return (jQuery("#" + targetDiv)).html();
		}
	};


	var getComponent = function(component, config) {
		var element;

		if (!config) var config = {};
		jQuery.extend(config, {
			targetDiv: component + "Container"
		});

		if (!isCached(component)) {
			var fnName = "draw" + component;
			element = visualComponents[fnName].call(this, config);
			if (element) cacheStore(component, element);

		} else {
			element = cacheFetch(component);
		}
		return element;
	};

	return {
		getDefaultPage: function() {
			return defaultPage;
		},
		setDataObj: function(__dataObj) {
			dataObj = __dataObj;
		},
		setShowAlignment: function(flag) {
			showAlignmnet = flag;
		},
		getShowAlignment: function() {
			return showAlignment;
		},

		draw: function() {
			loadingDiv.show();
			mainContainerDiv.empty();
			var pagePath = 'html/' + currentPage + ".html";
			var config = undefined;

			if (!isCached(currentPage)) {
				jQuery.get(pagePath)
					.done(function(pageHTML) {
					mainContainerDiv.append(pageHTML);
					cacheStore(currentPage, pageHTML);
					jQuery.each(pageComponents[currentPage], function(i, component) {
						if (typeof component === 'object') {
							config = component[Object.keys(component)];
							component = Object.keys(component)[0];
						}
						var element = getComponent(component, config);
						if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
					});
				});
			} else {
				var pageHTML = cacheFetch(currentPage)
				mainContainerDiv.append(pageHTML);

				jQuery.each(pageComponents[currentPage], function(i, component) {
					var element = _getComponent(component);
					if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
				});
			}
			loadingDiv.hide();
		}
	}
};