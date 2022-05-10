const { Pool } = require("pg");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylist(userId, playlistId) {
        const query = {
            text: "SELECT id,name FROM playlists WHERE owner = $1",
            values: [userId],
        };
        const nextQuery = {
            text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
            INNER JOIN songs ON playlistsongs.song_id = songs.id
            WHERE playlistsongs.playlist_id = $1`,
            values: [playlistId],
        };
        const result = await this._pool.query(query);

        result.rows[0].songs = (await this._pool.query(nextQuery)).rows;

        const playlist = result.rows[0];
        return playlist;
    }
}

module.exports = PlaylistsService;
