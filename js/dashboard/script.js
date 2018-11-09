$(document).ready( function () {
    
    function waitForElement(elementPath, callBack) {
      window.setTimeout(function() {
        if($(elementPath).length) {
          callBack(elementPath, $(elementPath));
        } 
        else {
          waitForElement(elementPath, callBack);
        }
      },500)
    }

    if ($('#mainDashboard').length != 0) {
        var table = $('#filesTable').dataTable({
            'pagingType' : 'simple_numbers'
        });

        waitForElement(".dataTables_paginate",function(){

            $('.dataTables_paginate a').on('click', function(e){
                e.preventDefault();
            });
        });


        $('.start_date').change(function(){
            // console.log(table);
            $('.time_input').show();

            var oTable = $('#filesTable').dataTable( {"bRetrieve": true} );

            oTable.fnClearTable();

            var datefilter_json_path = $('.inquiries-datas').attr('datefilter-json-path');
            var start_date_val = $('.start_date').val();
            var end_date_val = $('.end_date').val();
            var start_time_val = $('.start_time').val();
            var end_time_val = $('.end_time').val();
            var datas = {};

            if (start_time_val != "") {

                var ids = $('.inquiries-datas').attr('download-only-ids');

                datas = {
                    start_date : start_date_val,
                    end_date : end_date_val,
                    start_time : start_time_val,
                    end_time : end_time_val,
                    ids : ids
                };
            }else{
                datas = {
                    start_date : start_date_val,
                    end_date : end_date_val
                };
            }

            $.get(datefilter_json_path, datas, function(result){

                var info_ids = [];
                $.each(result, function(index , value){
                    var date = new Date(value.created_at.date)
                    var month = date.getMonth() + 1;
                    var parseDate = date.getFullYear() + '-' + month + '-' + date.getDate() + ' ';
                    var fullDate = parseDate + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();


                    oTable.fnAddData([
                        fullDate,
                        value.first_name,
                        value.last_name,
                        value.email,
                        value.mobile_no,
                        value.business_name,
                        value.industry,
                        value.buttons
                    ]);

                    info_ids.push(value.inquiry_id);

                });
                
                waitForElement("#filesTable tbody tr",function(){

                    $('.delete-inquiry-btn').on('click', function(){
                        var inquiryname = $(this).attr('data-name');
                        var inquiry_id = $(this).attr('delete-inquiry-id'); 
                        $('.inquiry-name').text(inquiryname);
                        $('.confirm-delete-btn').attr('data-id', inquiry_id);
                    });

                    $('.inquiries-datas').attr('download-only-ids', info_ids);
                });
                
            } );
        });


        $('.start_time, .end_time').change(function(){
            var oTable = $('#filesTable').dataTable( {"bRetrieve": true} );

            if ($('.start_date').val().length != 0 || $('.end_date').val().length != 0) {
                var oTable = $('#filesTable').dataTable( {"bRetrieve": true} );
                oTable.fnClearTable();
                var datefilter_json_path = $('.inquiries-datas').attr('datefilter-json-path');
                var start_date_val = $('.start_date').val();
                var end_date_val = $('.end_date').val();
                var start_time_val = $('.start_time').val();
                var end_time_val = $('.end_time').val();
                var ids = $('.inquiries-datas').attr('download-only-ids');

                var datas = {
                    start_date : start_date_val,
                    end_date : end_date_val,
                    start_time : start_time_val,
                    end_time : end_time_val,
                    ids : ids
                };

                $.get(datefilter_json_path, datas, function(result){

                    var info_ids = [];
                    $.each(result, function(index , value){
                        var date = new Date(value.created_at.date)
                        var month = date.getMonth() + 1;
                        var parseDate = date.getFullYear() + '-' + month + '-' + date.getDate() + ' ';
                        var fullDate = parseDate + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();


                        oTable.fnAddData([
                            fullDate,
                            value.first_name,
                            value.last_name,
                            value.email,
                            value.mobile_no,
                            value.business_name,
                            value.industry,
                            value.buttons
                        ]);

                        info_ids.push(value.inquiry_id);

                    });
                    
                    waitForElement("#filesTable tbody tr",function(){

                        $('.delete-inquiry-btn').on('click', function(){
                            var inquiryname = $(this).attr('data-name');
                            var inquiry_id = $(this).attr('delete-inquiry-id'); 
                            $('.inquiry-name').text(inquiryname);
                            $('.confirm-delete-btn').attr('data-id', inquiry_id);
                        });

                        $('.inquiries-datas').attr('download-only-ids', info_ids);
                    });
                    
                } );
            }
            // if (!$('.end_date, .start_date').val() != '') {}
            // oTable.fnFilter( '02:57', 0 );
        });

        $('.export-csv-btn').on('click', function(event){

        event.preventDefault();

        var export_path = $(this).attr('href');
        var inquiry_ids = $('.inquiries-datas').attr('download-only-ids');
        // var start_date_val = $('.start_date').val();
        // var end_date_val = $('.end_date').val();
        // var start_time_val = $('.start_time').val();
        // var end_time_val = $('.end_time').val();

        // var datas = {
        //     start_date : start_date_val,
        //     end_date : end_date_val,
        //     start_time : start_time_val,
        //     end_time : end_time_val
        // };

        if (inquiry_ids != '') {
            
                window.open(export_path + '?inquiries_ids='+ inquiry_ids);

            }else{

                window.open(export_path);

            }
        });

        $('.delete-inquiry-btn').on('click', function(){
            var inquiryname = $(this).attr('data-name');
            var inquiry_id = $(this).attr('delete-inquiry-id'); 
            $('.inquiry-name').text(inquiryname);
            $('.confirm-delete-btn').attr('data-id', inquiry_id);
        });

        var inst = $('[data-remodal-id=modal]').remodal();

        $('.add-item-btn').on('click',function(){
            inst.open();
        });

        $('.edit-user-btn').on('click', function(){

            var user_data = JSON.parse($(this).attr('user-data'));
            var update_user_path = $(this).attr('update-path');

            $('.edit_username_input').val(user_data.username);
            $('.edit_name_input').val(user_data.name);
            $('.edit_email_input').val(user_data.email);
            $('.edit_user_form').attr('action', update_user_path);
            $('[data-remodal-id=edit_user]').remodal().open();

        });
    }

    

    // $('.export-csv-btn').on('click', function(){


    //   var export_data = JSON.parse($(this).attr('export-data'));
    //   console.log(export_data);
    //   var download_path;
    //   $.ajax({
    //      type:'GET',
    //      url: export_data.export_url,
    //      success:function(data){
    //      }
    //   });
      
    // });

    function emptyInputValidation(selector, counter, message){

        if (selector == '#mobileno_input') {
            var mobile_no = $(selector).val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');

            if (mobile_no == undefined || mobile_no.replace(/\s/g,"") == "" || mobile_no.length != 10) {

                $(selector).parent().find('.error-msg').css({ display: 'inline-block'});

                counter++;

                return counter;
            }else{
                $(selector).parent().find('.error-msg').hide();

                return counter;
            }

        }else{
            if ($(selector).val() == undefined || $(selector).val().replace(/\s/g,"") == "") {

                $(selector).parent().find('.error-msg').css({ display: 'inline-block'});

                counter++;

                return counter;
            }else{
                $(selector).parent().find('.error-msg').hide();

                return counter;
            }
        }
        
    }

    $('#strategyform').submit(function(e){
        e.preventDefault();

        var errorCounter = 0;
        var counter = 0;
        var inputIds = ['#firstname_input', '#lastname_input',
                        '#email_input', '#businessname_input',
                        '#industry_input', '#mobileno_input'];

        $.each(inputIds, function( index, target ) {
          errorCounter = emptyInputValidation(target, errorCounter, 'First Name');
        });

        if (errorCounter == 0) {
         $(this)[0].submit();
        }
        
    });


} );