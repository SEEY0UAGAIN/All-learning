import { useTitle } from "../hooks/useTitle";

export const Home = () => {
  useTitle("Marvel App 🦸‍♂️");
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 p-4">
      <h1 className="text-white text-3xl font-bold font-mono text-center mb-4">
        Marval App
      </h1>

      <img
        src="https://f.ptcdn.info/022/030/000/1428081747-marvellogo-o.jpg"
        alt="marvel home picture"
        className="md:h-6/12 lg:h-2/4 object-cover rounded my-7 shadow-sm shadow-blue-400"
      />
    </div>
  );
};
export default Home;
