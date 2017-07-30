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
var datafile = "js/sampledata.json";
var jsondata;
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
    $.getJSON( datafile, function( data ) {
        $.mobile.loading("hide");
        console.log(data);
        detaildata = data[5];
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
        $("#poi-c-id").val(detaildata._id);
        $("#poi-c-author").val("Guest");
        $("#poi-c-title").val("");
        $("#poi-c-story").val("");

        var challengeObj = new Object();
        challengeObj.id="123";
        challengeObj.name="Challenge title";
        challengeObj.story="Challenge story";
        challengeObj.author="Guest";
        challengeObj.date="30-07-2017";

        challenge = [challengeObj];

        var clst = "";
        for(var i=0;i<challenge.length;i++){
            clst += '<li><a href="javajscript: challenge_detail();">';
            clst += '<b>'+challenge[i].name+'</b>';
            clst += '<br/><i style="font-size: 10px;">By '+challenge[i].name+' on '+challenge[i].date+'</i>';
            clst += '</a></li>';
        }
        $("#poi-challenge").html(clst);
        $("#poi-challenge").listview( "refresh" );

    });
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#poi-detail-page", { role: "page" } );
    

}



function submit_new_challenge(){
    if($("#poi-c-id").val()=="" || $("#poi-c-title").val()=="" || $("#poi-c-story").val()=="" ){
        show_alert("Please fill in both title and story before submit new challenge");
        return;
    }
    // TODO submit to server
    console.log($("#poi-c-form").serialize());
    open_detail($("#poi-c-id").val());

}
function search_poi(){

}

function open_external(url){
    window.open(url);
}

function show_alert(mess){
    alert(mess);
}