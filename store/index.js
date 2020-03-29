import { db, auth } from "@/plugins/firebase.js";

// STORE

export const state = () => ({
  user: null,
  ratings: [],
  masterRatings: [],
  names: [],
  platforms: [],
  error: null,
  searchBar: false
});

// MUTATIONS

export const mutations = {
  setLoadedRatings(state, payload) {
    state.ratings = payload;
    state.names = state.ratings.map(rating => rating.name);
    state.platforms = state.ratings.map(rating => rating.platform);
  },
  addRating(state, payload) {
    state.ratings.push(payload);
    state.ratings.sort((a, b) => (a.rating < b.rating ? 1 : -1));
  },
  deleteRating(state, payload) {
    state.ratings = state.ratings.filter(rating => rating.id !== payload);
  },
  updateRating(state, payload) {
    state.ratings.forEach(rating => {
      if (rating.id === payload.id) {
        rating.name = payload.name;
        rating.rating = payload.rating;
        rating.platform = payload.platform;
        rating.user = payload.user;
      }
    });
    state.ratings.sort((a, b) => (a.rating < b.rating ? 1 : -1));
  },
  clearRatings(state) {
    state.ratings = [];
  },
  setMasterRatings(state, payload) {
    state.masterRatings = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
  clearError(state) {
    state.error = null;
  },
  searchBarToggle(state) {
    state.searchBar = !state.searchBar;
  },
  // USER HANDLING
  setUser(state, payload) {
    state.user = payload;
  }
};

// ACTIONS

export const actions = {
  loadRatings({ commit, dispatch }) {
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
        dispatch("createMasterRatings");
      });
  },
  createMasterRatings({ commit, state }) {
    let tempMaster = [];
    let nameList = [];
    state.names.map(x => {
      if (!nameList.includes(x)) {
        nameList.push(x);
      }
    });
    nameList.forEach(name => {
      let obj = {};
      obj.name = name;
      obj.platform = "";
      obj.ratings = [];
      obj.users = [];
      state.ratings.forEach(rating => {
        if (rating.name === name) {
          obj.platform = rating.platform;
          obj.ratings.push(rating.rating);
          obj.users.push(rating.user);
        }
      });
      tempMaster.push(obj);
    });
    tempMaster.forEach(rating => {
      let averageRating = parseFloat(
        rating.ratings.reduce((a, b) => a + b, 0) / rating.ratings.length
      );
      // CURRENT WEIGTHING PER RATING IS .01
      let weight = rating.ratings.length * 0.01;
      rating.averageRating = averageRating + weight;
    });
    const master = tempMaster.filter(rating => rating.ratings.length > 1);
    master.sort((a, b) => (a.averageRating < b.averageRating ? 1 : -1));
    master.forEach(rating => {
      rating.rank = master.indexOf(rating) + 1;
      rating.roundedRating = rating.averageRating.toFixed(2);
      console.log(
        `${rating.rank}: ${rating.name} (${rating.averageRating.toFixed(2)})`
      );
    });
    // ROUNDING DOWN TO NEAREST .5 TO CONTROL VUETIFY RATING COMPONENT
    master.forEach(rating => {
      rating.averageRating = Math.floor(rating.averageRating * 2) / 2;
    });

    // COMMIT TO MUTATION AND STATE
    commit("setMasterRatings", master);
  },
  // USER HANDLING
  signUserUp({ commit }, payload) {
    commit("clearError");
    auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        const newUser = {
          // user.uid is undefined until later
          id: user.uid
        };
        commit("setUser", newUser);
      })
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  signUserIn({ commit }, payload) {
    commit("clearError");
    auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        const newUser = {
          id: user.uid,
          name: ""
        };
        commit("setUser", newUser);
      })
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  autoSignIn({ commit }, payload) {
    commit("setUser", {
      id: payload.uid,
      name: ""
    });
  },
  logout({ commit }) {
    auth.signOut();
    commit("setUser", null);
    this.$router.push("/");
  }
};

export const getters = {
  ratingsChange(state) {
    return state.ratings;
  },
  userRatings(state) {
    let newList = [];
    state.ratings.forEach(rating => {
      if (rating.userId === state.user.id) {
        newList.push(rating);
      }
    });
    return newList;
  },
  error(state) {
    return state.error;
  },
  user(state) {
    return state.user;
  }
};

export const strict = false;
