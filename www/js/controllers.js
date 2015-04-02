angular.module('starter.controllers', [])

.controller('NavController', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})
  
.controller('TutorialCtrl', function($scope, $state, $ionicViewService, $ionicPlatform) {
  // 退出app
  var deregister = $ionicPlatform.registerBackButtonAction(function () {
    $ionicPopup.confirm({
        title: '退出',
        content: '确定要退出?'
    }).then(function(res) {
        if(res) {
          ionic.Platform.exitApp();
        }
    });
  }, 100);

  $scope.$on('$destroy', deregister);
  // localStorage['didTutorial'] = false;// For Test

  var startApp = function() {
    $ionicViewService.clearHistory();
    // 默认进入
    $state.go('app.site');
    localStorage['didTutorial'] = true;
  };

  if(localStorage['didTutorial'] === "true") {
    //console.log('Skip intro');
    // 向导页面只显示一次
    startApp();
  } else {
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 500);
  }

  // "立即体验"按钮Event
  $scope.gotoMain = function() {
    startApp();
  }

  $scope.slideHasChanged = function(index) {
  }
})

.controller('TemplateCtrl', function($scope, $state, $ionicPopup, User, Device, BaseConfig) {
  $scope.messagenum = 0;
  $scope.user = User.getuser();
  $scope.showlogin = true;

  $scope.init = function(){
      var UserObj = localStorage['user'];
      if(!UserObj)
      {
         //$state.go("app.account-login"); 
         $scope.showlogin = true;
         $scope.user.photo = "img/touxiang.png";
         return;
      }

      $scope.showlogin = false;
      $scope.user = JSON.parse(UserObj);
      User.setAll($scope.user);
    //Device.set();
  };

  $scope.login = function(){
    var UserObj = localStorage['user'];
      if(!UserObj)
      {
         $state.go("app.account-login"); 
         return;
      }

      $scope.showlogin = false;
      $scope.user = JSON.parse(UserObj);
  }

  $scope.logout = function(){

    var confirmPopup = $ionicPopup.confirm({ title: '确定要退出成功吗？', cancelText:'取消', okText:'确认' });
    confirmPopup.then(function(res) {
      if(res) {
        localStorage.removeItem('user');
        User.clear();
        $scope.showlogin = true;
        //$state.go("app.account-login");
        //console.log('<-log-> state.go(app.account-login)');
      } else {
        //console.log('<-log-> not sure');
      }
    });
  }  

  $scope.setcity = function(){
    alert("Test");
    return;
  }

  //if(!User.getuid()){
     $scope.init();
  //}

})

.controller('SiteCtrl', function($scope, $state, $ionicPlatform, User, Device) {
  // 退出app
  var deregister = $ionicPlatform.registerBackButtonAction(function () {
    $ionicPopup.confirm({
        title: '退出',
        content: '确定要退出?'
    }).then(function(res) {
        if(res) {
          ionic.Platform.exitApp();
        }
    });
  }, 100);

  $scope.$on('$destroy', deregister);  
})

.controller('SiteArrangeCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, Arrange, Device) {
  $scope.user = User.getuser();
  $scope.arrange = Arrange.Get();

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
    return;
  }  

  // 获取arrange
  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=getarrange', $scope.user).
      success(function(data) {
        
        Arrange.SetTime();
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有您的日常安排!' });
              return;
            }

            for (var i = data.list.length - 1; i >= 0; i--) {
               Arrange.Set(data.list[i]);
            }
            $scope.arrange = Arrange.Get();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '没有您的日常安排!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if(Arrange.isNeedFetch()){
    $scope.init();
    return;
  }

})

