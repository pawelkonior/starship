import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export function PresentationInfo({image, title, description, tags}) {

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "20px",
            }}
        >
            <div
                className="flex flex-col w-[600px] md:w-[520px] h-[600px] gap-y-2 bg-[#011f26] rounded-lg text-white hover:scale-[102%] transition ease-in-out">

                <img alt="preview" src={image} className="rounded-t-lg max-h-[200px] w-full object-cover"/>

                <div className="flex flex-col px-3 py-2 gap-y-2 grow">
                    <h4 className="text-lg font-semibold mb-2">{title}</h4>
                    <p className="flex-grow text-sm">{description}</p>
                    <div className="flex mt-2 gap-x-2">
                        {tags.map((tag, index) => <span key={index} className="px-2 py-1 bg-blue-500 rounded-md text-xs">{tag}</span>)}
                    </div>
                    <div className="justify-center hidden pb-2 mt-auto overflow-wrap gap-x-2 md:flex">
                        <Button
                            type={"submit"}
                            variant="contained"
                        >Rozpocznij</Button>
                    </div>
                </div>
            </div>
        </Box>
    )
}}
