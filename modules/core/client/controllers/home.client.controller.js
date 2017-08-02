(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController)
    .service("uploadService", function($http, $q) {

      return ({
        upload: upload
      });

      function upload(file) {
        var upl = $http({
          method: 'POST',
          url: 'http://jsonplaceholder.typicode.com/posts', // /api/upload
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: {
            upload: file
          },
          transformRequest: function(data, headersGetter) {
            var formData = new FormData();
            angular.forEach(data, function(value, key) {
              formData.append(key, value);
            });

            var headers = headersGetter();
            delete headers['Content-Type'];

            return formData;
          }
        });
        return upl.then(handleSuccess, handleError);

      } // End upload function

      // ---
      // PRIVATE METHODS.
      // ---

      function handleError(response, data) {
        if (!angular.isObject(response.data) ||!response.data.message) {
          return ($q.reject("An unknown error occurred."));
        }

        return ($q.reject(response.data.message));
      }

      function handleSuccess(response) {
        return (response);
      }

    })
    .directive("fileinput", [function() {
      return {
        scope: {
          fileinput: "=",
          filepreview: "="
        },
        link: function(scope, element, attributes) {
          element.bind("change", function(changeEvent) {
            scope.fileinput = changeEvent.target.files[0];
            var reader = new FileReader();
            reader.onload = function(loadEvent) {
              scope.$apply(function() {
                scope.filepreview = loadEvent.target.result;
              });
            }
            reader.readAsDataURL(scope.fileinput);
          });
        }
      }
    }])
    HomeController.$inject = ['$scope', '$http', 'uploadService'];
  function HomeController($scope, $http, uploadService) {
    var vm = this;
    $scope.$watch('file', function(newfile, oldfile) {
      if(angular.equals(newfile, oldfile) ){
        return;
      }
      uploadService.upload(newfile).then(function(res){
        // DO SOMETHING WITH THE RESULT!
        console.log("result", res);
      })
    });
    var canvas = new fabric.Canvas('myCanvas');
    var imgElement = document.getElementById('myImage');
    var imgInstance = new fabric.Image(imgElement, {
      left: 100,
      top: 100,
      angle: 30,
      opacity: 0.85
    });
    canvas.add(imgInstance);
  }
}());
