// Initialize your app
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

var $$ = Dom7;

var myApp = new Framework7({
    animateNavBackIcon: true,
    cache: true,
    fastClicks: true,
    animatePages: true
});

var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});

(function () {
    if (isAndroid) {
        $('body').addClass('android');
        if ('.modal-inner') {

        }
        $('.ripple, a.link, a.item-link, .button, .modal-button, .tab-link, .label-radio, .label-checkbox, .actions-modal-button, a.searchbar-clear, .floating-button').addClass('ripple');

    } 
    else if(isIos){
        $('body').addClass('apple');
    }

})();

$(document).ready(function() {
    var browser = {
        chrome: false,
        mozilla: false,
        opera: false,
        msie: false,
        safari: false
    };
    var sUsrAg = navigator.userAgent;
    if(sUsrAg.indexOf("Chrome") > -1) {
        browser.chrome = true;
    } else if (sUsrAg.indexOf("Safari") > -1) {
        browser.safari = true;
    } else if (sUsrAg.indexOf("Opera") > -1) {
        browser.opera = true;
    } else if (sUsrAg.indexOf("Firefox") > -1) {
        browser.mozilla = true;
    } else if (sUsrAg.indexOf("MSIE") > -1) {
        browser.msie = true;
    }

    if(browser.safari){
        console.log('You are using safari');
        $('body').addClass('safari');
    }

    if(browser.chrome){
        console.log('You are using chrome');
        $('body').addClass('chrome');
    }
 });

//ANDROID SPECIFIC FUNCTIONS

$('body').on('click', '.ripple', function(){
    $(this).addClass('active');
    setTimeout(function(){
        $('.ripple').removeClass('active');
    }, 100);
});

// TOUCH CHECK FUNCTION

// var touchmoved;

$('body').on('touchend', function(e){

}).on('touchmove', function(e){
    $('.topic-content').removeClass('topic-change');
    touchmoved = true;
}).on('touchstart', function(e){
    if (e.target.nodeName == 'INPUT') {
        e.preventDefault();
    }
});

// ***POPULATE MENU***

var catTitle,
    catSlug,
    catClass,
    catArray = [],
    catClassArr = [];

function getMenu() {

    $.ajax({
        type: 'GET',
        url: 'http://www.capetownetc.com/wp-json/wp-api-menus/v2/menus/7536',
        dataType: 'json',
        crossDomain: 'true',
        success: function (data) {
            $('#topicContent').empty();

            $.each(data.items, function (i) {
                catTitle = data.items[i].title;
                catClass = catTitle.toLowerCase();
                catClass = catClass.replace(/[^\w\s]|_/g, "");
                catClass = catClass.replace(/\s/g, '-');
                catArray.push(catTitle);
                catClassArr.push(catClass);
                if (i > 0) {
                    $('.topic-link:nth-child(' + 1 + ')').addClass('active');
                    $('#topicContent').append('<a href="#" class="topic-link ' + catClass + '" onclick="topicChange(\'' + catTitle + '\', \'.' + catClass + '\')">' + catTitle + '</a>');
                }
            });
        }
    }).done(function () {
        loadSideCategories();
    });
}

// LOAD SIDE PANEL CATEGORIES

function loadSideCategories() {
    $.each(catArray, function (i) {
        catTitle = catArray[i];
        catClass = catClassArr[i]
        if (i > 0) {
            $('#cat-list').append('<li class="left-cat" onclick="topicChange(\'' + catTitle + '\', \'.' + catClass + '\')">' + catTitle + '</li>');
        }
    });
}

$('body').on('click', '.cat-item', function () {
    myApp.closePanel();
});

// ***POST CARDS FUNCTION***

var posts,
    imgTitle,
    imgLink,
    url = 'http://www.capetownetc.com/api/get_category_posts/?slug=',
    counter = 1,
    postID,
    postSlug,
    articleContent,
    titleMaxLength = 25,
    articleArray = [],
    topicName = 'news',
    pageNumber,
    hourPageCount = -1,
    iconCount = 0,
    postCat,
    articleOpen = false,
    containerCount = 0;

