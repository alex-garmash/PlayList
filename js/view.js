'use strict';

class View {


    // cleanAlbums(){
    //     $('.list ul').text('');
    // };

    /**
     * function get 2 parameters name, mp3 url and add new line
     * song name and song url with event to delete line in modal window.
     * @param name
     * @param url
     */
    addNewSongURLAndName(name, url) {
        let $el = $(`<input type="text" value="${url}" class="addSongURL"><input type="text" value="${name}" class="addSongName"><i class="fa fa-times" aria-hidden="true"></i>`);

        $('.inputsSongs').append($el.on('click', function () {
            if ($(this).attr('class') == 'fa fa-times') {
                $el.remove();
            }
        }));
    };

    /**
     * function get one parameter image url and show it in modal.
     * @param url
     */
    previewImageURL(url) {
        $('.modal-body img').attr("src", url);
    };

    /**
     * function reset input name, input image url values, and set preview image to default image.
     */
    resetFieldsNameImageURL() {

        $('.inputName').val('');
        $('.inputImageURL').val('');
        $('.modal-body img').attr("src", 'img/NoImagePreview.png');
    };

    /**
     * function get one parameter.
     * parameter of error container to clean it.
     * @param ctr
     */
    cleanErrors(ctr) {
        let $err = $('.' + ctr);
        $err.text('');
    };

    /**
     * function get 2 parameters.
     * first parameter name of class container,
     * second parameter message to dump error with text.
     * @param ctr
     * @param str
     */
    dumpErrors(ctr, str) {
        $('.' + ctr).text('ERROR: ' + str);
    };

    /**
     * function remove all inputs Song Url, Name in modal.
     */
    removeAllFieldsSongURLAndNamesInputs() {
        $('.inputsSongs').text('');
    };

    /**
     * function cleaning all inputs fields in modal,
     * songs urls and songs names.
     */
    cleanFieldsAllSongURLAndNamesInputs() {
        $('.inputsSongs :input').each(function (index, value) {
            $(this).removeClass('red');
            value.value = '';
        });
    };

}
