import { useRoute, useLocation } from "wouter";
import { useHeroes } from "../hooks/useHeroes";
import { useTitle } from "../hooks/useTitle";

const HeroesDetail = () => {
  const [, params] = useRoute("/heroes/:heroesName");
  const { getHeroesByName, loading } = useHeroes();
  const [, setLocation] = useLocation();

  const heroesName = params ? decodeURI(params.heroesName) : "Unknown Hero";
  useTitle(`Heroes | ${heroesName}`);

  if (!params) return <p>Hero not found</p>;
  if (loading) return <p>Loading...</p>;

  const hero = getHeroesByName(heroesName);
  if (!hero) return <p>Hero not found</p>;

  const { img, link, biography } = hero;

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-800 text-white">
      <div className="flex flex-col md:flex-col md:gap-4 md:w-[calc(80%+1rem)] lg:w-[calc(70%+1rem)] items-center p-12 border-dashed border-2 rounded-xl">
        <div className="flex flex-col items-cemter w-full">
          <a href={link} target="_Blank">
            <p className="font-mono font-bold text-2xl lg:text-3xl text-center hover:text-gray-300">
              {heroesName}
            </p>
          </a>
          <img
            src={img}
            alt={heroesName}
            className="lg:h-60 md:h-38 w-auto object-contain my-3 "
          />
        </div>
        <p className="font-mono md:text-base lg:text-lg p-3 lg:p-0">
          {biography || "No biography available for this hero."}
        </p>

        <button
          onClick={() => setLocation("/heroes")}
          className="text-black bg-white rounded-md p-3"
        >
          GO BACK!!
        </button>
      </div>
    </div>
  );
};

export default HeroesDetail;