function postCards(pageNumber, cardLimit, container, topic) {

    topicName = topic || 'news';

    $.ajax({
        type: 'GET',
        url: url + topicName + '&count=10&page=' + pageNumber,
        data: {
            get_param: 'value'
        },
        dataType: 'jsonp',
        crossDomain: 'true',
        success: function postPop(data) {

            $('#cardContent').append('<div class="card-container card-container' + container + '"></div>');

            $.each(data.posts, function (i) {
                iconCount++;

                posts = data.posts;
                imgTitle = data.posts[i].title;
                imgLink = data.posts[i].thumbnail_images.medium.url;
                //imgTitle = imgTitle.substr(0, titleMaxLength);
                postID = data.posts[i].id;
                postSlug = data.posts[i].slug;
                $('.swiper-wrapper').append('<div class="swiper-slide"></div>');
                $('.card-container' + container).append('<div class="card sub-card"><a href="' + postID + '" class="article-link" onclick="postArticle(' + i + ',' + pageNumber + ', \'article\', articleArray, \'.article-swiper\')" data-index="' + i + '"><img src="' + imgLink + '" class="card-img"><div class="card-info-container"><h2 class="card-heading">' + imgTitle + '</h2><div class="post-date post-date' + i + '"></div></div></a><div class="post-icons"><span class="icon-wrap"><input class="like-input" id="likeIcon' + iconCount + '" type="checkbox"><label class="post-icon like-icon" for="likeIcon' + iconCount + '" data-id="' + postID + '"></label></span><span class="icon-wrap"><input class="share-input" id="shareIcon' + iconCount + '" type="checkbox"><label class="post-icon share-icon" for="shareIcon' + iconCount + '"></label><div class="social-icons"><a onclick="window.open(\'https://www.facebook.com/sharer.php?u=http://www.capetownetc.com/slug/' + postSlug + '?type=individual\',\'_blank\')" class="face-icon platform-icon" target="_blank"></a><a onclick="window.open(\'https://twitter.com/intent/tweet?hashtags=&original_referer=http://www.capetownetc.com/slug&text=' + imgTitle + '&url=http://www.capetownetc.com/slug/' + postSlug + '\',\'_blank\')" class="twit-icon platform-icon" target="_blank"></a></div></span></div></div>');

                $('#loading').css('opacity', '0');

                callFunction = true;

                if (i % 5 === 0) {
                    i++;
                    $('.card-container .card:nth-child(' + i + ')').addClass('top-story');
                    $('.card-container .card:nth-child(' + i + ')').removeClass('sub-card');
                }
                
            });
            //JSON CONTENT TO ARRAY
            articleArray.push(posts);
            //TOP STORY CARD
            $('.card:first').addClass('top-story');
            $('.card:first').removeClass('sub-card');

        }

    }).done(function () {
        myApp.hidePreloader();
        $('.modal.modal-no-buttons.modal-preloader.modal-in').removeClass('left');
        hourPageCount++;
        containerCount++;

        $.each(articleArray[hourPageCount], function (i) {
            calcTime(articleArray, hourPageCount, i);
        });

        $('.topic-slider-container').removeClass('loading');

        if(container > 1){
            setTimeout(function(){
                $('.card-container'+container).css('opacity', '1');
            }, 500);
        }

    });
    myApp.showPreloader();
}

$('body').on('click', '.article-link', function () {

    var articleSwiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        dots: false,
        slideToClickedSlide: true,
        threshold: 45
    });

    $('.swiper-wrapper').css('transform', 'translate3d(0px, 0px, 0px)');

    if ($('body').hasClass('android')) {
        $('.navbar-inner').addClass('android-nav');
    }

    $('div[data-page="article"] .back').addClass('article');
});

