'use strict';

class Editor {
    /**
     * Constructor get 3 parameters.
     * @param list
     * @param view
     * @param model
     */
    constructor(list, view, model) {
        this._list = list;
        this._view = view;
        this._model = model;


        //event button reset filed Name and Image URL
        /**
         * event listener on button reset fields in modal add new playlist.
         */
        $('.resetFieldsNameImageURL').on('click', () => {
            this._view.resetFieldsNameImageURL();
        });

        //event button next
        /**
         * event listener on button next in modal,
         * call function to check all inputs.
         */
        $('.addEditPlaylist').on('click', () => {
            this.validatePlayListNameAndImageURL();
        });

        //event button add new Song URL and Song Name
        /**
         * event listener on button '+' in modal to
         * add another input name and song url.
         */
        $('.btnPlus').on('click', () => {
            this._view.addNewSongURLAndName('', '');
        });

        //event reset fields songs names and songs urls
        /**
         * event listener on button 'reset fields' in modal to
         * reset all inputs names and song urls.
         */
        $('.cleanFieldsAllSongURLAndNamesInputs').on('click', () => {
            this._view.cleanFieldsAllSongURLAndNamesInputs();
        });

        //event input preview image url
        /**
         * event listener on input preview image url,
         * call function check if url valid.
         */
        $('.inputImageURL').on('change', (e) => {
            this.validateInputImageURL(e.target.value);
        });

        //event button save & finish
        /**
         * event listener on button save & finish,
         * call function to create or edit playlist.
         */
        $('.btnAddNewAlbum').on('click', () => {
            this.createEditAlbum();
        });

        //event button back in modal
        /**
         * event listener on button back in modal,
         * hide modal 2, and open modal 1.
         */
        $('.btnBackToAlbum').on('click', () => {
            $('#playlistSongs').modal('hide');
            $('#addEditPlayListModal').modal('toggle');
        });

        //event button close in modal 1
        /**
         * event listener on button close in modal 1,
         * set edit playlist to false, remove all fields
         * song url and name, hide modal 1.
         */
        $('.closeModal').on('click', () => {
            this._list._edit = false;
            this._view.removeAllFieldsSongURLAndNamesInputs();
            $('#addEditPlayListModal').modal('hide');

        });

        //event button close in modal 2
        /**
         * event listener on button close in modal 1,
         * set edit playlist to false, remove all fields
         * song url and name, hide modal 2.
         */
        $('.closeModal2').on('click', () => {
            this._list._edit = false;
            this._view.removeAllFieldsSongURLAndNamesInputs();
            $('#playlistSongs').modal('hide');
        });

        //event button close in modal 3
        /**
         * event listener on button close in modal 3,
         * close modal 3.
         */
        $('.closeModal3').on('click', () => {
            $('#deleteAlbum').modal('hide');
        });

        //event button delete album in modal 3
        /**
         * event listener on button delete in modal 3,
         * check if deleting playlist that playing stop play song and hide it,
         * call function to delete playlist from database, and close modal3.
         */
        $('.btnDeleteAlbum').on('click', () => {
            if (this._list._selectedID == this._list._audioPlayerID) {
                $('.playerCtrRight audio')[0].pause();
                $('.audioplayer').hide();
            }
            this._model.deleteExistingPlaylist(this._list, 'deleteAlbumFromList', this._list._selectedID);
            $('#deleteAlbum').modal('hide');
        });
    }

    /**
     * function create or edit playlist.
     * if creating new playlist:
     * check all inputs valid if yes send name,image,songs,object,callback function name to API
     * and close modal.
     * if editing playlist:
     * check all inputs valid if yes check if now playing playlist that you editing send
     * object,callback function name,songs,id of playlist to API,
     * remove all inputs fields in modal 2 , reset all inputs fields in modal 1,
     * set editing playlist to false, and close modal.
     * and close modal.
     */
    createEditAlbum() {
        if (this.checkAllSongURLAndNamesInputs()) {

            let songs = this.createSongURLAndNamesAssociativeArray();
            let $name = $('.inputName').val().trim();
            let $image = $('.inputImageURL').val().trim();
            let $modal = $('#playlistSongs');

            if (this._list._edit) {

                if (this._list._audioPlayerID == this._list._selectedID) {
                    this._model.updatePlaylistSongs(this._list._selectedID, songs, this._list, 'loadSongListToPlayerAndPlaySong');
                } else {
                    this._model.updatePlaylistSongs(this._list._selectedID, songs, false, false);
                }

                this._view.removeAllFieldsSongURLAndNamesInputs();
                this._view.resetFieldsNameImageURL();
                this._list._edit = false;
                $modal.modal('hide');
            } else {
                this._model.createNewPlaylists(this._list, 'createNewAlbum', $name, $image, songs);
                //console.log('creating new song list: ', songs);
                $modal.modal('hide');
            }

        } else {
            console.log("bad input");
        }
    };

    /**
     * function get all values from modal 2 {song url,name} and return
     * associative array.
     * @returns {Array}
     */
    createSongURLAndNamesAssociativeArray() {
        let $songsURL = $('.addSongURL');
        let $songsNames = $('.addSongName');
        let song = [];

        for (let i = 0; i < $songsNames.length; i++) {

            let name = $songsNames[i].value;
            let url = $songsURL[i].value;
            song[i] = {
                'name': name,
                'url': url
            };
        }
        return song;
    };

