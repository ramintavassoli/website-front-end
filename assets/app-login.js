$(window).load(function() {
    $(document.body).show();
});

$('#redirect-to-signup').click(function(e){
	$('#read_policy').tooltip({title: "Minimum 8 characters; at least 1 uppercase, 1 lowercase and 1 number", animation: true});
	$('#signin').hide();
	document.getElementById("in-signup").reset();
	$('#signup').show();
	$('#passforget').hide();
});

$('#redirect-to-signin').click(function(e){
	$('#signup').hide();
	document.getElementById("in-signin").reset();
	$('#signin').show();
	$('#passforget').hide();
});

$('#redirect-to-signin_2').click(function(e){
	$('#signup').hide();
	document.getElementById("in-signin").reset();
	$('#signin').show();
	$('#passforget').hide();
});
  
$('#redirect-to-passforget').click(function(e){
	$('#signin').hide();
	document.getElementById("in-passforget").reset();
	$('#passforget').show();
	$('#signup').hide();
});

$('#in-signup').submit(function(e){
    $('#signup-load').button('loading'); 
  	e.preventDefault();
  	
  	if ($('#name-signup').val().length === 0 || $('#email-signup').val().length === 0 || $('#password-signup').val().length === 0){
  		bootpopup.alert("Make sure to fill out all 3 sections.");
        $('#signup-load').button('reset');  
    	document.getElementById("in-signup").reset();
  	}
  	else{

	  	AWS.config.region = 'us-east-1';

		// Configure the credentials provider to use your identity pool
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: "us-east-1:be3ba2c1-a11f-49fe-9653-04b77079be5e",
		});

		// Make the call to obtain credentials
		AWS.config.credentials.get(function(){

		    // Credentials will be available when this function is called.
		    var access = AWS.config.credentials.accessKeyId;
		    var secret = AWS.config.credentials.secretAccessKey;
		    var token = AWS.config.credentials.sessionToken;

		});
	  		
	  	var userPool = new AmazonCognitoIdentity.CognitoUserPool({
		    UserPoolId : 'us-east-1_ZcSwNv6Bi',
		    ClientId : 'd4rrl93m2p8a3qliht0tbh303'
	  	});

	  	var attributeList = [];

	  	var dataEmail= {
			Name : 'email',
			Value : $('#email-signup').val()
	  	};

	  	var dataName={
	  		Name: 'name',
	  		Value: $('#name-signup').val()
	  	};

	  	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	  	var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

	  	attributeList.push(attributeEmail);
		attributeList.push(attributeName);

	  	var authenticationData = {
	    	Username : $('#email-signup').val(),
	    	Password : $('#password-signup').val()	
	  	};

		userPool.signUp(authenticationData.Username, authenticationData.Password, attributeList, null, function(err, result){
			var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
			if (err.code == "UsernameExistsException"){
				var params = {
					Username: authenticationData.Username,
					UserPoolId : 'us-east-1_ZcSwNv6Bi'
				};
				cognitoidentityserviceprovider.adminGetUser(params, function(err,data) {
					if (err) {
                  		bootpopup.alert("Something went wrong. Please try again.");
				        $('#signup-load').button('reset');  
    					document.getElementById("in-signup").reset();
					}
					else {
						if(data.UserStatus == "UNCONFIRMED"){
						    cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {
								if (err) {
			                  		bootpopup.alert("Something went wrong. Please try again.");
      						        $('#signup-load').button('reset');  
    								document.getElementById("in-signup").reset();
								}
			                	else{
			                		userPool.signUp(authenticationData.Username, authenticationData.Password, attributeList, null, function(err, result){
			                			cognitoUser = result.user;
								        bootpopup({
								            title: "ZeroToHeroMath",
								            content: [
								                { p: {text: "Enter the verification code sent to your email."}},
								                { input: {type: "number", label: "Code", name: "code", id:"code", placeholder: "123456", value:""}},
								                ],
								            cancel: function(data, array, event) {   
	              					            $('#signup-load').button('reset');
		              					        document.getElementById("in-signup").reset();

								            	var params={
								                	UserPoolId: 'us-east-1_ZcSwNv6Bi',
								                	Username: $('#email-signup').val()
								              	};
								              	cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {});
								            },
								            ok: function(data, array, event) {
								            	var stringified = JSON.stringify(data);
								              	var parsed = JSON.parse(stringified);
								              	cognitoUser.confirmRegistration(parsed.code, true, function(err,result){
								              		if (err){
								                  		var params={
								                    		UserPoolId: 'us-east-1_ZcSwNv6Bi',
								                    		Username: $('#email-signup').val()
								                  		};
								                  		cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {});
								                  		bootpopup.alert("Verification failed, please try again.");
	  		              					            $('#signup-load').button('reset');  
		                  						        document.getElementById("in-signup").reset();
								              		}
								                	else if (result=='SUCCESS'){
								                		bootpopup.alert("Your account is actived. You may sign in to access your account.", "ZeroToHeroMath");
								                  		$("#signup").hide();
								                  		$("#signin").show();
								                 	}else{
								                  		var params={
								                    		UserPoolId: 'us-east-1_ZcSwNv6Bi',
								                    		Username: $('#email-signup').val()
								                  		};
								                  		cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {});
								                  		bootpopup.alert("Verification failed, please try again.");
	  		              					            $('#signup-load').button('reset');  
		                  						        document.getElementById("in-signup").reset();
								                	}
								             	});
								            },
								        });
			                	 	});
			                	}
			            	});
		            	}
				        else{
							bootpopup.alert("This email is already registered. If you forgot your password, continue to 'Reset password'.", "ZeroToHeroMath");
				            $('#signup-load').button('reset');  
					        document.getElementById("in-signup").reset();
			        	}
		        	}
				});
			}else if ( err != null && err.code != "UsernameExistsException"){
		  		bootpopup.alert('Invalid Password. Your password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter and 1 number.');  
		  		document.getElementById("in-signup").reset();
	            $('#signup-load').button('reset'); 

		  	}else{
		    	cognitoUser = result.user;
		        bootpopup({
		            title: "ZeroToHeroMath",
		            content: [
		                { p: {text: "Enter the verification code sent to your email."}},
		                { input: {type: "number", label: "Code", name: "code", id:"code", placeholder: "123456", value:""}},
		                ],
		            cancel: function(data, array, event) {  
			            $('#signup-load').button('reset');
				        document.getElementById("in-signup").reset();           
		            	var params={
		                	UserPoolId: 'us-east-1_ZcSwNv6Bi',
		                	Username: $('#email-signup').val()
		              	};
		              	cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {});
		            },
		            ok: function(data, array, event) {
		            	var stringified = JSON.stringify(data);
		              	var parsed = JSON.parse(stringified);
		              	cognitoUser.confirmRegistration(parsed.code, true, function(err,result){
		              		if (err){
		                  		var params={
		                    		UserPoolId: 'us-east-1_ZcSwNv6Bi',
		                    		Username: $('#email-signup').val()
		                  		};
				              	cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {});
		                  		bootpopup.alert("Verification failed, please try again.");
  					            $('#signup-load').button('reset');  
  						        document.getElementById("in-signup").reset();
		              		}
		                	else if (result=='SUCCESS'){
		                		bootpopup.alert("Your account is activated. You may sign in to continue.", "ZeroToHeroMath.");
		                  		$("#signup").hide();
		                  		$("#signin").show();
		                 	}else{
		                  		var params={
		                    		UserPoolId: 'us-east-1_ZcSwNv6Bi',
		                    		Username: $('#email-signup').val()
		                  		};
		                  		cognitoidentityserviceprovider.adminDeleteUser(params, function(err, result) {});
		                  		bootpopup.alert("Verification failed, please try again.");
		                		document.getElementById("in-signup").reset();
					            $('#signup-load').button('reset');  

		                	}
		             	});
		            },
		        });
		  	}
		});
  	}
});

