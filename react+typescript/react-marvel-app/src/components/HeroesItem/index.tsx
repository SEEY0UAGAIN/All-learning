import { FC } from "react";
import { useLocation } from "wouter";
import type { Heroes } from "../../interfaces";

interface HeroesItemProps {
  heroesProps: Heroes;
}

export const HeroesItem: FC<HeroesItemProps> = ({ heroesProps }) => {
  const { hero, img } = heroesProps;
  const [, setLocation] = useLocation();

  const containerClass =
    "flex items-center gap-3 bg-blue-700 w-40 rounded-md hover:bg-blue-800 cusor-pointer p-3 transition ease-in-out delay-150 hover:translate-y-1 hover:scale-110 duration-300";

  return (
    <div
      className={containerClass}
      onClick={() => setLocation(`/heroes/${hero}`)}
    >
      <img src={img} alt={hero} loading="lazy" className="h-12" />
      <p className="text-gray-100 overflow-hidden whitespace-nowrap text-ellipsis font-mono text-lg"></p>
      {hero}
    </div>
  );
};
