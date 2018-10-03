$(document).ready(function() {
	$(document.body).css({"background-color":"black","font-family":"lato"});
	$(document.body).show();
	updateAuthenticationStatus();
});

$('#read_policy').click(function(e){
	$('#read_policy').tooltip({title: "salam", animation: true});
});

$('#login').click(function(e){
	e.preventDefault();
	window.location = '/login.html';
});

$('#logout').click(function(e){
	e.preventDefault();
	// var uname = localStorage.getItem('uname');
	try{
		var courses = localStorage.getItem('courses');
		var mycourses = JSON.parse(courses);

		for (i = 0; i < mycourses.length; i++) {
			$("#" + mycourses[i] + "_purchased").hide();
			$("#" + mycourses[i] + "_available").show();
		}

	  //THIS PIECE OF CODE (INCOMPLETE) IS INTENDED TO ENSURE EACH EMAIL ADDRESS IS USED WITH ONE COMPUTER AT A TIME AND NOT MANY//

	  // var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
	  //   UserPoolId : 'us-east-1_c7stEg2jO',
	  //   ClientId : '69f3rvid78ok4e68rpi9fsk1d4'
	  // });

	  // var cognitoUser = userPool.getCurrentUser();

	  // if (cognitoUser != null) {
	  //   cognitoUser.getSession(function(err, session) {
	  //       if (err) {
	  //          console.log(err);
	  //           return;
	  //       }
	  //       console.log('session validity: ' + session.isValid());

	  //       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	  //           IdentityPoolId : 'us-east-1_c7stEg2jO',
	  //           Logins : {
	  //               'cognito-idp.us-east-1.amazonaws.com/us-east-1_c7stEg2jO' : session.getIdToken().getJwtToken()
	  //           }
	  //       })
	  //   });
	  // }

	  // cognitoUser.globalSignOut();
	  // MAIN IDEA IS THAT PEOPLE CANNOT SIGN IN AT THE SAME TIME VIA TWO OR MORE VARIOUS DEVICES. 

		localStorage.clear();
		// document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
		updateAuthenticationStatus();
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});

function updateAuthenticationStatus(){
	
	const err = 'error';
	var user = JSON.parse(localStorage.getItem('token'));

	if(user){
		var courses = localStorage.getItem('courses');
		var mycourses = JSON.parse(courses);
		for (i = 0; i < mycourses.length; i++) {
		// $(`#${mycourses[i]}_purchased`).show();
		// $(`#${mycourses[i]}_available`).hide(); 
		// This is next gen JS, for rendering in IE11, I need to use prev gen stuff
			$("#" + mycourses[i] + "_purchased").show();
			$("#" + mycourses[i] + "_available").hide();

		}
		var name = localStorage.getItem('name');
		name = name.replace(/^"(.*)"$/, '$1');
		hi = "Hello ";
		exclamation = "!";
		greeting = hi.concat(name, exclamation, "&nbsp;&nbsp;");
		$('#profile-name').html(greeting);
		$('#logout').show();
		$('#login').hide();
		return user
	} 
	else {
		$('#profile-name').hide();
		$('#logout').hide();
		$('#login').fadeIn();
		return err
	}
};

window.addEventListener('popstate', function() {
	handlerGED.close();
  	handlerSAT.close();
  	handlerACT.close();
	handlerGRE.close();
	handlerGMAT.close();
	//handlerPSAT.close();
	//handlerSATII.close();

});

var handlerGED = StripeCheckout.configure({
	key: 'pk_live_nyo1BAszKrLS7UgZvRuBgsiI',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_ged').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem('uname');
		const course_ged = 'ged';
		$.ajax({
			url: "https://uox3l0dl25.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_2",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
			Authorization : auth
			},
			success: function() {
				var date = new Date();
				bootpopup.alert("Thank you for your purchase! Now, navigate to the 'GED' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_ged, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
								}
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_ged').button('reset');
							},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_ged').button('reset');
							},
							type: 'GET'
						});          
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_ged').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_ged').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_ged').click(function(e){
	e.preventDefault();

	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
			"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
			"<b>(B)</b> Your purchase gives you access to the 'GED Module' which includes:</br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
			"<b>(C)</b> Your will have access to the GED module is for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
		  	"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
				if (span>3600000){
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
						$("#" + mycourses[i] + "_purchased").hide();
						$("#" + mycourses[i] + "_available").show();
					}
					localStorage.clear();
					bootpopup.alert('Your session has expired. Please sign in again.');
					updateAuthenticationStatus();
				} 
				else {
					e.preventDefault();
						handlerGED.open({
							name: 'ZeroToHeroMath',
							description: 'GED Module',
							amount: 995
						});
				} 
			}
			else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});

