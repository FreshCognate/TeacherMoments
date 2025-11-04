import { useLocation, useMatches, useNavigate, useNavigation, useParams, useRevalidator } from "react-router";

const WithRouter = (Component) => {

  const RouterHOC = (props) => {

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const transition = useNavigation();
    const matches = useMatches();
    const revalidator = useRevalidator();

    return (
      <Component
        {...props}
        router={{ navigate, location, params, transition, revalidator, matches }}
      />
    );

  };

  return RouterHOC;

};

export default WithRouter;