var freeChat = angular.module('freeChat', ['ngRoute', 'firebase']);

freeChat.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', { templateUrl: 'partials/home.html', controller: 'HomeController'}).
	when('/:chatRoom', {templateUrl: 'partials/chat-room.html', controller: 'ChatRoomController'}).
	otherwise({
		redirectTo: '/'
	});
}
]);

freeChat.controller('NavController', ['$scope', '$location', function($scope, $location) {
	$scope.isHomeActive = function() {
		if($location.path() === '/home') {
			return true;
		}
		return false;
	}
}]);

freeChat.controller('HomeController', ['$scope', '$firebase', '$location', function($scope, $firebase, $location){
	console.log($location);
	$scope.submitNewRoom = function() {
		var firebase = new Firebase('https://vieiralucas-freechat.firebaseio.com/');
		var newRoom = firebase.push();
		newRoom.set({title: $scope.newRoomTitle});
		$location.path('/' + newRoom.path.n[0]);
	}
}]);

freeChat.controller('ChatRoomController', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	var firebase = new Firebase("https://vieiralucas-freechat.firebaseio.com/" + $routeParams.chatRoom);
	$scope.color = "trolow";
	$scope.messages = [];
	firebase.on('child_added', function(content) {
		if(content.val().body) {
			$scope.messages.push(content.val());
		} else {
			$scope.title = content.val()
		}
		$scope.$apply();
		fitEverything();
	});
	$scope.submitMsg = function() {
		console.log($scope.newMsg);
		if($scope.nickname) {
			var newmsg = firebase.push();
			newmsg.set({user: $scope.nickname, body: $scope.newMsg, date: new Date().toUTCString(), color: $scope.color});
			$scope.newMsg = '';
			$('#form-nickname').removeClass('has-error');
		} else {
			$('#form-nickname').addClass('has-error');
		}
	}
}]);