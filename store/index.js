import { db, auth } from "@/plugins/firebase.js";

// STORE

export const state = () => ({
  userDark: true,
  user: null,
  ratings: [],
  masterRatings: [],
  recentRatings: [],
  names: [],
  platforms: [],
  error: null,
  searchBar: false,
  message: "",
  success: false,
  admin: "12KI0hTtG5fHrX2TvFVpW5I3WF72"
});

// MUTATIONS

export const mutations = {
  setLoadedRatings(state, payload) {
    state.ratings = payload;
    state.ratings.sort((a, b) => (a.rating < b.rating ? 1 : -1));
    state.names = state.ratings.map(rating => rating.name);
    state.platforms = state.ratings.map(rating => rating.platform);
  },
  addAlert(state) {
    state.message = "Added!";
    state.success = true;
    setTimeout(() => {
      state.success = false;
    }, 1000);
  },
  deleteRating(state, payload) {
    state.ratings = state.ratings.filter(rating => rating.id !== payload);
  },
  deleteAlert(state) {
    state.message = "Deleted!";
    state.success = true;
    setTimeout(() => {
      state.success = false;
    }, 1000);
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
    state.message = "Updated!";
    state.success = true;
    setTimeout(() => {
      state.success = false;
    }, 1000);
  },
  clearRatings(state) {
    state.ratings = [];
  },
  setMasterRatings(state, payload) {
    state.masterRatings = payload;
  },
  setRecentRatings(state, payload) {
    state.recentRatings = payload;
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
  },
  setUserDark(state, payload) {
    state.userDark = payload;
  },
  updateUserName(state, payload) {
    state.user.name = payload;
    state.message = "Updated!";
    state.success = true;
    setTimeout(() => {
      state.success = false;
    }, 1000);
  },
  passwordReset(state, payload) {
    state.message = `Email sent to ${payload}`;
    state.success = true;
    setTimeout(() => {
      state.success = false;
    }, 2000);
  }
};

// ACTIONS

export const actions = {
  loadRatings({ commit, dispatch }) {
    let ratings = [];
    db.collection("show")
      .orderBy("rating", "desc")
      .onSnapshot(querySnapshot => {
        let changes = querySnapshot.docChanges();
        changes.forEach(change => {
          if (change.type == "added") {
            let rating = change.doc.data();
            rating.id = change.doc.id;
            ratings.push(rating);
            commit("setLoadedRatings", ratings);
            dispatch("createMasterRatings");
          } else if (change.type == "removed") {
            commit("deleteRating", change.doc.id);
            dispatch("createMasterRatings");
          }
        });
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
      // console.log(
      //   `${rating.rank}: ${rating.name} (${rating.averageRating.toFixed(2)})`
      // );
    });
    // ROUNDING DOWN TO NEAREST .5 TO CONTROL VUETIFY RATING COMPONENT
    master.forEach(rating => {
      rating.averageRating = Math.floor(rating.averageRating * 2) / 2;
    });

    // COMMIT TO MUTATION AND STATE
    commit("setMasterRatings", master);
  },
  createRecentRatings({ commit }) {
    let ratings = [];
    db.collection("show")
      .orderBy("date", "desc")
      .limit(30)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let rating = doc.data();
          rating.id = doc.id;
          rating.date = doc
            .data()
            .date.toDate()
            .toDateString()
            .split(" ")
            .slice(1, 3)
            .join(" ");
          ratings.push(rating);
        });
      });

    // COMMIT TO MUTATION AND STATE
    commit("setRecentRatings", ratings);
  },
  // USER HANDLING
  signUserUp({ commit }, payload) {
    commit("clearError");
    auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        auth.currentUser
          .updateProfile({
            displayName: payload.displayName
          })
          .then(function() {
            console.log("Updated Display Name");
            commit("updateUserName", payload.displayName);
          });
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
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  autoSignIn({ commit }, payload) {
    if (!payload.displayName) {
      this.$router.push("/updatename");
    } else {
      this.$router.push("/");
    }
    db.collection("users")
      .doc(payload.uid)
      .get()
      .then(querySnapshot => {
        commit("setUserDark", querySnapshot.data().dark);
      });
    commit("setUser", {
      id: payload.uid,
      name: payload.displayName
    });
  },
  updateDisplayName({ commit }, payload) {
    commit("clearError");
    const router = this.$router;
    auth.currentUser
      .updateProfile({
        displayName: payload
      })
      .then(function() {
        commit("updateUserName", payload);
        router.push("/");
      })
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  saveUserDark({ state }, payload) {
    let userId = state.user.id;
    db.collection("users")
      .doc(userId)
      .set({
        dark: payload
      })
      .then(docRef => {
        console.log(`Dark Mode set to ${payload}`);
      });
  },
  logout({ commit }) {
    auth.signOut();
    commit("setUser", null);
    this.$router.push("/");
  }
};

export const getters = {
  masterRatings(state) {
    return state.masterRatings;
  },
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
  recentRatings(state) {
    return state.recentRatings;
  },
  error(state) {
    return state.error;
  },
  fetchMessage(state) {
    return state.message;
  },
  fetchSuccess(state) {
    return state.success;
  },
  user(state) {
    return state.user;
  },
  userDark(state) {
    return state.userDark;
  }
};

export const strict = false;
