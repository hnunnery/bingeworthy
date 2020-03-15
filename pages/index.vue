<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <h1>LIS5364 Binge Watch Ratings</h1>
      <h2>LIS5364 Show Ratings</h2>
      <div class="content mx-2">
        <form @submit.prevent="addRating">
          <input type="text" name="name" placeholder="Name of Show" v-model="name" />
          <input type="text" name="platform" placeholder="Netflix/Hulu/Disney+" v-model="platform" />
          <input type="text" name="rating" placeholder="Rating (0-10)" v-model="rating" />
          <input type="text" name="user" placeholder="Your Name" v-model="user" />
          <button type="submit">Add to List</button>
        </form>
      </div>
      <v-flex v-for="rating in ratings" :key="rating.id" class="mb-5">
        <v-card class="px-4 mx-2">
          <v-layout>
            <v-flex>
              <v-row align="center" justify="center" class="text-center">
                <v-col cols="12" sm="4" class="headline">{{ rating.name }}</v-col>
                <v-col cols="12" sm="2">{{ rating.rating }}</v-col>
                <v-col cols="12" sm="2">Watched on {{ rating.platform }}</v-col>
                <v-col cols="12" sm="3">{{ rating.user }}</v-col>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    fab
                    x-small
                    absolute
                    bottom
                    right
                    color="primary"
                    @click="deleteRating(rating.id)"
                  >X</v-btn>
                </v-card-actions>
              </v-row>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "@/plugins/firebase.js";

export default {
  data() {
    return {
      ratings: [],
      name: "",
      platform: "",
      rating: "",
      user: ""
    };
  },
  methods: {
    addRating() {
      // saving data to firestore
      db.collection("show").add({
        name: this.name,
        platform: this.platform,
        rating: this.rating,
        user: this.user
      });
    },
    deleteRating(id) {
      // removing data from firestore
      db.collection("show")
        .doc(id)
        .delete();
    }
  },
  created() {
    console.log("created");
    db.collection("show")
      .orderBy("rating", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let rating = doc.data();
          rating.id = doc.id;
          this.ratings.push(rating);
        });
      });
  }
};
</script>

<style scoped>
body {
  font-family: ubuntu;
}

h1 {
  color: #ceb888;
  font-size: 64px;
  letter-spacing: 2px;
  margin-top: 80px;
  text-align: center;
}

h2 {
  color: #ceb888;
  font-size: 32px;
  letter-spacing: 1.5px;
  margin-top: 30px;
  text-align: center;
  display: none;
}

.content {
  background: #fafafa;
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
}

form {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 4fr 1fr 1fr 4fr 2fr;
  justify-content: center;
  align-items: center;
  color: #555;
}

form input {
  float: left;
  margin: 0;
  border: 0;
  border-bottom: 1px solid #eee;
  margin: 0 1%;
  padding: 10px;
  display: block;
  box-sizing: border-box;
  font-size: 18px;
}

form input:focus {
  outline: none;
  border-bottom: 3px solid #782f40;
  padding-bottom: 8px;
  transition: all ease 0.2s;
}

form:after {
  content: "";
  clear: both;
  display: block;
}

button {
  background: #782f40;
  border-radius: 10px;
  padding: 10px;
  box-shadow: -1px 0px 1px rgba(0, 0, 0, 0.1);
  color: #fafafa;
  font-family: ubuntu;
  font-size: 1.1em;
  cursor: pointer;
}

/* MEDIA QUERIES */

@media only screen and (max-width: 1250px) {
  h1 {
    display: none;
  }
  h2 {
    display: block;
  }
  li,
  form {
    grid-template-columns: repeat(auto-fit, minmax(280px, auto));
  }
}
</style>