    /**
     * function check inputs: name, image url
     * if there is errors dump errors,
     * else if editing name and url image
     * call to function save it to database, close this window
     * and open another modal window,
     * else open another modal window.
     */
    validatePlayListNameAndImageURL() {

        let er = [];
        let flagErrors = false;
        let $name = $('.inputName').val().trim();
        let $image = $('.inputImageURL').val().trim();
        let $modal = $('#addEditPlayListModal');
        let $nextModal = $('#playlistSongs');

        //clean errors
        this._view.cleanErrors('errorMessage');
        this._view.cleanErrors('errorImageMessage');
        this._view.cleanErrors('errorMessageListSong');

        if (!this.validateInputName($name)) {
            er.push("Name");
            flagErrors = true;
        }
        if (!this.validateImageURL($image)) {
            this._view.dumpErrors('errorImageMessage', 'Image');
            flagErrors = true;
        }
        // for debugging step over validation flagErrors = false;
        //flagErrors = false;
        if (flagErrors) {
            if (er.length > 0) {
                this._view.dumpErrors('errorMessage', er.join(','));
            }
        } else {
            if (this._list._edit) {
                this._model.updateExistingPlaylistInfo(this._list, 'editAlbumById', this._list._selectedID, $name, $image);
                if ($('.inputsSongs input').length == 0) {
                    this._model.getPlaylistSongs(this, 'createSongsURLAndNames', this._list._selectedID);
                    console.log('this id: ', this._list._selectedID);
                }

            } else {
                if ($('.inputsSongs input').length == 0) {
                    //clean all inputs.
                    this._view.removeAllFieldsSongURLAndNamesInputs();

                    //add one empty inputs.
                    this._view.addNewSongURLAndName('', '');
                }
            }
            $modal.modal('hide');
            $nextModal.modal('toggle');
        }
    };

    /**
     * function get one parameter array of objects{name,url},
     * and add inputs with values to modal 2.
     * @param res
     */
    createSongsURLAndNames(res) {
        for (let i = 0; i < res.length; i++) {
            this._view.addNewSongURLAndName(res[i].name, res[i].url);
        }
    };

    /**
     * function get one parameter.
     * check if value not empty,
     * if empty return false,
     * else return true.
     * @param value
     * @returns {boolean}
     */
    validateInputName(value) {

        if (value == '') {
            return false;
        } else {
            return true;
        }
    };

    /**
     *  function get one parameter.
     *  checking with regex if url have image with supported formats
     *  if yes return true else return false.
     *  @param value
     *  @returns {boolean}
     */
    validateImageURL(value) {

        //simple expression.
        //let expression = /(http]?:\/\/.*.(?:png|jpg|gif|svg|jpeg))/gi;

        //real expression but not include http://localhos/name.img
        let expression = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpg|gif|png|jpeg|svg)$/gi;

        let regex = new RegExp(expression);
        if (value.match(regex)) {
            this._view.cleanErrors('errorImageMessage');
            return true;
        } else {
            this._view.dumpErrors('errorImageMessage', 'Image');
            return false;
        }

    };

    /**
     *  function get one parameter.
     *  checking with regex if url have audio with supported formats
     *  if yes return true else return false.
     *  @param value
     *  @returns {boolean}
     */
    validateMP3URL(value) {

        //simple expression
        //let expression = /(https?:\/\/.*.(?:mp3|ogg|mp4))/gi;

        //real expression but not include http://localhos/name.mp3
        let expression = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:mp3|ogg|mp4)/gi;

        let regex = new RegExp(expression);
        if (value.match(regex)) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * function get one parameter image url.
     * checking if image url valid dump image,
     * else set default image preview.
     * @param imageURL
     */
    validateInputImageURL(imageURL) {
        //clean image error.
        this._view.cleanErrors('errorImageMessage');

        if (this.validateImageURL(imageURL)) {
            this._view.previewImageURL(imageURL);
        } else {
            this._view.dumpErrors('errorImageMessage', 'Image');
            this._view.previewImageURL('img/NoImagePreview.png');
        }
    };

    /**
     * function check all inputs song name, song url.
     * if there is error print it and return false,
     * else return true.
     * @returns {boolean}
     */
    checkAllSongURLAndNamesInputs() {
        //variables
        let $songsURL = $('.addSongURL');
        let $songsNames = $('.addSongName');
        let errName = false;
        let errURL = false;
        let err = [];
        let _this = this;

        //clean errors
        this._view.cleanErrors('errorMessageListSong');

        //check if inputs song name valid.
        $songsNames.each(function (index, value) {
            if (_this.validateInputName(value.value)) {
                $(this).removeClass('red');
            } else {
                $(this).addClass('red');
                errName = true;
            }
        });
        //check if inputs song url valid.
        $songsURL.each(function (index, value) {
            if (_this.validateMP3URL(value.value)) {
                $(this).removeClass('red');
            } else {
                $(this).addClass('red');
                errURL = true;
            }
        });
        if (errName) {
            err.push('Name');
        }
        if (errURL) {
            err.push('Song URL');
        }
        if (err.length > 0) {
            this._view.dumpErrors('errorMessageListSong', err.join(','));
        }
        if (errName || errURL) {
            return false;
        } else {
            return true;
        }
    };
}