angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $state, User) {

  // //console.log("<-log-> HomeCtrl");

  $scope.user = User.getuser();

  $scope.init = function(){
    ////console.log("<-log-> HomeCtrl.init");
    
    var UserObj = localStorage['user'];
    

    if(!UserObj)
    {
       $state.go("app.account-login"); 
       //console.log("<-log-> state.go(app.account-login)");
       return;
    }

    $scope.user = JSON.parse(UserObj);
    User.setuser($scope.user.uid, $scope.user.username, $scope.user.password, $scope.user.usertype);
  };

  if(!$scope.user.uid){
    $scope.init();  
  }
  
})

.controller('JobDetailCtrl', function($scope, $stateParams, Jobs) {
  $scope.job = Jobs.get($stateParams.jobId);
})

// PostSubscription 招聘会
.controller('PostSubsCtrl', function($scope, $ionicPopup, User) {
  //$scope.postsubs = PostSubs.all();
  $scope.mycity = "深圳";

  $scope.postsubs = function(){  
    $ionicPopup.alert({ template: '没有您期待的职位，请稍候再试！' });
  }

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
  }

})

// NewJobs 职位招聘
.controller('NewJobsCtrl', function($scope, Jobs) {
  //$scope.postsubs = PostSubs.all();
  $scope.mycity = "深圳";
  $scope.jobs = Jobs.all();

})

// jobfair 招聘会
.controller('JobFairsCtrl', function($scope, JobFairs) {
  $scope.jobfairs = JobFairs.all();
  $scope.mycity = "深圳";
})

.controller('JobFairDetailCtrl', function($scope, $stateParams, JobFairs) {
  $scope.jobfair = JobFairs.get($stateParams.jobfairId);
})

// preach 宣讲会
.controller('PreachesCtrl', function($scope, Preaches) {
  $scope.Preaches = Preaches.all();
  $scope.mycity = "深圳";
})

.controller('PreachDetailCtrl', function($scope, $stateParams, Preaches) {
  $scope.preach = Preaches.get($stateParams.preachId);
})

// news
.controller('NewsCtrl', function($scope, $stateParams, Newss) {
  $scope.news = Newss.get($stateParams.newsid);

})

// study 学习中心
.controller('StudyCtrl', function($scope, Newss) {
  $scope.newss = Newss.all();

})

// venture 创业中心
.controller('VentureCtrl', function($scope, Newss) {
  $scope.newss = Newss.all();

})

