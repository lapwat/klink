$(document).ready(function() {
    // connection
    var socket = io.connect('http://localhost:8080');
    var sendToId;

    // initialisation user list
    socket.on('user_list', function(threads) {
        $('#friendslist').empty();

        // friends list fill
        $('#searchbox').load('html/searchbox.html', function() {
            $(this).find('#autocompleteState').focus();
        });

        $('#messagebox').load('html/messagebox.html');

        $('#friendslist').addClass('collection');
        $.each(threads, function (i, val) {
            $('#friendslist').append('<li class="list-item ' + ((i === 0)?'first':'') + '"><a id="' + val.id + '" href="#" class="collection-item waves-effect waves-dark"><img src="' + ((val.image)?val.image:'https://graph.facebook.com/'+val.id+'/picture?width=50') + '" alt="Contact Person"><span>' + val.name + '</span></a></li>');
        });

        $('li.list-item').filter(function(index) {
            return index >= 5;
        }).hide();
        // Materialize.showStaggeredList('#friendslist');
    });

    socket.on('status', function(status) {
        switch (status) {
            case 'connected':
                $('#status > .indeterminate').addClass('determinate green').removeClass('indeterminate deep-orange red');
                break;
            case 'loading':
                $('#connection').hide();
                $('#connect_button').addClass('disabled');
                $('#status > .determinate').addClass('indeterminate deep-orange').removeClass('determinate red green');
                break;
            case 'disconnected':
                $('#connection').show();
                $('#status > .indeterminate').addClass('determinate red').removeClass('indeterminate green deep-orange');
                break;
            default:
        }
    });

    socket.on('share_ok', function (message) {
        Materialize.toast('Link shared to ' + message.name + ' !', 3000);
        $('#cross').hide();
        $('#autocompleteState').val('');
        $('#autocompleteState').keyup();
    });

    // erreur
    socket.on('erreur', function(err) {
        switch (err) {
            case 'Wrong username/password.':
                $('#connect_button').removeClass('disabled');
                break;
            default:
        }
        var $toastContent = $('<span class="erreur">' + err + '</span>');
        Materialize.toast($toastContent, 3000);
        $('.erreur').parent().addClass('red');
    });

    // panneau de connexion
    $('#connection').load('html/connection.html');
    $('#connection').on('click', '#connect_button', function() {
        socket.emit('login', {email:$('#email').val(), password:$('#password').val()});
    });
    $('#connection').on('keypress', '#email, #password', function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            socket.emit('login', {email:$('#email').val(), password:$('#password').val()});
        }
    });

    // liste d'amis
    $('#friendslist').on('click', 'a', function() {
        sendToId = $(this).attr('id');
        name = $(this).text();
        chrome.tabs.getSelected(null, function(tab) {
            socket.emit('share_order', {id: sendToId, name: name, link: tab.url, body: $('#messageinput').val()});
        });
    });

    // auto-completion
    $(document).on('keyup', '#autocompleteState', function() {
        if ($('#autocompleteState').val() !== '') {
            $('#cross').show();
            $('li.list-item').filter(function(index) {
                return $(this).text().toLowerCase().indexOf($('#autocompleteState').val().toLowerCase()) >= 0
            }).show();
            $('li.list-item').filter(function(index) {
                return $(this).text().toLowerCase().indexOf($('#autocompleteState').val().toLowerCase()) < 0
            }).hide();

            $('li.list-item').removeClass('first');
            var seen = false;
            $('li.list-item').each(function() {
                if ($(this).css('display') !== 'none' && !seen) {
                    $(this).addClass('first');
                    seen = true;
                }
            });
        } else {
            $('#cross').hide();
            $('li.list-item').hide();
            $('li.list-item').removeClass('first').first().addClass('first');
            $('li.list-item').filter(function(index) {
                return index < 5;
            }).show();
        }
    });
    $(document).on('click', '#cross', function() {
        $('li.list-item').removeClass('first');
        $('li.list-item').first().addClass('first');
        $('#cross').hide();
        $('#autocompleteState').val('').keyup().focus();
    });
    $('#searchbox, #messagebox').on('keyup', '#autocompleteState, #messageinput', function(event) {
        if ($('#messageinput').val() !== '') {
            $('#cross2').show();
        } else {
            $('#cross2').hide();
        }
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            sendToId = $('.first').first().find('a').attr('id');
            if (!sendToId) {
                var $toastContent = $('<span class="erreur">Nothing seems to match the search</span>');
                Materialize.toast($toastContent, 3000);
                $('.erreur').parent().addClass('red');
            } else {
                chrome.tabs.getSelected(null, function(tab) {
                    socket.emit('share_order', {id: sendToId, name: $('.first').text(), link: tab.url, body: $('#messageinput').val()});
                });
            }

        }
    });
    $(document).on('click', '#cross2', function() {
        $('#cross2').hide();
        $('#messageinput').val('').focus();
    });

    socket.emit('ready');
});
