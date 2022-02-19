/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useQuery } from "@apollo/client";
import Container from "components/layout/container";
import CatchButton from "components/pokemon-detail/catch-button";
import CatchModal from "components/pokemon-detail/catch-modal";
import PokemonDetailAbout from "components/pokemon-detail/about";
import MoveList from "components/pokemon-detail/move-list";
import StatList from "components/pokemon-detail/stat-list";
import TypeList from "components/pokemon-detail/type-list";
import { GET_POKEMON_BY_NAME } from "graphql/queries";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import staticCDN from "convert-staticzap";
import { useQueryParams } from "hooks/useQueryParams";

const PokemonDetail = () => {
  const params = useParams();
  const location = useLocation();
  const { nickname } = useQueryParams(location.search);

  const [isCatching, setIsCatching] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const gqlVariables = { name: params.name };
  const { loading, error, data } = useQuery(GET_POKEMON_BY_NAME, {
    variables: gqlVariables,
  });

  const pokemon = {
    name: params.name || "",
    sprite: data?.pokemon?.sprites?.front_default || "",
    spriteAnimated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${params.id}.gif`,
    types: data?.pokemon?.types || [],
    moves: data?.pokemon?.moves || [],
    stats: data?.pokemon?.stats || [],
    about: {
      height: data?.pokemon?.height,
      weight: data?.pokemon?.weight,
      abilities: data?.pokemon?.abilities || [],
    },
  };

  const containerStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "center",
    marginTop: "24px",
    padding: "0 24px",
  });

  const spriteStyle = css({
    width: "70%",
    height: "auto",
    transition: `0.4s ease ${isCatching ? "1s" : "0s"}`,
  });

  const nameStyle = css({
    fontWeight: "bold",
    fontSize: "2.4em",
    textAlign: "center",
    textTransform: "capitalize",
  });

  const nicknameStyle = css({
    fontSize: "1em",
    textAlign: "center",
    marginTop: "8px",
    color: "rgb(150 165 186)",
  });

  const subHeading = css({
    fontWeight: "bold",
    color: "rgb(203 213 225)",
    padding: "0 4px",
    marginBottom: "16px",
  });

  const transition = css({ transition: `0.4s ease` });
  const fadeOutEffect = css({ opacity: 0 });
  const spacingY = css({ "> * + *": { marginTop: "24px" } });

  const handleImageError = (e: any) => {
    e.target.src = staticCDN(pokemon.sprite) || pokemon.sprite;
    e.target.style.width = "100%";
  };

  const handleCatch = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const htmlElement = document.getElementsByTagName("html")[0];
    htmlElement.style.overflowY = "hidden";

    setIsCatching(true);

    setTimeout(() => {
      setShowModal(true);
    }, 1600);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsCatching(false);
  };

  const loadingStyle = css({
    color: "rgb(100 116 139)",
  });

  useEffect(() => {
    return () => {
      const htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.style.overflowY = "scroll";
    };
  }, []);

  return (
    <Container>
      <div css={containerStyle}>
        <img
          src={staticCDN(pokemon.spriteAnimated) || pokemon.spriteAnimated}
          css={[spriteStyle, isCatching && fadeOutEffect]}
          onError={handleImageError}
          width={224}
          height={224}
          alt={`${pokemon.name} sprite`}
          crossOrigin="anonymous"
        />

        <div css={[spacingY, transition, isCatching && fadeOutEffect]}>
          <p css={nameStyle}>{pokemon.name}</p>
          {nickname && <p css={nicknameStyle}>{nickname}</p>}

          <TypeList data={pokemon.types} />
        </div>

        {loading && <p css={loadingStyle}>Loading...</p>}
        {error && <p css={loadingStyle}>Seems something bad happen to the server.</p>}

        {!loading && !nickname && (
          <CatchButton
            handleClick={handleCatch}
            isCatching={isCatching}
            isModalOpen={showModal}
          />
        )}
        {showModal && <CatchModal data={pokemon} closeModal={handleCloseModal} />}

        {!loading && (
          <div css={[spacingY, transition, isCatching && fadeOutEffect]}>
            <div>
              <p css={subHeading}>About</p>
              <PokemonDetailAbout data={pokemon.about} moves={pokemon.moves.length} />
            </div>
            <div>
              <p css={subHeading}>Stats</p>
              <StatList data={pokemon.stats} />
            </div>
            <div>
              <p css={subHeading}>Moves</p>
              <MoveList data={pokemon.moves} />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default PokemonDetail;