var handlerSAT = StripeCheckout.configure({
	key: 'pk_live_nyo1BAszKrLS7UgZvRuBgsiI',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_sat').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem("uname");
		const course_sat = "sat";
		$.ajax({
			url: "https://uox3l0dl25.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_2",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
				Authorization : auth
			},
			success: function() {
				var date = new Date();
				bootpopup.alert("Thank you for your purchase! Now, navigate to the 'SAT' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_sat, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
							    }
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_sat').button('reset');
					  		},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_sat').button('reset');
							},
							type: 'GET'
						});         
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_sat').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_sat').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_sat').click(function(e){
	e.preventDefault();
	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
			"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
			"<b>(B)</b> Your purchase gives you access to the 'GED Module' which includes:</br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
			"<b>(C)</b> Your will have access to the GED module is for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
		  	"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
				if (span>3600000){
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
						$("#" + mycourses[i] + "_purchased").hide();
						$("#" + mycourses[i] + "_available").show();
					}
					localStorage.clear();
					bootpopup.alert('Your session has expired. Please sign in again.');
					updateAuthenticationStatus();
				} 
				else {
					e.preventDefault();
					handlerSAT.open({
						name: 'ZeroToHeroMath',
						description: 'SAT Module',
						amount: 995
					});
				} 
			}
			else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});

//ACT//

var handlerACT = StripeCheckout.configure({
	key: 'pk_live_nyo1BAszKrLS7UgZvRuBgsiI',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_act').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem('uname');
		const course_act = 'act';
		$.ajax({
			url: "https://uox3l0dl25.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_2",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
				Authorization : auth
			},
			success : function() {
				var date = new Date();
				bootpopup.alert("Thank you for your purchase! Now, navigate to the 'ACT' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_act, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
								}
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_act').button('reset');
							},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_act').button('reset');
							},
							type: 'GET'
						});          
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_act').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_act').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_act').click(function(e){
	e.preventDefault();
	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
			"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
			"<b>(B)</b> Your purchase gives you access to the 'GED Module' which includes:</br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
			"<b>(C)</b> Your will have access to the GED module is for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
			"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
				if (span>3600000){
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
						$("#" + mycourses[i] + "_purchased").hide();
						$("#" + mycourses[i] + "_available").show();
					}
					localStorage.clear();
					bootpopup.alert('Your session has expired. Please sign in again.');
					updateAuthenticationStatus();
				} 
				else {
					e.preventDefault();
					handlerACT.open({
						name: 'ZeroToHeroMath',
						description: 'ACT Module',
						amount: 995
					});
				} 
			}
			else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});

