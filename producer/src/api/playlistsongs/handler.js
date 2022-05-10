const ClientError = require("../../exceptions/ClientError");
const songs = require("../songs");

class PlaylistsongsHandler {
    constructor(
        playlistsongsService,
        playlistsService,
        songsService,
        validator
    ) {
        this._playlistsongsService = playlistsongsService;
        this._playlistsService = playlistsService;
        this._songsService = songsService;
        this._validator = validator;

        this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
        this.getPlaylistsongByIdHandler =
            this.getPlaylistsongByIdHandler.bind(this);
        this.deletePlaylistsongHandler =
            this.deletePlaylistsongHandler.bind(this);
    }

    async postPlaylistsongHandler(request, h) {
        try {
            this._validator.validatePlaylistsongPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload;
            const { id: playlistId } = request.params;

            await this._songsService.getSongById(songId);

            await this._playlistsService.verifyPlaylistAccess(
                playlistId,
                credentialId
            );
            const playlistsongId =
                await this._playlistsongsService.addPlaylistsong(
                    songId,
                    playlistId
                );

            const response = h.response({
                status: "success",
                message: "Lagu berhasil ditambahkan",
                data: {
                    playlistsongId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            console.log(error.message);
            return response;
        }
    }

    async getPlaylistsongByIdHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { id: playlistId } = request.params;

            await this._playlistsService.verifyPlaylistAccess(
                playlistId,
                credentialId
            );
            const playlistsongs =
                await this._playlistsongsService.getPlaylistsongById(
                    playlistId
                );
            const playlists = await this._playlistsService.getPlaylistById(
                playlistId
            );

            const playlistsongsProps = playlistsongs.map((playlistsong) => ({
                id: playlistsong.id,
                title: playlistsong.title,
                performer: playlistsong.performer,
            }));

            return {
                status: "success",
                data: {
                    playlist: { ...playlists, songs: playlistsongsProps },
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deletePlaylistsongHandler(request, h) {
        try {
            this._validator.validatePlaylistsongPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload;
            const { id: playlistId } = request.params;

            await this._playlistsService.verifyPlaylistAccess(
                playlistId,
                credentialId
            );
            await this._playlistsongsService.deletePlaylistsong(
                songId,
                playlistId
            );

            return {
                status: "success",
                message: "Lagu berhasil dihapus",
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistsongsHandler;