.controller('SiteBindXueXiaoCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, Device, BaseConfig) {
  $scope.user = User.getuser();
  $scope.searchobj = {};

  $scope.cityclass = BaseConfig.getCities();
  $scope.xxlist = {}; //学校list
  $scope.xylist = {}; // 学院list
  $scope.zylist = {}; // 专业list
  $scope.xllist = [{id:1,n:'大专'},{id:2,n:'本科'},{id:3,n:'硕士'},{id:4,n:'博士'},
                    {id:5,n:'高中'},{id:6,n:'中专'},{id:7,n:'初中'},{id:8,n:'其他'}];

  // filter
  $scope.filterPid = function(keyid){
     return function(item){
        return item.pid == keyid;
     }
  }

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
    return;
  }  

  // get xxlist
  $scope.OnSelectCity = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '学校数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=getxxlist', $scope.searchobj).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '该地区没有学校信息!' });
              return;
            }

            $scope.xxlist = data.list;

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '请先选择省份和城市！' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '该地区没有学校信息!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

 // get xylist
  $scope.OnSelectXuexiao = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '学院数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=getxylist', $scope.searchobj).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '该学校暂没有学院，专业数据!' });
              return;
            }

            $scope.xylist = data.list;

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '请先选择学校！' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '该学校暂没有学院，专业数据!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

 // get zylist
  $scope.OnSelectXueYuan = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '专业数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=getzylist', $scope.searchobj).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '该学校暂没有学院，专业数据!' });
              return;
            }

            $scope.zylist = data.list;

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '请先选择学校和学院！' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '该学校暂没有学院，专业数据!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }  

  $scope.CheckSubmit = function(){
    $scope.searchobj.uid = $scope.user.uid;
    $scope.searchobj.username = $scope.user.username;
    $scope.searchobj.password = $scope.user.password;

    if( !$scope.searchobj.xxid || !$scope.searchobj.zyid || !$scope.searchobj.uid
      || !$scope.searchobj.xueli || !$scope.searchobj.cardid || !$scope.searchobj.xuehao
      || !$scope.searchobj.nianji || !$scope.searchobj.banji){

      $ionicPopup.alert({ template: '请检查是否都正确填写！' });
      return false;
    }

     return true; 
  }

  $scope.BindXueXiao = function(){
    if(!$scope.CheckSubmit()){
      return;
    }

    $ionicLoading.show({
        noBackdrop:true,
        template: '正在提交...'
        });

    $http.post(localStorage.siteHost+'?c=bindxuexiao', $scope.searchobj).
      success(function(data) {
        $ionicLoading.hide();
        if(data.error == 1){ 
          $ionicPopup.alert({ template: '绑定成功!' });
        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '请先选择省份和城市！' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '该地区没有学校信息!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

})


.controller('HomeCtrl', function($scope, $state, $ionicPlatform, User, Device) {
  // 退出app
  var deregister = $ionicPlatform.registerBackButtonAction(function () {
    $ionicPopup.confirm({
        title: '退出',
        content: '确定要退出?'
    }).then(function(res) {
        if(res) {
          ionic.Platform.exitApp();
        }
    });
  }, 100);

  $scope.$on('$destroy', deregister);  
})

.controller('JobDetailCtrl', function($scope, $stateParams, $ionicPopup, $state, $http, $ionicLoading, User, Device, BaseConfig) {
  $scope.job = {};
  $scope.job.id= $stateParams.jobId;
  $scope.user = User.getuser();
  $scope.bFav = "";

  $scope.JobDetail = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=show', {id:$stateParams.jobId}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有数据!' });
              return;
            }

            $scope.job = data.list;
            if($scope.job){
              $scope.job.edu = BaseConfig.getcomclass($scope.job.edu).n;
              $scope.job.salary = BaseConfig.getcomclass($scope.job.salary).n;
              $scope.job.type = BaseConfig.getcomclass($scope.job.type).n;
              $scope.job.report = BaseConfig.getcomclass($scope.job.report).n;
              $scope.job.sex = BaseConfig.getcomclass($scope.job.sex).n;
              $scope.job.pr = BaseConfig.getcomclass($scope.job.pr).n;
              $scope.job.age = BaseConfig.getcomclass($scope.job.age).n;
              $scope.job.exp = BaseConfig.getcomclass($scope.job.exp).n;

              $scope.job.hy = BaseConfig.getjobclass($scope.job.hy).n;
              $scope.job.job1 = BaseConfig.getjobclass($scope.job.job1).n;
              $scope.job.job_post = BaseConfig.getjobclass($scope.job.job_post).n;

              $scope.job.provinceid = BaseConfig.getcity($scope.job.provinceid).n;
              $scope.job.cityid = BaseConfig.getcity($scope.job.cityid).n;
            }

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有数据' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  $scope.jobFav = function(){
    
    $ionicLoading.show({
        noBackdrop:true,
        template: '正在操作...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=fav', {companyname:$scope.job.comname, 
        companyuid:$scope.job.comid, jobid:$scope.job.id, jobname:$scope.job.name, 
        uid:$scope.user.uid, username:$scope.user.username, password:$scope.user.password}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            $ionicPopup.alert({ template: '收藏成功！' });  
            $scope.bFav = "balanced";
        }else{
          switch(data.error){
            //case 2:
            case 3:
            case 4:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 5: 
              $ionicPopup.alert({ template: '取消收藏' });
              $scope.bFav = "";
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  // $scope.jobComment = function(){
  //   $ionicPopup.alert({ template: '评论成功！' });
  // }

  $scope.jobApply = function(){
    $ionicPopup.alert({ template: '申请成功！' });
  }

  $scope.jobShare = function(){
    window.plugins.socialsharing.share($scope.job.body, 
      $scope.job.title, 
      'www/img/hqt92.ico', 
      'http://haoqiantu.net/wap')
    //$ionicPopup.alert({ template: '分享成功！' });
  }

  if($scope.job.id > 0){
    $scope.JobDetail();
    return;
  }
})

// PostSubscription 职位订阅
.controller('PostSubsCtrl', function($scope, $stateParams, $ionicPopup, $state, $http, $ionicLoading, User, Jobs, Device, BaseConfig) {
  //$scope.postsubs = PostSubs.all();
  $scope.mycity = "深圳";
  $scope.comclass = BaseConfig.getComclassAll();
  $scope.cityclass = BaseConfig.getCities();
  $scope.jobclass = BaseConfig.getJobclassAll();
  $scope.jobs = Jobs.all();

  $scope.searchobj = {};
  $scope.display_search = "block";
  $scope.display_joblist = "none";

  // filter
  $scope.filterPid = function(keyid){
     return function(item){
        return item.pid == keyid;
     }
  }

  $scope.postSubs = function(){  
    //$ionicPopup.alert({ template: '没有您期待的职位，请稍候再试！' });
    //alert(JSON.stringify($scope.searchobj));
    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=list', $scope.searchobj).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有您期待的职位，请稍候再试!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
              data.list[i].salary = BaseConfig.getcomclass(data.list[i].salary).n;
              Jobs.set(data.list[i]);
            };
            $scope.jobs = Jobs.all();
            $scope.display_search = "none";
            $scope.display_joblist = "block";

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有您期待的职位，请稍候再试！' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

})

// NewJobs 职位招聘
.controller('NewJobsCtrl', function($scope, $stateParams, $ionicPopup, $state, $http, $ionicLoading, User, Jobs, Device, BaseConfig) {

  $scope.jobs = {};
  $scope.showlist = false;

  $scope.init = function(){  
    //$ionicPopup.alert({ template: '没有您期待的职位，请稍候再试！' });
    //alert(JSON.stringify($scope.searchobj));
    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=list', {type:56}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有您期待的职位，请稍候再试!' });
              return;
            }

            for (var i = data.list.length - 1; i >= 0; i--) {
              data.list[i].salary = BaseConfig.getcomclass(data.list[i].salary).n;
              Jobs.set(data.list[i]);
            };
            $scope.jobs = Jobs.all();
            $scope.showlist = true;

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有您期待的职位，请稍候再试！' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if(!$scope.showlist){
    $scope.init();
  }

})

// jobfair 招聘会
.controller('JobFairsCtrl', function($scope, $stateParams, $ionicPopup, $state, $http, $ionicLoading, User, Jobs, Device, JobFairs) {
  $scope.jobfairs = JobFairs.all();
  $scope.mycity = "深圳";

  $scope.init = function(){  

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=zphlist', {limit:20}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有招聘会信息，请稍候再试!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
              JobFairs.set(data.list[i]);
            };
            $scope.jobfairs = JobFairs.all();  
            JobFairs.setisfetch();
        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有招聘会信息，请稍候再试!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if(!JobFairs.isfetch()){
    $scope.init();
  }
  
})

