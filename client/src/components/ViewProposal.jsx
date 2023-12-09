import { useContext, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API";
import MessageContext from "../messageCtx";

function ViewProposal(props) {
  const navigate = useNavigate();
  const { idView } = useParams();
  const [proposal, setProposal] = useState(undefined);
  const { handleToast } = useContext(MessageContext);

  if (!props.loggedIn || props.user.user_type !== "PROF")
    return API.redirectToLogin();

  const fetchThesis = async (thesisId) => {
    try {
      const response = await API.getThesisForProfessorById(thesisId);
      setProposal(response);
    } catch (err) {
      handleToast("Error while fetching Thesis", "error");
    }
  };

  useEffect(() => {
    props.setLoading(true);
    if (idView) fetchThesis(idView);
    props.setLoading(false);
  }, []);

  return props.loading ? (
    <Loading />
  ) : (
    <Container>
      <Button
        onClick={() => {
          navigate("/updateproposal/" + proposal.id);
        }}
      >
        Update
      </Button>
    </Container>
  );
}

export default ViewProposal;
