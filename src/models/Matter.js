const mongoose = require("mongoose");

const MatterState = Object.freeze({
    GAS: "Gas",
    LIQUID: "Liquid",
    SOLID: "Solid",
});

const MatterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        enum: Object.values(MatterState),
        default: MatterState.GAS,
    },
});

// To make the `MatterState` object available in other files
Object.assign(MatterSchema.statics, {
    MatterState,
});

module.exports = mongoose.models.Matter || mongoose.model("Matter", MatterSchema);
