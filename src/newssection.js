exports.getNewsList=function (json_url,image_size,margin,targt_page){

     var featuredNewsList = tabris.create("CollectionView", {
        layoutData: {left:0, right: 0, bottom: 0},
        refreshEnabled: true,
        itemHeight: 120,
        initializeCell: function(cell) {
          var imageView = tabris.create("ImageView", {
            layoutData: {width: image_size,left:5,bottom:10,top:5},
            scaleMode:"fill",
          }).appendTo(cell);
          var titleView = tabris.create("TextView", {
            layoutData: {top: 0, left: [imageView, margin], right: 5,top:5},
            markupEnabled: true,
            font: "16px Arial, sans-serif",
            textColor: "#000",
          }).appendTo(cell);
          var periodView = tabris.create("TextView", {
            layoutData: {top: [titleView, 2],left: [imageView, margin], right: 5},
            markupEnabled: true
          }).appendTo(cell);
          cell.on("change:item", function(widget, newsItems) {
            imageView.set("image", {src: newsItems.image});
            titleView.set("text", '<b>'+newsItems.title+'</b>');
            periodView.set("text", '<small>'+newsItems.period+'</small>');
          });
				  }
				}).on("refresh", function() {
				  load_news(featuredNewsList,'news_list',json_url);
			}).appendTo(targt_page);
		fetch_newslist(featuredNewsList,json_url,'news_list_test');
}

function fetch_newslist(view,json_url,key)
{
	 var $ = require("./lib/jquery.js");
  var items = [];
  $.ajaxSetup({ cache:false });
  $.ajax({
    url: json_url,
    dataType: 'json',
    //timeout: 5000,
    success:  function (data) {
          localStorage.setItem(key,JSON.stringify(data));
          load_news(view,data,key);
          },error: function(data, errorThrown)
          {
             console.log('news not fetched'+errorThrown);
          }
  });
}

function load_news(view,newsData,key)
{
  console.log('OUT: '+JSON.stringify(newsData));
  newsitems=JSON.parse(localStorage.getItem(key));
    view.set({
      items: newsitems,
      refreshIndicator: true,
      refreshMessage: ""
    });
  
  newsitems=newsData;
  setTimeout(function() {
    view.set({
      items: newsitems,
      refreshIndicator: false,
      refreshMessage: "loading..."
    });
  }, 3000);
}