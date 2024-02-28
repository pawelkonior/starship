import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import 'swiper/css';

import useAxios from "../hooks/useAxios";
import RocketCoins from "../components/RocketCoins/RocketCoins.jsx";

export default function Projects() {
    const { data: projects } = useProjects();
    const projectCategories = {
        "Popularne": projects,
        "Ostatnio dodane": projects,
        "Najwyżej oceniane": projects,
    }

    return <div className="flex flex-col gap-y-3  py-4">
        {Object.entries(projectCategories).map(([title, portfolioItems]) => (
            <CardRow key={title} title={title} portfolioItems={portfolioItems} />
        ))}
    </div>
}

function CardRow({ title, portfolioItems }) {

    return (
        <div>
            <h3 className="text-xl text-white mb-3">{title}</h3>
            <Swiper loop modules={[Navigation]} slidesPerView={3} centeredSlides className="w-full">
                {portfolioItems.map(({ id, images, title, description, tags }) => {
                    return (
                        <SwiperSlide key={id}>
                            <Link to={`/portfolio/${id}/`}>
                                <Card images={images} title={title} description={description} tags={tags} />
                            </Link>
                        </ SwiperSlide>
                    )
                })}
            </Swiper>
        </div >
    )
}

function Card({ images, title, description, tags }) {
    return (
        <div className="flex flex-col w-[200px] md:w-[360px] gap-y-2 bg-[#011f26] rounded-lg text-white hover:scale-[102%] transition ease-in-out">
            <img alt="preview" src={images.length ? images[0] : "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"} className="rounded-t-lg max-h-[200px] object-cover" />
            <div className="flex flex-col px-3 py-2 gap-y-2 grow">
                <h4 className="text-lg font-semibold">{title}</h4>
                <p>{description}</p>
                <div className="justify-center hidden pb-2 mt-auto  gap-x-2 md:flex">
                    {tags.map(text => <Tag key={text} text={text} />)}
                </div>
            </div>
        </div>
    )
}

function Tag({ text }) {
    return <span className="px-2 py-0.5 bg-gray-900 border border-blue-600 rounded-full transtion">{text}</span>
}

function useProjects() {
    const axios = useAxios()
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/api/v1/projects/")
            .then(response => {
                const projects = response.data.map(
                    ({ id, name, description, link, pictures }) => ({
                        id: id,
                        title: name,
                        description,
                        link,
                        images: pictures.map(pic => pic.image),
                        tags: ["webflow", "figma"],
                    }))
                setData(projects)
            })
            .catch(e => console.log(e))
    }, [])

    return { data }
}
