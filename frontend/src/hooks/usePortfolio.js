import { useEffect } from "react";
import { useAtom } from "jotai"
import useAxios from "./useAxios";
import { portfolioAtom } from "../store";

export default function usePortfolio() {
    const axios = useAxios()
    const [data, setData] = useAtom(portfolioAtom);

    useEffect(() => {
        if (data.length) return
        axios.get("/api/v1/user_portfolio/")
            .then(response => {
                const projects = response.data.projects.map(({ name, description, link, pictures }) => ({
                    id: uuid(),
                    title: name,
                    description,
                    link: link,
                    images: pictures.map(pic => pic.image),
                    tags: ["webflow", "figma"],
                }))
                setData(projects)
            })
            .catch(e => console.log(e))
    }, [])

    return {
        data,
        addItem: (item) => { setData([{ id: uuid(), ...item }, ...data]) }
    }
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}
