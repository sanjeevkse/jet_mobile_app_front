'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$rootScope', '$translate', '$localStorage', '$window', 'appConstants', '$http', '$state', '$timeout', 'apiFactory',  
    function( $scope,   $rootScope, $translate,   $localStorage,   $window, appConstants, $http, $state, $timeout, apiFactory ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      if(isIE){ angular.element($window.document.body).addClass('ie');}
      if(isSmartDevice( $window ) ){ angular.element($window.document.body).addClass('smart')};

      if (angular.isDefined($localStorage.user) && $localStorage.user!='') {
        $rootScope.localStorageMemory = $localStorage.user;
      } else {
          $timeout(function() {
            $state.go('signin');
          }, 200);        
      }

      $rootScope.includes = $state.includes;
      $rootScope.timezone = moment.tz.guess(true);

      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // if(toState === $state.current) {
          $rootScope.toState = $state.current;
        // }
      });

      $http.defaults.headers.common.Timezone = $rootScope.timezone;

      var today = new Date();

      // config
      $scope.app = {
        name: 'Logistics Expert',
        shortClient: 'BBI', 
        client: 'Bluebridge International', 
        version: '1.0.2.60',
        copyRight: today.getFullYear(),
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        },
        companyName: 'Immenseline',
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // for box layout, add background image
        $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

      $scope.onClickLogout = function () {
        // bootbox.confirm({
        //   message: 'Are you sure want to Logout?',
        //   buttons: {
        //     confirm: {
        //       label: 'Yes',
        //       className: 'btn-success'
        //     },
        //     cancel: {
        //       label: 'No',
        //       className: 'btn-danger'
        //     }
        //   },
        //   callback: function (result) {
        //     if (!!result) {
              $http({
                method: 'PUT',
                url: appConstants.apiUrlBase + 'auth/logout' // appConstants.newApiUrl + '/public/auth/logout'
              }).then(function(retData) {
                delete $localStorage.user;
                $localStorage.user = '';
                $timeout(function() {
                  $state.go('signin');
                }, 500);
              });
        //     }
        //   }
        // });
      }


      $scope.$watch('localStorageMemory', function() {
        $localStorage.user = $rootScope.localStorageMemory;
        $http.defaults.headers.common.Authorization = $localStorage.user ? $localStorage.user.token : '';
      });
      $http.defaults.headers.common.Authorization = $localStorage.user ? $localStorage.user.token : '';

      $scope.$watch(function() {
          return angular.toJson($localStorage);
      }, function() {
          $rootScope.localStorageMemory = $localStorage.user;
      });

      $rootScope.exportAsPdf = function(argObj){

        let pdfHtml = '';
        var $frm = document.createElement('form');
        $frm.setAttribute('method', 'POST');
        $frm.setAttribute('action', appConstants.apiUrlBase + '../generate_pdf/generate_pdf.php');
        if(argObj.export_type == 'xls') {
            $frm.setAttribute('action', appConstants.apiUrlBase + '../generate_xlsx/export_to_xlsx_custom.ajax.php');
        }

        if (argObj.targetId) {
          pdfHtml = $('#' + argObj.targetId).html();
          var $bdy = document.createElement('input');
          $bdy.setAttribute('type', 'hidden');
          $bdy.setAttribute('name', 'body');
          $bdy.setAttribute('value', pdfHtml);
          $frm.appendChild($bdy);
        }
        if (argObj.custom_type) {
          pdfHtml = argObj.custom_type;
          var $bdy = document.createElement('input');
          $bdy.setAttribute('type', 'hidden');
          $bdy.setAttribute('name', 'custom_type');
          $bdy.setAttribute('value', pdfHtml);
          $frm.appendChild($bdy);
        }
        if (argObj.filters) {
          angular.forEach(Object.keys(argObj.filters), function(v, i) {
            var $el = document.createElement('input');
            $el.setAttribute('type', 'hidden');
            $el.setAttribute('name', v);
            $el.setAttribute('value', argObj.filters[v]);
            $frm.appendChild($el);
          });
        }

        if (argObj.printFor) {
          angular.forEach(Object.keys(argObj), function(v, i) {
            var $el = document.createElement('input');
            $el.setAttribute('type', 'hidden');
            $el.setAttribute('name', v);
            $el.setAttribute('value', argObj[v]);
            $frm.appendChild($el);
          });
        }

        // window.open('downloadProfile.php?usr='+, '_blank');

        $frm.setAttribute('target', '_blank');
        $frm.setAttribute('id', 'downloadProfile');

        var $hdr = document.createElement('input');
        $hdr.setAttribute('type', 'hidden');
        $hdr.setAttribute('name', 'header');
        $hdr.setAttribute('value', argObj.targetId);

        // var $fltrParams = document.createElement('input');
        // $fltrParams.setAttribute('type', 'hidden');
        // $fltrParams.setAttribute('name', 'fltrParams');
        // $fltrParams.setAttribute('value', JSON.stringify(argObj.filterParams));

        var $i_d = document.createElement('input');
        $i_d.setAttribute('type', 'hidden');
        $i_d.setAttribute('name', 'i_d');
        $i_d.setAttribute('value', 'I');

        // var $firm = document.createElement('input');
        // $firm.setAttribute('type', 'hidden');
        // $firm.setAttribute('name', 'firmName');
        // $firm.setAttribute('value', $rootScope.ngStorageData.firm.disp_name);

        // var $project = document.createElement('input');
        // $project.setAttribute('type', 'hidden');
        // $project.setAttribute('name', 'projectName');
        // $project.setAttribute('value', $rootScope.ngStorageData.project.disp_name);

        // var $tmz = document.createElement('input');
        // $tmz.setAttribute('type', 'hidden');
        // $tmz.setAttribute('name', 'timezoneZ');
        // $tmz.setAttribute('value', moment().tz(moment.tz.guess()).format('Z'));

        $frm.appendChild($hdr);
        $frm.appendChild($i_d);
        // $frm.appendChild($firm);
        // $frm.appendChild($project);
        // $frm.appendChild($fltrParams);

        document.getElementsByTagName('body')[0].appendChild($frm);
        $frm.submit();
        document.getElementsByTagName('body')[0].removeChild($frm);
        return false;
      }



  jQuery.extend( jQuery.fn.dataTableExt.oSort, {
      "date-uk-pre": function ( a ) {
          if (a == null || a == "") {
              return 0;
          }
          var ukDatea = a.split('-');
          return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
      },
   
      "date-uk-asc": function ( a, b ) {
          return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      },
   
      "date-uk-desc": function ( a, b ) {
          return ((a < b) ? 1 : ((a > b) ? -1 : 0));
      }
  } );

}]) 