function postArticle(postID, pageNumber, pageLoad, whichArray, whichSlider) {
            $('.swiper-slide').scrollTop(0);

            mainView.router.load({
                pageName: pageLoad
            });
        
            //SLIDES APPEND FUNCTION
            var slideCount = 0;
            var slideAmount = $('.swiper-slide').length;
            postCat = whichArray[(pageNumber - 1)][postID].categories[0].title;
            imgTitle = whichArray[(pageNumber - 1)][postID].title;
            postSlug = whichArray[(pageNumber - 1)][postID].slug;
        
            $('' + whichSlider + ' .swiper-slide:nth-child(1)').html('<div class="article-head-info"><img class="article-img" src="' + whichArray[(pageNumber - 1)][postID].thumbnail_images.medium.url + '"><h2 class="article-head-text">' + whichArray[(pageNumber - 1)][postID].title + '</h2><div class="article-info-wrap"><p class="post-cat">' + currentTopic + '</p><input type="checkbox" id="postShare"><label for="postShare" class="post-icon share-icon"></label><div class="social-icons"><a onclick="window.open(\'https://www.facebook.com/sharer.php?u=http://www.capetownetc.com/slug/' + postSlug + '?type=individual\',\'_blank\')" class="face-icon platform-icon" target="_blank"></a><a onclick="window.open(\'https://twitter.com/intent/tweet?hashtags=&original_referer=http://www.capetownetc.com/slug&text=' + imgTitle + '&url=http://www.capetownetc.com/slug/' + postSlug + '\',\'_blank\')" class="twit-icon platform-icon" target="_blank"></a></div></div></div><div class="article-content-wrap">' + whichArray[(pageNumber - 1)][postID].content + '</div>');
        
            var counter = postID;
            if (moreArray) {
                counter = -1;
            }
        
            $.each(whichArray[0], function (i) {
                counter++;
                slideCount++;
        
                if (counter > 0 && counter < 10) {
                    postCat = whichArray[(pageNumber - 1)][counter].categories[0].title;
                    postSlug = whichArray[(pageNumber - 1)][postID].categories[0].slug;
                    articleContent = whichArray[(pageNumber - 1)][counter].content;
                    imgTitle = whichArray[(pageNumber - 1)][counter].title;
                    imgLink = whichArray[(pageNumber - 1)][counter].thumbnail_images.medium.url;

                    $('' + whichSlider + ' .swiper-slide:nth-child(' + slideCount + ')').html('<div class="article-head-info"><img class="article-img" src="' + imgLink + '"><h2 class="article-head-text">' + imgTitle + '</h2><div class="article-info-wrap"><p class="post-cat">' + currentTopic + '</p><input type="checkbox" id="postShare' + counter + '"><label for="postShare' + counter + '" class="post-icon share-icon"></label></div></div><div class="article-content-wrap">' + articleContent + '</div>');
                }
        
            });
        
            $('#read-more').addClass('in-article');
        
            if (whichArray == articleArray) {
                $('' + whichSlider + ' .swiper-slide:nth-child(1)').append('<div class="more-from-container" id="moreCont"><p class="more-text" class="moreText">MORE FROM</p><p class="post-cat more-cat"></p><div class="moreWrap"></div></div>');
        
                $('.more-cat').html(currentTopic);
        
                $('#moreText').html('LOADING...');
                $('#moreText').addClass('load');
                postMore(1, postSlug, '#articleContent');
            }
        
            articleOpen = true;
        
}

//APPEND MORE STORIES FUNCTION
var moreArray = [];

function postMore(pageNumber, moreCat, whichMore) {
    $('.swiper-slide').scrollTop(0);
    $('#moreWrap').empty();

    $.ajax({
        type: 'GET',
        url: 'http://www.capetownetc.com/api/get_category_posts/?slug=' + moreCat + '&order=rand&count=4&page=' + pageNumber,
        data: {
            get_param: 'value'
        },
        crossDomain: 'true',
        dataType: 'jsonp',
        success: function (data) {

            $.each(data.posts, function (i) {
                posts = data.posts;
            });
            moreArray = [];
            moreArray.push(posts);

        }

    }).done(function () {

        $.each(moreArray[0], function (i, data) {
            imgTitle = data.title;
            imgLink = data.thumbnail_images.medium.url;
            postID = data.id;

            $('' + whichMore + ' .moreWrap').append('<div class="more-block more-block-' + i + '"><a href="' + postID + '" class="article-link more-link" onclick="moreArticle($(this))" data-index="' + i + '"><div class="more-info"><p class="card-heading">' + imgTitle + '</p><p class="more-post-date post-date-' + i + '"></p></div><img src="' + imgLink + '" class="card-img"></a></div>');
            $('' + whichMore + ' .moreText').html('MORE FROM');
        });

        $('.moreText').removeClass('load');
        $('.moreText').html('MORE FROM');
        $.each(moreArray[0], function (i) {
            calcTime(moreArray, 0, i);
        });

    });
}

var moreArtCount = 0;