var handlerGRE = StripeCheckout.configure({
	key: 'pk_live_nyo1BAszKrLS7UgZvRuBgsiI',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_gre').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem('uname');
		const course_gre = 'gre';
		$.ajax({
		    url: "https://izoxz36rel.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_tutoring",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
				Authorization : auth
			},
			success : function() {
				var date = new Date();
				bootpopup.alert("Thank you for your purchase! Now, navigate to the 'GRE' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_gre, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
								}
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_gre').button('reset');
							},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_gre').button('reset');
							},
							type: 'GET'
						});          
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_gre').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_gre').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_gre').click(function(e){
	e.preventDefault();
	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
			"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
			"<b>(B)</b> Your purchase gives you access to the 'GED Module' which includes:</br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
			"<b>(C)</b> Your will have access to the GED module is for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
			"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
				if (span>3600000){
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
						$("#" + mycourses[i] + "_purchased").hide();
						$("#" + mycourses[i] + "_available").show();
					}
				localStorage.clear();
				bootpopup.alert('Your session has expired. Please sign in again.');
				updateAuthenticationStatus();
				} 
				else {
					e.preventDefault();
					handlerGRE.open({
						name: 'ZeroToHeroMath',
						description: 'GRE Module',
						amount: 1295
					});
				} 
			}
			else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});

var handlerGMAT = StripeCheckout.configure({
	key: 'pk_live_nyo1BAszKrLS7UgZvRuBgsiI',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_gmat').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem('uname');
		const course_gmat = 'gmat';
		$.ajax({
     		url: "https://izoxz36rel.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_tutoring",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
				Authorization : auth
			},
			success : function() {
				var date = new Date();
				bootpopup.alert("Thank you for your purchase! Now, navigate to the 'GMAT' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_gmat, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
								}
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_gmat').button('reset');
							},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_gmat').button('reset');
							},
							type: 'GET'
						});          
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_gmat').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_gmat').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_gmat').click(function(e){
	e.preventDefault();
	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
			"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
			"<b>(B)</b> Your purchase gives you access to the 'GED Module' which includes:</br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
			"<b>(C)</b> Your will have access to the GED module is for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
		  	"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
				if (span>3600000){
					bootpopup.alert("Your session has expired. Please sign in again.")
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
						$("#" + mycourses[i] + "_purchased").hide();
						$("#" + mycourses[i] + "_available").show();
					}
					localStorage.clear();
					bootpopup.alert('Your session has expired. Please sign in again.');
					updateAuthenticationStatus();
				} 
				else {
					e.preventDefault();
					handlerGMAT.open({
						name: 'ZeroToHeroMath',
						description: 'GMAT Module',
						amount: 1295
					});
				} 
			}
			else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});

