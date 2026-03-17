function newlife_church_googlemap_init(dom_obj, coords) {
	"use strict";
	if (typeof NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'] == 'undefined') newlife_church_googlemap_init_styles();
	NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'].geocoder = '';
	try {
		var id = dom_obj.id;
		NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id] = {
			dom: dom_obj,
			markers: coords.markers,
			geocoder_request: false,
			opt: {
				zoom: coords.zoom,
				center: null,
				scrollwheel: false,
				scaleControl: false,
				disableDefaultUI: false,
				panControl: true,
				zoomControl: true, //zoom
				mapTypeControl: false,
				streetViewControl: false,
				overviewMapControl: false,
				styles: NEWLIFE_CHURCH_STORAGE['googlemap_styles'][coords.style ? coords.style : 'default'],
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		};
		
		newlife_church_googlemap_create(id);

	} catch (e) {
		
	};
}

function newlife_church_googlemap_create(id) {
	"use strict";

	// Create map
	NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].map = new google.maps.Map(NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].dom, NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].opt);

	// Add markers
	for (var i in NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers)
		NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].inited = false;
	newlife_church_googlemap_add_markers(id);
	
	// Add resize listener
	jQuery(window).resize(function() {
		if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].map)
			NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].map.setCenter(NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].opt.center);
	});
}

function newlife_church_googlemap_add_markers(id) {
	"use strict";
	for (var i in NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers) {
		
		if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].inited) continue;
		
		if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].latlng == '') {
			
			if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].geocoder_request!==false) continue;
			
			if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'].geocoder == '') NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'].geocoder = new google.maps.Geocoder();
			NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].geocoder_request = i;
			NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'].geocoder.geocode({address: NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].address}, function(results, status) {
				"use strict";
				if (status == google.maps.GeocoderStatus.OK) {
					var idx = NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].geocoder_request;
					if (results[0].geometry.location.lat && results[0].geometry.location.lng) {
						NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = '' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
					} else {
						NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = results[0].geometry.location.toString().replace(/\(\)/g, '');
					}
					NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].geocoder_request = false;
					setTimeout(function() { 
						newlife_church_googlemap_add_markers(id); 
						}, 200);
				} else
					dcl(NEWLIFE_CHURCH_STORAGE['strings']['geocode_error'] + ' ' + status);
			});
		
		} else {
			
			// Prepare marker object
			var latlngStr = NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].latlng.split(',');
			var markerInit = {
				map: NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].map,
				position: new google.maps.LatLng(latlngStr[0], latlngStr[1]),
				clickable: NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].description!=''
			};
			if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].point) markerInit.icon = NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].point;
			if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].title) markerInit.title = NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].title;
			NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].marker = new google.maps.Marker(markerInit);
			
			// Set Map center
			if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].opt.center == null) {
				NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].opt.center = markerInit.position;
				NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].map.setCenter(NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].opt.center);				
			}
			
			// Add description window
			if (NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].description!='') {
				NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].infowindow = new google.maps.InfoWindow({
					content: NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].description
				});
				google.maps.event.addListener(NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].marker, "click", function(e) {
					var latlng = e.latLng.toString().replace("(", '').replace(")", "").replace(" ", "");
					for (var i in NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers) {
						if (latlng == NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].latlng) {
							NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].infowindow.open(
								NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].map,
								NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].marker
							);
							break;
						}
					}
				});
			}
			
			NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'][id].markers[i].inited = true;
		}
	}
}

function newlife_church_googlemap_refresh() {
	"use strict";
	for (id in NEWLIFE_CHURCH_STORAGE['googlemap_init_obj']) {
		newlife_church_googlemap_create(id);
	}
}

