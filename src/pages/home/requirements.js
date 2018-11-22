import React from "react";
import setInbox from "../../mutations/setInbox";
import setCommitted from "../../mutations/setCommitted";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getCommitments from "../../queries/getCommitments";
import { PropsRoute } from "../../helpers/router";
import Todo from "../../components/todo";
import setMatched from "../../mutations/setMatched";

export default props => (
  <Query
    query={getCommitments}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: props.providerId
    }}
  >
    {({ loading, error, data, client, refetch }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      let intents = data.viewer.agent.agentCommitments;
      let filteredIntents = [];
      if (props.event !== "all") {
        filteredIntents = intents.filter(i => i.action === props.event);
      } else {
        filteredIntents = intents;
      }
      // INBOX
      let inbox = filteredIntents.filter(i => !i.isFinished);
      let completed = filteredIntents.filter(i => i.isFinished);
      client.mutate({
        mutation: setInbox,
        variables: { total: filteredIntents.length }
      });
      // COMMITTED
      let allCommittedIntents = filteredIntents.filter(
        int => (int.provider ? int.provider.id === props.providerId : null)
      );
      let committed = allCommittedIntents.filter(i => !i.isFinished);
      let committedCompleted = allCommittedIntents.filter(i => i.isFinished);
      client.mutate({
        mutation: setCommitted,
        variables: { total: allCommittedIntents.length }
      });
      // MATCHED
      let allmatchedIntents = data.viewer.agent.commitmentsMatchingSkills;
      let matched = allmatchedIntents.filter(i => !i.isFinished);
      let matchedCompleted = allmatchedIntents.filter(i => i.isFinished);
      client.mutate({
        mutation: setMatched,
        variables: { total: allmatchedIntents.length }
      });
      return (
        <React.Fragment>
          <PropsRoute
            exact
            component={Todo}
            activeIntents={inbox}
            completed={completed}
            path={props.match.path}
            onToggleSidebar={props.onToggleSidebar}
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerImage={props.providerImage}
            providerName={props.providerName}
            toggleValidationModal={props.toggleValidationModal}
            isCommittedOpen={props.isCommittedOpen}
            handleCommittedOpen={props.handleCommittedOpen}
            isCompletedOpen={props.isCompletedOpen}
            handleCompletedOpen={props.handleCompletedOpen}
          />
          <PropsRoute
            component={Todo}
            exact
            path={"/requirements/committed"}
            activeIntents={committed}
            completed={committedCompleted}
            onToggleSidebar={props.onToggleSidebar}
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerImage={props.providerImage}
            providerName={props.providerName}
            toggleValidationModal={props.toggleValidationModal}
            isCommittedOpen={props.isCommittedOpen}
            handleCommittedOpen={props.handleCommittedOpen}
            isCompletedOpen={props.isCompletedOpen}
            handleCompletedOpen={props.handleCompletedOpen}
          />
          <PropsRoute
            component={Todo}
            exact
            path={"/requirements/matched"}
            activeIntents={matched}
            completed={matchedCompleted}
            onToggleSidebar={props.onToggleSidebar}
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerImage={props.providerImage}
            providerName={props.providerName}
            toggleValidationModal={props.toggleValidationModal}
            isCommittedOpen={props.isCommittedOpen}
            handleCommittedOpen={props.handleCommittedOpen}
            isCompletedOpen={props.isCompletedOpen}
            handleCompletedOpen={props.handleCompletedOpen}
          />
        </React.Fragment>
      );
    }}
  </Query>
);