.controller('JobFairDetailCtrl', function($scope, $stateParams, JobFairs) {
  $scope.jobfair = JobFairs.get($stateParams.jobfairId);
  $scope.jobfair.bshow = true;

  if(!$scope.jobfair){
    $scope.jobfair.bshow = false;
  }

})

// xjhlist 宣讲会
.controller('XJHListCtrl', function($scope, $stateParams, $ionicPopup, $state, $http, $ionicLoading, User, Jobs, Device, XjhList) {
  $scope.xjlist = XjhList.all();
  $scope.mycity = "深圳";

  $scope.init = function(){  

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=xjhlist', {limit:20}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有招聘会信息，请稍候再试!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
              XjhList.set(data.list[i]);
            };
            $scope.xjlist = XjhList.all();  
            XjhList.setisfetch();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有招聘会信息，请稍候再试!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if(!XjhList.isfetch()){
    $scope.init();
  }

})

.controller('XJHDetailCtrl', function($scope, $stateParams, XjhList, BaseConfig) {
  $scope.xjh = XjhList.get($stateParams.Id);
  $scope.xjh.bshow = false;
  $scope.xjhk = {};

  if($scope.xjh){
    $scope.xjh.bshow = true;
    $scope.xjh.province = BaseConfig.getcity($scope.xjh.provinceid).n;
    $scope.xjh.city = BaseConfig.getcity($scope.xjh.cityid).n;

  }

  

})

