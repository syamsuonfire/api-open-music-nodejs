const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = "album-" + nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
            values: [id, name, year, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Album gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query(
            "SELECT id, name, year FROM albums"
        );
        return result.rows;
    }

    async getAlbumById(id) {
        const query = {
            text: "SELECT * FROM albums WHERE id = $1",
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Album tidak ditemukan");
        }

        return result.rows.map(mapDBToModel)[0];
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                "Gagal memperbarui album. Id tidak ditemukan"
            );
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: "DELETE FROM albums WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
        }
    }

    async addCoverAlbumById(id, cover) {
        const query = {
            text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
            values: [cover, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError(
                "Gagal memperbarui cover. Id tidak ditemukan"
            );
        }
    }
}

module.exports = AlbumsService;
