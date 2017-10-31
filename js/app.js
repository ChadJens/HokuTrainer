/*
  Please add all Javascript code to this file.
  GA JS-SF-8 Chad Jens
*/

let allArticles = [];

function initialLoadWTF() {
	$.get("https://accesscontrolalloworiginall.herokuapp.com/http://thedailywtf.com/api/articles/recent/5", function(results) {
		for (let i = 0; i < results.length; i++) {
			let thisArticle = [];
			let resSrc = 'wtf';
			let resImg = results[i].Author.ImageUrl;
			let resTitle = results[i].Title;
			let resTag = results[i].Series.Title;
			let resImpressions = Math.floor(Math.random()*1000);
	    let resLink = results[i].Url;
			let resDesc = results[i].Series.Description;
			let resId = 'wtf' + i;
			thisArticle = [resImg, resTitle, resTag, resImpressions, resLink, resDesc, resSrc, resId];
			allArticles.push(thisArticle);
			//createArticle(resImg, resTitle, resTag, resImpressions, resLink, resDesc, resSrc);
		};
	});
};
function initialLoadReddit() {
	$.get("http://www.reddit.com/search.json?q=javascript&sort=new&limit=5", function(results) {
		for (let i = 0; i < results.data.children.length; i++) {
			let resSrc = 'reddit';
			let resImg = results.data.children[i].data.thumbnail;
			let resTitle = results.data.children[i].data.title;
			let resTag = results.data.children[i].data.subreddit;
			let resImpressions = Math.floor(Math.random()*1000);
	    let resLink = results.data.children[i].data.url;
			let resDesc = results.data.children[i].data.selftext;
			let resId = 'reddit' + i;
			thisArticle = [resImg, resTitle, resTag, resImpressions, resLink, resDesc, resSrc, resId];
			allArticles.push(thisArticle);
			//createArticle(resImg, resTitle, resTag, resImpressions, resLink, resDesc, resSrc);
		};
	});
};

function initialLoadTC() {
	$.get('https://newsapi.org/v1/articles?source=techcrunch&sortBy=top&apiKey=f93482f218c546fe9c37c9ce91e80a3a', function(results) {
		for (let i = 0; i < results.articles.length; i++) {
			let resSrc = 'techcrunch';
			let resImg = results.articles[i].urlToImage;
			let resTitle = results.articles[i].title;
			let resTag = 'techcrunch';
			let resImpressions = Math.floor(Math.random()*1000);
	    let resLink = results.articles[i].url;
			let resDesc = results.articles[i].description;
			let resId = 'techcrunch' + i;
			thisArticle = [resImg, resTitle, resTag, resImpressions, resLink, resDesc, resSrc, resId];
			allArticles.push(thisArticle);
			//createArticle(resImg, resTitle, resTag, resImpressions, resLink, resDesc, resSrc);
		};
	});
};

function createArticle(artImg, artTitle, artTag, artImpressions, artLink, artDesc, artSrc, artId) {
	let newArt = `
	  <article id=${artId} class="article">
	    <section class="featuredImage">
	      <img src=${artImg} alt="" />
	    </section>
	    <section class="articleContent">
	        <a href="#"><h3>${artTitle}</h3></a>
	        <h6>${artTag}</h6>
	    </section>
	    <section class="impressions">
	      ${artImpressions}
	    </section>
	    <div class="clearfix"></div>
	  </article>
	`;
	let newPop = `
	  <h1>${artTitle}</h1>
         <p>
           ${artDesc}
          </p>
          <a href=${artLink} class="popUpAction" target="_blank">Read more from source</a>
	`
	$('#main').append(newArt);
	$(`#${artId}`).on('click', function showPopUp() {
	  $('#popUp').removeClass('loader hidden');
	  $('#popUp .container').html('');
	  $('#popUp .container').append(newPop);
  });
	
};

$( window ).on('load', function initialLoad() {
	console.log('initLoad run');
	$('#main').html('');
	initialLoadReddit();
	initialLoadTC();
	initialLoadWTF();

	// How would I get the data to load here?
});

// Why did this not work when I had instead created function loadAll() (...) (it seemed to run immediately)
$('#logo').on('click', function loadAll() {
	console.log('loadAll run');
	$('#src0 span').html('All');
	$('#main').html('');
	for (let i = 0; i < allArticles.length; i++) {
	  createArticle(allArticles[i][0], allArticles[i][1], allArticles[i][2], allArticles[i][3], allArticles[i][4], allArticles[i][5], allArticles[i][6], allArticles[i][7]);
	}
});

$('#src1').on('click', function loadWTF() {
  console.log('clicked WTF');
  $('#src0 span').html('DailyWTF');
	$('#main').html('');
	for (let i = 0; i < allArticles.length; i++) {
		if (allArticles[i][6] === 'wtf') {
			createArticle(allArticles[i][0], allArticles[i][1], allArticles[i][2], allArticles[i][3], allArticles[i][4], allArticles[i][5], allArticles[i][6], allArticles[i][7]);
		};
	};
});

$('#src2').on('click', function loadReddit() {
	console.log('loadReddit run');
	$('#src0 span').html('Reddit');
	$('#main').html('');
	for (let i = 0; i < allArticles.length; i++) {
		if (allArticles[i][6] === 'reddit') {
			createArticle(allArticles[i][0], allArticles[i][1], allArticles[i][2], allArticles[i][3], allArticles[i][4], allArticles[i][5], allArticles[i][6], allArticles[i][7]);
		};
	};
});

$('#src3').on('click', function loadTC() {
	console.log('clicked TC');
	$('#src0 span').html('TechCrunch');
	$('#main').html('');
	for (let i = 0; i < allArticles.length; i++) {
		if (allArticles[i][6] === 'techcrunch') {
			createArticle(allArticles[i][0], allArticles[i][1], allArticles[i][2], allArticles[i][3], allArticles[i][4], allArticles[i][5], allArticles[i][6], allArticles[i][7]);
		};
	};
});

$('.closePopUp').on('click', function closePopUp() {
 $('#popUp').addClass('loader hidden');
});

// TODO
// Have search bar do something (listen for key-up?)
