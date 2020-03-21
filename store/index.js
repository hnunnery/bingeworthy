import { db } from "@/plugins/firebase.js";

// STORE

export const state = () => ({
  ratings: []
});

// MUTATIONS

export const mutations = {
  setLoadedRatings(state, payload) {
    state.ratings = payload;
  }
};

// ACTIONS

export const actions = {
  loadRatings({ commit }) {
    db.collection("show")
      .orderBy("rating", "desc")
      .get()
      .then(querySnapshot => {
        let ratings = [];
        querySnapshot.forEach(doc => {
          let rating = doc.data();
          rating.id = doc.id;
          ratings.push(rating);
        });
        commit("setLoadedRatings", ratings);
      });
  }
};

// GETTERS

export const getters = {};

export const strict = false;