function moreArticle(moreId){

    moreArtCount++;

    // HTML Content of new page:
    var hashPageContent = '<div class="navbar">' +
    '<div data-page="hash-page' + moreArtCount + '" class="navbar-inner">' +
    '<div class="left sliding"><a href="#" class="back link"><i class="icon icon-back more-back"></i><span>Back</span></a></div><img class="cape-logo center" src="img/cape-logo-white.png" id="capeLogo"><div class="right"><a href="#" data-panel="right" class="link icon-only open-panel"><i class="icon icon-bars"></i></a></div>' + 
    '</div>' +
    '</div>'+

    '<div class="page" data-page="hash-page' + moreArtCount + '">' +
    '<div class="page-content hash-content">' +
    '<div class="hash-article-container"></div>' +
    '</div>' +
    '</div>';

    eval('var hashPageContent' + moreArtCount + '= hashPageContent');

    mainView.router.loadContent(hashPageContent+moreArtCount);
    mainView.router.load({
        content: hashPageContent+moreArtCount,
        animatePages: true
    });
    
    postID = moreId.data('index');
    pageNumber = 1;

    $('.hash-article-container').append('<div class="article-head-info"><img class="article-img" src="' + moreArray[(pageNumber - 1)][postID].thumbnail_images.medium.url + '"><h2 class="article-head-text">' + moreArray[(pageNumber - 1)][postID].title + '</h2><div class="article-info-wrap"><p class="post-cat">' + currentTopic + '</p><input type="checkbox" id="postShare"><label for="postShare" class="post-icon share-icon"></label><div class="social-icons"><a onclick="window.open(\'https://www.facebook.com/sharer.php?u=http://www.capetownetc.com/slug/' + postSlug + '?type=individual\',\'_blank\')" class="face-icon platform-icon" target="_blank"></a><a onclick="window.open(\'https://twitter.com/intent/tweet?hashtags=&original_referer=http://www.capetownetc.com/slug&text=' + imgTitle + '&url=http://www.capetownetc.com/slug/' + postSlug + '\',\'_blank\')" class="twit-icon platform-icon" target="_blank"></a></div></div></div><div class="article-content-wrap">' + moreArray[(pageNumber - 1)][postID].content + '</div><div class="hash-wrap hash-wrap' + moreArtCount + '"></div>');

    $.each(moreArray[0], function (i, data) {
        imgTitle = data.title;
        imgLink = data.thumbnail_images.medium.url;
        postID = data.id;

        $('.hash-wrap' + moreArtCount).append('<div class="more-block more-block-' + i + '"><a href="' + postID + '" class="article-link more-link" onclick="moreArticle($(this))" data-index="' + i + '"><div class="more-info"><p class="card-heading">' + imgTitle + '</p><p class="more-post-date post-date-' + i + '"></p></div><img src="' + imgLink + '" class="card-img"></a></div>');

        calcTime(moreArray, 0, i);
    });

    // $('' + whichMore + ' .moreText').html('MORE FROM');
}

$('body').on('click', '.post-cat', function () {
    var whichClass = $(this).html().toLowerCase();
    whichClass = whichClass.replace(/\s/g, "-");

    mainView.router.load({
        pageName: 'index'
    });

    event.preventDefault();
    history.pushState(null, null, ' ');
    topicChange(whichClass, '.' + whichClass);
});

//HASH-URL FUNCION
var linkID, 
hashArray = [],
articleCount = -1;

$('body').on('click', '.card-container .article-link', function (event) {
    hashArray = [];
});

$('body').on('click', '.article-link', function (event) {
    linkID = $(this).attr('href');
    articleCount++;

    hashArray.push(linkID);
    linkID = hashArray[articleCount];
    window.location.hash = linkID;
});

if (window.location.hash) {

    var urlHash = window.location.hash.substr(1);
    articleCount++;
    hashArray.push(urlHash);

    getActiveId(null, urlHash, null);

    mainView.router.load({
        pageName: 'hash-page'
    });

    if ($('body').hasClass('android')) {
        $('.navbar-inner').addClass('android-nav');
    }

    $('.back').addClass('hash');

    $.ajax({
        type: 'GET',
        url: 'http://www.capetownetc.com/api/get_post/?id=' + urlHash,
        data: {
            get_param: 'value'
        },
        dataType: 'jsonp',
        crossDomain: 'true',
        success: function postPop(data) {
            articleContent = data.post.content;
            imgTitle = data.post.title;
            imgLink = data.post.thumbnail_images.medium.url;
            postID = data.post.id;
            postCat = data.post.categories[0].title;
            moreSlug = data.post.categories[0].slug;
            postSlug = data.post.slug;
            $('#hashContent').html('<div class="article-head-info"><img class="article-img" src="' + imgLink + '"><h2 class="article-head-text">' + imgTitle + '</h2><div class="article-info-wrap"><p class="post-cat">' + currentTopic + '</p><input type="checkbox" id="postShare"><label for="postShare" class="post-icon share-icon"></label><div class="social-icons"><a onclick="window.open(\'https://www.facebook.com/sharer.php?u=http://www.capetownetc.com/slug/' + postSlug + '?type=individual\',\'_blank\')" class="face-icon platform-icon" target="_blank"></a><a onclick="window.open(\'https://twitter.com/intent/tweet?hashtags=&original_referer=http://www.capetownetc.com/slug&text=' + imgTitle + '&url=http://www.capetownetc.com/slug/' + postSlug + '\',\'_blank\')" class="twit-icon platform-icon" target="_blank"></a></div></div></div><div class="article-content-wrap">' + articleContent + '</div>');
            $('#hashContent').append('<div class="more-from-container" id="hashCont"><p class="more-text" id="moreText">More From</p><p class="post-cat">' + currentTopic + '</p><div class="moreWrap"></div></div>');
        }

    }).done(function () {

        postMore(1, moreSlug, '#hashCont');
        myApp.hidePreloader();
    });
    myApp.showPreloader();

} else {
    getMenu();

    postCards(counter, 10, counter);
}