// resume 简历
.controller('ResumesCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $ionicModal, User, Resumes, Device) {
  console.log("<-log-> ResumesCtrl");
  $scope.user = User.getuser();
  $scope.bindxxinfo = {};
  $scope.resumes = Resumes.all();

  // ionic-modal
  $scope.showpic = false;
  $scope.showvideo = false;
  $scope.showaudio = false;
  $scope.imageurl = "";
  $scope.audiourl = "";
  $scope.audioname = "";
  $scope.videourl = "";
  $scope.videoname = "";

  if($scope.user.isAppPhoto){
    $scope.imageurl = "http://haoqiantu.net/upload/app/" + User.getuid() + "_img.png";
  }

  if($scope.user.isAppAudio){
    $scope.audiourl = "http://haoqiantu.net/upload/app/" + User.getuid() + "_audio.aac";
  }

  if($scope.user.isAppVideo){
    $scope.videourl = "http://haoqiantu.net/upload/app/" + User.getuid() + "_video.mp4";
  }

  // 获取简历
  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=resumelist', $scope.user).
      success(function(data) {
        Resumes.setisfetch();
        $ionicLoading.hide();
        if(data.error == 1){   
            
            if(!data.list){
              $ionicPopup.alert({ template: '没有您的数据!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
               Resumes.pushresume(data.list[i]);
            };
            $scope.resumes = Resumes.all();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              Resumes.setisfetch();
              $ionicPopup.alert({ template: '没有数据' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        //console.log("<-log-> resp.status:" + status);
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  $scope.getbindxxinfo = function(){
    $http.post(localStorage.siteHost+'?c=getbindxxinfo', $scope.user).
      success(function(data) {
        
        if(data.error == 1){   
            if(!data.list){
              //$ionicPopup.alert({ template: '没有您的数据!' });
              return;
            }
            
            $scope.bindxxinfo = data.list[0];

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              //$ionicPopup.alert({ template: '没有数据' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        //console.log("<-log-> resp.status:" + status);
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  // ionic-modal
  $ionicModal.fromTemplateUrl('templates/resume-media.html', {
          scope: $scope
      }).then(function(modal) {
          $scope.modal = modal;
      });

  $scope.openModal = function(type) {
    switch(type){
      case 1:
         $scope.showpic = true;
         $scope.showvideo = false;
         $scope.showaudio = false;
         break;

      case 2:
         $scope.showpic = false;
         $scope.showvideo = true;
         $scope.showaudio = false;
         break;   

      case 3:
         $scope.showpic = false;
         $scope.showvideo = false;
         $scope.showaudio = true;
         break;   
    }

    $scope.modal.show();

  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  }

  // resume-media -- modal
    /** * Upload current picture */
  $scope.uploadPicture = function() {
    // Get URI of picture to upload
      var img = document.getElementById('myImage');
      var imageURI = img.src;
      if (!imageURI || (img.style.display == "none")) {
          $ionicPopup.alert({ template: '先照相或选照片' });
          return;
      }
    // Verify server has been entered
    //server = document.getElementById('serverUrl').value;
    server = localStorage.siteHost + "?c=upload";
    if (server) {
    // Specify transfer options
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName= User.getuid() + "_img.png"; //imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType= "image/jpeg";
        options.chunkedMode = false;
    // Transfer picture to server
        var ft = new FileTransfer();
        ft.upload(imageURI, server, function(r) {
            //document.getElementById('camera_status').innerHTML = "Upload successful: "+ r.bytesSent+" bytes uploaded.";
            $ionicPopup.alert({ template: '上传成功' });
        }, function(error) {
            //document.getElementById('camera_status').innerHTML = "Upload failed: Code = "+ error.code;
            $ionicPopup.alert({ template: '上传失败，错误码：' +  error.code});
        }, options);
    }
  }

  // 照相
  $scope.TakePicture = function(picsource){
    if(!picsource){
      picsource = 1;
    }
    // picsource 1:camera  2:photolib
    if(picsource == '1'){
      picSrcType = Camera.PictureSourceType.CAMERA;
    }
    else{
      picSrcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    }
   //alert("will getPicture111");
    var CameraOptions;
    if(Device.get().platform == 'ios'){
      CameraOptions = {
        quality : 30,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : picSrcType,
        allowEdit : true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 120,
        targetHeight: 150,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        cameraDirection: camera.Direction.FRONT 
      };
    }
    else{
      CameraOptions = {
        quality : 100
        ,destinationType : Camera.DestinationType.FILE_URI
        ,sourceType : picSrcType
        ,allowEdit : true
        ,encodingType: Camera.EncodingType.PNG
        ,targetWidth: 480
        ,targetHeight: 600
        ,popoverOptions: CameraPopoverOptions
        ,saveToPhotoAlbum: true
        // ,cameraDirection: camera.Direction.FRONT 
      };
    }
    //alert("will getPicture");
    navigator.camera.getPicture(onSuccess, onFail, CameraOptions);
    function onSuccess(imageURI) {
        var image = document.getElementById('myImage');
        // image.style.visibility = "visible";
        // image.style.display = "block";
        image.src = imageURI;
        //alert(image.src);

        $scope.imageurl = imageURI;
    }
    function onFail(message) {
      setTimeout(function() {
        // do your thing here!
        $ionicPopup.alert({ template: '照相失败：' + message });
      }, 0);  
    }
  }

  // media-capture
  $scope.MediaCapture = function(type){

    function GoUpload(mediaurl, medianame){
      //alert("upload"+ mediaurl + ";" + medianame);
      server = localStorage.siteHost + "?c=upload";
      if (server) {
        $ionicLoading.show({
          noBackdrop:true,
          template: '数据上传中...'
        });
        // Specify transfer options
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName= medianame; 
        options.mimeType= "image/jpeg";
        options.chunkedMode = false;
        // Transfer picture to server
        var ft = new FileTransfer();
        ft.upload(mediaurl, server, function(r) {
          $ionicLoading.hide();
          $ionicPopup.alert({ template: '上传成功' });
        }, function(error) {
          $ionicLoading.hide();
          $ionicPopup.alert({ template: '上传失败，错误码：' + error.code });
        }, options);
      }
    }

    function OnSuccess(mediafiles){
      var i, path, len;
      //alert(mediafiles[0].fullPath + ";" + medianame);
      //GoUpload(mediafiles[0].fullPath, medianame);
      if(type == 1){
        $scope.audiourl = mediafiles[0].fullPath;
        
        var image = document.getElementById('myImage');
        image.style.visibility = "hidden";
        image.style.display = "none";
        
        var audio = document.getElementById('myAudio');
        audio.style.visibility = "visible";
        audio.style.display = "block";
        audio.src = mediafiles[0].fullPath;

        var video = document.getElementById('myVideo');
        video.style.visibility = "hidden";
        video.style.display = "none";
      }
      else if(type == 3){
        $scope.videourl = mediafiles[0].fullPath;

        var image = document.getElementById('myImage');
        image.style.visibility = "hidden";
        image.style.display = "none";
        
        var audio = document.getElementById('myAudio');
        audio.style.visibility = "hidden";
        audio.style.display = "none";

        var video = document.getElementById('myVideo');
        video.style.visibility = "visible";
        video.style.display = "block";
        video.src = mediafiles[0].fullPath;
      } 
      else{

      }

      // for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      //     path = mediaFiles[i].fullPath;
      //     // do something interesting with the file
      // }
    }

    function OnError(error){
      $ionicPopup.alert({ template: 'capture failed code:' + error.code });
    }

    if(!type){
      type = 1;
    }
    // global var 
    medianame = "png";

    switch(type){
      case 1: // audio
        var options = { limit: 1, duration: 10 };
        medianame = User.getuid() + "_audio.aac";
        $scope.audioname = medianame;
        navigator.device.capture.captureAudio(OnSuccess, OnError, options);
        break;

      case 2: // image
        var options = { limit: 1 };
        medianame = User.getuid() + "_img.png";
        navigator.device.capture.captureImage(OnSuccess, OnError, options);
        break;

      case 3: // video
        var options = { limit: 1, duration: 10 };
        medianame = User.getuid() + "_video.mp4";
        $scope.videoname = medianame;
        navigator.device.capture.captureVideo(OnSuccess, OnError, options);
        break;

      default:
        $ionicPopup.alert({ template: 'capture failed type:' + type });
    }
  }

  $scope.MediaUpload = function(type){
    if(type == 1){
      medianame = $scope.audioname;
      mediaurl = $scope.audiourl;
    }
    else if( type == 3){
      medianame = $scope.videoname;
      mediaurl = $scope.videourl;
    }
    else{
      $ionicPopup.alert({ template: '选择错误，请重现选择！'});
      return;
    }

    server = localStorage.siteHost + "?c=upload";
    if (server) {
      $ionicLoading.show({
        noBackdrop:true,
        template: '数据上传中...'
      });
      // Specify transfer options
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName= medianame; 
      options.mimeType= "image/jpeg";
      options.chunkedMode = false;
      // Transfer picture to server
      var ft = new FileTransfer();
      ft.upload(mediaurl, server, function(r) {
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '上传成功' });
      }, function(error) {
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '上传失败，错误码：' + error.code });
      }, options);
    }
    else{
      $ionicPopup.alert({ template: '系统错误，请退出重新登录！'});
      return;
    }
  }


  if(!User.getuid()){
    $state.go("app.account-login");
    return;
  }

  if(!Resumes.isfetch()){
    $scope.init();
    $scope.getbindxxinfo();
    return;
  }

})

.controller('ResumeDetailCtrl', function($scope, $stateParams, $ionicPopup, Resumes) {

  $scope.resume = Resumes.get($stateParams.resumeId);

  if(!$scope.resume){
    $ionicPopup.alert({ template: '系统错误，请退出重现登录' });
  }

  $scope.ResumeDef = function(){
    $ionicPopup.alert({ template: '简历刷新成功' });
  }

  $scope.ResumeOpen = function(){
    $ionicPopup.alert({ template: '简历设置开放' });
  }

  $scope.ResumeRefresh = function(){
    $ionicPopup.alert({ template: '简历刷新成功' });
  }

})

.controller('ResumeMediaCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, Resumes, Device) {

  $scope.imageurl = "";

  $scope.audiourl = "";
  $scope.audioname = "";
  $scope.videourl = "";
  $scope.videoname = "";


  /** * Upload current picture */
  $scope.uploadPicture = function() {
    // Get URI of picture to upload
      var img = document.getElementById('myImage');
      var imageURI = img.src;
      if (!imageURI || (img.style.display == "none")) {
          $ionicPopup.alert({ template: '先照相或选照片' });
          return;
      }
    // Verify server has been entered
    //server = document.getElementById('serverUrl').value;
    server = localStorage.siteHost + "?c=upload";
    if (server) {
    // Specify transfer options
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName= User.getuid() + "_img.png"; //imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType= "image/jpeg";
        options.chunkedMode = false;
    // Transfer picture to server
        var ft = new FileTransfer();
        ft.upload(imageURI, server, function(r) {
            //document.getElementById('camera_status').innerHTML = "Upload successful: "+ r.bytesSent+" bytes uploaded.";
            $ionicPopup.alert({ template: '上传成功' });
        }, function(error) {
            //document.getElementById('camera_status').innerHTML = "Upload failed: Code = "+ error.code;
            $ionicPopup.alert({ template: '上传失败，错误码：' +  error.code});
        }, options);
    }
  }

  // 照相
  $scope.TakePicture = function(picsource){
    if(!picsource){
      picsource = 1;
    }
    // picsource 1:camera  2:photolib
    if(picsource == '1'){
      picSrcType = Camera.PictureSourceType.CAMERA;
    }
    else{
      picSrcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    }
   //alert("will getPicture111");
    var CameraOptions;
    if(Device.get().platform == 'ios'){
      CameraOptions = {
        quality : 30,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : picSrcType,
        allowEdit : true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 120,
        targetHeight: 150,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        cameraDirection: camera.Direction.FRONT 
      };
    }
    else{
      CameraOptions = {
        quality : 100
        ,destinationType : Camera.DestinationType.FILE_URI
        ,sourceType : picSrcType
        ,allowEdit : true
        ,encodingType: Camera.EncodingType.PNG
        ,targetWidth: 480
        ,targetHeight: 600
        ,popoverOptions: CameraPopoverOptions
        ,saveToPhotoAlbum: true
        // ,cameraDirection: camera.Direction.FRONT 
      };
    }
    //alert("will getPicture");
    navigator.camera.getPicture(onSuccess, onFail, CameraOptions);
    function onSuccess(imageURI) {
        var image = document.getElementById('myImage');
        image.style.visibility = "visible";
        image.style.display = "block";
        image.src = imageURI;
        //alert(image.src);

        $scope.imageurl = imageURI;
    }
    function onFail(message) {
      setTimeout(function() {
        // do your thing here!
        $ionicPopup.alert({ template: '照相失败：' + message });
      }, 0);  
    }
  }

  // media-capture
  $scope.MediaCapture = function(type){

    function GoUpload(mediaurl, medianame){
      //alert("upload"+ mediaurl + ";" + medianame);
      server = localStorage.siteHost + "?c=upload";
      if (server) {
        $ionicLoading.show({
          noBackdrop:true,
          template: '数据上传中...'
        });
        // Specify transfer options
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName= medianame; 
        options.mimeType= "image/jpeg";
        options.chunkedMode = false;
        // Transfer picture to server
        var ft = new FileTransfer();
        ft.upload(mediaurl, server, function(r) {
          $ionicLoading.hide();
          $ionicPopup.alert({ template: '上传成功' });
        }, function(error) {
          $ionicLoading.hide();
          $ionicPopup.alert({ template: '上传失败，错误码：' + error.code });
        }, options);
      }
    }

    function OnSuccess(mediafiles){
      var i, path, len;
      //alert(mediafiles[0].fullPath + ";" + medianame);
      //GoUpload(mediafiles[0].fullPath, medianame);
      if(type == 1){
        $scope.audiourl = mediafiles[0].fullPath;
        
        var image = document.getElementById('myImage');
        image.style.visibility = "hidden";
        image.style.display = "none";
        
        var audio = document.getElementById('myAudio');
        audio.style.visibility = "visible";
        audio.style.display = "block";
        audio.src = mediafiles[0].fullPath;

        var video = document.getElementById('myVideo');
        video.style.visibility = "hidden";
        video.style.display = "none";
      }
      else if(type == 3){
        $scope.videourl = mediafiles[0].fullPath;

        var image = document.getElementById('myImage');
        image.style.visibility = "hidden";
        image.style.display = "none";
        
        var audio = document.getElementById('myAudio');
        audio.style.visibility = "hidden";
        audio.style.display = "none";

        var video = document.getElementById('myVideo');
        video.style.visibility = "visible";
        video.style.display = "block";
        video.src = mediafiles[0].fullPath;
      } 
      else{

      }

      // for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      //     path = mediaFiles[i].fullPath;
      //     // do something interesting with the file
      // }
    }

    function OnError(error){
      $ionicPopup.alert({ template: 'capture failed code:' + error.code });
    }

    if(!type){
      type = 1;
    }
    // global var 
    medianame = "png";

    switch(type){
      case 1: // audio
        var options = { limit: 1, duration: 10 };
        medianame = User.getuid() + "_audio.aac";
        $scope.audioname = medianame;
        navigator.device.capture.captureAudio(OnSuccess, OnError, options);
        break;

      case 2: // image
        var options = { limit: 1 };
        medianame = User.getuid() + "_image.jpeg";
        navigator.device.capture.captureImage(OnSuccess, OnError, options);
        break;

      case 3: // video
        var options = { limit: 1, duration: 10 };
        medianame = User.getuid() + "_video.mp4";
        $scope.videoname = medianame;
        navigator.device.capture.captureVideo(OnSuccess, OnError, options);
        break;

      default:
        $ionicPopup.alert({ template: 'capture failed type:' + type });
    }
  }

  $scope.MediaUpload = function(type){
    if(type == 1){
      medianame = $scope.audioname;
      mediaurl = $scope.audiourl;
    }
    else if( type == 3){
      medianame = $scope.videoname;
      mediaurl = $scope.videourl;
    }
    else{
      $ionicPopup.alert({ template: '选择错误，请重现选择！'});
      return;
    }

    server = localStorage.siteHost + "?c=upload";
    if (server) {
      $ionicLoading.show({
        noBackdrop:true,
        template: '数据上传中...'
      });
      // Specify transfer options
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName= medianame; 
      options.mimeType= "image/jpeg";
      options.chunkedMode = false;
      // Transfer picture to server
      var ft = new FileTransfer();
      ft.upload(mediaurl, server, function(r) {
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '上传成功' });
      }, function(error) {
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '上传失败，错误码：' + error.code });
      }, options);
    }
    else{
      $ionicPopup.alert({ template: '系统错误，请退出重新登录！'});
      return;
    }
  }

})

// 个人
.controller('AccountCtrl', function($scope, $state, $http, $ionicPopup, $ionicHistory, User) {
  //$scope.data = {}
  //console.log('<-log-> AccountCtrl');

  $scope.Logout = function(){
    //console.log('<-log-> account-Logout');

    var confirmPopup = $ionicPopup.confirm({ title: '确定要退出成功吗？', cancelText:'取消', okText:'确认' });
    confirmPopup.then(function(res) {
      if(res) {
        //console.log('<-log-> sure');
        // localStorage.removeItem('user.uid');
        // localStorage.removeItem('user.password');
        localStorage.removeItem('user');
        User.clear();
        $ionicHistory.clearCache();
        $state.go("app.account-login");
        //console.log('<-log-> state.go(app.account-login)');
      } else {
        //console.log('<-log-> not sure');
      }
    });
    
  }

  if(!User.getuid()){
    $state.go("app.account-login")
  }
})

.controller('AccountBaseInfoCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, BaseConfig) {
  $scope.user = User.getuser();
  $scope.ouser = {}
  $scope.buser = {}
  $scope.educlass = BaseConfig.getEduclassAll();
  $scope.sexclass = BaseConfig.getSexclassAll();

  $scope.showbase = false;

  //alert(JSON.stringify(BaseInfo.getcity(1)) );
  $scope.AddBaseInfo = function(){
    if(!$scope.buser.name || !$scope.buser.sex || !$scope.buser.sno || !!$scope.buser.maxedu
      || !$scope.buser.school || !$scope.buser.starttime || !$scope.buser.endtime || !$scope.buser.college || !$scope.buser.specialty){

      $ionicPopup.alert({ template: '请检查是否都正确填写！' });
      return;
    }
    $ionicPopup.alert({ template: '提交成功！' });
    $state.go("app.account");
  }

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
  }  
})

