const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistsongHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistsongByIdHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistsongHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
];

module.exports = routes;
