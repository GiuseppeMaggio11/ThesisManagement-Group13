import ProfessorActiveProposals from "./ProfessorActiveProposals";
import SearchProposalRoute from "./SearchProposal";
import API from "../API";

function ProposalsPage(props) {
  if (!props.loggedIn || (props.user.user_type !== "PROF" && props.user.user_type !== "STUD"))
    return API.redirectToLogin();

  return (
    props.user.user_type === "PROF" ? (
      <ProfessorActiveProposals
        loading={props.loading}
        virtualClock={props.virtualClock}
        setLoading={props.setLoading}
        loggedIn={props.loggedIn}
        user={props.user}
      /> ) : (
      <SearchProposalRoute
        loading={props.loading}
        setLoading={props.setLoading}
        virtualClock={props.virtualClock}
        loggedIn={props.loggedIn}
        user={props.user}
      />
    )
  );
}

export default ProposalsPage;