.controller('AccountFavJobCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, FavJobs, Device) {
  $scope.user = User.getuser();
  $scope.myprivince = $scope.user.province;
  $scope.mycity = $scope.user.city;
  $scope.jobs = FavJobs.all();

  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=favlist', $scope.user).
      success(function(data) {
        FavJobs.SetTime();
        $ionicLoading.hide();
        if(data.error == 1){
            if(!data.list){
              $ionicPopup.alert({ template: '没有您的数据!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
               FavJobs.set(data.list[i]);
            };
            $scope.jobs = FavJobs.all();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
            $ionicPopup.alert({ template: '没有数据' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if(!User.getuid()){
    $state.go("app.account-login");
    return;
  }

  if(FavJobs.isNeedFetch()){
    $scope.init();
    return;
  }

})

.controller('AccountApplyJobsCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, ApplyJobs, Device) {

  $scope.user = User.getuser();
  $scope.myprivince = $scope.user.province;
  $scope.mycity = $scope.user.city;
  $scope.jobs = ApplyJobs.all();

  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=job&c=applylist', $scope.user).
      success(function(data) {
        ApplyJobs.SetTime();
        $ionicLoading.hide();
        if(data.error == 1){
            if(!data.list){
              $ionicPopup.alert({ template: '没有您的数据!' });
              return;
            }   
            for (var i = data.list.length - 1; i >= 0; i--) {
               ApplyJobs.set(data.list[i]);
            };
            $scope.jobs = ApplyJobs.all();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有数据' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if(!User.getuid()){
    $state.go("app.account-login");
    return;
  }

  if(ApplyJobs.isNeedFetch()){
    $scope.init();
    return;
  }

})


.controller('NewsCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, News) {
  $scope.newslist = News.All();

  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=news&c=list', {nid:24}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有数据!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
               News.Set(data.list[i]);
            }
            $scope.newslist = News.All();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '没有您的消息!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if($scope.newslist.length <= 0){
    $scope.init();
    return;
  }

})

.controller('NewsDetailCtrl', function($scope, $stateParams, $http, $ionicPopup, $ionicLoading, $sce, User) {
  $scope.news = {};
  $scope.news.id= $stateParams.ID;

  $scope.NewsDetail = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?m=news&c=show', {id:$stateParams.ID}).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有数据!' });
              return;
            }

            $scope.news = data.list;
            $scope.news.body = $sce.trustAsHtml($scope.news.body);

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: 
              $ionicPopup.alert({ template: '没有数据' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if($scope.news.id > 0){
    $scope.NewsDetail();
  }

})


.controller('AccountMyMsgCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, Message) {
  $scope.user = User.getuser();
  $scope.ouser = {}
  $scope.messagelist = Message.All();

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
    return;
  }  

  // 获取message
  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=messagelist', $scope.user).
      success(function(data) {
        
        $ionicLoading.hide();
        if(data.error == 1){   
            if(!data.list){
              $ionicPopup.alert({ template: '没有您的数据!' });
              return;
            }
            for (var i = data.list.length - 1; i >= 0; i--) {
               Message.Set(data.list[i]);
            }
            $scope.messagelist = Message.All();

        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: // 消息不存在
              $ionicPopup.alert({ template: '没有您的消息!' });
              break;  

            case 1008:
              $ionicPopup.alert({ template: '密码错误，请退出重现登录' });
              break;     

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
          
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  if($scope.messagelist.length <= 0){
    $scope.init();
    return;
  }

})

.controller('MessageDetailCtrl', function($scope, $stateParams, $ionicPopup, Message) {

  $scope.message = Message.Get($stateParams.ID);
  //console.log("<-log-> ID:" + $stateParams.ID);
  if(!$scope.message){
    $ionicPopup.alert({ template: '系统错误，请退出重现登录' });
  }

  $scope.Reply = function(){
    $ionicPopup.alert({ template: '正在开发' });
  }

})

.controller('AccountMyCoinCtrl', function($scope) {
})

.controller('AccountEmployRegCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User) {
  $scope.user = User.getuser();
  $scope.ouser = {};
  $scope.dengji = {};

  $scope.employReg = function(){

    if(!$scope.dengji.company || !$scope.dengji.baodaozheng || !$scope.dengji.position)
    {
      $ionicPopup.alert({ template: '请确认所有记录项填写正确！' });
      return;
    }

    $ionicPopup.alert({ template: '就业登记，提交成功！' });
  }

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
  }
})

.controller('AccountChgPassCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User) {
  $scope.user = User.getuser();
  $scope.ouser = {}

  $scope.chgpass = function(){
    if(!$scope.ouser.oldpassword || !$scope.ouser.password || !$scope.ouser.newconfirmpass){
      $ionicPopup.alert({ template: '全部为必填！' });
      return;
    }
    if($scope.ouser.password != $scope.ouser.newconfirmpass){
      $ionicPopup.alert({ template: '两次新密码不一致，请重现输入！' });
      return;
    }

    $scope.ouser.uid = $scope.user.uid
    $http.post(localStorage.siteHost+'?c=savepasswd', $scope.ouser).
        success(function(data) {
          $ionicLoading.hide();
          if(data.error == 1){
              User.setuser($scope.user.uid, $scope.user.username, $scope.ouser.password);
              localStorage['user'] = JSON.stringify(User.getuser());
              $ionicPopup.alert({ template: '修改密码成功' });

          }else{
            switch(data.error){
              case 4:
                $ionicPopup.alert({ template: '登录过期，重现登录后，再修改密码！' });
                break;

              case 2:
                $ionicPopup.alert({ template: '旧密码错误，请重现输入' });
                break;   

              default:
                $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
            }
            
          }
        }).
        error(function(data,status,headers,config){
          $ionicLoading.hide();
          //console.log("<-log-> resp.status:" + status);
          $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
        });
  }

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
  }
})

