export const state = {
    notifications : []
}
export const getters = {}

export const mutations = {
  ["ADD_NOTIFICATION"] (state, { message, color }) {
    state.notifications.push(message);
  }
}

export const actions = {
  addNotification ({ commit }, { message, color }) {
    commit("ADD_NOTIFICATION", { message, color })
  }
}

