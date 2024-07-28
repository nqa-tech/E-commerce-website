

function register() {
    var x = document.getElementById("login");
    var y = document.getElementById("register");
    var z = document.getElementById("btn");

    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "125px";
}
function login() {
    var x = document.getElementById("login");
    var y = document.getElementById("register");
    var z = document.getElementById("btn");

    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0px";
}
var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider.when("/home", {
        templateUrl: "/Home.html"
    })
        .when("/prod", {
            templateUrl: "/sanpham3.html"
        })
        .when("/news", {
            templateUrl: "/news.html"
        })
        .otherwise({
            redirectTo: "/home"
        });
});
app.run(function ($rootScope, $location) {
    $rootScope.shouldReload = false;
    $rootScope.$on('$routeChangeStart', function () {
        if (!$rootScope.shouldReload) {
            event.preventDefault();
        }
        $rootScope.shouldReload = false;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });
    $rootScope.$on('$routeChangeError', function () {
        $rootScope.loading = false;
        alert("Lỗi");
    });
});

app.controller("showButton", function ($scope) {
    $scope.showButtonAll = true;
    $scope.showButtonSmall = true;
    $scope.handleClick1 = function () {
        var element = document.getElementById("button-click");
        element.style.display = "none";
    };
    $scope.handleClick2 = function () {
        var element = document.getElementById("button-click");
        element.style.display = "flex";
    };
});
app.controller("prod", function ($scope, $http) {
    $scope.products = [];
    $scope.prodInfo =[];
    $http.get("/js/prod.json").then(function (response) {
        $scope.products = response.data;

        console.log($scope.products);
        $scope.prop = "";
        $scope.sortBy = function (prop) {
            $scope.prop = prop;
            console.log($scope.prop);
        };
        $scope.begin = 0;
        $scope.pageSize = 8;
        $scope.pageCount = Math.ceil($scope.products.length / $scope.pageSize);
        $scope.pages = new Array($scope.pageCount);
        for (let i = 0; i < $scope.pageCount; i++) {
            $scope.pages[i] = i + 1;
        }

        $scope.setPage = function (page) {
            $scope.begin = (page - 1) * $scope.pageSize;
        };

        $scope.first = function () {
            $scope.begin = 0;
        };
        $scope.prev = function () {
            if ($scope.begin > 0) {
                $scope.begin -= $scope.pageSize;
            }
        };
        $scope.next = function () {
            if ($scope.begin < ($scope.pageCount - 1) * $scope.pageSize) {
                $scope.begin += $scope.pageSize;
            }
        };
        $scope.last = function () {
            $scope.begin = ($scope.pageCount - 1) * $scope.pageSize;
        };

        $scope.showProductDetails = function (productId) {
            if ($scope.products.length === 0) {
                console.log('Không có sản phẩm.');
                return;
            }
        
            for (let i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i].id_prod === productId) {
                     $scope.prodInfo = [$scope.products[i]];
                    console.log('Thông tin sản phẩm:', $scope.showCart);
                    break; // Kết thúc vòng lặp khi đã tìm thấy
                }
            }
    
        };

    });

    app.filter("percentage", function ($filter) {
        return function (input, decimals) {
            return $filter("number")(input * 100, decimals) + "%";
        };
    });






    $scope.searchTerm = '';
    $scope.searchResults = [];
    $scope.onSearch = function () {
        if ($scope.searchTerm === '') {
            $scope.searchResults = [];
        } else {
            $scope.searchResults = $scope.products.filter(function (product) {
                return product.name.toLowerCase().includes($scope.searchTerm.toLowerCase());
            }).slice(0, 5);
        };
    }


    $scope.checkPasswordMatch = function () {
        $scope.frmBonus.txtPasswordConfirm.$setValidity('pattern', $scope.Password === $scope.confirmPassword);
    };
    var nextUserId = localStorage.getItem('nextUserId');

    if (!nextUserId) {
        nextUserId = 1;
    }
    $scope.dangky = function () {
        const user = {
            id: "user_" + nextUserId++,
            password: $scope.user.password,
            name: $scope.user.name_dk,
            email: $scope.user.email_dk,
        };
        localStorage.setItem('nextUserId', nextUserId);
        $http.post('http://localhost:3000/data', user)
            .then(function (response) {
                console.log('Dữ liệu đã được gửi và xử lý thành công.', response.data);
            })
            .catch(function (error) {
                console.error('Lỗi khi gửi dữ liệu:', error);
            });
    };
    $scope.login = function () {
        $scope.user = {};
        $scope.message = '';

        const user = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post('http://localhost:3000/data', user)
            .then(function (response) {
                $scope.message = 'Đăng nhập thành công.';
                console.log('Đăng nhập thành công.', response.data);
            })
            .catch(function (error) {
                $scope.message = 'Đăng nhập thất bại.';
                console.error('Đăng nhập thất bại:', error);
            });
    };
    $scope.cart = [];


    
    $scope.insert = function () {
        $scope.userData = [];
        $http.get('http://localhost:3000/data')
            .then(function (response) {
                $scope.userData = response.data.user;


                const card = {
                    cart_id: $scope.cart.length + 1,
                    id: $scope.userData[0].id,
                    id_prod: $scope.products[1].id_prod,
                    name_prod: $scope.products[1].name,
                    cpu: $scope.products[1].cpu,
                    ram: $scope.products[1].ram,
                    image: $scope.products[1].image,
                    quantity: 1,
                    price: $scope.products[1].price,
                    amount: $scope.getAmount(),
                    status: "Chưa thanh toán"
                };
                return $http.post('http://localhost:3000/card', card);

            })
            .then(function (response) {
                console.log('Dữ liệu đã được gửi và xử lý thành công.', response.data);


            })
            .catch(function (error) {
                console.error('Lỗi khi lấy hoặc gửi dữ liệu:', error);
            });

    };

    $scope.deleteCartItem = function (cartItem, index) {
        if (!cartItem) {
            console.error('CartItem không hợp lệ.');
            return;
        }


        if (cartItem.status === "Chưa thanh toán") {
        const cartId = cartItem.cart_id;
            console.log(cartId);
            fetch(`http://localhost:3000/deleteCard/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Lỗi mạng');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Dữ liệu đã được xóa và cập nhật thành công.', data);



                    $scope.load(); 
                })
                .catch(error => {
                    console.error('Lỗi khi xóa dữ liệu:', error);
                });
        }
        else {
            console.log('Không xóa vì "status" không phải là "Chưa thanh toán".');
        }
    };

    $scope.updateCard = function () {
        const updatePromises = [];
    
        // Iterate through each product in the cart
        for (let i = 0; i < $scope.cart.length; i++) {
            // Check if the status is "Chưa thanh toán"
            if ($scope.cart[i].status === 'Chưa thanh toán') {
                console.log( $scope.cart[i].cart_id)
                const data = {
                    cart_id:$scope.cart[i].cart_id,
                    productId: $scope.cart[i].id_prod,
                    quantity: $scope.quantity,
                    status: 'Đã thanh toán'
                };
    
                // Push the promise returned by $http.put into the updatePromises array
                updatePromises.push($http.put('http://localhost:3000/updateCard', data));
            }
        }
    
        $scope.load(); 

        Promise.all(updatePromises)
            .then(function (responses) {
                console.log('Dữ liệu card đã được cập nhật thành công.', responses);
            })
            .catch(function (error) {
                console.error('Lỗi khi cập nhật dữ liệu card:', error);
            });
    };
    



    $scope.quantity = 1;
    $scope.getAmount = function () {
        var amount = 0;
        amount += $scope.products[1].price * $scope.quantity;

        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    $scope.load = function () {
        $http.get('http://localhost:3000/data')
            .then(function (response) {
                $scope.cart = response.data.card;

                const allItemsPaid = $scope.cart.every(item => item.status === "Đã thanh toán");

                if ($scope.cart.length === 0 || allItemsPaid) {
                    $scope.showCart = false;
                } else {
                    $scope.showCart = true;
                }

                console.log($scope.cart);
            })
            .catch(function (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            });
    };

    $scope.load();


});