var clearHash = false;

$('body').on('click', '.back', function (event) {
    articleCount--;
    linkID = hashArray[articleCount];

    mainView.router.back();

    event.preventDefault();

    if ($("#read-more").is(".in-article")) {
        $('#read-more').removeClass('in-article');
    }

    $('view main-view').data('page', 'home');
    articleOpen = false;

    if ($(this).hasClass('hash')) {
        getMenu();
        postCards(counter, 10, counter);
        history.pushState(null, null, ' ');
        $('.back').removeClass('hash');
    }

    if ($(this).hasClass('article')) {
        history.pushState(null, null, ' ');
    }

    return false;
});

//LAZY LOAD/ READ MORE FUNCTION

var callFunction = true;

function scrollFunction() {
    
    $(".index-content").scroll(function loadPosts() {
        var elemHeight = $(this)[0].scrollHeight;
        var topPage = $(this).scrollTop();
        var outerHeight = $(this).outerHeight();
        // $('.scroll-count').html(topPage);
        if (callFunction == true && topPage + outerHeight > elemHeight - 300) {
            counter++;
            postCards(counter, 10, counter, topicName);
            callFunction = false; //THIS STOPS SCROLL FROM FIRING EACH TIME IT HITS BOTTOM
        }

        if (callFunction == true && topPage + outerHeight > elemHeight - 600) {
            $('.card:nth-child(6), .card-container .sub-card:nth-child(6), .card-container .sub-card:nth-child(7), .card-container .sub-card:nth-child(8), .card-container .sub-card:nth-child(9), .card-container .sub-card:nth-child(10)').css('opacity', '1');
        }

        if ((counter % 4) === 0) {
            $(".index-content").unbind('scroll');
            $('#read-more').addClass('active');
            counter++;
        }

        if(myApp.params.fastClicks == true){
            myApp.params.fastClicks = false;
        }
        
    });

    (function() {        
        var timer;
        $('.index-content').bind('scroll',function () {
            clearTimeout(timer);
            timer = setTimeout( refresh , 150 );
        });
        var refresh = function () { 
            myApp.params.fastClicks = true;
        };
    })();
}

scrollFunction();

$('#read-more').click(function () {
    postCards(counter, 10, counter, topicName);
    scrollFunction();
    $('#read-more').removeClass('active');
});

//TOPIC FUNCTIONS
var currentTopic = 'News';

function topicChange(topic, activeClass) {
    event.preventDefault();
    callFunction = false;
    
    currentTopic = topic;

    counter = 1;
    $('#cardContent').empty();
    articleArray = [];

    postCards(counter, 10, counter, topic);

    $('#read-more').removeClass('active');

    $('.topic-link').removeClass("active");
    $(activeClass).addClass("active");
    containerCount = 0;
    hourPageCount = -1;
    iconCount = 0;
    
    scrollFunction();
}

$('.news').addClass('active');

