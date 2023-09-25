app.controller("serviceController", ($scope, $http,) => {
    $scope.serviceFile = null;
    $scope.service_image = "";
    $scope.fileSelectedservice = (input) => {
        $scope.serviceFile = null;
        if (input.files && input.files[0]) {
            var filename = input.files[0].name;
            var valid_extensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG)$/i;
            if (valid_extensions.test(filename)) {
                $(input.files).each(function () {
				    $scope.serviceFile = input.files[0];
					$scope.serviceFileUploader();
				});
            } else {
				swal("", 'Invalid File Format, Valid Format is .jpg .png .jpeg !', "error");
			}
        }
    };
    $scope.serviceFileUploader = () => {
        if ($scope.serviceFile != null) {
			let formData = new FormData();
			formData.append("image", $scope.serviceFile);
			$http({
                url: BASE_URL + "create/image",
				method: "POST",
				data: formData,
				transformRequest: angular.identity,
				headers: { "Content-Type": undefined, "Process-Data": false, },
			}).then(
				function (response) {
					if (response.data.IsSuccess == true) {
						if(response.data.Data){
                            $scope.service_image = response.data.Data;
                        }else{
                            swal("", 'Some-thing went wrong while uploading the file! Please try again', "error");
                        }
					}
				}, function (error) {
					console.error(error);
				}
			);
		}
    };
    $scope.createService = function () {
        var formData = new FormData();
        formData.append('servicename', $scope.servicename);
        formData.append('image', $scope.image);
        formData.append('banner', $scope.banner);
        formData.append('longdesc', $scope.longdesc);
        formData.append('before', $scope.before);
        formData.append('after', $scope.after);
        formData.append('title', $scope.title);
        formData.append('longdesc1', $scope.longdesc1);
        formData.append('ptitle', $scope.ptitle);
        formData.append('desc', $scope.desc);
        $http({
            url: BASE_URL + 'create',
            method: "POST",
            data: formData,
            transformRequest: angular.identity,
			headers: {'Content-Type': undefined },
        }).then(
            function (response) {
                console.log("response", response);
            },
            function (error) {
                $('#loadingdiv').hide();
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
});
