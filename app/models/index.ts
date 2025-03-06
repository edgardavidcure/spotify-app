import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// ========================== User Schema ==========================
const UserSchema = new Schema({
  spotifyId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String },
  profilePicture: { type: String },
  lastFetched: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);
// ========================== Top Data Schema ==========================
const topDataSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true },
  topArtists: [{ type: String, required: true }],
  topSongs: [{ type: String, required: true }],
  lastFetched: { type: Date, required: true },
});

export const TopData = models.TopData || model("TopData", topDataSchema);
// ========================== Currently Playing Schema ==========================
const CurrentlyPlayingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  songId: String,
  songName: String,
  artist: String,
  album: String,
  image: String,
  timestamp: { type: Date, default: Date.now, expires: 300 },
});
CurrentlyPlayingSchema.index({ user: 1, timestamp: -1 });

export const CurrentlyPlaying =
  models.CurrentlyPlaying || model("CurrentlyPlaying", CurrentlyPlayingSchema);

// ========================== Recently Played Schema ==========================
const RecentlyPlayedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  songId: String,
  playedAt: { type: Date, default: Date.now },
});
RecentlyPlayedSchema.index({ user: 1, playedAt: -1 });

export const RecentlyPlayed =
  models.RecentlyPlayed || model("RecentlyPlayed", RecentlyPlayedSchema);

// ========================== Circle Schema ==========================
const CircleSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Circle = models.Circle || model("Circle", CircleSchema);

const CircleMemberSchema = new Schema({
  circle: { type: Schema.Types.ObjectId, ref: "Circle", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  addedAt: { type: Date, default: Date.now },
});
CircleMemberSchema.index({ circle: 1, user: 1 }, { unique: true });

export const CircleMember =
  models.CircleMember || model("CircleMember", CircleMemberSchema);

// ========================== Post Schema ==========================
const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  songId: String,
  caption: String,
  createdAt: { type: Date, default: Date.now },
});
PostSchema.index({ createdAt: -1, user: 1 });

export const Post = models.Post || model("Post", PostSchema);

const LikeSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
LikeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = models.Like || model("Like", LikeSchema);

// ========================== Feed Schema ==========================
const FeedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});
FeedSchema.index({ user: 1, createdAt: -1 });

export const Feed = models.Feed || model("Feed", FeedSchema);

// ========================== Direct Message Schema ==========================
const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export const Message = models.Message || model("Message", MessageSchema);

// ========================== Notifications Schema ==========================
const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "message"],
    required: true,
  },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
NotificationSchema.index({ user: 1, createdAt: -1 });

export const Notification =
  models.Notification || model("Notification", NotificationSchema);

// ========================== Subscription Schema ==========================
const SubscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["free", "premium"], default: "free" },
  expiresAt: { type: Date },
});
SubscriptionSchema.index({ user: 1 });

export const Subscription =
  models.Subscription || model("Subscription", SubscriptionSchema);

// ========================== WebSocket Events Schema ==========================
const WebSocketEventSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventType: { type: String, required: true },
  payload: Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});
WebSocketEventSchema.index({ user: 1, timestamp: -1 });

export const WebSocketEvent =
  models.WebSocketEvent || model("WebSocketEvent", WebSocketEventSchema);
