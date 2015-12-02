$(document).ready(function () {
                var layout = $("#layout").html();
                var layoutTemplate = Handlebars.compile(layout);
                $("body").append(layoutTemplate);

                window.app = {};
                app.type1 = [30 , 39 , 70];
                app.type2 = [1,3,5,6];
                app.type3 = [2,4];

                app.styles = [ [{
        url: '/img/Infocontent/marker12.png',
        height: 31,
        width: 33,
        anchor: [10,0],
        textColor: '#282828',
        textSize: 9
      }, {
        url: '/img/Infocontent/marker12.png',
        height: 31,
        width: 32,
        anchor: [10, 0],
        textColor: '#282828',
        textSize: 10
      }, {
        url: '/img/Infocontent/marker34.png',
        width: 40,
        height: 31,
        anchor: [10, 0],
        textColor: '#282828',
        textSize: 11
      }]];

    app.mcOptions = {gridSize: 35, maxZoom: 15, styles: app.styles[0]};


                app.mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng(55.772200, 37.605029),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
               };

                app.map = new google.maps.Map(document.getElementById("map-canvas"),
    app.mapOptions);


               app.markers = [];


    app.clust =  new MarkerClusterer(app.map,null,app.mcOptions)

    app.setMapPoint = function () {
                               app.obj = {};

                               function makeRoadSqlArr(){

                                 var roadSqlArr = [];
                                 var inputList = $('.selectRoad input');
                                 for (var i = 0; i < inputList.length; i++) {
                                                 var inputID =+inputList.eq(i).attr('id').substr(1);
                                     var inputListItem = inputList.eq(i);
                                     var checked = inputListItem.is(':checked');
                                     if(checked === true){
                                               roadSqlArr.push(inputID);
                                     }
                                               }
                                 app.obj.roadSqlArr = roadSqlArr;
                               };
                               makeRoadSqlArr();





                               function makeTypeSqlArr(){
                                 var typeSqlArr = [];
                                 var inputList = $('.selectType input');
                                 for (var i = 0; i < inputList.length; i++) {
                                     var inputID =+inputList.eq(i).attr('id');
                                     var inputListItem = inputList.eq(i);
                                     var checked = inputListItem.is(':checked');
                                     if(checked === true){
                                       typeSqlArr.push(inputID);
                                     }
                                 }
                                               app.obj.typeSqlArr = typeSqlArr;

                               };

                               makeTypeSqlArr();



                               history.pushState(null,null,'/outdoor/filtred?type='+app.obj.typeSqlArr+'&okrug='+app.obj.roadSqlArr);

                               var cartData = JSON.stringify(app.obj);


                               app.post = $.ajax({
                                                 type: "POST",
                                                 url: '/filtred',
                                                 data: cartData,
                                                 success: success
                                               });


                               function success(data){

                                               $('.table tbody').empty().append(data.table);
                                               if (window.cart) {
                                               var cart = window.cart.get();
                                               var count = 0;
                                               var sum = 0;



                                               for(val in cart){
                                                               var elem = $("#"+val);
                                                               elem.find('.first-month').attr('checked',cart[val].fPChecked);
                                                               elem.find('.second-month').attr('checked',cart[val].sPChecked);
                                                               elem.find('.third-month').attr('checked',cart[val].tPChecked);

                                                               count++;

                                                               if(cart[val].fPChecked==true){
                                                                               sum+= parseInt(cart[val].price1)
                                                               }

                                                               if(cart[val].sPChecked==true){
                                                                              sum+= parseInt(cart[val].price2)
                                                               };

                                                               if(cart[val].tPChecked==true){
                                                                              sum+= parseInt(cart[val].price3)
                                                               };

                                               }



                                               $('.infoText p:nth-child(2)').text(count);
                                               $('.infoText p:nth-child(4)').text(sum + '  р')




                                               }
                                               app.screens = [];


                                               for (var i = 0; i < data.data.length; i++) {
                                                               var name = data.data[i].house
                                                               var let = convertDeg(data.data[i].p10,data.data[i].p11,data.data[i].p12)
                                                               var lng = convertDeg(data.data[i].p20,data.data[i].p21,data.data[i].p22)
                                                               var ext = data.data[i].ext_key
                                                               var house = data.data[i].house
                                                               var type = data.data[i].type
                                                               var road = data.data[i].okrug
                                                               var intKey = data.data[i].type_group_id
                                                               marker = [name,let,lng,ext,house,type,intKey,road]
                                                               app.screens.push(marker);
                                                               cache:false;
                                               }
                                               app.clearMap();
                                               app.setMarkers(app.map,app.screens);
                               }



                               app.post.done(function(data){
                                               $("body .layout").remove();
                               })


                }


               app.setMapPoint();

     app.clearMap = function () {
                app.clust.removeMarkers(app.markers);
                for (var i = 0; i < app.markers.length; i++) {
                               app.markers[i].setMap(null);

                };
    }

    window.convertDeg = function (a,b,c) {
                var a = +a,
                               b = +b,
                               c = +c,
                               res = a + b/60.0 + c/3600.0;
                return res;
    }

               app.openBuble;

  app.setMarkerEvents = function (marker,map,idType) {
                               var idType = +idType;
                                var differentMarkerContent;
                                if (~app.type1.indexOf(idType)) {

                                               differentMarkerContent = app.Content.markerContent1;

                                   } else if(~app.type2.indexOf(idType)) {
                                               differentMarkerContent = app.Content.markerContent2;

                                   } else if(~app.type3.indexOf(idType)) {

                                               differentMarkerContent = app.Content.markerContent3;
                                   }

                                google.maps.event.addListener(marker, 'click', function() {

                                               if (app.openBuble && app.openBuble.close) {
                                                               app.openBuble.close()
                                               };




                                               google.maps.InfoWindow.prototype.opened = false;
                                               app.infowindow = new google.maps.InfoWindow({
                                                content:differentMarkerContent,
                                                maxWidth:350
                                });



                                               app.infowindow.open(map,marker);

                                               app.openBuble = app.infowindow;


                               });
                }



                app.setMarkers = function (map,locations){
                                               app.markers = [];
                                               var markerIndex =[];
                               for (var i = 0; i < locations.length; i++) {
                                var site = locations[i];
                                var image = '/img/Infocontent/marker.png'
                                var myLatLng = new google.maps.LatLng(site[1],site[2])
                                if (~markerIndex.indexOf(site[1]+':'+site[2])) {
                                               continue;
                                };
                                var marker = new google.maps.Marker({
                                       position: myLatLng,
                                       map: app.map,
                                       animation: google.maps.Animation.none,
                                       icon:image
                                });

                                app.markers.push(marker);
                                markerIndex.push(site[1]+':'+site[2]);

                app.Content = {};

                               app.Content.markerContent1 = '<div class="popup">'+
                                                                                                                                             '<div class="photo"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="/img/Photos/'+site[3]+'A.jpg"><img src="/img/Photos/'+site[3]+'A.jpg" alt="" /></a></div>'+
                                                                                                                                             '<div class="clear"></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Номер конструкции: </span>'+site[3]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Направление: </span>'+site[7]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Адрес: </span>'+site[4]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Тип: </span>'+site[5]+'</p></div>'+
                                                                                                                             '</div>';
                               app.Content.markerContent2 = '<div class="popup">'+
                                                                                                                                             '<div class="photo"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="/img/Photos/'+site[3]+'A.jpg"><img src="/img/Photos/'+site[3]+'A.jpg" alt="" /></div>'+
                                                                                                                                             '<div class="photo"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="/img/Photos/'+site[3]+'B.jpg"><img src="/img/Photos/'+site[3]+'B.jpg" alt="" /></a></div>'+
                                                                                                                                             '<div class="clear"></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Номер конструкции: </span>'+site[3]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Адрес: </span>'+site[4]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Направление: </span>'+site[7]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Тип: </span>'+site[5]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Стороны: </span><a href="/outdoor/site/'+site[3]+'A">А</a> | <a href="/outdoor/site/'+site[3]+'B">Б</a></p></div>'+
                                                                                                                             '</div>';
                    app.Content.markerContent3 = '<div class="popup">'+
                                                                                                                                             '<div class="photo"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="/img/Photos/'+site[3]+'A.jpg"><img src="/img/Photos/'+site[3]+'A.jpg" alt="" /></div>'+
                                                                                                                                             '<div class="photo"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="/img/Photos/'+site[3]+'B.jpg"><img src="/img/Photos/'+site[3]+'B.jpg" alt="" /></a></div>'+
                                                                                                                                             '<div class="photo"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="/img/Photos/'+site[3]+'C.jpg"><img src="/img/Photos/'+site[3]+'C.jpg" alt="" /></a></div>'+
                                                                                                                                             '<div class="clear"></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Номер конструкции: </span>'+site[3]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Направление: </span>'+site[7]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Адрес: </span>'+site[4]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Тип: </span>'+site[5]+'</p></div>'+
                                                                                                                                             '<div class="buble-adres"><p><span>Стороны: </span><a href="/outdoor/site/'+site[3]+'A">А</a> | <a href="/outdoor/site/'+site[3]+'B">Б</a> | <a href="/outdoor/site/'+site[3]+'C">C</a></p></div>'+
                                                                                                                             '</div>';

                                               app.setMarkerEvents(marker,app.map,site[6]);


                               }

                               app.clust.addMarkers(app.markers);
                }

                $(document).on('change','.box input',function(){
                               app.post.abort();
                               $("body").append(layoutTemplate);
                app.setMapPoint();
                });

                $(document).on('click','.resetFilters',function(){
                               var checkList = $('.box input');
                               for (var i = 0; i < checkList.length; i++) {
                                               var inputListItem = checkList.eq(i);
                                   var checked = inputListItem.is(':checked');
                                   if (checked == true) {
                                               inputListItem.attr('checked', false);
                                   };
                               };
                                               $("body").append(layoutTemplate);
                                   app.setMapPoint();
                })



                function displayVals() {
                               var typeVal = $("#typeVal-button .ui-selectmenu-text").text();
                               var okrugVal = $("#okrugVal-button .ui-selectmenu-text").text();
                               $("#outdoor").find(".road>p").html(okrugVal);
                               $("#outdoor").find(".current-type>p").html(typeVal);


                }

                displayVals()

                //////////////*Range-sliders*/////////////////////////////

                $( "#slider-range" ).slider({
      range: true,
      min: 4000,
      max: 190000,
      values: [ 4000, 190000 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "от " + ui.values[ 0 ] +  "                                    " +"до " + ui.values[ 1 ] );
        $(".price-value-1 input").val(ui.values[0]);
        $(".price-value-2 input").val(ui.values[1]);
      }

    });

                $( "#amount" ).val( "от " + $( "#slider-range" ).slider( "values", 0 ) +"                                    "+
      "до" + $( "#slider-range" ).slider( "values", 1 ) );


})

