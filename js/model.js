'use strict';

class ModelAPI {

    /**
     * function get 2 parameters object and callback function name,
     * if response success get all id's names and urls from API
     * and call function to dump it.
     * @param obj
     * @param cb
     */
    getAllPlaylists(obj, cb) {
        $.ajax({
            url: "http://localhost/playlist/api/playlist",
            method: "GET",
            dataType: "json"
        }).done((res) => {
            if (res.success) {
                obj[cb](res);
            } else {
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert("Request failed: " + textStatus);
            console.log("Request failed: " + textStatus);
        });
    };

    /**
     * function get 3 parameters object, callback function name, and id
     * if response success return array of objects{name,url} in function callback.
     * @param obj
     * @param cb
     * @param id
     */
    getPlaylistSongs(obj, cb, id) {
        $.ajax({
            url: `http://localhost/playlist/api/playlist/${id}/songs`,
            method: "GET",
            dataType: "json"
        }).done((res) => {
            if (res.success) {
                obj[cb](res.data.songs);
            } else {
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            console.log(textStatus);
        });
    };

    /**
     * function get 5 parameters object, callback function name, id,name,image url
     * and update database with new name, new image url
     * if response success return id,name and image url in function callback.
     * @param obj
     * @param cb
     * @param id
     * @param name
     * @param image
     */
    updateExistingPlaylistInfo(obj, cb, id, name, image) {
        $.ajax({
            url: `http://localhost/playlist/api/playlist/${id}`,
            method: 'POST',
            data: {
                'name': name,
                'image': image
            },
        }).done((res) => {
            if (res.success) {
                obj[cb](id, name, image);
            } else {
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            console.log(textStatus);
        });
    };

    /**
     * function get 3 parameters id, songs, object, callback function name,
     * if parameter obj or cb equal false only update songs else
     * if response success call function callback with parameters obj,cb,id.
     * @param id
     * @param songs
     * @param obj
     * @param cb
     */
    updatePlaylistSongs(id, songs, obj, cb) {
        $.ajax({
            url: `http://localhost/playlist/api/playlist/${id}/songs`,
            method: 'POST',
            data: {
                'songs': songs
            },
        }).done((res) => {
            if (res.success) {
                if (obj && cb) {
                    this.getPlaylistSongs(obj, cb, id);
                }
            } else {
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            console.log(textStatus);
        });
    };

    /**
     * function get 5 parameters object, callback function name, name,image url, songs
     * and create new playlist.
     * if response success return id,name and image url in function callback.
     * @param obj
     * @param cb
     * @param name
     * @param image
     * @param songs
     */
    createNewPlaylists(obj, cb, name, image, songs) {
        $.ajax({
            url: 'http://localhost/playlist/api/playlist',
            method: 'POST',
            data: {
                'name': name,
                'image': image,
                'songs': songs
            },
        }).done(function (res) {
            if (res.success) {
                obj[cb](res.data.id, name, image);
            } else {
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            console.log(textStatus);
        });
    };

    /**
     * function get 3 parameters object, callback function name, and id.
     * if response success delete playlist from database, and
     * return id in function callback.
     * @param obj
     * @param cb
     * @param id
     */
    deleteExistingPlaylist(obj, cb, id) {
        $.ajax({
            url: `http://localhost/playlist/api/playlist/${id}`,
            method: "DELETE",
            dataType: "json",
        }).done(function (res) {
            if (res.success) {
                obj[cb](id);
            }else{
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            console.log(textStatus);
        });
    };

    /**
     * function get 3 parameters object, callback function name, and id
     * if response success return id,name and image url of album in function callback.
     *
     * @param obj
     * @param cb
     * @param id
     */
    getExistingPlaylist(obj, cb, id) {
        $.ajax({
            url: "http://localhost/playlist/api/playlist/" + id,
            method: "GET",
            dataType: "json",
        }).done((res) => {
            if (res.success) {
                obj[cb](res);
            } else {
                console.log('problem with response from API');
            }
        }).fail(function (jqXHR, textStatus) {
            //alert( "Request failed: " + textStatus );
            console.log("Request failed: " + textStatus);
        });
    };
}