// resume 简历
.controller('ResumesCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User, Resumes) {

  //console.log("<-log-> ResumesCtrl");
  $scope.user = User.getuser();
  $scope.resumes = Resumes.all();

  // 获取简历
  $scope.init = function(){

    $ionicLoading.show({
        noBackdrop:true,
        template: '数据加载中...'
        });

    $http.post(localStorage.siteHost+'?c=resumelist', $scope.user).
      success(function(data) {
        //console.log("<-log-> resumelist.resp.success");

        $ionicLoading.hide();
        if(!data.error){
            
            //console.log("<-log-> resumelist-resp listnum:" + data.list.length);
            
            Resumes.setisfetch();
            for (var i = data.list.length - 1; i >= 0; i--) {
               Resumes.pushresume(data.list[i]);
            };
            $scope.resumes = Resumes.all();

            //localStorage['resumelist'] = JSON.stringify(data.list);
            
        }else{
          switch(data.error){
            case 2:
            case 3:
              $ionicPopup.alert({ template: '帐号不存在，请退出重现登录' });
              break;

            case 4: // 简历不存在
              Resumes.setisfetch();
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

  if(!User.getuid()){
    $state.go("app.account-login");
    return;
  }

  if(!Resumes.isfetch()){
    $scope.init();
    return;
  }

})

.controller('ResumeDetailCtrl', function($scope, $stateParams, $ionicPopup, Resumes) {

  $scope.resume = Resumes.get($stateParams.resumeId);

  if(!$scope.resume){
    $ionicPopup.alert({ template: '系统错误，请退出重现登录' });
  }

})

// day-award
// .controller('DayAwardCtrl', function($scope) {
// })

// 个人
.controller('AccountCtrl', function($scope, $state, $http, $ionicPopup, User) {
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

.controller('AccountBaseInfoCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User) {
  $scope.user = User.getuser();
  $scope.ouser = {}

  $scope.AddBaseInfo = function(){
    $ionicPopup.alert({ template: '提交成功！' });
  }

  if (!User.getuid()) {
    $ionicPopup.alert({ template: '登录过期，请先退出登录。' });
    $state.go("app.account-login");
  }  
})

.controller('AccountMyMsgCtrl', function($scope) {
})

.controller('AccountMyCoinCtrl', function($scope) {
})

.controller('AccountEmployRegCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User) {
  $scope.user = User.getuser();
  $scope.ouser = {}

  $scope.employreg = function(){
    $ionicPopup.alert({ template: '提交成功！' });
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
          //console.log("<-log-> resp.error:" + data.error);

          $ionicLoading.hide();
          if(data.error == 1){
              
              //console.log("<-log-> chgpass ok:" + data.uid);

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
.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, User) {
  $scope.user = {}
  $scope.handletype = 0; // 1login，2reg

  //console.log("<-log-> LoginCtrl");
  $scope.login = function(){
    $ionicLoading.show({
        noBackdrop:true,
        template: '正在登录...'
        });

    //console.log("<-log-> " + $scope.user.username + "," + $scope.user.password);
    //console.log(localStorage.siteHost);
 
    $scope.handletype = 1;

    if(!$scope.checkinput()){
      return;
    }

    $http.post(localStorage.siteHost+'?c=login', $scope.user).
      success(function(data) {
        //console.log("<-log-> resp.error:" + data.error);

        $ionicLoading.hide();
        if(data.error == 1){
            
            //console.log("<-log-> login ok:" + data.uid);
            // localStorage['user.uid'] = data.uid;
            // localStorage['user.username'] = data.username;
            // localStorage['user.password'] = $scope.user.password;

            User.setuser(data.uid, data.username, $scope.user.password);
            localStorage['user'] = JSON.stringify(User.getuser());
            $ionicPopup.alert({ template: '登录成功' });
            $state.go("app.home");
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
  };

  $scope.reg = function(){
    //console.log("<-log-> reg" + $scope.user.username + "," + $scope.user.password);
    // //console.log(localStorage.siteHost);
    $ionicLoading.show({
        noBackdrop:true,
        template: '正在登录...'
        });

    $scope.handletype = 2;

    if(!$scope.checkinput()){
      return;
    }

    $http.post(localStorage.siteHost+'?c=reg', $scope.user).
      success(function(data) {
        //console.log("<-log-> resp.error:" + data.error);

        $ionicLoading.hide();
        if(data.error == 1){     
            //console.log("<-log-> reg ok:" + data.uid);
  

            User.setuser(data.uid, $scope.user.username, $scope.user.password, data.usertype);
            localStorage['user'] = JSON.stringify(User.getuser());
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
        //console.log("<-log-> resp.status:" + status);
        $ionicPopup.alert({ template: '系统或网络异常，请稍候重试！' });
      });
  };

  $scope.tologin = function(){
    $scope.title = "登录";
    $scope.display_reg = "display:none";
    $scope.display_login = "display:block";
  }

  $scope.toreg = function(){
    $scope.title = "新人注册";
    $scope.display_reg = "display:block";
    $scope.display_login = "display:none";
  }

  $scope.checkinput = function(){
    if(!$scope.user.username || !$scope.user.password){
      $ionicPopup.alert({ template: '帐号密码填写有误，请检查后重新填写' });
      return false;
    }

    if($scope.handletype == 2){
      if(!$scope.user.email){
        $ionicPopup.alert({ template: '邮箱不能为空' });
        return false;
      }

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
.controller('AboutCtrl', function($scope, $http, $ionicPopup, User) {
  $scope.user = User.getuser();

  $scope.refresh = function(){
    $ionicPopup.alert({ template: '您已经是最新版本，不需要更新！' });
  }

})

// 关于
.controller('AboutAdviceCtrl', function($scope, $http, $ionicPopup, User) {
  $scope.user = User.getuser();

  $scope.advice = function(){
    $ionicPopup.alert({ template: '多谢您的反馈，我们一定及时处理！' });
  }

})

// 关于
.controller('AboutFindOutCtrl', function($scope, $http, $ionicPopup, User) {
  $scope.user = User.getuser();

  $scope.findout = function(){
    $ionicPopup.alert({ template: '多谢您的反馈，我们一定及时处理！' });
  }

})
;