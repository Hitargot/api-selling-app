import { useParams } from "react-router-dom";
import UserServices from "./UserServices";
import ApiList from "./APIList";

const ServiceDetails = () => {
    const { id } = useParams();
    
    return (
      <div>
        {id.startsWith("user") ? <UserServices serviceId={id} /> : <ApiList serviceId={id} />}
      </div>
    );
  };  

export default ServiceDetails;
