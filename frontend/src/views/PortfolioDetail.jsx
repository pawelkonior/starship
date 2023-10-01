import { Swiper, SwiperSlide, } from "swiper/react"
import { Navigation } from "swiper/modules"
import { useState } from "react";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import "swiper/css/navigation";
import { Container } from "@mui/material";

export default function PortfolioDetail() {
    const { data: { images, title, decription, tags, deploymnetLink } } = usePortfolioDetail();
    const [selectedImage, setSelectedImage] = useState(images ? images[0] : null)

    return (
        <div className="flex items-center justify-center h-full mt-10">
            <div
                className="max-w-[900px] rounded-2xl bg-[#acacac]/[0.2] backdrop-blur-lg px-4 py-3 md:px-10 md:py-8 flex flex-col shadow-[0px_4px_16px_-1px_] grow mx-4">
                <div className="flex items-center justify-center w-full">
                    <a href={deploymnetLink} className="mb-4 text-3xl text-white transition ease-in-out cursor-pointer hover:text-gray-300" target="blank">{title}</a>
                </div>
                <div className="flex justify-center mb-4 gap-x-2">
                    {tags.map((text) => <Tag text={text} key={text} />)}
                </div>
                <p className="mb-12 text-white">{decription}</p>
                <Zoom>
                    <img src={selectedImage} alt="main" className="mb-12 max-h-[300px] w-fit mx-auto" />
                </Zoom>
                <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    slidesPerView={3}
                    spaceBetween={10}
                    className="w-full mb-2">
                    {images.map((image) => {
                        return (
                            <SwiperSlide key={image}>
                                <img
                                    alt="portfolio preview"
                                    src={image}
                                    onClick={() => setSelectedImage(image)}
                                    className="object-cover w-[300px] h-[150px] cursor-pointer" />
                            </ SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    )
}

function Tag({ text }) {
    return <span className="px-2 py-px text-white border border-blue-600 rounded-full transtion">{text}</span>
}

function usePortfolioDetail() {
    return {
        data: {
            images: [
                "https://i.ytimg.com/vi/waS2R3mt-Co/maxresdefault.jpg",
                "https://www.ilovefreesoftware.com/wp-content/uploads/2022/10/Featured-10.jpg",
                "https://d2908q01vomqb2.cloudfront.net/f6e1126cedebf23e1463aee73f9df08783640400/2022/05/09/aws-iot-app-kit-demo-screely.png",
                "https://i.ytimg.com/vi/waS2R3mt-Co/maxresdefault.jpg",
                "https://www.ilovefreesoftware.com/wp-content/uploads/2022/10/Featured-10.jpg",
            ],
            title: "Azeno",
            decription: "Azeno is a revolutionary digital platform designed to transform the way people manage their personal and professional lives. With Azeno, you can seamlessly organize tasks, schedules, and communication all in one place. Whether you're an individual looking to streamline your daily routines or a team aiming to boost productivity, Azeno offers a powerful suite of tools to help you achieve your goals.",
            tags: ["python", "react", "typescript", "tailwindCSS"],
            deploymnetLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
        }
    }
}
