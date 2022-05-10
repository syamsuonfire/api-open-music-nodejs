const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumLikesService {
    constructor(cacheService) {
        this._pool = new Pool();

        this._cacheService = cacheService;
    }

    async addAlbumLike(userId, albumId) {
        const id = `like-${nanoid(16)}`;
        const query = {
            text: "INSERT INTO user_album_likes VALUES ($1, $2, $3) returning id",
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Gagal melakukan Like");
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
        return result.rows[0].id;
    }

    async deleteAlbumLike(userId, albumId) {
        const query = {
            text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 returning id",
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError("Gagal melakukan unlike");
        }

        await this._cacheService.delete(`album_likes:${albumId}`);
    }

    async checkAlreadyLike(userId, albumId) {
        const query = {
            text: "SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            return false;
        }
        return true;
    }

    async getLikesCount(albumId) {
        try {
            const result = await this._cacheService.get(
                `album_likes:${albumId}`
            );
            const like = {
                count: JSON.parse(result),
                source: "cache",
            };
            return like;
        } catch (error) {
            const query = {
                text: "SELECT * FROM user_album_likes WHERE album_id = $1",
                values: [albumId],
            };

            const result = await this._pool.query(query);
            if (!result.rows.length) {
                throw new InvariantError("Album tidak memiliki like");
            }

            await this._cacheService.set(
                `album_likes:${albumId}`,
                JSON.stringify(result.rows.length)
            );

            const like = {
                count: result.rows.length,
                source: "db",
            };
            return like;
        }
    }
}

module.exports = AlbumLikesService;