function calcTime(whichArray, hoursPage, whichPost, whatDiv) {

    var curDate,
        curDay,
        curMonth,
        curYear,
        curHours,
        curMin,
        curTime,
        resDay,
        resMonth,
        resYear,
        resHours,
        monthDayComb,
        postDate,
        postYear,
        postMonth,
        postHours,
        postMin,
        finalTime;

    postDate = whichArray[hoursPage][whichPost].date;

    //POST INFO SPLIT FUNCTIONS
    postYear = postDate.substr(0, 4);
    postYear = parseInt(postYear);

    postMonth = postDate.substr(5, 2);
    postMonth = parseInt(postMonth);

    postDay = postDate.substr(8, 2);
    postDay = parseInt(postDay);

    postHours = postDate.substr(10, 9);
    postHours = parseInt(postHours);

    //CURRENT DATE/TIME FUNTCION
    curDate = new Date();
    curYear = curDate.getFullYear();
    curMonth = (curDate.getMonth() + 1);
    curDay = curDate.getDate();
    curHours = curDate.getHours();
    curMin = curDate.getMinutes();
    curTime = curHours + ':' + curMin;
    //RESULT - HOURS
    resHours = curHours - postHours;

    //RESULT - DAY
    resDay = curDay - postDay;

    //RESULT - MONTH
    resMonth = curMonth - postMonth;
    if (resDay < 0) {
        resDay = (resDay * -1);
    }

    //RESULT - YEAR
    resYear = curYear - postYear;

    //CHECK HOURS
    if (resHours < 0) {
        resHours = (resHours * -1);
    }

    if (resHours == 0) {
        resHours = 'A few min ago';
        finalTime = resHours;
    }

    if (resHours > 0) {

        if (resHours == 1) {
            resHours = 'A few min ago';
            finalTime = resHours;
        } else {
            resHours = resHours + ' Hours Ago';
            finalTime = resHours;
        }
    }

    //CHECK DAYS
    if (resDay < 0) {
        resDay = (resDay * -1);
    }
    if (resDay == 0) {
        resDay = resHours;
    }
    if (resDay > 0 && resDay < 30) {
        if (resDay == 1) {
            finalTime = resDay + ' Day Ago';
        } else {
            resDay = resDay;
            finalTime = resDay + ' Days';
        }

        resHours = '';
    }
    
    //CHECK MONTHS
    if (resMonth < 0) {
        resMonth = (resMonth * -1);
    }

    if (resMonth == 0) {
        resMonth = '';
    }

    if (resMonth > 0) {
        if (resMonth > 1) {
            resMonth = resMonth + ' Months';
            finalTime = resMonth;
        }
        else if(resMonth == 1 && resDay < 30){
            resMonth = (resMonth * 30) - resDay;
            finalTime = resMonth + ' Days Ago';
        }
        else{
            finalTime = resHours;
        }
    }

    //CHECK YEARS
    if (resYear == 0) {
        resYear = '';
    }
    if (resYear > 0) {
        resMonth = '';
        resDay = '';
        reshours = '';
    }
    if (resYear > 0) {
        resYear = resYear + ' Years Ago';
        resHours = '';
        resDay = '';
        resMonths = '';
    }

    if (whichArray == articleArray) {
        $('.card-container' + containerCount + ' .post-date' + whichPost + '').append(finalTime);
    }

    if (whichArray == moreArray) {
        $('.more-block-' + whichPost + ' .post-date-' + whichPost + ' ').empty();
        $('.more-block-' + whichPost + ' .post-date-' + whichPost + ' ').append(finalTime);
    }

}

// LOGIN FUNCTIONS

$('body').on('blur', '.login-input', function(){
    if($(this).val()){
        
    }
    else{
        $(this).prev().removeClass('material');
        $(this).removeClass('material');
    }
}).on('focus','.login-input' ,function(){
   $(this).prev().addClass('material');
   $(this).addClass('material');
});

$('#logoutInput').change(function () {
    if ($(this).is(':checked')) {
        $('#profileImg').addClass('logout-cancel');
    }
});

$('body').on('click', '.logout-cancel', function () {
    $('#logoutInput').prop('checked', false);
    $('#profileImg').removeClass('logout-cancel');
});

$('#logout').click(function () {
    $('#profileCont').removeClass('open');
    $('#logCont').addClass('open');
    $('#logoutInput').prop('checked', false);
    $('#profileImg').removeClass('logout-cancel');
});

var savedUser,
    savedPass,
    savedConfirm;

function getLoginDetails(username, password, confirmP) {
    savedUser = $(username).val();
    savedPass = $(password).val();
    savedConfirm = $(confirmP).val();

    if (savedUser == undefined || savedUser == null || savedUser == '') {
        console.log('Empty Username');
        $('#userNameInput').addClass('not-filled');
        $('.username').addClass('error');
    }

    if (savedPass == undefined || savedPass == null || savedPass == '') {
        console.log('Empty Password');
        $('#passwordInput').addClass('not-filled');
        $('.password').addClass('error');
    }

    if (savedConfirm == undefined || savedConfirm == null || savedConfirm == '') {
        console.log('Empty Confirm Password');
        $('#confirmPassInput').addClass('not-filled');
        $('.cPassword').addClass('error');
    }
    if (savedUser && savedPass) {
        console.log('proceed');
        $('.user-profile-container').addClass('open');
        $('#logCont').removeClass('open');
    }
}

$('#userNameInput').focus(function () {
    $('#userNameInput').removeClass('not-filled');
}).on('keypress', function(){
    $('.username').removeClass('error');
});

$('#passwordInput').focus(function () {
    $('#passwordInput').removeClass('not-filled');
}).on('keypress', function(){
    $('.password').removeClass('error');
});

