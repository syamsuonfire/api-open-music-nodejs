const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const title = request.payload.title;
            const year = request.payload.year;
            const genre = request.payload.genre;
            const performer = request.payload.performer;
            const duration = request.payload.duration;
            const albumId = request.payload.albumId;

            const songId = await this._service.addSong({
                title,
                year,
                genre,
                performer,
                duration,
                albumId,
            });

            const response = h.response({
                status: "success",
                message: "Lagu berhasil ditambahkan",
                data: {
                    songId,
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

    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: "success",
            data: {
                songs,
            },
        };
    }

    async getSongByIdHandler(request, h) {
        try {
            const id = request.params.id;
            const song = await this._service.getSongById(id);
            return {
                status: "success",
                data: {
                    song,
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

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const title = request.payload.title;
            const year = request.payload.year;
            const genre = request.payload.genre;
            const performer = request.payload.performer;
            const duration = request.payload.duration;
            const albumId = request.payload.albumId;
            const id = request.params.id;

            await this._service.editSongById(id, {
                title,
                year,
                genre,
                performer,
                duration,
                albumId,
            });

            return {
                status: "success",
                message: "Lagu berhasil diperbarui",
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

    async deleteSongByIdHandler(request, h) {
        try {
            const id = request.params.id;
            await this._service.deleteSongById(id);

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

module.exports = SongsHandler;
