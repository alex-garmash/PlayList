'use strict';

class Controller {

    /**
     * Constructor
     */
    constructor() {
        this._model = new ModelAPI();
        this._view = new View();
        this._list = new List(this._view, this._model);
        this._editor = new Editor(this._list, this._view, this._model);

        this._model.getAllPlaylists(this._list, 'addToListFromAPI');

        /** Events **/

        /**
         * event listener on button 'Add new playlist'
         * on click open modal window to create new name and image url,
         * also clean all inputs and errors.
         */
        $('.addEditPlayListModal').on('click', () => {
            //console.log('btn add new album');
            $('#addEditPlayListModal div.modal-header h3 span').text('Add New Playlist Songs');
            $('#playlistSongs div.modal-header h3 span').text('Add New Playlist Songs');
            this._view.resetFieldsNameImageURL();
            this._view.removeAllFieldsSongURLAndNamesInputs();
            this._view.cleanErrors('errorImageMessage');
            this._view.cleanErrors('errorMessage');
            $('#addEditPlayListModal').modal('toggle');
        });

        /** Search album event
         *  start find album after second character,
         *  to show all albums input must bee empty.
         **/
        $('.inputSearch').on('keyup', (e) => {
            this._list.finder(e.target.value.trim());
        });
    };
}
