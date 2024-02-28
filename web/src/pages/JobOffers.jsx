import {useQuery} from "@tanstack/react-query";

import axiosInstance from "../helpers/axiosInstance.js";
import api_routes from "../data/constants/api_routes.js";
import JobCard from "../components/JobCard.jsx";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";


function useJobOffersQuery() {
    return useQuery({
        queryKey: [axiosInstance, api_routes.jobs.all],
        queryFn: async ({queryKey: [axios, url]}) => {
            const response = await axios.get(url)
            return response.data
        }
    })
}

export default function JobOffers() {
    const {data: jobOffers, isLoading} = useJobOffersQuery();

    return <Container sx={{padding: 2, display: "flex", flexDirection: "column", rowGap: 2}}>
        {isLoading ? (
            <div>Loading</div>
        ) : (
            jobOffers.results.map((offer) => (
                <Link key={offer.id} to={`/oferty/${offer.id}`} style={{textDecoration: "none"}}>
                    <JobCard key={offer.id} {...offer}/>
                </Link>
            ))
        )}
    </Container>
}
