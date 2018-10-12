'use strict';

class List {

    /**
     *  Constructor
     * @param view
     * @param model
     */
    constructor(view, model) {
        this._view = view;
        this._model = model;
        this._ctr = $('.list ul');
        this._album = [];
        this._albumName = '';
        this._edit = false;
        this._selectedID = null;
        this._songs = [];
        this._audioPlayerID = null;
    }

    /**
     * function get 4 parameters id,name,image, DOM element and add to album.
     * @param id
     * @param name
     * @param image
     * @param objElement
     */
    addAlbumToList(id, name, image, objElement) {
        this._album.push({
            id: id,
            name: name,
            image: image,
            obj: objElement
        });
    };

    /**
     * function get one parameter id
     * and return playlist with this id if exist else return null.
     * @param id
     * @returns {*}
     */
    getAlbumByID(id) {
        let result = null;
        if (this._album.length > 0) {
            for (let i = 0; i < this._album.length; i++) {
                if (this._album[i].id === id) {
                    result = this._album[i];
                    break;
                }
            }
        }
        return result;
    };

    /**
     * function get one parameter id, and
     * remove playlist with this id.
     * @param id
     */
    deleteAlbumFromList(id) {
        //get playlist by id.
        let alb = this.getAlbumByID(id);
        //remove rainbow.
        alb.obj.find('p').rainbow(false);
        //remove object itself from DOM.
        alb.obj.remove();
    };

    /**
     * function get 3 parameters id,name,image and
     * changing this parameters in DOM and in object _album.
     * @param id
     * @param name
     * @param image
     */
    editAlbumById(id, name, image) {
        let alb = this.getAlbumByID(id);

            if (alb) {
                let $p = alb.obj.find('p');
                $p.arctext('destroy');
                $p.text(name);
                $p.arctext({radius: 110});

                alb.obj.find('img').attr('src', image);

                alb.id = id;
                alb.name = name;
                alb.url = image;
            }
    };

    /**
     * function get data{id,name,image} from DataBase
     * dump it and add to member _album.
     * @param res
     */
    addToListFromAPI(res) {
        for (let data of res.data) {
            let obj = this.dumpAlbum(data.id, data.name, data.image);
            this.addAlbumToList(data.id, data.name, data.image, obj);
        }
    }

    /**
     * function get 3 parameters id,name,image
     * create playlist elements with adding event listeners on elements
     * {delete,edit,play} and return DOM elements.
     * @param id
     * @param name
     * @param image
     * @returns {jQuery|HTMLElement}
     */
    dumpAlbum(id, name, image) {
        let $elements = $(`<li><div class="songCtr"><p class="arcText">${name}</p><img src="${image}"><i class="playpause fa fa-play-circle-o" aria-hidden="true"></i><i class="edit fa fa-pencil" aria-hidden="true"></i><i class="remove fa fa-remove" aria-hidden="true"></i></div></li>`);
        //event i delete album
        $elements.find('.remove').on('click', () => {
            //console.log('delete album id: ', id);
            this._selectedID = id;
            // console.log('delete album selectedID id: ', this._selectedID);
            $('#deleteAlbum').modal('toggle');
        });
        //event i  edit album
        $elements.find('.edit').on('click', () => {
            //console.log('edit album id: ', (id));
            //clean errors
            this._view.cleanErrors('errorMessage');
            this._view.cleanErrors('errorImageMessage');
            this._view.cleanErrors('errorMessageListSong');

            $('#addEditPlayListModal div.modal-header h3 span').text('Edit Playlist Songs');
            $('#playlistSongs div.modal-header h3 span').text('Edit Playlist Songs');

            this._edit = true;
            this._selectedID = id;
            this.dumpInputNameAndImageURL(id);

        });

        //event i play album
        $elements.find('.playpause').on('click', () => {
            //console.log('play album id: ', id);
            this._selectedID = id;
            this.loadPlayer(id, name, image);
        });

        this._ctr.append($elements);
        $('.arcText').arctext({radius: 110}).rainbow({
            colors: [
                '#FF0000',
                '#f26522',
                '#fff200',
                '#00a651',
                '#28abe2',
                '#2e3192',
                '#6868ff'
            ],
            animate: true,
            animateInterval: 100,
            pad: false,
            pauseLength: 100
        });

        return $elements;
    }

    /**
     * function get one parameter id.
     * dump in modal1 image with preview, name and
     * open modal1 window.
     * @param id
     */
    dumpInputNameAndImageURL(id) {

        let alb = this.getAlbumByID(id);
        let name = alb.obj.find('p').text();
        let img = alb.obj.find('img').attr('src');

        $('.inputName').val(name);
        $('.inputImageURL').val(img);
        this._view.previewImageURL(img);

        $('.inputsSongs').text('');
        $('#addEditPlayListModal').modal('toggle');

    }

