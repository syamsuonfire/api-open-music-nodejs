const ClientError = require("../../exceptions/ClientError");

class PlaylistsHandler {
    constructor(playlistsService, usersService, validator) {
        this._playlistsService = playlistsService;
        this._validator = validator;
        this._usersService = usersService;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
        this.deletePlaylistByIdHandler =
            this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const playlistId = await this._playlistsService.addPlaylist({
                name,
                owner: credentialId,
            });

            const response = h.response({
                status: "success",
                message: "Playlist berhasil ditambahkan",
                data: {
                    playlistId,
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
            return response;
        }
    }

    async getPlaylistsHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._playlistsService.getPlaylists(
                credentialId
            );

            const playlistsProps = playlists.map((playlist) => ({
                id: playlist.id,
                name: playlist.name,
                username: playlist.username,
            }));
            return {
                status: "success",
                data: {
                    playlists: playlistsProps,
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

    async getPlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(id, credentialId);
            const playlist = await this._playlistsService.getPlaylistById(id);

            return {
                status: "success",
                data: {
                    playlist,
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

    async deletePlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            await this._playlistsService.deletePlaylistById(id);
            return {
                status: "success",
                message: "Playlist berhasil dihapus",
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

module.exports = PlaylistsHandler;
