require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
const spotRoutes = require("./routes/index.js");
app.use("/", spotRoutes);

app.get("/artist-search", (req, res, next) => {
  let { artistName } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      res.render("artist-search-results.hbs", {object: data.body.artists.items});
      console.log("The Received", data.body.artists.items.images);
      // res.json(data.body.artists)
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  let id = req.params.artistId
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      res.render("albums.hbs", {album: data.body.items})
      // res.json(data.body.items)
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get("/albums/:albumId/tracks", (req, res, next) => {
  let id = req.params.albumId;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      res.render("tracks.hbs", { track: data.body.items});
      // res.json(data.body.items)
    })
    .catch((err) => {
      console.log(err);
    });
});







app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
