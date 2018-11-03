import React from "react";
import s from "styled-components";
import Select from "react-select";
import { clearFix, placeholder} from "polished";
import gql from "graphql-tag";
import { Icons } from "oce-components/build";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";

export default ({ handleGroup, history, togglePanel, providerImage, providerName }) => (
  <HeaderWrapper>
    <Header>
        <Span onClick={togglePanel}>
          <Icons.Menu width="18" color="#f0f0f0" />
        </Span>
        <SpanInput>
            <AvatarWrapper>
              <Img small src={`${providerImage}`} />
              <AvatarTitle>{providerName}</AvatarTitle>
            </AvatarWrapper>
        </SpanInput>
      </Header>
    <Query
      query={agentRelationships}
      variables={{
        token: localStorage.getItem("oce_token")
      }}
    >
      {({ loading, error, data, refetch, client }) => {
        if (loading) return <LoadingMini />;
        if (error)
          return (
            <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
          );

              let options = data.viewer.myAgent.agentRelationships.map(a => ({
                value: a.object.id,
                label: a.object.name
              }));
              options.unshift({ value: "all", label: "All groups" });
              let defaultValue = history.location.pathname.replace(/\D/g,'')
              let defaultLabel
              if (defaultValue.length > 0){
                defaultLabel = data.viewer.myAgent.agentRelationships.filter(a => a.object.id === defaultValue)
                defaultLabel = defaultLabel[0].object.name
              } else {
                defaultLabel = 'All groups',
                defaultValue= 'all'
              }
              let defaultOption = {
                value: defaultValue,
                label: defaultLabel
              }
        return (
          <GroupSelect
            defaultValue={defaultOption}
            handleGroup={handleGroup}
            options={options}
            client={client}
          />
        );
      }}
    </Query>
  </HeaderWrapper>
);


const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        agentRelationships {
          object {
            id
            name
          }
        }
      }
    }
  }
`;


const Header = s.div`
  height: 36px;
  width: 270px;
  float: left;
  ${clearFix()}
  background: #277BD5;
  border-right: 1px solid #1e68b8;
    box-shadow: 1px 0px 0px rgba(250,250,250,0.1);
`;

const Span = s.div`
  vertical-align: middle;
  cursor: pointer;
  margin-left: 16px;
  float:left;
  margin-top: 5px;
`;

const SpanInput = s.div`
  margin-right: 8px;
  float: left;
`;

const customStyles = {
  control: base => ({
    ...base,
    background: "rgba(250,250,250, .8)",
    border: 'none',
    color: "#3B99FC",
    fontWeight: 500,
    fontSize:'13px',
    minHeight: '30px',
    height: '30px',
    borderRadius: '6px'
  }),
  input: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize:'13px',
    height: '30px'
  }),
  singleValue: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize:'13px'
  }),
  option: base => ({
    ...base,
    fontSize: '13px'
  }),
  menuList: base => ({
    ...base,
    fontSize: '13px'
  }),
  placeholder: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px"
  })
};

const WrapperSelect = s.div`
    float: left;
    margin: 0;
    width: 200px;
    margin-top: 3px;
    margin-left: 8px;
    position: relative;
    z-index: 9999999999999999;
  `;

const HeaderWrapper = s.div`
  height: 36px;
  ${clearFix()}
  background: ${props => props.theme.color.b100};
  `;

const H1 = s.h3`
  float: left;
  line-height: 40px;
  letter-spacing: 1px;
  margin-left 8px;
  margin-right: 8px;
  `;

const GroupSelect = props => {
  
  return (
    <WrapperSelect>
      <Select
        placeholder="Select a group..."
        // value={field.value}
        styles={customStyles}
        defaultValue={props.defaultValue}
        onChange={val => props.handleGroup(val)}
        options={props.options}
      />
    </WrapperSelect>
  );
};