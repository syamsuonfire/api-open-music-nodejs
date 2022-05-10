const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistsongPayloadSchema } = require("./schema");

const PlaylistsongsValidator = {
  validatePlaylistsongPayload: (payload) => {
    const validationResult = PlaylistsongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsongsValidator;
