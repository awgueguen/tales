/* global ------------------------------------------------------------------ */
import React from "react";

const FriendCard = ({ profilePic, nickname, username, full }) => {
  nickname = nickname.length > 14 && !full ? nickname.substring(0, 14) + "..." : nickname;
  nickname = nickname.charAt(0).toUpperCase() + nickname.slice(1);

  username = username.length > 14 && !full ? username.substring(0, 14) + "..." : username;
  username = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <div className="friend-card">
      <div className="friend-card__image">
        <img alt={username} src={profilePic} />
      </div>
      <div className="friend-card__details">
        <span className="friend-card__nickname">{nickname}</span>
        <span className="friend-card__username">{username}</span>
      </div>
    </div>
  );
};

export default FriendCard;