    /**
     * function get 3 parameters id,name,image.
     * dump and add them to member _album.
     * @param id
     * @param name
     * @param url
     */
    createNewAlbum(id, name, url) {
        let objElement = this.dumpAlbum(id, name, url);
        this.addAlbumToList(id, name, url, objElement);
        //console.log('new album created');
    };

    /**
     * function get one parameter value.
     * if value characters >= 2 searching and dump playlist
     * if find value match in names else clean all playlist not found.
     * @param findValue
     */
    finder(findValue) {
        if (findValue.length === 0) {
            for (let i = 0; i < this._album.length; i++) {
                this._album[i].obj.show();
            }
        }
        else if (findValue.length >= 2) {
            for (let i = 0; i < this._album.length; i++) {
                if ((this._album[i].name.toLowerCase()).includes(findValue)) {
                    this._album[i].obj.show();
                } else {
                    this._album[i].obj.hide();
                }
            }
        }
    };

    /** Player **/

    /**
     * function get 3 parameters id,name,image.
     * open player window with name and image,
     * and call function to dump songs.
     * @param id
     * @param name
     * @param image
     */
    loadPlayer(id, name, image) {

        $('.audioplayer').show();
        let $img = $('.imgSong img');

        $img.attr("src", image);
        this._albumName = name;
        this._audioPlayerID = id;
        this._model.getPlaylistSongs(this, 'loadSongListToPlayerAndPlaySong', id);

    };

    /**
     * function get data from database.
     * create list of songs with events, and automatically play firs song in list.
     * @param data
     */
    loadSongListToPlayerAndPlaySong(data) {

        this._songs = data;

        let $list = $('.playerCtrRight ul');
        let $img = $('.imgSong img');
        let $audio = $('.playerCtrRight audio');
        let $icon = $('.iconPlay');
        let $nowPlaying = $('.runningText');
        let $btnsCtr = $('.buttonsAction');
        let $btnDelete = $(`<i class="deleteAlbum fa fa-trash" aria-hidden="true"></i>`);
        let $btnEdit = $(`<i class="editAlbum fa fa-pencil" aria-hidden="true"></i>`);

        let currentSong = 0;
        let totalSongs = 0;

        $btnsCtr.text('');
        $list.text('');
        for (let song of this._songs) {

            let $element = $(`<li><i class="fa ">&nbsp;</i><a href="${song.url}" >${song.name}</li>`);
            $element.on('click', (e) => {

                let url = e.target.attributes[0].value;
                let name = e.target.text;

                e.preventDefault();

                $nowPlaying.text('Now Playing: ' + this._albumName + ' - ' + name);
                $list.find('.fa').removeClass('fa-play');
                $element.find('.fa').addClass('fa-play');

                $audio[0].pause();
                $audio[0].src = url;
                $audio[0].play();
                currentSong = $element.index();
            });
            $list.append($element);
        }

        $btnDelete.on('click', () => {
            //console.log('player delete: ', this._selectedID);
            $('#deleteAlbum').modal('toggle');

        });
        $btnEdit.on('click', () => {

            this._edit = true;
            //this._selectedID = id;
            $('#addEditPlayListModal div.modal-header h3 span').text('Add New Playlist Songs');
            $('#playlistSongs div.modal-header h3 span').text('Add New Playlist Songs');
            this.dumpInputNameAndImageURL(this._selectedID);

        });
        $btnsCtr.append($btnDelete).append($btnEdit);


        $audio.attr('src', this._songs[0].url);
        $nowPlaying.text(`Now Playing:  ${this._albumName}  -  ${this._songs[0].name}`);
        $audio[0].play();
        $icon.addClass('fa-pause-circle-o');
        $('.playerCtrRight > ul > li:nth-child(1) > i').addClass('fa-play');


        totalSongs = $('.playerCtrRight ul li').length;
        let $song = $('.playerCtrRight ul li a');
        let iconFa = $('.playerCtrRight .fa ');

        $audio.on('playing', function () {
            $img.addClass('animatedImage');
            $icon.addClass('fa-pause-circle-o');
            //console.log('song playing');
        });
        $audio.on('pause', function () {
            $img.removeClass('animatedImage');
            $icon.removeClass('fa-pause-circle-o');
            $icon.addClass('fa-play-circle');
            //console.log('song paused');
        });
        $audio.on('ended', function () {
            $img.removeClass('animatedImage');
            //console.log('song ended');

            currentSong++;
            $list.find('.fa').removeClass('fa-play');

            if (currentSong === totalSongs) {
                currentSong = 0;
            }
            iconFa[currentSong].className = 'fa fa-play';
            $nowPlaying.text('Now Playing: ' + $song[currentSong].text);
            $audio[0].src = $song[currentSong].href;
            $audio[0].play();
        });

    };
}