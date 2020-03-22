import { db } from "@/plugins/firebase.js";

// STORE

export const state = () => ({
  ratings: []
});

// MUTATIONS

export const mutations = {
  setLoadedRatings(state, payload) {
    state.ratings = payload;
  },
  clearRatings(state) {
    state.ratings = [];
  }
};

// ACTIONS

export const actions = {
  loadRatings({ commit }) {
    commit("clearRatings");
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

export const getters = {
  names(state) {
    return state.ratings.map(rating => rating.name);
  },
  platforms(state) {
    return state.ratings.map(rating => rating.platform);
  }
};

export const strict = false;

// use to push {user: rating} on to array within Average Rating Object
// let userList = state.ratings.map(ratingObj => {
//   let userObj = {};
//   userObj[ratingObj.user] = ratingObj.rating;
//   console.log(userObj);
//   return userObj;
// });
