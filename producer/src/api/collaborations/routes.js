const routes = (handler) => [
    {
        method: "POST",
        path: "/collaborations",
        handler: handler.postCollaborationHandler,
        options: {
            auth: "playlistsapp_jwt",
        },
    },
    {
        method: "DELETE",
        path: "/collaborations",
        handler: handler.deleteCollaborationHandler,
        options: {
            auth: "playlistsapp_jwt",
        },
    },
];

module.exports = routes;