/////////////////////////////////////////////

$('#in-signin').submit(function(e){
  	e.preventDefault();
  	$('#signin-load').button('loading');

	AWS.config.region = 'us-east-1';
			
	var userPool = new AmazonCognitoIdentity.CognitoUserPool({
	    UserPoolId : 'us-east-1_ZcSwNv6Bi',
	    ClientId : 'd4rrl93m2p8a3qliht0tbh303'
	});


	var authenticationData = {
	Username : $('#email-signin').val(),
	Password : $('#password-signin').val(),
	};

	var userData = {
	Username : $('#email-signin').val(),
	Pool : userPool
	};

	var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			const un = userData.Username;
			localStorage.setItem('timeStamp', JSON.stringify(new Date().getTime()));  
			localStorage.setItem('token', JSON.stringify(result.idToken.jwtToken));
			localStorage.setItem('uname', un);
			$.ajax({
				url: 'https://sdmj1cz65m.execute-api.us-east-1.amazonaws.com/dev/getcourses', //here we get courses and the name of the user to greet. 
				data: {userName : un},
				dataType: 'json',
				type: 'GET',
				success: function(data) {
					var AuthenticatedUser = JSON.parse(data.body);
					var greeting_name = AuthenticatedUser.name;
					var allcourses = AuthenticatedUser.courses.values;
					localStorage.setItem("name",JSON.stringify(greeting_name));
					localStorage.setItem("courses",JSON.stringify(allcourses));
					$('#signin').hide('explode');
					setTimeout(function(){
						window.location = '/';
					},100)
					setTimeout(function(){
						$('#signin-load').button('reset');
						document.getElementById("in-signin").reset();
						$("#signin").show();					
					},500)
				},
				error: function(){
					document.getElementById("in-signin").reset();
					$('#signin-load').button('reset');
					bootpopup.alert("Sign-in failed. Please try again.");
				}
			});
		},
		onFailure: function(err) {
			document.getElementById("in-signin").reset();
			$('#signin-load').button('reset');
			bootpopup.alert("Sign-in failed. Please try again.");
		}
	});

});

