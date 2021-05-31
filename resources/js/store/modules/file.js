export const state = {
    file: {
        source_packages: [],
        needle: ""
    }
};

export const getters = {
    json: state => state.file,
    count: state => state.file.source_packages.length,
    needle: state => state.file.needle
};

export const mutations = {
    ["SAVE_FILE"](state, { json }) {
        state.file = json;
    }
};

export const actions = {
    saveFile({ commit }, { json }) {
        commit("SAVE_FILE", { json });
    }
};
