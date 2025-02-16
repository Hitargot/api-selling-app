import { useParams } from "react-router-dom";
import UserServices from "./UserServices";
import ApiList from "./HomeList";

const ServiceDetails = () => {
    const { id } = useParams();

    return (
        <div>
            {/* Render UserServices if the ID corresponds to a user service, otherwise show ApiList */}
            {id ? <UserServices serviceId={id} /> : <ApiList serviceId={id} />}
        </div>
    );
};

export default ServiceDetails;