function newlife_church_googlemap_init_styles() {
	// Init Google map
	NEWLIFE_CHURCH_STORAGE['googlemap_init_obj'] = {};
	NEWLIFE_CHURCH_STORAGE['googlemap_styles'] = {
		'default': [],
		'invert': [ { "stylers": [ { "invert_lightness": true }, { "visibility": "on" } ] } ],
		'dark': [{"featureType":"landscape","stylers":[{ "invert_lightness": true },{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
		'simple': [
				{
				  stylers: [
					{ hue: "#00ffe6" },
					{ saturation: -20 }
				  ]
				},{
				  featureType: "road",
				  elementType: "geometry",
				  stylers: [
					{ lightness: 100 },
					{ visibility: "simplified" }
				  ]
				},{
				  featureType: "road",
				  elementType: "labels",
				  stylers: [
					{ visibility: "off" }
				  ]
				}
			  ],
	'greyscale': [
					{
						"stylers": [
							{ "saturation": -100 }
						]
					}
				],
	'greyscale2': [
				{
				 "featureType": "landscape",
				 "stylers": [
				  { "hue": "#FF0300" },
				  { "saturation": -100 },
				  { "lightness": 20.4705882352941 },
				  { "gamma": 1 }
				 ]
				},
				{
				 "featureType": "road.highway",
				 "stylers": [
				  { "hue": "#FF0300" },
				  { "saturation": -100 },
				  { "lightness": 25.59999999999998 },
				  { "gamma": 1 }
				 ]
				},
				{
				 "featureType": "road.arterial",
				 "stylers": [
				  { "hue": "#FF0300" },
				  { "saturation": -100 },
				  { "lightness": -22 },
				  { "gamma": 1 }
				 ]
				},
				{
				 "featureType": "road.local",
				 "stylers": [
				  { "hue": "#FF0300" },
				  { "saturation": -100 },
				  { "lightness": 21.411764705882348 },
				  { "gamma": 1 }
				 ]
				},
				{
				 "featureType": "water",
				 "stylers": [
				  { "hue": "#FF0300" },
				  { "saturation": -100 },
				  { "lightness": 21.411764705882348 },
				  { "gamma": 1 }
				 ]
				},
				{
				 "featureType": "poi",
				 "stylers": [
				  { "hue": "#FF0300" },
				  { "saturation": -100 },
				  { "lightness": 4.941176470588232 },
				  { "gamma": 1 }
				 ]
				}
			   ],
	'style1': [{
					"featureType": "landscape",
					"stylers": [
						{ "hue": "#FF0300"	},
						{ "saturation": -100 },
						{ "lightness": 20.4705882352941 },
						{ "gamma": 1 }
					]
				},
				{
					"featureType": "road.highway",
					"stylers": [
						{ "hue": "#FF0300" },
						{ "saturation": -100 },
						{ "lightness": 25.59999999999998 },
						{ "gamma": 1 }
					]
				},
				{
					"featureType": "road.arterial",
					"stylers": [
						{ "hue": "#FF0300" },
						{ "saturation": -100 },
						{ "lightness": -22 },
						{ "gamma": 1 }
					]
				},
				{
					"featureType": "road.local",
					"stylers": [
						{ "hue": "#FF0300" },
						{ "saturation": -100 },
						{ "lightness": 21.411764705882348 },
						{ "gamma": 1 }
					]
				},
				{
					"featureType": "water",
					"stylers": [
						{ "hue": "#FF0300" },
						{ "saturation": -100 },
						{ "lightness": 21.411764705882348 },
						{ "gamma": 1 }
					]
				},
				{
					"featureType": "poi",
					"stylers": [
						{ "hue": "#FF0300" },
						{ "saturation": -100 },
						{ "lightness": 4.941176470588232 },
						{ "gamma": 1 }
					]
				}
			],
	'style2': [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"hue":"#ffe500"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"},{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9bdffb"},{"visibility":"on"}]}],
	'style3':  [
 {
  "featureType": "landscape",
  "stylers": [
   {
    "hue": "#FFA800"
   },
   {
    "saturation": 17.799999999999997
   },
   {
    "lightness": 152.20000000000002
   },
   {
    "gamma": 1
   }
  ]
 },
 {
  "featureType": "road.highway",
  "stylers": [
   {
    "hue": "#007FFF"
   },
   {
    "saturation": -77.41935483870967
   },
   {
    "lightness": 47.19999999999999
   },
   {
    "gamma": 1
   }
  ]
 },
 {
  "featureType": "road.arterial",
  "stylers": [
   {
    "hue": "#FBFF00"
   },
   {
    "saturation": -78
   },
   {
    "lightness": 39.19999999999999
   },
   {
    "gamma": 1
   }
  ]
 },
 {
  "featureType": "road.local",
  "stylers": [
   {
    "hue": "#00FFFD"
   },
   {
    "saturation": 0
   },
   {
    "lightness": 0
   },
   {
    "gamma": 1
   }
  ]
 },
 {
  "featureType": "water",
  "stylers": [
   {
    "hue": "#007FFF"
   },
   {
    "saturation": -77.41935483870967
   },
   {
    "lightness": -14.599999999999994
   },
   {
    "gamma": 1
   }
  ]
 },
 {
  "featureType": "poi",
  "stylers": [
   {
    "hue": "#007FFF"
   },
   {
    "saturation": -77.41935483870967
   },
   {
    "lightness": 42.79999999999998
   },
   {
    "gamma": 1
   }
  ]
 }
]
}
}