$('body').on('focus', '#confirmPassInput', function () {
    $('#confirmPassInput').removeClass('not-filled');
}).on('keypress', function(){
    $('.cPassword').removeClass('error');
});

$('body').on('click', '#login-btn', function () {
    getLoginDetails('#userNameInput', '#passwordInput', null);
});

$('#noAccount').one('click', function () {
    $('.login-content-wrap').append('<span class="password-wrap input-wrap"><p class="login-text cPassword">Confirm Password</p><input type="password" id="confirmPassInput" class="login-input"></span>');
    $('.login-btn-wrap').addClass('no-account');
    $('#login-btn').html('Register');
    $('#login-btn').addClass('register');
});

$('body').on('click', '.register', function () {
    getLoginDetails('#userNameInput', '#passwordInput', '#confirmPassInput');
});


// GET TAGS FUNCTION

$('#tagBtn').click(function () {
    myApp.closePanel();
    $('#tagCont').addClass('open');
    mainView.router.load({
        pageName: 'tags'
    });
    getTags();
    $('#tagList').empty();
});

var tagName;

function getTags() {
    $.ajax({
        type: 'GET',
        url: 'http://www.capetownetc.com/api/tags/get_tags/?orderby=count&order=desc&limit=10',
        data: {
            get_param: 'value'
        },
        dataType: 'jsonp',
        crossDomain: 'true',
        success: function (data) {
            $.each(data.tags, function (i) {
                tagName = data.tags[i].name;
                $('#tagList').append('<li class="tag-item"><input type="checkbox" id="' + tagName + '" class="tag-input"><label for="' + tagName + '" class="tag-lbl">' + tagName + '</label></li>');

            });
            
        },
        error: function () {
            
        }
    }).done(function () {
        myApp.hidePreloader();
    });
    myApp.showPreloader();
    $('.page').addClass('stop-scrolling');
    $('.page').scrollTop(0);
}

$('#tagDone').click(function () {
    mainView.router.back();
    event.preventDefault();
    $('.page').removeClass('stop-scrolling');
});

// GET ACTIVE SLIDE ID

var currActive;

$(function () {
    $("#cardContent").swipe({
        //Generic swipe handler for all directions
        swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
            currActive = $('#topicContent').find('.topic-link.active').html();

            $.each(catArray, function (i) {
                if (catArray[i] == currActive) {
                    if(currActive == 'Competitions'){
                        topicChange('competitions', '.competitions');
                    }
                    else{
                        topicChange(catArray[i + 1], '.' + catClassArr[i + 1]);
                    }
                }
            });
            
            console.log(currActive);
            if(currActive == 'Culture'){
                $('.topic-link.active').addClass('swiped');
                $('.topic-content').addClass('topic-change');
            }

        },

        swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
            currActive = $('#topicContent').find('.topic-link.active').html();

            $.each(catArray, function (i) {
                if (catArray[i] == currActive) {
                    if(currActive == 'News'){
                        topicChange('news', '.news');
                    }
                    else{
                        topicChange(catArray[i - 1], '.' + catClassArr[i - 1]);
                    }
                }
            });


        }

    });

});

if (navigator.userAgent.toLowerCase().match(/(ipad|iphone)/)) {
    $('.page[data-page="index"]').addClass('safari');
}

$('a[data-panel="left"]').click(function () {
    $('.modal.modal-no-buttons.modal-preloader.modal-in').toggleClass('left');
});

var uniqueId;

function getActiveId(onClickLink, hashPost, likeId) {

    if (onClickLink) {
        onClickLink = $(onClickLink).attr('href');
        onClickLink = onClickLink.replace('#', '');
        uniqueId = onClickLink;
    }
    if (hashPost) {
        uniqueId = hashPost;
    }
    if (likeId) {
        uniqueId = $(likeId).parent().parent().siblings('.article-link').attr('href');
        uniqueId = uniqueId.replace('#', '');
    }

}

$('body').on('click', '.article-link', function () {
    getActiveId(this, null, null);
});

$('body').on('click', '.like-icon', function () {
    getActiveId(null, null, this);
});

// FAVOURITES FUNCTION

$('#favBtn').click(function () {
    myApp.closePanel();
    mainView.router.load({
        pageName: 'favourites'
    });
});

// SEARCH FUNCTION

var searchArray = [],
    searchPost;

