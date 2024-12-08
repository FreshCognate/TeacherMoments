import { useLocation, useNavigate, useNavigation, useParams, useRevalidator } from "react-router";

const WithRouter = (Component) => {

  const RouterHOC = (props) => {

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const transition = useNavigation();

    const revalidator = useRevalidator();

    return (
      <Component
        {...props}
        router={{ navigate, location, params, transition, revalidator }}
      />
    );

  };

  return RouterHOC;

};

export default WithRouter;