/*

//PSAT//

var handlerPSAT = StripeCheckout.configure({
	key: 'pk_test_ZZgTqKtKdVFJsw2HDySvhmrJ',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_psat').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem('uname');
		const course_psat = 'psat';
		$.ajax({
			url: "https://uox3l0dl25.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_2",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
				Authorization : auth
			},
			success: function() {
			var date = new Date();
			bootpopup.alert("Thank you for your purchase! Now, navigate to the 'PSAT' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_psat, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
								}
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_psat').button('reset');
							},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_psat').button('reset');
							},
							type: 'GET'
						});          
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_psat').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_psat').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_psat').click(function(e){
	e.preventDefault();
	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
		"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
		"<b>(B)</b> Your purchase gives you access to the 'PSAT Module' which includes:</br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>4)</b></br>",
		"<b>(C)</b> Your will have access to the module for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
		"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
					if (span>3600000){
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
						$("#" + mycourses[i] + "_purchased").hide();
						$("#" + mycourses[i] + "_available").show();
					}
					localStorage.clear();
					bootpopup.alert('Your session has expired. Please sign in again.');
					updateAuthenticationStatus();
				} 
				else {
					e.preventDefault();
					handlerPSAT.open({
						name: 'ZeroToHeroMath',
						description: 'PSAT Module',
						amount: 200
					});
				} 
			} else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});

////////////////////////////////////////////////////////////////////////////SAT II

var handlerSATII = StripeCheckout.configure({
	key: 'pk_test_ZZgTqKtKdVFJsw2HDySvhmrJ',
	image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
	locale: 'auto',
	allowRememberMe: false,
	token: function(token) {
		$('#purchase_satii').button('loading');
		const auth = updateAuthenticationStatus();
		const username = localStorage.getItem('uname');
		const course_satii = 'satii';
		$.ajax({
			url: "https://uox3l0dl25.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_2",
			data: {stripeToken: token.id, stripeEmail: token.email},
			dataType: 'html',
			headers: {
				Authorization : auth
			},
			success: function() {
				var date = new Date();
				bootpopup.alert("Thank you for your purchase! Now, navigate to the 'SAT II' tab and watch the orientation video before you begin.");
				$.ajax({
					url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
					data:  {userName : username, course : course_satii, month : date.getMonth()+1, year : date.getFullYear()},
					contentType:"application/json",
					dataType: 'json',
					success: function(data) {
						$.ajax({
							url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
							data: {userName : username},
							dataType: 'json',
							success: function(data) {
								var AuthenticatedUser = JSON.parse(data.body);
								var allcourses = AuthenticatedUser.courses.values;
								for (i = 0; i < allcourses.length; i++) {
									$("#" + allcourses[i] + "_purchased").show();
									$("#" + allcourses[i] + "_available").hide();
								}
								localStorage.setItem("courses",JSON.stringify(allcourses));
								$('#purchase_satii').button('reset');
							},
							error: function(){
								bootpopup.alert("Something must have gone wrong. Please try again.");
								$('#purchase_satii').button('reset');
							},
							type: 'GET'
						});          
					},
					error: function(){
						bootpopup.alert("Something must have gone wrong. Please try again.");
						$('#purchase_satii').button('reset');
					},
					type: 'POST'
				});
			},
			error: function(){
				bootpopup.alert("Something must have gone wrong. Please try again.");
				$('#purchase_satii').button('reset');
			},
			type: 'POST'
		});
	}
});

$('#purchase_satii').click(function(e){
	e.preventDefault();

	bootpopup({
		title: "<h3>Terms and Conditions</h3>",
		content: [
		"<b>(A)</b> All rights reserved. Any use of the material, including but not limited to copying or redistributing the material, requires explicit permission in writing. </br>",
		"<b>(B)</b> Your purchase gives you access to the 'GED Module' which includes:</br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>1)</b></br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>2)</b></br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>3)</b></br>",
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>4)</b></br>",
		"<b>(C)</b> Your will have access to the GED module is for <b>1 year</b>. If you wish to regain access, you must repurchase the module.</br></br>",
		"<b> Do you agree with the terms and conditions? </b>"
		],
		cancel: function() {},
		yes: function() {
			const auth = updateAuthenticationStatus();
			if (auth != 'error') {
				var then = JSON.parse(localStorage.getItem('timeStamp'));
				var now = new Date().getTime().toString();
				var span = now - then;
				if (span>3600000){
					var courses = localStorage.getItem('courses');
					var mycourses = JSON.parse(courses);
					for (i = 0; i < mycourses.length; i++) {
					$("#" + mycourses[i] + "_purchased").hide();
					$("#" + mycourses[i] + "_available").show();
					}
					localStorage.clear();
					bootpopup.alert('Your session has expired. Please sign in again.');
					updateAuthenticationStatus();
				} else {
					e.preventDefault();
					handlerSATII.open({
						name: 'ZeroToHeroMath',
						description: 'SAT II Module',
						amount: 200
					});
				} 
			} else {
				bootpopup.alert("Please sign in to access content.");
			}
		},
	});
});
*/
// After Purchase - Go to course

$('#gotocourse_ged').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var span = now - then;
		var session_length = 24*3600*1000;
		if (span>session_length){
			var courses = localStorage.getItem('courses');
			var mycourses = JSON.parse(courses);
			for (i = 0; i < mycourses.length; i++) {
			    $("#" + mycourses[i] + "_purchased").hide();
			    $("#" + mycourses[i] + "_available").show();
			}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		}
		else {
			$('#gotocourse_ged').button('loading');
			const auth = updateAuthenticationStatus();
			const crs = 'ged';
			const username = localStorage.getItem('uname');

			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if (response.body == '1'){
						window.location = 'https://ged.zerotoheromath.com';
						setTimeout(function(){
							$('#gotocourse_ged').button('reset');
						},500)				
					}
					else if (response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.');
						$('#gotocourse_ged').button('reset');
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this to be a mistake, please contact us for further assistance.");
						$('#gotocourse_ged').button('reset');
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.");
					$('#gotocourse_ged').button('reset');
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});


