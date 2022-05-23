/**
 * WIP
 */
/* global ------------------------------------------------------------------ */
import React from "react";

const FriendCard = ({ profilePic, nickname }) => {
  nickname = nickname.length > 12 ? nickname.substring(0, 12) + "..." : nickname;
  nickname = nickname.charAt(0).toUpperCase() + nickname.slice(1);

  return (
    <div className="friend-card">
      <div className="friend-card__image">
        <img src={profilePic} />
      </div>
      <div className="friend-card__nickname">
        <p>{nickname}</p>
      </div>
    </div>
  );
};

export default FriendCard;
