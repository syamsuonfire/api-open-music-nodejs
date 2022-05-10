const ClientError = require("../../exceptions/ClientError");

class AlbumLikesHandler {
    constructor(service, albumsService) {
        this._service = service;
        this._albumsService = albumsService;

        this.postLikeHandler = this.postLikeHandler.bind(this);
        this.getLikeHandler = this.getLikeHandler.bind(this);
    }

    async postLikeHandler(request, h) {
        try {
            const { albumId } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._albumsService.getAlbumById(albumId);

            const alreadyLiked = await this._service.checkAlreadyLike(
                credentialId,
                albumId
            );

            if (!alreadyLiked) {
                const likeId = await this._service.addAlbumLike(
                    credentialId,
                    albumId
                );

                const response = h.response({
                    status: "success",
                    message: `Berhasil melakukan like pada album dengan id: ${likeId}`,
                });
                response.code(201);
                return response;
            }

            await this._service.deleteAlbumLike(credentialId, albumId);

            const response = h.response({
                status: "success",
                message: "Berhasil melakukan unlike",
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

    async getLikeHandler(request, h) {
        try {
            const { albumId } = request.params;

            const data = await this._service.getLikesCount(albumId);
            const likes = data.count;

            const response = h.response({
                status: "success",
                data: {
                    likes,
                },
            });
            response.header("X-Data-Source", data.source);
            response.code(200);

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
}

module.exports = AlbumLikesHandler;
