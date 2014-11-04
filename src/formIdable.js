/**
 * Form handler for Symfony2 FormIdable (Ajax)
 * 
 * @author Ruben Harms <info@rubenharms.nl>
 * @link http://www.rubenharms.nl
 */

(function ($){ 
    $.fn.formIdable = function( ) { 
	  	return this.each(function(){
	  		
	  		var form = $(this);
	  		
	  		console.log(form);
	  		  		
	  		/**
			 * Default error handler
			 * 
			 * @author Ruben Harms <info@rubenharms.nl>
			 * @link http://www.rubenharms.nl
			 **/
	  		var handleErrors = function (form,response){
				var errors = getErrors(response.errors.name,response.errors.name, response.errors.errors);				
				$(form).find('.form-group').removeClass('has-error').removeClass('has-feedback');
				$(form).find('.form-group').find('.form-control-error-message').remove();						
				$(form).find('.form-group').find('.form-control-feedback').remove();						
														
				$.each(errors,function(index,obj){
					formGroup = $(form).find('#'+obj.id).closest('.form-group');					
					formGroup.addClass('has-error').addClass('has-feedback');										
					$(form).find('#'+obj.id).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');					
					$.each(obj.errors, function(mid,message){
						$(form).find('#'+obj.id).parent().append('<span class="help-block form-control-error-message" style="display:hidden;">' + message + '</span>');
					});					
					
				});
				
				$(form).find('.form-group').not('.has-error').each(function(){
					$(this).addClass('has-success');
				});
				
			};
			
					  		
	  		/**
			 * Default success handler
			 * 
			 * @author Ruben Harms <info@rubenharms.nl>
			 * @link http://www.rubenharms.nl
			 **/
	  		var handleSuccess = function (form,response){
	  			$(form).find('.form-group').removeClass('has-error').removeClass('has-feedback');
	  			$(form).find('.form-group').find('.form-control-error-message').remove();						
				$(form).find('.form-group').find('.form-control-feedback').remove();					
														
	  			$(form).find('.form-group').not('.has-error').each(function(){
					$(this).addClass('has-success').addClass('has-feedback');														
					$(this).find("input").parent().append('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');		
				});
	  		};
	
			/**
			 * Rewrites JSON response errors into handable objects
			 * 
			 * @param string id 
			 * @param string name
			 **/

	  		var getErrors = function (id, name, errors){
				var newErrors = new Array();	
				var object = new Object();
				object['id'] = id;
				object['name'] = name;
				object['errors'] = new Array();	
				hasChilds = false;
				$.each(errors, function(index,obj){
					
					if (!isNaN(parseFloat(index)) && isFinite(index)){		
						object.errors.push(obj);
					}
					else {			
						var varID = id + '_' + index;					
						var varName = name + '[' + index + ']';					
						errors = getErrors(varID, varName , obj.errors);	
						
						$.each(errors, function(index,obj){
							newErrors.push(obj);
						});
					}
				});		
				newErrors.push(object);	
				return newErrors;	
			};	  		
			
			/**
			 * Prevent default action for AJAX forms and provide a AJAx response
			 * 
			 * @author Ruben Harms <info@rubenharms.nl>
			 * @link http://www.rubenharms.nl
			 **/
			
			$(form).submit(function(e){
			
				
				e.preventDefault();
				var url = form.attr("action");
				var data = form.serialize();
			
				$.post(url, data, function(response){
					var status = response.msgStatus;
					var msg = response.message;
					if(response.status) {
						
						if(response.options.successHandler){
							window[response.options.successHandler](form,response,data);
						}
						else {
							handleSuccess(form,response);
							
							if (response.options.location){
								location.href = response.options.location 
							}
						}		
						
					}
					else {
						if(response.options.errorHandler){
							window[response.options.errorHandler](form,response);
						}
						else {
							handleErrors(form,response);
						}
					}		
				});
				
				return false;
	  		}); 
	  		
	    });
	};
}(jQuery));
	