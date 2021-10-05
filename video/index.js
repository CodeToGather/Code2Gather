const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

require("dotenv").config();

const PORT = process.env.PORT;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();

// Forces browser to never cache the response so that we always get a fresh token.
const nocache = (request, response, next) => {
  response.header(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  response.header("Expires", "-1");
  response.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = (request, response) => {
  // Set response header
  response.header("Acess-Control-Allow-Origin", "*");
  // Get channel name
  const channelName = request.query.channelName;
  if (!channelName) {
    return response.status(500).json({ error: "Channel name is required" });
  }
  // Get uid
  let uid = request.query.uid;
  if (!uid || uid == "") {
    uid = 0;
  }
  // Get role
  let role = RtcRole.SUBSCRIBER;
  if (request.query.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }
  // Get the expire time
  let expireTime = request.query.expireTime;
  if (!expireTime || expireTime == "") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // Calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  // Build the token
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
  return response.json({ token: token });
};

app.get("/access_token", nocache, generateAccessToken);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
