/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("playlists", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        name: {
            type: "TEXT",
            notNull: true,
        },
        created_at: {
            type: "TEXT",
            notNull: true,
        },
        updated_at: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("playlists");
};
