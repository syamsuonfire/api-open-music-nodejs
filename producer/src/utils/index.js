/* eslint-disable camelcase */
const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    created_at,
    updated_at,
    username,
    name,
    owner,
    playlist_id,
    song_id,
    cover,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    createdAt: created_at,
    updatedAt: updated_at,
    username,
    name,
    owner,
    playlistId: playlist_id,
    songId: song_id,
    coverUrl: cover,
});

module.exports = { mapDBToModel };
