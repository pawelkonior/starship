import {Link} from "react-router-dom";
import Button from "@mui/material/Button"

import 'swiper/css';

import usePortfolio from "../hooks/usePortfolio";

export default function Portfolio() {
    const {data: portfolios} = usePortfolio();

    return <div className="h-full py-4 overflow-y-scroll gap-y-3">
        <div className="flex items-center justify-between col-span-3 mt-2 mb-4">
            <h2 className="col-span-3 text-3xl text-white">Twoje portfolio</h2>
            <Link to="/portfolio/dodaj/">
                <Button variant="contained">Dodaj</Button>
            </Link>
        </div>
        <div style={{display: 'flex', flexWrap: "wrap", justifyContent: "flex-start", gap: "20px"}} className="mt-5">
            {portfolios.map(({id, image, title, description, tags}) => (
                <Link key={id} to={`/portfolio/${id}/`}>
                    <Card image={"https://i.ytimg.com/vi/waS2R3mt-Co/maxresdefault.jpg"} title={title}
                          description={description} tags={tags}/>
                </Link>
            ))}
        </div>
    </div>
}

function Card({image, title, description, tags}) {
    return (
        <div
            className="flex flex-col w-[200px] md:w-[320px] gap-y-2 bg-[#011f26] rounded-lg text-white hover:scale-[102%] transition ease-in-out">
            <img alt="preview" src={image} className="rounded-t-lg max-h-[200px] object-cover"/>
            <div className="flex flex-col px-3 py-2 gap-y-2 grow">
                <h4 className="text-lg font-semibold">{title}</h4>
                <p>{description}</p>
                <div className="mt-3 mb-3 md:flex gap-2 flex-wrap">
                    {tags.map(text => <Tag key={text} text={text}/>)}
                </div>
            </div>
        </div>
    )
}

function Tag({text}) {
    return <span className="px-2 py-0.5 bg-gray-900 border border-blue-600 rounded-full transtion">{text}</span>
}