$('#gotocourse_sat').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var span = now - then;
		var session_length = 24*3600*1000;
		if (span>session_length){
			var courses = localStorage.getItem('courses');
			var mycourses = JSON.parse(courses);
			for (i = 0; i < mycourses.length; i++) {
			    $("#" + mycourses[i] + "_purchased").hide();
			    $("#" + mycourses[i] + "_available").show();
			}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		} 
		else {
			$('#gotocourse_sat').button('loading');
			const auth = updateAuthenticationStatus();
			const crs = 'sat';
			const username = localStorage.getItem('uname');

			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if (response.body == '1'){
						window.location = 'https://sat.zerotoheromath.com';
						setTimeout(function(){
							$('#gotocourse_sat').button('reset');
						},500)
					}
					else if (response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.');
						$('#gotocourse_sat').button('reset');
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this is a mistake, please contact us for further assistance.");
						$('#gotocourse_sat').button('reset');
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.");
					$('#gotocourse_sat').button('reset');
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});

$('#gotocourse_act').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var span = now - then;
		var session_length = 24*3600*1000;
		if (span>session_length){
			var courses = localStorage.getItem('courses');
			var mycourses = JSON.parse(courses);
			for (i = 0; i < mycourses.length; i++) {
			    $("#" + mycourses[i] + "_purchased").hide();
			    $("#" + mycourses[i] + "_available").show();
			}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		}  
		else 
		{
			$('#gotocourse_act').button('loading');
			const auth = updateAuthenticationStatus();
			const crs = 'act';
			const username = localStorage.getItem('uname');
			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if(response.body == '1'){
						window.location = 'https://act.zerotoheromath.com';
						setTimeout(function(){
							$('#gotocourse_act').button('reset');
						},500)
					}
					else if(response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.');
						$('#gotocourse_act').button('reset');
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this is a mistake, please contact us for further assistance.");
						$('#gotocourse_act').button('reset');
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.");
					$('#gotocourse_act').button('reset');
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});

$('#gotocourse_gre').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var span = now - then;
		var session_length = 24*3600*1000;
		if (span>session_length){
			var courses = localStorage.getItem('courses');
			var mycourses = JSON.parse(courses);
			for (i = 0; i < mycourses.length; i++) {
			    $("#" + mycourses[i] + "_purchased").hide();
			    $("#" + mycourses[i] + "_available").show();
				}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		} 
		else 
		{
			$('#gotocourse_gre').button('loading');
			const auth = updateAuthenticationStatus();
			const crs = 'gre';
			const username = localStorage.getItem('uname');
			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if(response.body == '1'){
						window.location = 'https://gre.zerotoheromath.com';
						setTimeout(function(){
							$('#gotocourse_gre').button('reset');
						},500)
					}
					else if(response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.');
						$('#gotocourse_gre').button('reset');
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this is a mistake, please contact us for further assistance.");
						$('#gotocourse_gre').button('reset');
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.");
					$('#gotocourse_gre').button('reset');
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});

