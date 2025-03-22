
import {  useEffect } from "react";
import NewTrip from "./newTrip";
import { useMapUtils } from "../../context/mapContext";
import { useParams } from "react-router-dom";

const TripOverView: React.FC = () => {

      const { fetchSingleTrip } = useMapUtils();
      const { id } = useParams<{ id: string }>();
        useEffect(() => {
            if(id)
            fetchSingleTrip(parseInt(id));
        }, [id]);
    return (
      <>
        <NewTrip/>
      </>
    );
  };
  
  export default TripOverView;