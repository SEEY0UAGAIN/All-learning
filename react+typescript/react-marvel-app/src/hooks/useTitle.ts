import {useRef, useEffect} from "react"
export const useTitle = (title: string) => {
    const defauleTitle = useRef<string>(document.title)

    useEffect(() => {
        document.title = title || defauleTitle.current
    }, [title])
}