$('#gotocourse_gmat').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var session_length = 24*3600*1000;
		var span = now - then;
		if (span>session_length){
			var courses = localStorage.getItem('courses');
			var mycourses = JSON.parse(courses);
			for (i = 0; i < mycourses.length; i++) {
				$("#" + mycourses[i] + "_purchased").hide();
				$("#" + mycourses[i] + "_available").show();
			}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		} 
		else {
			$('#gotocourse_gmat').button('loading');
			const auth = updateAuthenticationStatus();
			const crs = 'gmat';
			const username = localStorage.getItem('uname');

			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if(response.body == '1'){
						window.location = 'https://gmat.zerotoheromath.com';
						setTimeout(function(){
							$('#gotocourse_gmat').button('reset');
						},500)
					}
					else if(response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.');
						$('#gotocourse_gre').button('reset');
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this is a mistake, please contact us for further assistance.");
						$('#gotocourse_gre').button('reset');
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.");
					$('#gotocourse_gre').button('reset');
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});

/*$('#gotocourse_psat').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var span = now - then;
		if (span>3600000){
			var courses = localStorage.getItem('courses');
			var mycourses = JSON.parse(courses);
			for (i = 0; i < mycourses.length; i++) {
				$("#" + mycourses[i] + "_purchased").hide();
				$("#" + mycourses[i] + "_available").show();
			}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		} 
		else {
			const auth = updateAuthenticationStatus();
			const crs = 'psat';
			const username = localStorage.getItem('uname');

			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if(response.body == '1'){
						// window.location = 'http://d3gzqmg1j5n50t.cloudfront.net';
					}
					else if(response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.')
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this is a mistake, please contact us for further assistance.")
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.")
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});

$('#gotocourse_satii').click(function(e){
	try{
		var then = JSON.parse(localStorage.getItem('timeStamp'));
		var now = new Date().getTime().toString();
		var span = now - then;
		if (span>3600000){
		var courses = localStorage.getItem('courses');
		var mycourses = JSON.parse(courses);
		for (i = 0; i < mycourses.length; i++) {
			$("#" + mycourses[i] + "_purchased").hide();
			$("#" + mycourses[i] + "_available").show();
		}
			localStorage.clear();
			bootpopup.alert('Your session has expired. Please sign in again.');
			updateAuthenticationStatus();
		} 
		else {
		  const auth = updateAuthenticationStatus();
		  const crs = 'satii';
		  const username = localStorage.getItem('uname');
			$.ajax({
				url:'https://efzh3l0k7f.execute-api.us-east-1.amazonaws.com/dev/geturl',
				data: {userName : username, course : crs},
				contentType:"application/json",
				dataType: "json",
				success: function(data) {
					var response = JSON.parse(data);

					if(response.body == '1'){
						// window.location = 'http://d3gzqmg1j5n50t.cloudfront.net';
					}
					else if(response.body == '0'){
						bootpopup.alert('You do not have or have lost access to this contact. Please contact us for further assistance.')
					}
					else {
						bootpopup.alert("You appear not to be registered for this course. If you believe this is a mistake, please contact us for further assistance.")
					}
				},
				error: function(){
					bootpopup.alert("Something went wrong. Please try again. If this problem persists, please contact us for further assistance.")
				},
				type: 'POST'
			});
		}
	}
	catch(err){
		window.location = "https://zerotoheromath.com";
	}
});*/



//TUTORING//