//登录注册相关
.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $ionicHistory, User, BaseConfig) {
  $scope.user = {}
  $scope.handletype = 0; // 1login，2reg，3getpass，4chgpass
  var HandleType = {
    NONE: 0, LOGIN: 1, REG: 2, GETPASS: 3, CHGPASS:4 };

  //console.log("<-log-> LoginCtrl");
  $scope.login = function(){
    $scope.handletype = HandleType.LOGIN;

    if(!$scope.checkinput()){
      return;
    }

    $ionicLoading.show({
        noBackdrop:true,
        template: '正在登录...'
        });

    $http.post(localStorage.siteHost+'?c=login', $scope.user).
      success(function(data) {
        $ionicLoading.hide();
        if(data.error == 1){
            if(!data.photo){
              data.photo = "img/touxiang.png";
            }
            else
            {
              data.photo = "http://haoqiantu.net/" + data.photo;
            }
            User.setAll(data);
            User.setAddr(BaseConfig.getcity($scope.user.provinceid).n, BaseConfig.getcity($scope.user.cityid).n);

            localStorage['user'] = JSON.stringify(User.getuser());

            // 上报注册信息-app-push
            var regid= localStorage['regid'];
            var device = JSON.parse(localStorage['device']); 
            $http.post(localStorage.siteHost+'?c=appreg', {"uid":User.getuid(), "deviceid":device.uuid, 
                "ostype":device.platform, "regid":regid}).success(function(){}).error(function(){});  

            $ionicPopup.alert({ template: '登录成功' });
            $ionicHistory.clearCache();
            $state.go("app.site");
        }else{
          switch(data.error){
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请重现输入；没有帐号请注册新帐号' });
              break;

            case 4:
              $ionicPopup.alert({ template: '密码错误，请重现输入' });
              break;

            case 5:
              $ionicPopup.alert({ template: '邮箱没有认证' });
              break;  

            case 6:
              $ionicPopup.alert({ template: '帐号已被锁定！请登录网页版查看具体原因。' });
              break;      

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }  
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        //console.log("<-log-> resp.status:" + status);
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  $scope.reg = function(){
    $scope.handletype = HandleType.REG;

    if(!$scope.checkinput()){
      return;
    }

    $ionicLoading.show({
        noBackdrop:true,
        template: '正在注册中...'
        });

    $http.post(localStorage.siteHost+'?c=reg', $scope.user).
      success(function(data) {

        $ionicLoading.hide();
        if(data.error == 1){     
  
            User.setuser(data.uid, $scope.user.username, $scope.user.password, data.usertype);
            localStorage['user'] = JSON.stringify(User.getuser());

            // 上报注册信息-app-push
            var regid= localStorage['regid'];
            var device = JSON.parse(localStorage['device']); 
            $http.post(localStorage.siteHost+'?c=appreg', {"uid":User.getuid(), "deviceid":device.uuid, 
                "ostype":device.platform, "regid":regid}).success(function(){}).error(function(){});  

            $ionicPopup.alert({ template: '注册成功' });
            $state.go("app.account");

        }else{
          switch(data.error){
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请重现输入；没有帐号请注册新帐号' });
              break;

            case 5:
              $ionicPopup.alert({ template: '邮箱填写有误，请重现输入' });
              break;

            case 6:
              $ionicPopup.alert({ template: '帐号或邮箱已存在，如有帐号请直接登录' });
              break;  

            case 8:
              $ionicPopup.alert({ template: '请进行邮箱认证。' });
              break;      

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  $scope.getpass = function(){
    $scope.handletype = HandleType.GETPASS;

    if(!$scope.checkinput()){
      return;
    }

    $ionicLoading.show({
        noBackdrop:true,
        template: '正在提交...'
        });

    $http.post(localStorage.siteHost+'?c=chgpassforcode', $scope.user).
      success(function(data) {
        $ionicLoading.hide();
        if(data.error == 1){     
            $ionicPopup.alert({ template: '验证码已成功发送，请留意您登记的手机和邮箱' });
            $scope.tochgpass();
        }else{
          switch(data.error){
            case 3:
              $ionicPopup.alert({ template: '参数异常，请重新填写' });
              break;

            case 4:
              $ionicPopup.alert({ template: '请查收邮箱或者短信，不要频繁尝试' });
              break;

            case 2:
              $ionicPopup.alert({ template: '帐号，邮箱，手机可能不匹配，请重新填写' });
              break;    

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  $scope.chgpassBycode = function(){
    $scope.handletype = HandleType.CHGPASS;

    if(!$scope.checkinput()){
      return;
    }

    $ionicLoading.show({
        noBackdrop:true,
        template: '正在提交...'
        });

    $http.post(localStorage.siteHost+'?c=chgpassbycode', $scope.user).
      success(function(data) {
        $ionicLoading.hide();
        if(data.error == 1){     
          $ionicPopup.alert({ template: '密码修改成功，请重现登录' });
          $scope.tologin();
        }else{
          switch(data.error){
            case 3:
              $ionicPopup.alert({ template: '请确认参数都输入正确，重现输入！' });
              break;

            case 4:
              $ionicPopup.alert({ template: '帐号不存在' });
              break;

            case 5:
              $ionicPopup.alert({ template: '验证码过期，请重现获取验证码' });
              break;  

            case 2:
              $ionicPopup.alert({ template: '验证失败，请重现输入。' });
              break;      

            default:
              $ionicPopup.alert({ template: '系统错误，请稍候重试。错误码：' + data.error });
          }
        }
      }).
      error(function(data,status,headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  }

  $scope.tologin = function(){
    $scope.title = "登录";
    $scope.display_reg = "display:none";
    $scope.display_login = "display:block";
    $scope.display_getpass = "display:none";
    $scope.display_chgpass = "display:none";
  }

  $scope.toreg = function(){
    $scope.title = "新用户注册";
    $scope.display_reg = "display:block";
    $scope.display_login = "display:none";
    $scope.display_getpass = "display:none";
    $scope.display_chgpass = "display:none";
  }

  $scope.togetpass = function(){
    $scope.title = "找回密码";
    
    $scope.display_login = "display:none";
    $scope.display_reg = "display:none";
    $scope.display_chgpass = "display:none";
    $scope.display_getpass = "display:block";
  }

  $scope.tochgpass = function(){
    $scope.title = "找回密码";
    
    $scope.display_login = "display:none";
    $scope.display_reg = "display:none";
    $scope.display_chgpass = "display:block";
    $scope.display_getpass = "display:none";
  }

  $scope.checkinput = function(){
    if($scope.handletype == HandleType.GETPASS || $scope.handletype == HandleType.REG){
      if(!$scope.user.username){
        $ionicPopup.alert({ template: '帐号不能为空，请检查后重新填写' });
        return false;
      }
      if(!$scope.user.email && !$scope.user.mobile){
        $ionicPopup.alert({ template: '邮箱或电话至少填一个，请检查后重新填写' });
        return false;
      }

      return true;
    }

    if(!$scope.user.username || !$scope.user.password){
      $ionicPopup.alert({ template: '帐号密码填写有误，请检查后重新填写' });
      return false;
    }

    if($scope.handletype == HandleType.REG || $scope.handletype == HandleType.CHGPASS){
      if($scope.user.password != $scope.user.passconfirm){
        $ionicPopup.alert({ template: '两次密码不一致，请重新填写' });
        return false;
      }
    }

    return true;
  }

  if(User.getuid()){
      $state.go('app.account');
  }else{
    $scope.tologin();
  }
})

// 关于
.controller('AboutCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, User) {
  // 退出app
  var deregister = $ionicPlatform.registerBackButtonAction(function () {
    $ionicPopup.confirm({
        title: '退出',
        content: '确定要退出?'
    }).then(function(res) {
        if(res) {
          ionic.Platform.exitApp();
        }
    });
  }, 100);

  $scope.$on('$destroy', deregister);  

  $scope.user = User.getuser();
  $scope.showlogin = true;

  if(User.getuid()){
    $scope.showlogin = false;
  }

  $scope.refresh = function(){
    $ionicPopup.alert({ template: '您已经是最新版本，不需要更新！' });
  }

  $scope.Logout = function(){

    var confirmPopup = $ionicPopup.confirm({ title: '确定要退出成功吗？', cancelText:'取消', okText:'确认' });
    confirmPopup.then(function(res) {
      if(res) {
        localStorage.removeItem('user');
        User.clear();
        $scope.showlogin = true;
        //$state.go("app.account-login");
        //console.log('<-log-> state.go(app.account-login)');
      } else {
        //console.log('<-log-> not sure');
      }
    });
  }

  $scope.Login = function(){
    $state.go("app.account-login");
    return;
  }

})

// 关于
.controller('AboutAdviceCtrl', function($scope, $http, $ionicPopup, User) {
  $scope.user = User.getuser();
  $scope.suggest = {};

  $scope.advice = function(){
    if(!$scope.suggest.content || !$scope.suggest.name || !$scope.suggest.email){
       $ionicPopup.alert({ template: '请完整填写，我们一定及时处理！' });
       return;
    }

    $ionicPopup.alert({ template: '多谢您的反馈，我们一定及时处理！' });
  }
})

// 关于
.controller('AboutFindOutCtrl', function($scope, $http, $ionicPopup, User) {
  $scope.user = User.getuser();
  $scope.suggest = {};

  $scope.findout = function(){
    if(!$scope.suggest.content || !$scope.suggest.comname || !$scope.suggest.job_post){
       $ionicPopup.alert({ template: '请完整填写，我们一定及时处理！' });
       return;
    }
    $ionicPopup.alert({ template: '多谢您的反馈，我们一定及时处理！' });
  }
})

  //$scope.mainCtrl.showFeature = false;
;