function searchArticles(searchTerm, searchCount) {
    $('#noRes').removeClass('open');
    if (searchTerm) {
        searchArray = [];
        $.ajax({
            type: 'GET',
            url: 'http://www.capetownetc.com/api/get_search_results/?search=' + searchTerm + '/&count=30',
            data: {
                get_param: 'value'
            },
            dataType: 'jsonp',
            crossDomain: 'true',
            success: function (data) {

                searchPost = data.posts;
                if (searchPost.length === 0) {
                    console.log('searchPost is empty!');
                    $('#noRes').addClass('open');
                    return searchPost;
                } else {
                    $('#noRes').removeClass('open');
                    searchArray.push(searchPost);
                }

            },
            error: function () {
                
            }
        }).done(function () {

            if (searchArray[0] !== undefined) {

                $.each(searchArray[0], function (i) {
                    postID = searchArray[searchCount - 1][i].id;
                    imgTitle = searchArray[searchCount - 1][i].title;
                    imgLink = searchArray[searchCount - 1][i].thumbnail_images.medium.url;
                    postSlug = searchArray[searchCount - 1][i].slug;

                    $('.search-container').append('<div class="card sub-card"><a href="#' + postID + '" class="article-link" onclick="postArticle(' + i + ',' + searchCount + ', \'article\', searchArray, \'.article-swiper\')" data="' + i + '"><img src="' + imgLink + '" class="card-img"><div class="card-info-container"><h2 class="card-heading">' + imgTitle + '</h2><div class="post-date post-date' + i + '"></div></div></a><div class="post-icons"><span class="icon-wrap"><input class="like-input" id="likeIcon' + iconCount + '" type="checkbox"><label class="post-icon like-icon" for="likeIcon' + iconCount + '" data-id="' + postID + '"></label></span><span class="icon-wrap"><input class="share-input" id="shareIcon' + iconCount + '" type="checkbox"><label class="post-icon share-icon" for="shareIcon' + iconCount + '"></label><div class="social-icons"><a onclick="window.open(\'https://www.facebook.com/sharer.php?u=http://www.capetownetc.com/slug/' + postSlug + '?type=individual\',\'_blank\')" class="face-icon platform-icon" target="_blank"></a><a onclick="window.open(\'https://twitter.com/intent/tweet?hashtags=&original_referer=http://www.capetownetc.com/slug&text=' + imgTitle + '&url=http://www.capetownetc.com/slug/' + postSlug + '\',\'_blank\')" class="twit-icon platform-icon" target="_blank"></a></div></span></div></div>');
                });
            }

            myApp.hidePreloader();
        });
    } else {
        console.log('Please enter a value');
    }
}

var searchValue;

$('body').on('click', '#searchBtn', function () {
    searchValue = $('#searchInput').val();
    if(searchValue){
        myApp.showPreloader();
        myApp.closePanel();

        mainView.router.load({
            pageName: 'search'
        });

        $('.search-container').empty();
        searchArticles(searchValue, 1);
    }
    else{
        $('#searchInput').addClass('error');
        $('.search-text').addClass('error');
    }
});

var elem = document.getElementById("searchInput");

elem.onkeyup = function (e) {
    
    if (e.keyCode == 13) {
        searchValue = $('#searchInput').val();
        if(searchValue){
            myApp.showPreloader();
            myApp.closePanel();
    
            mainView.router.load({
                pageName: 'search'
            });
    
            $('.search-container').empty();
            searchArticles(searchValue, 1);
        }
        else{
            $('#searchInput').addClass('error');
            $('.search-text').addClass('error');
        }
    }
}

$('body').on('blur', '#searchInput', function(){
    if($(this).val()){
        
    }
    else{
        $(this).prev().removeClass('material');
        $(this).removeClass('material');
    }
}).on('focus','#searchInput' ,function(){
   $(this).prev().addClass('material');
   $(this).addClass('material');
   $('.search-text').addClass('material');
}).on('keypress', function(){
    $('.search-text').removeClass('error');
    $('#searchInput').removeClass('error');
});

// STORE LIKES FUNCTION
var userLikes = {},
    likeArray = [],
    likeValue;

function storeUserLikes(likeId) {
    userLikes = {
        id: likeId
    };
    likeArray.push(userLikes);
}

$('body').on('click', '.like-icon', function () {
    likeValue = $(this).data('id');
    storeUserLikes(likeValue);
});

// CLOSE ON SWIPE RIGHT FUNCTION

$(function () {
    $('.swiper-slide').swipe({
        //Generic swipe handler for all directions
        swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
            console.log('swiper legft');
        },

        swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
            console.log('swipe right');
            if($(this).attr('style') == 'transform: translate3d(0px, 0px, 0px); transition-duration: 0ms;'){
                console.log('first slide is active');
                // setTimeout(function(){
                //     $('.swiper-slide:nth-child(1)').addClass('swipe-right');
                // });
            }
            //mainView.router.back();
        }

    });

});




