'use strict';

/**
 * Login controller.
 */
angular.module('docs').controller('Login', function (Restangular, $scope, $rootScope, $state, $stateParams, $dialog, User, $translate, $uibModal) {
  $scope.codeRequired = false;

  // Get the app configuration
  Restangular.one('app').get().then(function (data) {
    $rootScope.app = data;
  });

  // Login as guest
  $scope.loginAsGuest = function () {
    $scope.user = {
      username: 'guest',
      password: ''
    };
    $scope.login();
  };

  // Login
  $scope.login = function () {
    User.login($scope.user).then(function () {
      User.userInfo(true).then(function (data) {
        $rootScope.userInfo = data;
      });

      if ($stateParams.redirectState !== undefined && $stateParams.redirectParams !== undefined) {
        $state.go($stateParams.redirectState, JSON.parse($stateParams.redirectParams))
          .catch(function () {
            $state.go('document.default');
          });
      } else {
        $state.go('document.default');
      }
    }, function (data) {
      if (data.data.type === 'ValidationCodeRequired') {
        // A TOTP validation code is required to login
        $scope.codeRequired = true;
      } else {
        // Login truly failed
        var title = $translate.instant('login.login_failed_title');
        var msg = $translate.instant('login.login_failed_message');
        var btns = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary' }];
        $dialog.messageBox(title, msg, btns);
      }
    });
  };

  // Password lost
  $scope.openPasswordLost = function () {
    $uibModal.open({
      templateUrl: 'partial/docs/passwordlost.html',
      controller: 'ModalPasswordLost'
    }).result.then(function (username) {
      if (username === null) {
        return;
      }

      // Send a password lost email
      Restangular.one('user').post('password_lost', {
        username: username
      }).then(function () {
        var title = $translate.instant('login.password_lost_sent_title');
        var msg = $translate.instant('login.password_lost_sent_message', { username: username });
        var btns = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary' }];
        $dialog.messageBox(title, msg, btns);
      }, function () {
        var title = $translate.instant('login.password_lost_error_title');
        var msg = $translate.instant('login.password_lost_error_message');
        var btns = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary' }];
        $dialog.messageBox(title, msg, btns);
      });
    });
  };

  // 注册
  $scope.register = function () {
    console.log('Register 开始执行注册操作');

    User.register($scope.user).then(function (response) {
      console.log('Register 注册成功，服务器响应:', response.data);

      var title = '成功';
      var msg = '请等待管理员批准，批准后即可登录';
      var btns = [{ result: 'ok', label: '确定', cssClass: 'btn-primary' }];
      $dialog.messageBox(title, msg, btns).result.then(function () {
        console.log('Register 用户点击 确定，准备跳转至登录页面');
        $state.go('login');
      });
    }, function (error) {
      console.error('Register 注册失败，错误信息:', error);

      var title = '失败';
      var msg = '注册失败';
      var btns = [{ result: 'ok', label: '确定', cssClass: 'btn-primary' }];
      $dialog.messageBox(title, msg, btns);
    });
  };
});