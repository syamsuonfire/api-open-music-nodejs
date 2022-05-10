class Listener {
    constructor(playlistsService, mailSender) {
        this._playlistsService = playlistsService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { userId, playlistId, targetEmail } = JSON.parse(
                message.content.toString()
            );

            const playlist = await this._playlistsService.getPlaylist(
                userId,
                playlistId
            );

            const result = await this._mailSender.sendEmail(
                targetEmail,
                JSON.stringify({
                    playlist,
                })
            );
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Listener;
