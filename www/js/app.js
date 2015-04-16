// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.factory('PushProcessingService', function() {
  function onDeviceReady() {
    // alert('NOTIFY  Device is ready.  Registering with GCM server');
    //register with google GCM server
    var gcmAppID = "573617880484";
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {"senderID":gcmAppID,"ecb":"onNotificationGCM"});
  }
  function gcmSuccessHandler(result) {
    // alert('NOTIFY  pushNotification.register succeeded.  Result = '+result)
  }
  function gcmErrorHandler(error) {
    alert('NOTIFY  '+error);
  }
  return {
    initialize : function () {
      //alert('NOTIFY  initializing');
      document.addEventListener('deviceready', onDeviceReady, false);
    },
    registerID : function (id) {
      //Insert code here to store the user's ID on your notification server. 
      //You'll probably have a web service (wrapped in an Angular service of course) set up for this.  
      //For example:
      myService.registerNotificationID(id).then(function(response){
        if (response.data.Result) {
          alert('NOTIFY  Registration succeeded');
        } else {
          alert('NOTIFY  Registration failed');
        }
      });
    }, 
    //unregister can be called from a settings area.
    unregister : function () {
      alert('unregister')
      var push = window.plugins.pushNotification;
      if (push) {
        push.unregister(function () {
          alert('unregister success')
        });
      }
    }
  }
})

.run(function($ionicPlatform, PushProcessingService) {
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

    PushProcessingService.initialize();

    // try{
    //   // push
    //   var senderID = "573617880484";
    //   var pushNotification;
    //   pushNotification = window.plugins.pushNotification; 
    //   if ( device.platform == 'android' || device.platform == 'Android' ) { 
    //     pushNotification.register( successHandler, errorHandler, { 
    //       "senderID": senderID, "ecb":"onNotificationGCM" }); 
    //   }
    //   else if( device.platform == "ios"){
    //     pushNotification.register(tokenHandler, errorHandler, {
    //       "badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
    //   } 
    //   else{
    //     console.log(device.platform + " device, not support PushPlugin");
    //   }

    //   function successHandler(result){
    //     console.log(result);
    //     alert("GCM register ok:" + result);
    //   }
    //   function errorHandler(result){
    //     console.log(result);
    //     alert("GCM register failed:" + result);
    //   }
    //   function tokenHandler(result){
    //     console.log(result);
    //   }

    //   // handle APNS notifications for iOS
    //   function onNotificationAPN(e) {
    //     if (e.alert) {
    //        //$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
    //        // showing an alert also requires the org.apache.cordova.dialogs plugin
    //        navigator.notification.alert(e.alert);
    //     }
          
    //     if (e.sound) {
    //       // playing a sound also requires the org.apache.cordova.media plugin
    //       var snd = new Media(e.sound);
    //       snd.play();
    //     }
        
    //     if (e.badge) {
    //       pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    //     }
    //   }
      
    //   // Android
    //   function onNotificationGCM(e) {
    //     alert(JSON.stringify(e));
    //     switch ( e.event ) {
    //       case 'registered':
    //         if ( e.regid.length > 0 ) {
    //           console.log("regID = " + e.regid);
    //           localStorage['regid'] = e.regid;
    //           alert("registered:" + e.regid);
    //         }
    //       break;

    //     case 'message':
    //       if ( e.foreground ) {
    //         var soundfile = e.soundname || e.payload.sound;
    //         var my_media = new Media("/android_asset/www/" + soundfile);            
    //         my_media.play();
    //       }
    //       else {
    //         // if ( e.coldstart ) {
    //         // } else { }
    //         console.log("backgroud notify + codeStart:" + e.coldstart);
    //       }

    //       alert(e.payload.message);
    //       break;

    //     case 'error':
    //       console.log(e.msg);
    //       alert("notify error:" + e.msg);
    //       break;

    //     default:
    //       console.log("unknown event:" + e.event);
    //       break;
    //     }

    //   }
    // }
    // catch(e){
    //   alert("where error:"+ e);
    // }
  });

  version="1.0.30"
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

    // .state('app.site-arrange', {
    //   url: '/site/arrange',
    //   views: {
    //     'app-site': {
    //       templateUrl: 'templates/site-arrange.html',
    //       controller: 'SiteArrangeCtrl'
    //     }
    //   }
    // })

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

    // xjhlist 宣讲会
    .state('app.xjhlist', {
      url: '/xjhlist',
      views: {
        'app-site': {
          templateUrl: 'templates/xuanjiang.html',
          controller: 'XJHListCtrl'
        }
      }
    })

    .state('app.xjhdetail', {
      url: '/xjhlist/:Id',
      views: {
        'app-site': {
          templateUrl: 'templates/xjh-detail.html',
          controller: 'XJHDetailCtrl'
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

    // .state('app.resume-media', {
    //   url: '/resumes/media',
    //   views: {
    //     'app-resumes': {
    //       templateUrl: 'templates/resume-media.html',
    //       controller: 'ResumeMediaCtrl'
    //     }
    //   }
    // })

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

// ALL GCM notifications come through here. 
function onNotificationGCM(e) {
    alert('EVENT -> RECEIVED:' + e.event + ':' + JSON.stringify(e));
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                alert('REGISTERED with GCM Server -> REGID:' + e.regid + "");
                
                //regid localstorage
                localStorage.setItem('valueregid', e.regid);
 
                //call back to web service in Angular.  
                //This works for me because in my code I have a factory called
                //      PushProcessingService with method registerID
                var elem = angular.element(document.querySelector('[ng-app]'));
                var injector = elem.injector();
                var myService = injector.get('PushProcessingService');
                myService.registerID(e.regid);
            }
            break;
 
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                //we're using the app when a message is received.
                alert('--INLINE NOTIFICATION--' + '');
 
                // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/"+e.soundname);
                //my_media.play();
                alert(e.payload.message);
            }
            else
            {   
                // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    alert('--COLDSTART NOTIFICATION--' + '');
                else
                    alert('--BACKGROUND NOTIFICATION--' + '');
 
                // direct user here:
                window.location = "#/tab/featured";
            }
 
            alert('MESSAGE -> MSG: ' + e.payload.message + '');
            alert('MESSAGE: '+ JSON.stringify(e.payload));
            break;
 
        case 'error':
            alert('ERROR -> MSG:' + e.msg + '');
            break;
 
        default:
            alert('EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
};
