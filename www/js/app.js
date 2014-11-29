// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //navigator.splashscreen.hide();
    localStorage['device'] = JSON.stringify(device);
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  version="0.0.039"
  if(localStorage.data_version!=version){

    localStorage.removeItem('siteHost');
    localStorage.removeItem('data_version');
    localStorage['didTutorial'] = false;

    localStorage.siteHost= "http://haoqiantu.net/api/app/index.php";
    //localStorage.localUrl= "file:///android_asset/www/index.html";
    localStorage.data_version= version
  }
  
  // cordova-api
  // document.addEventListener("deviceready", onDeviceReady, false);
  // function onDeviceReady() {
  //     //console.log(device); // cordova-api
  //     //alert(JSON.stringify(device));
  //     localStorage['device'] = JSON.stringify(device);
  //     //navigator.splashscreen.hide();
  // }
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.timeout = 5000;
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('tutorial', {
        url: '/',
        templateUrl: 'templates/tutorial.html',
        controller: 'TutorialCtrl'
     })

    // setup an abstract state for the apps directive
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/template.html",
      controller: 'TemplateCtrl'
    })

    .state('app.site', {
      url: '/site',
      views: {
        'app-site': {
          templateUrl: 'templates/site.html',
          controller: 'SiteCtrl'
        }
      }
    })

    .state('app.site-arrange', {
      url: '/site/arrange',
      views: {
        'app-site': {
          templateUrl: 'templates/site-arrange.html',
          controller: 'SiteArrangeCtrl'
        }
      }
    })

    .state('app.site-bindxuexiao', {
      url: '/site/bindxuexiao',
      views: {
        'app-site': {
          templateUrl: 'templates/site-bindxuexiao.html',
          controller: 'SiteBindXueXiaoCtrl'
        }
      }
    })

    .state('app.account-mymsg', {
      url: '/mymsg',
      views: {
        'app-msg': {
          templateUrl: 'templates/account-mymsg.html',
          controller: 'AccountMyMsgCtrl'
        }
      }
    })

    .state('app.message-detail', {
      url: '/mymsg/:ID',
      views: {
        'app-msg': {
          templateUrl: 'templates/message-detail.html',
          controller: 'MessageDetailCtrl'
        }
      }
    })

    .state('app.news', {
      url: '/news',
      views: {
        'app-site': {
          templateUrl: 'templates/news.html',
          controller: 'NewsCtrl'
        }
      }
    })

    .state('app.news-detail', {
      url: '/news/:ID',
      views: {
        'app-site': {
          templateUrl: 'templates/news-detail.html',
          controller: 'NewsDetailCtrl'
        }
      }
    })

    // Each app has its own nav history stack:
    .state('app.home', {
      url: '/home',
      views: {
        'app-home': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.account-favjobs', {
      url: '/account/favjobs',
      views: {
        'app-account': {
          templateUrl: 'templates/account-favjobs.html',
          controller: 'AccountFavJobCtrl'
        }
      }
    })
    .state('app.account-applyjobs', {
      url: '/account/applyjobs',
      views: {
        'app-account': {
          templateUrl: 'templates/account-applyjobs.html',
          controller: 'AccountApplyJobsCtrl'
        }
      }
    })

    // 职位订阅
    .state('app.home-postsubs', {
      url: '/home/postsubs',
      views: {
        'app-home': {
          templateUrl: 'templates/postsubs.html',
          controller: 'PostSubsCtrl'
        }
      }
    })

    // 最新职位
    .state('app.home-newjobs', {
      url: '/home/newjobs',
      views: {
        'app-home': {
          templateUrl: 'templates/newjobs.html',
          controller: 'NewJobsCtrl'
        }
      }
    }) 
    // 职位详情
    .state('app.home-jobdetail', {
      url: '/home/:jobId',
      views: {
        'app-home': {
          templateUrl: 'templates/job-detail.html',
          controller: 'JobDetailCtrl'
        }
      }
    })

    // company-detail
    .state('app.home-comdetail', {
      url: '/home/com/:comId',
      views: {
        'app-home': {
          templateUrl: 'templates/com-detail.html',
          controller: 'ComDetailCtrl'
        }
      }
    })

    // jobfairs 招聘会
    .state('app.jobfairs', {
      url: '/jobfairs',
      views: {
        'app-site': {
          templateUrl: 'templates/jobfairs.html',
          controller: 'JobFairsCtrl'
        }
      }
    })

    .state('app.jobfairdetail', {
      url: '/jobfairs/:jobfairId',
      views: {
        'app-site': {
          templateUrl: 'templates/jobfair-detail.html',
          controller: 'JobFairDetailCtrl'
        }
      }
    }) 

    // resume 简历
    .state('app.resumes', {
      url: '/resumes',
      views: {
        'app-resumes': {
          templateUrl: 'templates/resumes.html',
          controller: 'ResumesCtrl'
        }
      }
    })
    .state('app.resume-detail', {
      url: '/resume/:resumeId',
      views: {
        'app-resumes': {
          templateUrl: 'templates/resume-detail.html',
          controller: 'ResumeDetailCtrl'
        }
      }
    })

    .state('app.resume-media', {
      url: '/resumes/media',
      views: {
        'app-resumes': {
          templateUrl: 'templates/resume-media.html',
          controller: 'ResumeMediaCtrl'
        }
      }
    })

    // 个人
    .state('app.account', {
      url: '/account',
      views: {
        'app-account': {
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('app.account-baseinfo', {
      url: '/account/baseinfo',
      views: {
        'app-account': {
          templateUrl: 'templates/account-baseinfo.html',
          controller: 'AccountBaseInfoCtrl'
        }
      }
    })

    .state('app.account-mycoin', {
      url: '/account/mycoin',
      views: {
        'app-account': {
          templateUrl: 'templates/account-mycoin.html',
          controller: 'AccountMyCoinCtrl'
        }
      }
    })

    .state('app.account-employreg', {
      url: '/account/employreg',
      views: {
        'app-account': {
          templateUrl: 'templates/account-employreg.html',
          controller: 'AccountEmployRegCtrl'
        }
      }
    })
    .state('app.account-chgpass', {
      url: '/account/chgpass',
      views: {
        'app-account': {
          templateUrl: 'templates/account-chgpass.html',
          controller: 'AccountChgPassCtrl'
        }
      }
    })
    .state('app.account-login', {
      url: '/account/account-login',
      views: {
        'app-account': {
          templateUrl: 'templates/account-login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    // 关于
    .state('app.about', {
      url: '/about',
      views: {
        'app-about': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    })

    .state('app.about-apps', {
      url: '/about/apps',
      views: {
        'app-about': {
          templateUrl: 'templates/about-apps.html'
        }
      }
    })

    .state('app.about-advice', {
      url: '/about/advice',
      views: {
        'app-about': {
          templateUrl: 'templates/about-advice.html',
          controller: 'AboutAdviceCtrl'
        }
      }
    })

    .state('app.about-question', {
      url: '/about/question',
      views: {
        'app-about': {
          templateUrl: 'templates/about-question.html'
        }
      }
    })

    .state('app.about-findout', {
      url: '/about/findout',
      views: {
        'app-about': {
          templateUrl: 'templates/about-findout.html',
          controller: 'AboutFindOutCtrl'
        }
      }
    })

    // .state('app.about-fresh', {
    //   url: '/about/fresh',
    //   views: {
    //     'app-about': {
    //       templateUrl: 'templates/about-fresh.html'
    //     }
    //   }
    // })

    .state('app.about-us', {
      url: '/about/us',
      views: {
        'app-about': {
          templateUrl: 'templates/about-us.html'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

