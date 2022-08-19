import { v4 as uuid } from "uuid";
import nouns from "./nouns_array";
import adj from "./adj_array";

const genreateUsername = () => {
  let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  let randomAdj = adj[Math.floor(Math.random() * adj.length)];

  return (randomAdj + "_" + randomNoun + "#" + uuid().slice(0, 4)).replace(
    /^\s|\-/g,
    ""
  );
};

export default genreateUsername;
