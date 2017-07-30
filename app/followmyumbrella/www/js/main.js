/*
*
* Follow my umbrella Team
* as part of #GovHack2017
* http://followmyumbrella.com/
*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
//var datafile = "js/sampledata.json";
var datafile = "http://app.followmyumbrella.com/api/v1/point-of-interest";
var storyapi = "http://app.followmyumbrella.com/api/v1/story";
var jsondata;
var storylist = new Object;
var storytitlelist = new Object;
var map;
$( document ).ready(function(){
    $("#near_me").change(function() {
        if($(this).is(":checked")) {
            $("#location").attr("disabled", "disabled"); 
        } else {
            $("#location").removeAttr("disabled"); 
        }
        
    });
});

function open_poi_idea(){
    $.mobile.loading("show");
    $.getJSON( datafile, function( data ) {
        $.mobile.loading("hide");
        console.log(data);
        jsondata = data;
        var str="";
		for(var i=0;i<data.length;i++){
             var poiimg='img/noimage.png';
			
			 if (typeof data[i].image !== "undefined" && data[i].image !="") {
				poiimg='data:image/png;base64,'+data[i].image+'';
			 }
             var poititle='';
			 if (typeof data[i].title !== "undefined" && data[i].title !="") {
				poititle=data[i].title;
			 }
             var poidescription='';
			 if (typeof data[i].description !== "undefined" && data[i].description !="") {
				poidescription=data[i].description;
			 }
             str += '<li>';
             str += '<a href="javascript: open_detail(\''+data[i]._id+'\')">';
             str += '<img src="'+poiimg+'" class="ui-thumbnail ui-thumbnail-circular" />';
             str += '<h2>'+poititle+'</h2>';
             str += '<p>'+poidescription+'</p>';
             str += '</a>';
             str += '</li>';
        }
        $("#poi-list").html(str);
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#poi-ideas-page", { role: "page" } );
		$("#poi-list").listview( "refresh" );
    });
}

function open_detail(id){
    $.mobile.loading("show");

    $.getJSON( datafile+"/"+id, function( data ) {
        $.mobile.loading("hide");
        console.log(data);
        detaildata = data;
        if (typeof detaildata.title !== "undefined" && detaildata.title !="") {
            $("#poi-title").html(detaildata.title);
        }
        if (typeof detaildata.image !== "undefined" && detaildata.image !="") {
            $("#poi-image").html('<img src="'+detaildata.img+'" />');
        }
        if (typeof detaildata.description !== "undefined" && detaildata.description !="") {
            $("#poi-description").html(detaildata.description);
        }
        if (typeof detaildata.url !== "undefined" && detaildata.ulr !="") {
            $("#poi-more").html('<a href="javascript: open_external(\''+detaildata.url+'\')">More information...</a>');
        }
        $("#poi-s-id").val(detaildata._id);
        $("#poi-s-author").val("Guest");
        $("#poi-s-title").val("");
        $("#poi-s-story").val("");

        var storyObj = new Object();
        storyObj.id="123";
        storyObj.name="Story title";
        storyObj.story="Story story";
        storyObj.author="Guest";
        storyObj.date="30-07-2017";

        //story = [storyObj];
        stories = detaildata.stories;

        var clst = "";
        for(var i=0;i<stories.length;i++){
            storylist[stories[i]._id] = stories[i].body;
            storytitlelist[stories[i]._id] = stories[i].title;
            clst += '<li><a href="javascript: story_detail(\''+stories[i]._id+'\');">';
            clst += '<b>'+stories[i].title+'</b>';
            clst += '<br/><i style="font-size: 10px;">By '+stories[i].author+'</i>';
            clst += '</a></li>';
        }
        $("#poi-story").html(clst);
        $("#poi-story").listview( "refresh" );

    });
    console.log(storylist);
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#poi-detail-page", { role: "page" } );
    

}

function story_detail(id){
    $("#popup-title").html(storytitlelist[id]);
    $("#popup-content").html(storylist[id]);
    $("#popupDialog").popup("open");
}



function submit_new_story(){
    if($("#poi-s-id").val()=="" || $("#poi-s-title").val()=="" || $("#poi-s-story").val()=="" ){
        show_alert("Please fill in both title and story before submit new challenge");
        return;
    }
    // TODO submit to server
    console.log($("#poi-s-form").serialize());
    var postdata = {title: $("#poi-s-title").val(), body: $("#poi-s-story").val(), pointOfInterest: $("#poi-s-id").val(), author: "Guest" }
    $.ajax({
        url: storyapi,
        type: 'PUT',
        data: JSON.stringify(postdata),
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            open_detail($("#poi-s-id").val());
        }
    });
    open_detail($("#poi-s-id").val());

}
function search_poi(){
    $.mobile.loading("show");
    if($("#near_me").is(":checked")) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition);
        } else {
            show_alert("Can not get location information");
            search_poi_process($("#keyword").val(),0,0);
        }
    } else if ($("#location").val()!=""){
        getLocationByText($("#location").val());
    } else {
        search_poi_process($("#keyword").val(),0,0);
    }

}



function getPosition(position) {
    console.log(position);
    search_poi_process($("#keyword").val(),position.coords.latitude ,position.coords.longitude);
}

function getLocationByText(address) {
    var osm="https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1";
    $.post(osm+"&q="+encodeURI(address), {}, function (data) {
		$.mobile.loading("hide");
		
		if(data.length>0){
			mylocation=[parseFloat(data[0].lon),parseFloat(data[0].lat)];
			console.log(mylocation);
            search_poi_process($("#keyword").val(),parseFloat(data[0].lat),parseFloat(data[0].lon));
		}
    }, 'json').fail(function () {
        show_alert('Connection error');
        $.mobile.loading("hide");

    });

}

function search_poi_process(keyword, lat,lon){
    
    $.mobile.loading("show");
    var searchurl = datafile+"/searchtags?tags="+keyword;
    console.log("test: "+keyword +" - " +lat+" - " +lon);
    $.getJSON( searchurl, function( data ) {
        $.mobile.loading("hide");
        console.log(data);
        jsondata = data;
        var str="";
		for(var i=0;i<data.length;i++){
             var poiimg='img/noimage.png';
			
			 if (typeof data[i].image !== "undefined" && data[i].image !="") {
				poiimg='data:image/png;base64,'+data[i].image+'';
			 }
             var poititle='';
			 if (typeof data[i].title !== "undefined" && data[i].title !="") {
				poititle=data[i].title;
			 }
             var poidescription='';
			 if (typeof data[i].description !== "undefined" && data[i].description !="") {
				poidescription=data[i].description;
			 }
             str += '<li>';
             str += '<a href="javascript: open_detail(\''+data[i]._id+'\')">';
             str += '<img src="'+poiimg+'" class="ui-thumbnail ui-thumbnail-circular" />';
             str += '<h2>'+poititle+'</h2>';
             str += '<p>'+poidescription+'</p>';
             str += '</a>';
             str += '</li>';
        }
        $("#poi-search-list").html(str);
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#poi-search-result-page", { role: "page" } );
		$("#poi-search-list").listview( "refresh" );
    });
}

function open_external(url){
    window.open(url);
}

function show_alert(mess){
    alert(mess);
}