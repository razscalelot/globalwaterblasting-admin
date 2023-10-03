app.controller("contactusController", ($scope, $http, HelperService) => {
    $scope.contactus = {};
    $scope.getContactus = function () {
        let request = { page: $scope.page, limit: $scope.limit, search: $scope.search };
        $http({
            url: BASE_URL + 'contactus/list',
            method: "POST",
            data: request,
            cache: false,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.contactus = response.data.Data;
                    $scope.pageNumberList = HelperService.paginator($scope.contactus.totalPages, $scope.page, 9);
                }
            },
            function (error) {
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
    $scope.getContactus();

    $scope.onSearch = () => {
        if ($scope.search.length > 2 || $scope.search.length == 0) {
            $scope.page = 1;
            $scope.getContactus();
        }
    }

    $scope.switchPage = (n) => {
        $scope.page = n;
        $scope.getContactus();
    }
});
