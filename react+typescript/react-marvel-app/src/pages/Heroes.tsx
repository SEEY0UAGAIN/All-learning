import { FC } from "react";
import { HeroesList } from "../components/HeroesList";
import { useTitle } from "../hooks/useTitle";

export const Heroes: FC = () => {
  useTitle("Heroes 🥶");
  return <HeroesList />;
};

export default Heroes;
