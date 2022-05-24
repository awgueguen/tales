<div className="private-room-wrapper">
  <div className="existing-rooms">
    {inRoomList &&
      inRoomList.map((r, index) => {
        return (
          <div key={index}>
            <Link
              className="private-card-link"
              to={`/rooms/${r.id}`}
              state={{ alreadyUser: true }}
              // const userId = useLocation()?.state?.user || 'INVITE';
            >
              <PrivateCard isAdmin={r.isAdmin} img={r.room.story.image} title={r.room.story.title} />
            </Link>
          </div>
        );
      })}
  </div>

  <div className="create-room" onClick={handleModal}>
    {/**
     * background '+' en image?
     */}
    <div style={{ color: "red", fontSize: "20px" }}>+ Click here to show how to Add room</div>
  </div>
  {modal ? (
    <ModalRoom
      step={step}
      setStep={setStep}
      backwardStep={backwardStep}
      input={input}
      setInput={setInput}
      handleChange={handleChange}
    />
  ) : (
    ""
  )}
</div>;

<div className="public-room-wrapper">
  {publicList !== undefined &&
    publicList.map((r, index) => {
      /* ici on return un lien si on peut rejoindre ou une div avec className si full pour la mettre en opacity inférieure en css ? */
      return (
        <div key={index}>
          {r.participants.length === r.maxParticipants ? (
            <div className="full-public-room">
              <PublicCard title={r.story.title} description={r.story.description} img={r.story.image} full={true} />
            </div>
          ) : (
            <Link className="public-card-link" to={`/rooms/${r.id}`} state={{ alreadyUser: false }}>
              <PublicCard
                title={r.story.title}
                description={r.story.description}
                img={r.story.image}
                participants={r.participants}
                max_participants={r.maxParticipants}
              />
            </Link>
          )}
        </div>
      );
    })}
</div>;
