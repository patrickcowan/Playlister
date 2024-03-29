(function() {

var Dom = YAHOO.util.Dom;
var Event = YAHOO.util.Event;
var DDM = YAHOO.util.DragDropMgr;

//////////////////////////////////////////////////////////////////////////////
// example app
//////////////////////////////////////////////////////////////////////////////
YAHOO.example.DDApp = {
 init: function() {

 var rows1=6,cols=2,i,j;
 for (i=1;i<cols+1;i=i+1) {
 new YAHOO.util.DDTarget("ul"+i);
 }

 for (i=1;i<cols+1;i=i+1) {
 for (j=1;j<rows1+1;j=j+1) {
 new YAHOO.example.DDList("li" + i + "_" + j);
 }
 }

 Event.on("ok-button", "click", this.showOrder);
 Dom.get("ul1").className = "draglist_alt";
 Dom.get("ul2").className = "draglist_alt";
 },

 showOrder: function() {
 var count = 0;
 var parseList = function(ul, title) {
 items = ul.getElementsByTagName("li"); 
var out = "";
 for (i=0;i<items.length;i=i+1) {
 out += items[i].id;
 count++;
 }
 return out;
 };

 var ul2=Dom.get("ul2");
 parseList(ul2, "List 2");

 if(count <= 2)
 {
 if("li1_2" == parseList(ul2))
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/chilled.html';
 }
 else if ("li1_3" == parseList(ul2))
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/disco.html';
 }
 else if ("li1_4" == parseList(ul2))
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/popular.html';
 }
 else if ("li1_5" == parseList(ul2))
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/acoustic.html';
 }
 else if ("li1_2li1_3" == parseList(ul2) || "li1_3li1_2" == parseList(ul2) )
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/discochilled.html';
 }
 else if ("li1_2li1_4" == parseList(ul2) || "li1_4li1_2" == parseList(ul2) )
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/popularchilled.html';
 }
 else if ("li1_2li1_5" == parseList(ul2) || "li1_5li1_2" == parseList(ul2) )
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/acousticchilled.html';
 }
 else if ("li1_3li1_4" == parseList(ul2) || "li1_4li1_3" == parseList(ul2) )
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/populardisco.html';
 }
 else if ("li1_3li1_5" == parseList(ul2) || "li1_5li1_3" == parseList(ul2) )
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/acousticdisco.html';
 }
 else if ("li1_5li1_4" == parseList(ul2) || "li1_4li1_5" == parseList(ul2) )
 {
 location.href = 'http://namek.computing.dundee.ac.uk/2013-ac32007/playlister/acousticpopular.html';
 }
 }
 else
 {
 alert("Too many" + "\n" + count + "\n" + "In list");
 }

 },
};

//////////////////////////////////////////////////////////////////////////////
// custom drag and drop implementation
//////////////////////////////////////////////////////////////////////////////

YAHOO.example.DDList = function(id, sGroup, config) {

 YAHOO.example.DDList.superclass.constructor.call(this, id, sGroup, config);

 this.logger = this.logger || YAHOO;
 var el = this.getDragEl();
 Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent

 this.goingUp = false;
 this.lastY = 0;
};

YAHOO.extend(YAHOO.example.DDList, YAHOO.util.DDProxy, {

 startDrag: function(x, y) {
 this.logger.log(this.id + " startDrag");

 // make the proxy look like the source element
 var dragEl = this.getDragEl();
 var clickEl = this.getEl();
 Dom.setStyle(clickEl, "visibility", "hidden");

 dragEl.innerHTML = clickEl.innerHTML;

 Dom.setStyle(dragEl, "color", Dom.getStyle(clickEl, "color"));
 Dom.setStyle(dragEl, "backgroundColor", Dom.getStyle(clickEl, "backgroundColor"));
 Dom.setStyle(dragEl, "border", "2px solid gray");
 },

 endDrag: function(e) {

 var srcEl = this.getEl();
 var proxy = this.getDragEl();

 // Show the proxy element and animate it to the src element's location
 Dom.setStyle(proxy, "visibility", "");
 var a = new YAHOO.util.Motion( 
proxy, { 
points: { 
to: Dom.getXY(srcEl)
 }
 }, 
0.2, 
YAHOO.util.Easing.easeOut 
);
 var proxyid = proxy.id;
 var thisid = this.id;

 // Hide the proxy and show the source element when finished with the animation
 a.onComplete.subscribe(function() {
 Dom.setStyle(proxyid, "visibility", "hidden");
 Dom.setStyle(thisid, "visibility", "");
 });
 a.animate();
 },

 onDragDrop: function(e, id) {

 // If there is one drop interaction, the li was dropped either on the list,
 // or it was dropped on the current location of the source element.
 if (DDM.interactionInfo.drop.length === 1) {

 // The position of the cursor at the time of the drop (YAHOO.util.Point)
 var pt = DDM.interactionInfo.point; 

// The region occupied by the source element at the time of the drop
 var region = DDM.interactionInfo.sourceRegion; 

// Check to see if we are over the source element's location. We will
 // append to the bottom of the list once we are sure it was a drop in
 // the negative space (the area of the list without any list items)
 if (!region.intersect(pt)) {
 var destEl = Dom.get(id);
 var destDD = DDM.getDDById(id);
 destEl.appendChild(this.getEl());
 destDD.isEmpty = false;
 DDM.refreshCache();
 }

 }
 },

 onDrag: function(e) {

 // Keep track of the direction of the drag for use during onDragOver
 var y = Event.getPageY(e);

 if (y < this.lastY) {
 this.goingUp = true;
 } else if (y > this.lastY) {
 this.goingUp = false;
 }

 this.lastY = y;
 },

 onDragOver: function(e, id) {

 var srcEl = this.getEl();
 var destEl = Dom.get(id);

 // We are only concerned with list items, we ignore the dragover
 // notifications for the list.
 if (destEl.nodeName.toLowerCase() == "li") {
 var orig_p = srcEl.parentNode;
 var p = destEl.parentNode;

 if (this.goingUp) {
 p.insertBefore(srcEl, destEl); // insert above
 } else {
 p.insertBefore(srcEl, destEl.nextSibling); // insert below
 }

 DDM.refreshCache();
 }
 }
});

Event.onDOMReady(YAHOO.example.DDApp.init, YAHOO.example.DDApp, true);

})();

