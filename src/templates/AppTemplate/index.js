import * as React from "react";
import gql from "graphql-tag";
import { compose, withHandlers, withState } from "recompose";
import styled from "styled-components";
import { LoadingMini, ErrorMini } from "../../components/loading";
import LeftPanel from "../../components/leftPanel/leftPanel";
import SettingModal from "../../pages/settings";
import Header from "./header";
import { Query } from "react-apollo";
import ValidationModal from "../../components/modalValidation";
import NewRequirementModal from "../../components/newRequirementModal";
import Home from "../../pages/home";
import { PropsRoute } from "../../helpers/router";
import Agent from "../../pages/agent/agent";
import { Switch } from "react-router-dom";
import NewProcessModal from '../../components/newProcessModal'
import Process from "../../pages/process";

const Surface = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1010px;
  margin: 0 auto;
  margin-top: 50px;
`;

const Overlay = styled.div`
  position: absolute;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 270px;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const Whole = styled.div`
  
`;

const AppTemplate = props => {
  return (
    <Query
      query={agentRelationships}
      variables={{
        token: localStorage.getItem("oce_token")
      }}
    >
      {({ loading, error, data, refetch, client }) => {
        if (loading) return <LoadingMini />;
        if (error) return (<ErrorMini refetch={refetch} message={`Error! ${error.message}`} />)
        return (
          <Whole>
            <Header 
              history={props.history}
              providerId={data.viewer.myAgent.id}
              providerImage={data.viewer.myAgent.image}
              agents={data.viewer.myAgent.agentRelationships}
            />
          <Surface>
            <Switch>
              <PropsRoute
                handleGroup={props.handleGroup}
                component={Process}
                path={"/process/:id"}
                location={props.location}
                onToggleSidebar={props.onToggleSidebar}
                togglePanel={props.onTogglePanel}
                isSidebarOpen={props.isSidebarOpen}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
              />
              <PropsRoute
                component={Agent}
                location={props.location}
                path="/agent/:id"
                client={client}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
                toggleValidationModal={props.toggleValidationModal}
                isCommittedOpen={props.isCommittedOpen}
                handleCommittedOpen={props.handleCommittedOpen}
                isCompletedOpen={props.isCompletedOpen}
                handleCompletedOpen={props.handleCompletedOpen}
              />
              <PropsRoute
                component={Home}
                path={props.match.path}
                location={props.location}
                client={client}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
                toggleValidationModal={props.toggleValidationModal}
                isCommittedOpen={props.isCommittedOpen}
                handleCommittedOpen={props.handleCommittedOpen}
                isCompletedOpen={props.isCompletedOpen}
                handleCompletedOpen={props.handleCompletedOpen}
              />
            </Switch>
            <LeftPanel
              data={data.viewer.myAgent}
              togglePanel={props.onTogglePanel}
              active={props.isopen}
              toggleSettings={props.onToggleSettings}
            />
            {props.isopen ? <Overlay onClick={props.onTogglePanel} /> : null}
            <SettingModal
              modalIsOpen={props.isSettingsOpen}
              toggleModal={props.onToggleSettings}
              providerId={data.viewer.myAgent.id}
            />

            <ValidationModal
              modalIsOpen={props.validationModalIsOpen}
              toggleModal={props.toggleValidationModal}
              contributionId={props.validationModalId}
              myId={data.viewer.myAgent.id}
            />
            <NewRequirementModal
              modalIsOpen={props.newRequirementModalIsOpen}
              toggleModal={props.togglenewRequirementModal}
            />
            <NewProcessModal
              modalIsOpen={props.newProcessModalIsOpen}
              history={props.history}
              toggleModal={props.togglenewProcessModal}
            />
          </Surface>
          </Whole>
        );
      }}
    </Query>
  );
};

const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        name
        image
        agentRelationships {
          id
          object {
            id
            name
          }
        }
      }
    }
  }
`;

export default compose(
  withState(
    "newRequirementModalIsOpen",
    "togglenewRequirementModalIsOpen",
    false
  ),
  withState(
    "newProcessModalIsOpen",
    "togglenewProcessIsOpen",
    false
  ),
  withState("validationModalIsOpen", "toggleValidationModalIsOpen", false),
  withState("validationModalId", "selectValidationModalId", null),
  withState("group", "onGroup", "all"),
  withState("isopen", "togglePanel", false),
  withState("isSidebarOpen", "toggleSidebar", false),
  withState("isSettingsOpen", "toggleSettings", false),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("intentModal", "selectIntentModal", null),
  withState("isCommittedOpen", "onCommittedOpen", true),
  withState("isCompletedOpen", "onCompletedOpen", false),

  withHandlers({
    handleGroup: props => val => {
      props.onGroup(val.value);
      if (val.value !== "profile") {
        return props.history.push("/agent/" + val.value);
      } else {
        return props.history.push("/");
      }
    },
    handleCommittedOpen: props => () =>
      props.onCommittedOpen(!props.isCommittedOpen),
    handleCompletedOpen: props => () =>
      props.onCompletedOpen(!props.isCompletedOpen),
    toggleIntentModal: props => contributionId => {
      props.selectIntentModal(contributionId);
      props.toggleIntentModalIsOpen(!props.intentModalIsOpen);
    },
    onToggleSettings: props => () => {
      props.toggleSettings(!props.isSettingsOpen);
      if (props.isopen && props.isSidebarOpen) {
        return props.toggleSidebar(!props.isSidebarOpen);
      }
      return null;
    },
    onTogglePanel: props => () => {
      props.togglePanel(!props.isopen);
      if (props.isopen && props.isSidebarOpen) {
        return props.toggleSidebar(!props.isSidebarOpen);
      }
      return null;
    },
    onToggleSidebar: props => () => props.toggleSidebar(!props.isSidebarOpen),
    togglenewRequirementModal: props => () => {
      props.togglenewRequirementModalIsOpen(!props.newRequirementModalIsOpen);
    },
    togglenewProcessModal: props => () => {
      props.togglenewProcessIsOpen(!props.newProcessModalIsOpen);
    },
    toggleValidationModal: props => contributionId => {
      props.selectValidationModalId(contributionId);
      props.toggleValidationModalIsOpen(!props.validationModalIsOpen);
    }
  })
)(AppTemplate);
