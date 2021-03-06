$(function () {
    var list = $('#books');

    //Load all books
    function bookList() {

        $.getJSON('./api/books.php', function (print) {
            print.forEach(function (book) {
                var li = $('<li>');
                li.append('<div class="form-group"><div class="title">' + book.name);
                li.append('<button class="delete" class="btn-warning">Usuń</button>');
                li.append('<div class="divhide"><p class="autor"></p><p class="description"></p></div></div></div>');
                li.attr("data-id", book.id);
                list.append(li);
            });
        });
    
    //load description to book after click on title
    $('ol').on("click", '.title', function (ev) {
        ev.preventDefault();
        var ind = $('.title').index(this);
        var hide = $('div.divhide').eq(ind);
        var id = $(this).parent().parent().attr('data-id');

        $.get("./api/books.php",
        
                {id: id},
                function (data) {
                    var author = JSON.parse(data)[0].author;
                    var description = JSON.parse(data)[0].description;

                    $('.autor').text(author);
                    $('.description').text(description);

                });
        hide.slideToggle();

        //create edit form
        var editForm = $('<form id="edit" action="./api/books.php">');

        editForm.append('<div class="form-group">\n\
                <label>Tytuł książki:</label>\n\
                <div class="input-group">\n\
                <input type="text" class="form-control" name="title" id="title">\n\
                <div class="input-group-addon" id="type">\n\
                </div>\n\
                </div>\n\
                </div>\n\
                <div class="form-group">\n\
                <label>Autor:</label>\n\
                <input type="text" class="form-control" name="author" id="author">\n\
                </div>\n\
                <div class="clearfix">\n\
                <div class="form-group form-group-mini">\n\
                <label>Opis:</label>\n\
                <input type="text" class="form-control" name="description" id="description">\n\
                </div>\n\
                </div>\n\
                <br>\n\
                <p>\n\
                <button type="submit" class="btn-warning" id="editbutton">Zmień</button>\n\
                </p>');
        editForm.attr("data-id", id);
        hide.append(editForm);

    });
    //edit the form using AJAX.
    $('ol').on("click", '#editbutton', function (ev) {
        ev.preventDefault();

        var formEdit = $('#edit');
        var formEditData = $().serialize();
        var id = $(this).parent().parent().attr('data-id');
        var editName = $(this).parent().parent().find('#title').val();
        var editAuthor = $(this).parent().parent().find('#author').val();
        var editDescription = $(this).parent().parent().find('#description').val();

        $.ajax({
            complete:function(){location.reload()},
            type: 'PUT',
            url: './api/books.php',
            data: {
                id: id,
                name: editName,
                author: editAuthor,
                description: editDescription
            }
        })
                .done(function (response) {

                    $(formMessages).text("Książka została zmieniona");

                })

                .fail(function (data) {
                    $(formMessages).text("Edycja książki niepowiodła się");
                })

                .always(function (data) {
                    console.log(data);
                    $(formMessages).text("Coś tam robi");
                });
       
    });


    // get the form.
    var form = $('#ajax-contact');

    // get the messages div.
    var formMessages = $('#form-messages');


    $(form).submit(function (ev) {
        // stop the browser from submitting the form.
        ev.preventDefault();

        // serialize the form data.
        var formData = $(form).serialize();

        // submit the form using AJAX.
        $.ajax({
            complete:function(){location.reload()},
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
                .done(function (response) {
                    // Make sure that the formMessages div has the 'success' class.
                    $(formMessages).removeClass('error');
                    $(formMessages).addClass('success');

                    // Set the message text.
                    $(formMessages).text(response);

                    // Clear the form.
                    $('#title').val('');
                    $('#author').val('');
                    $('#description').val('');
                })
                .fail(function (data) {
                    // Make sure that the formMessages div has the 'error' class.
                    $(formMessages).removeClass('success');
                    $(formMessages).addClass('error');

                    // Set the message text.
                    if (data.responseText !== '') {
                        $(formMessages).text(data.responseText);
                    } else {
                        $(formMessages).text('Oops! An error occured and your message could not be sent.');
                    }
                });
       
    });

    //delete book
    $('ol').on("click", '.delete', function (ev) {
        ev.preventDefault();
        var id = $(this).parent().attr('data-id');

        $.ajax({
            complete:function(){location.reload()},
            type: 'DELETE',
            url: './api/books.php',
            data: {id: id}
        })
                .done(function (response) {

                    $(formMessages).text("Książka została usunięta");

                })

                .fail(function (data) {
                    $(formMessages).text("Usuwanie książki niepowiodło się");
                });

        
    });
}
    bookList();
});