///////////////////////////////////////////////////

$('#in-passforget').submit(function(e){
	$('#passforget-load').button('loading');

	e.preventDefault();

	AWS.config.region = 'us-east-1';

	var userPool = new AmazonCognitoIdentity.CognitoUserPool({
	    UserPoolId : 'us-east-1_ZcSwNv6Bi',
	    ClientId : 'd4rrl93m2p8a3qliht0tbh303'
	});

	var userData = {
		Username : $('#email-passforget').val(),
		Pool : userPool
	};

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.forgotPassword({
	    
	    onSuccess: function (result) {
	        console.log('call result: ' + result);
	    },

	    onFailure: function(err) {
	    	if (err.code == "LimitExceededException"){
	    		bootpopup.alert("Attempt limit reached. Please try again in a few minutes.")
	    	}
	    	else if (err.code=="UserNotFoundException"){
	    		bootpopup.alert("Email not on file.")
	    	}
	    	else{
	    		bootpopup.alert("Something went wrong, please try again later.")
	    	}
			document.getElementById("in-passforget").reset();
			$('#passforget-load').button('reset');
	        $("#passforget").hide();
	        $("#signin").show();
		},

		inputVerificationCode() {

	        bootpopup({
	            title: "ZeroToHeroMath",
	            content: [
	                { p: {text: "Enter the verification code sent to your email."}},
	                { input: {label: "Code", name: "code", id:"code", placeholder: "123456", value:""}},
	                { p: {text: "Enter your new password. Policy: Minimum 8 characters; at least 1 uppercase, 1 lowercase and 1 number."}},
	                { input: {type: "password", label: "Password", name: "pass", id:"pass", placeholder: "Smith1234", value:""}},
	                ],
	            cancel: function(data, array, event) {   
		        	document.getElementById("in-passforget").reset();
					$('#passforget-load').button('reset');
		            $("#passforget").hide();
		            $("#signin").show();

	            },
	            ok: function(data, array, event) {
	            	var stringified = JSON.stringify(data);
	              	var parsed = JSON.parse(stringified);
	              	var verificationCode = parsed.code;
	              	var newPassword = parsed.pass;
			    	cognitoUser.confirmPassword(verificationCode, newPassword,{
			    		onSuccess : function(result){
	      			    	bootpopup.alert("You have successfully changed your password. Please sign in to continue.");
			  		        document.getElementById("in-passforget").reset();
							$('#passforget-load').button('reset');
			            	$("#passforget").hide();
			            	$("#signin").show();
			    		},
			    		onFailure : function(err){
			    			if (err.code=="CodeMismatchException"){
	      			    		bootpopup.alert("Code mismatch. Please try again.");
			    			}
			    			else if (err.code == "InvalidPasswordException"){
	      			    		bootpopup.alert("Invalid Password. Your password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter and 1 number.");
			    			}
			    			else{
	      			    		bootpopup.alert("Something went wrong. Please try again.");
			    			}
			        		document.getElementById("in-passforget").reset();
							$('#passforget-load').button('reset');
			            	$("#passforget").hide();
			            	$("#signin").show();
			    		}
			    	});
	            }
	        });
		}
	});
});

//////////////////////////////////////////////////