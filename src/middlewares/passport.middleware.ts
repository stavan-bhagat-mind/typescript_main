"use strict";
import passport from "passport";
import GooglePassport from "passport-google-oauth20";
import * as GitHubPassport from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

const GoogleStrategy = GooglePassport.Strategy;

// Interfaces for OAuth User and Email
interface IOauthEmail {
  value: string;
  verified?: boolean;
}

interface IOauthUser {
  id: string;
  emails?: IOauthEmail[];
  name?: { familyName?: string; givenName?: string };
  photos?: { value: string }[];
  provider: string;
  username?: string; // GitHub-specific
  displayName?: string; // GitHub-specific
  _json?: any; // For GitHub avatar_url and other raw data
}

interface NormalizedUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  provider: string;
  profileUrl?: string;
  username?: string;
  accessToken?: string;
  refreshToken?: string | null;
}

// Normalize OAuth profile (Google or GitHub)
const userProfile = (
  profile: IOauthUser,
  accessToken: string,
  refreshToken: string | undefined
): NormalizedUser => {
  const { id, name, emails, provider, username, displayName, photos } = profile;

  let firstName: string | undefined;
  let lastName: string | undefined;
  let email: string | undefined;
  let profileUrl: string | undefined;
  let profileUsername: string | undefined;

  // Extract email
  if (emails && emails.length) {
    email = emails[0].value;
  } else if (provider === "github") {
    email = `${username}@github.placeholder.com`;
  }

  // Extract profile picture
  if (photos && photos.length) {
    profileUrl = photos[0].value;
  } else if (provider === "github") {
    profileUrl = profile._json?.avatar_url || null;
  }

  // Extract username
  if (provider === "github" && username) {
    profileUsername = username;
  } else if (provider === "google" && emails) {
    profileUsername = emails[0].value.split("@")[0];
  }

  // Extract names
  if (provider === "google" && name) {
    firstName = name.givenName || "Unknown";
    lastName = name.familyName || "User";
  } else if (provider === "github" && displayName) {
    const nameParts = displayName.trim().split(" ");
    firstName = nameParts[0] || "Unknown";
    lastName = nameParts.slice(1).join(" ") || "User";
  } else {
    firstName = username || email?.split("@")[0] || "Unknown";
    lastName = "User";
  }

  return {
    id,
    firstName,
    lastName,
    email,
    provider,
    profileUrl,
    username: profileUsername,
    accessToken,
    refreshToken: refreshToken || null,
  };
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: process.env.REDIRECT_URI!,
      scope: ["profile", "email"],
      //   prompt: "consent", // Ensures refresh token is returned
      passReqToCallback: true,
    },
    (
      _req: Express.Request,
      accessToken: string,
      refreshToken: string | undefined,
      profile: IOauthUser,
      cb: (error: any, user?: any) => void
    ) => {
      const userData = userProfile(profile, accessToken, refreshToken);
      cb(null, userData);
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubPassport.Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_REDIRECT_URI!,
      scope: ["user:email", "read:user"], // Include read:user for profile data
      passReqToCallback: true,
    },
    (
      _req: Express.Request,
      accessToken: string,
      refreshToken: string | undefined,
      profile: IOauthUser,
      cb: (error: any, user?: any) => void
    ) => {
      const userData = userProfile(profile, accessToken, refreshToken);
      cb(null, userData);
    }
  )
);

// Serialize and deserialize user for session (optional if using JWT)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
