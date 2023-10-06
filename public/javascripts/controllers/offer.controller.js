app.controller("offerController", ($scope, $http, HelperService) => {
    $scope.offers = {};
    $scope.getOffer = function () {
        let request = { page: $scope.page, limit: $scope.limit, search: $scope.search, isDelete: $scope.isDelete, teammember: $scope.teammember, tags: $scope.selectedTags };
        $http({
            url: BASE_URL + 'offer/list',
            method: "POST",
            data: request,
            cache: false,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.offers = response.data.Data;
                    $scope.pageNumberList = HelperService.paginator($scope.offers.totalPages, $scope.page, 9);
                }
            },
            function (error) {
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
    $scope.getOffer();

    $scope.onSearch = () => {
        if ($scope.search.length > 2 || $scope.search.length == 0) {
            $scope.page = 1;
            $scope.getOffer();
        }
    }

    $scope.switchPage = (n) => {
        $scope.page = n;
        $scope.getContactus();
    }
});
