/**
 * Form handler for Symfony2 FormIdable (Ajax)
 * 
 * @author Ruben Harms <info@rubenharms.nl>
 * @link http://www.rubenharms.nl
 */

(function($) {
	$.fn.formIdable = function(options) {

		if (!options)
			options = {};

		var defaults = {
			error : true
		}

		options = $.extend({}, defaults, options);

		return this
				.each(function() {

					var form = $(this);

					if (!form.attr('action')) {
						form.attr('action', top.location);
					}
					var handleErrors = function(form, response) {
						var errors = getErrors(response.errors.name,
								response.errors.name, response.errors.errors);
						$(form).find('.form-group').removeClass('has-error')
								.removeClass('has-feedback');
						$(form).find('.form-group').find(
								'.form-control-error-message').remove();
						$(form).find('.form-group').find(
								'.form-control-feedback').remove();

						var i = 0;

						$.each(errors, function(index, obj) {

							if (i == 0) {
								if ($(form).find('#' + obj.id).parents(
										'.tab-pane').length > 0) {
									console.log('true');
									var tabId = $(form).find('#' + obj.id)
											.closest('.tab-pane').attr('id');
									$('a[href="#' + tabId + '"]').tab('show');
								}
							}
							i++;

							formGroup = $(form).find('#' + obj.id).closest(
									'.form-group');
							formGroup.addClass('has-error').addClass(
									'has-feedback');
							/*
							 * $(form).find('#'+obj.id).parent().append('<span
							 * class="glyphicon glyphicon-remove
							 * form-control-feedback"></span>');
							 */

							$.each(obj.errors, function(mid, message) {
								if ($(form).find('#' + obj.id).parent().is(
										".input-group"))
									$(form).find('#' + obj.id).parent()
											.parent().append(
													'<span class="help-block form-control-error-message" style="display:hidden;">'
															+ message
															+ '</span>');
								else
									$(form).find('#' + obj.id).parent().append(
											'<span class="help-block form-control-error-message" style="display:hidden;">'
													+ message + '</span>');

							});

						});

						$(form).find('.form-group').not('.has-error').each(
								function() {
									$(this).addClass('has-success');
								});

					};

					var handleSuccess = function(form, response) {
						$(form).find('.form-group').removeClass('has-error')
								.removeClass('has-feedback');
						$(form).find('.form-group').find(
								'.form-control-error-message').remove();
						$(form).find('.form-group').find(
								'.form-control-feedback').remove();

						$(form).find('.form-group').not('.has-error').each(
								function() {
									$(this).addClass('has-success').addClass(
											'has-feedback');
									// $(this).find("input").parent().append('<span
									// class="glyphicon glyphicon-ok
									// form-control-feedback"></span>');
								});
					};

					var getErrors = function(id, name, errors) {
						var newErrors = new Array();
						var object = new Object();
						object['id'] = id;
						object['name'] = name;
						object['errors'] = new Array();
						hasChilds = false;
						$.each(errors, function(index, obj) {

							if (!isNaN(parseFloat(index)) && isFinite(index)
									&& !obj.errors) {
								object.errors.push(obj);
							} else {
								var varID = id + '_' + index;
								var varName = name + '[' + index + ']';
								errors = getErrors(varID, varName, obj.errors);

								$.each(errors, function(index, obj) {
									newErrors.push(obj);
								});
							}
						});
						newErrors.push(object);
						return newErrors;
					};

					$(form)
							.ajaxForm(

									{
										success : function(response) {
											var status = response.msgStatus;
											var msg = response.message;
											var data = form.serialize();

											if (response.status) {

												if (response.options.successHandler) {
													window[response.options.successHandler]
															(form, response,
																	data);
												} else {
													handleSuccess(form,
															response);

													if (response.options.location) {
														location.href = response.options.location
													}
												}

											} else {
												if (response.options.errorHandler) {
													window[response.options.errorHandler]
															(form, response);
												} else if (options.errorHandler) {
													options.errorHandler(form,
															response);
												} else {
													handleErrors(form, response);
												}
											}

										},
										error : function(response) {

											if (options.error === false)
												return;
											
											 if (typeof options.error === 'function') 
												 return options.error(response);
											 

											if (confirm(response.status
													+ ' - '
													+ response.statusText
													+ "\r\nDo you want more details?")) {
												if ($.fn.modal !== undefined) {
													if (0 === $('#formidableErrorModal').length) {
														$('body')
																.append(
																		$(
																				'<div id="formidableErrorModal" class="modal fade" role="dialog" style="display:none;"></div>')
																				.append(
																						$(
																								'<div class="modal-dialog" style="width: '
																								+ (window.innerWidth * 0.8)
																								+ 'px"></div>')
																								.append(
																										$(
																												'<div class="modal-content"></div>')
																												.append(
																														$('<div class="modal-body"></div>')))));

													}
													$('#formidableErrorModal')
															.find('.modal-body')
															.html(
																	response.responseText);
													$('#formidableErrorModal')
															.modal();
												}
											}
										}

									});

					return false;

				});
	};
}(jQuery));
