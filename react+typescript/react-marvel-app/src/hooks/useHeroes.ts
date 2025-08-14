import { useEffect, useState }from "react"
import type { Hero } from "../interfaces";
import data from "../data/heroes.json"

export const useHeroes = () => {
    const [heroes, setHeroes] = useState<Hero[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getHeroesByName = (nameHeroes: string) => {
        return heroes.find(h => h.hero === nameHeroes) ?? ({} as Hero)
    }

    useEffect(() => {
        setTimeout(() => {
            setHeroes(data)
            setLoading(false)
        }, 500)
    }, [])
    return { heroes, loading, getHeroesByName }
}