/*$('#terms').click(function(e){
	e.preventDefault();
  bootpopup({
  title: "Terms and Conditions",
  content: [
      { p: {text: "Terms and conditions:"}},
      { p: {text: "(1) Your session is 90 minutes long and will take place on Google Hangouts."}},
      { p: {text: "(2) Your may only sign up for one session at a time. Subsequent sessions can be booked following the first session."}},
      { p: {text: "(3) You may only use the email address associated with your account to communicate with your tutor. Emails received from unknown addresses are discarded."}},
 ],
  ok: function() {}
  });
});

var handlerTUT = StripeCheckout.configure({
  key: 'pk_test_ZZgTqKtKdVFJsw2HDySvhmrJ',
  image: 'https://s3.amazonaws.com/zerotoheropublicmis/stripeLogo.png',
  locale: 'auto',
  allowRememberMe: false,
  token: function(token) {
    $('#purchase_tut').button('loading');
    const auth = updateAuthenticationStatus();
    const username = localStorage.getItem("uname");
    const course_tut = 'tut';
  $.ajax({
     url: "https://izoxz36rel.execute-api.us-east-1.amazonaws.com/dev/stripe_pay_tutoring",
     data: {stripeToken: token.id, stripeEmail: token.email},
     dataType: 'html',
     headers: {
      Authorization : auth
     },
     success: function() {
        bootpopup.alert("Thank you for purchasing a session of tutoring! Now, click on the 'Private Tutoring' tab to watch the orientation video.");
        $.ajax({
          url: 'https://kgkz9ly6nd.execute-api.us-east-1.amazonaws.com/dev/postcourse',
          data:  {userName : username, course : course_tut},
          contentType:"application/json",
          dataType: 'json',
          success: function(data) {
            $.ajax({
              url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses',
              data: {userName : username},
              dataType: 'json',
           	  success: function(data) {
                var AuthenticatedUser = JSON.parse(data.body);
                var allcourses = AuthenticatedUser.courses.values;
                for (i = 0; i < allcourses.length; i++) {
                  $("#" + allcourses[i] + "_purchased").show();
                  $("#" + allcourses[i] + "_available").hide();
                }
                localStorage.setItem("courses",JSON.stringify(allcourses));
                $('#purchase_tut').button('reset');
                $.ajax({
  	              url: 'https://4nsr3ek8sb.execute-api.us-east-1.amazonaws.com/dev/sns-tutoring',
                	  data: {userName : username},
                	  dataType: 'json',
  	           	  success: function(data) {
  	              	console.log('email-sent');
  	              },
                  error: function(){
                    bootpopup.alert("Something must have gone wrong. Please try again.");
                    $('#purchase_ged').button('reset');
                  },
  	              type: 'GET'
  	            });
              },
              error: function(){
                bootpopup.alert("Something must have gone wrong. Please try again.");
                $('#purchase_ged').button('reset');
              },
              type: 'GET'
            });          
          },
          error: function(){
            bootpopup.alert("Something must have gone wrong. Please try again.");
            $('#purchase_ged').button('reset');
          },
          type: 'POST'
        });
      },
      error: function(){
        bootpopup.alert("Something must have gone wrong. Please try again.");
        $('#purchase_ged').button('reset');
      },
      type: 'POST'
    });
  }
});

$('#purchase_tut').click(function(e){
  e.preventDefault();

  bootpopup({
  title: "Terms and Conditions",
  content: [
      { p: {text: "(1) Your session is 90 minutes long and will take place on Google Hangouts."}},
      { p: {text: "(2) Your may only sign up for one session at a time. Subsequent sessions can be booked following the first session."}},
      { p: {text: "(3) You may only use the email address associated with your account to communicate with your tutor. Emails received from unknown addresses are discarded."}},
      { p: {text: "Would you like to sign up for one session of tutoring?"}}
 ],
    cancel: function() {},
    ok: function() {
         const auth = updateAuthenticationStatus();
         if (auth != 'error') {
           var then = JSON.parse(localStorage.getItem('timeStamp'));
           var now = new Date().getTime().toString();
           var span = now - then;
           if (span>3600000){
            var courses = localStorage.getItem('courses');
            var mycourses = JSON.parse(courses);
            for (i = 0; i < mycourses.length; i++) {
              $("#" + mycourses[i] + "_purchased").hide();
              $("#" + mycourses[i] + "_available").show();
            }
              localStorage.clear();
              updateAuthenticationStatus();
           } else {
              handlerTUT.open({
              name: 'ZeroToHeroMath',
              description: 'Single tutoring session',
              amount: 200
              });
              e.preventDefault();
          } 
        }else {
          bootpopup.alert("Please sign in to access content.");
        }
    },
  });
});

window.addEventListener('popstate', function() {
  handlerTUT.close();
});*/

////////////////////////////////////////////////////////////////////////////TUTORING////////////////////////////////////////////////////////////////////////////////