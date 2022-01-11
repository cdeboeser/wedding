import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";

import api from "./api";
import "./App.css";

import Button from "./components/Button";
import CheckboxWithText from "./components/CheckboxWithText";
import SelectionItem from "./components/SelectionItem";
import SmallSelectionItem from "./components/SmallSelectionItem";

const CenterWrapper = styled.div`
  width: 100%;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: #44647b;

  @media screen and (min-width: 960px) {
    background-color: #d2dbe2;
    height: 100%;
  }
`;

const ContentWrapper = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #44647b;
  display: flex;
  overflow: hidden;

  & img {
    width: calc(100% - 12px);
    max-width: 480px;
    margin: 16px 6px;
    flex-shrink: 0;
    border-radius: 16px;
  }

  flex-direction: column;

  @media screen and (min-width: 960px) {
    box-shadow: 1px 1px 32px 1px rgba(0, 0, 0, 0.5);
    max-width: 960px;
    flex-direction: row;
    border-radius: 32px;

    & img {
      margin: 0px;
      border-radius: 0px;
    }
  }
`;

const FromWrapper = styled.div`
  position: relative;
  font-family: "Lora", serif;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 12px;

  @media screen and (min-width: 960px) {
    padding: 0 32px;
  }
`;

const Header = styled.h1`
  font-family: "Nicholia", "Lora", serif;
  font-weight: 400;
  font-size: 4rem;
  text-align: center;
  color: #eac160;
  margin: 48px 0 16px 0;
`;

const TextContainer = styled.div`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 48px;
`;

const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 32px;
`;

const AttendeeCheckboxWrapper = styled.div`
  margin-bottom: 24px;

  & > div {
    margin-bottom: 8px;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: auto;
  margin-bottom: 32px;

  & div {
    margin-top: 24px;
  }
`;

const SelectionItemWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

const AttendeeWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  & > div {
    padding: 8px;
  }
`;

const AttendeeDetails = ({
  name,
  checked,
  setChecked,
  selected,
  setSelected,
}) => {
  const getClassName = (value) => {
    if (!selected) return "";
    return selected === value ? "active" : "inactive";
  };

  const choices = ["Chicken", "Fish", "Vegetarian"];

  return (
    <AttendeeWrapper>
      <div>
        <CheckboxWithText
          checked={checked}
          onClick={() => {
            setChecked(!checked);
          }}
        >
          {name} will attend <br />
          <span>and is fully vaccinated</span>
        </CheckboxWithText>
      </div>
      {checked && (
        <div>
          <SelectionItemWrapper>
            {choices.map((choice) => (
              <SmallSelectionItem
                key={choice}
                className={getClassName(choice)}
                onClick={() => setSelected(choice)}
              >
                {choice}
              </SmallSelectionItem>
            ))}
          </SelectionItemWrapper>
        </div>
      )}
    </AttendeeWrapper>
  );
};

const Submitting = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(68, 100, 123, 0.8);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

function Invitation() {
  const { inviteCode } = useParams();

  const [loadingError, setLoadingError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [selection, setSelection] = useState(null);

  const [guest1, setGuest1] = useState({
    name: null,
    attending: true,
    choice: null,
  });

  const [guest2, setGuest2] = useState({
    name: null,
    attending: true,
    choice: null,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .get(`/invites/${inviteCode}`)
      .then((res) => {
        const { id, name, attending, guest1, guest2 } = res.data;

        setId(id);
        setName(name);

        setGuest1({ ...guest1, attending: guest1.attending === "Yes" });
        if (guest2) {
          setGuest2({ ...guest2, attending: guest2.attending === "Yes" });
        }

        if (attending !== "Pending") {
          setSelection(attending === "Yes" ? 1 : 2);
          setSubmitted(true);
        }

        setLoading(false);
      })
      .catch((err) => setLoadingError("Could not load the invite."));
  }, [inviteCode]);

  const validate = () => {
    if (!selection) return false;
    if (selection === 2) return true;
    if (!guest1.attending) return false;
    if (guest1.choice === "Pending") return false;

    if (guest2.name) {
      if (guest2.attending && guest2.choice === "Pending") return false;
    }

    return true;
  };

  const submitResponse = () => {
    if (!validate()) return;

    const submitData = {
      id,
      attending: selection === 1,
      guest1: {
        ...guest1,
        attending: guest1.attending ? "Yes" : "No",
      },
    };

    if (guest2.name) {
      submitData.guest2 = {
        ...guest2,
        attending: guest2.attending ? "Yes" : "No",
      };
    }

    setSubmitting(true);

    api
      .put(`/invites/${inviteCode}`, submitData)
      .then(() => {
        setSubmitting(false);
        setSubmitted(true);
      })
      .catch((err) => console.log(err));
  };

  const getClassName = (id) => {
    if (!id) return "";
    return id === selection ? "active" : "inactive";
  };

  if (loadingError) {
    return (
      <CenterWrapper>
        <div>{loadingError}</div>
      </CenterWrapper>
    );
  }

  if (loading) {
    return (
      <CenterWrapper>
        <div>Loading</div>
      </CenterWrapper>
    );
  }

  return (
    <CenterWrapper>
      <ContentWrapper>
        <img src="invite.jpg" width="480" alt="invite" />
        <FromWrapper>
          {submitting && (
            <Submitting>
              <div>Submitting...</div>
            </Submitting>
          )}
          {submitted ? (
            <>
              <Header style={{ marginBottom: 32 }}>Thank you!</Header>
              {selection === 1 ? (
                <>
                  <TextContainer>
                    We are excited you will celebrate this exciting day with us!
                  </TextContainer>
                  <TextContainer style={{ fontSize: "1rem", opacity: 0.7 }}>
                    Please remember to dress <b>smart casual</b>
                    <br /> in shades of <b>cream and blue</b>.
                  </TextContainer>
                </>
              ) : (
                <TextContainer>
                  We are sorry to hear that you won't make it.
                  <br />
                  <br /> Of course, we will miss you during the celebration, but
                  we'll keep you in our hearts!
                </TextContainer>
              )}
              <ButtonWrapper>
                <Button onClick={() => setSubmitted(false)}>
                  Edit Response
                </Button>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <Header>Dear {name}</Header>
              <TextContainer>
                Kindly respond until 02 February 2022
              </TextContainer>
              <SelectionWrapper>
                <SelectionItem
                  onClick={() => setSelection(1)}
                  className={getClassName(1)}
                >
                  Accept <br />
                  with Pleasure
                </SelectionItem>
                <SelectionItem
                  onClick={() => setSelection(2)}
                  className={getClassName(2)}
                >
                  Decline <br />
                  with Regret
                </SelectionItem>
              </SelectionWrapper>
              {selection === 1 && (
                <>
                  <AttendeeCheckboxWrapper>
                    <AttendeeDetails
                      name={guest1.name}
                      checked={guest1.attending}
                      setChecked={(newValue) =>
                        setGuest1({ ...guest1, attending: newValue })
                      }
                      selected={guest1.choice}
                      setSelected={(newValue) =>
                        setGuest1({ ...guest1, choice: newValue })
                      }
                    />
                    {guest2.name && (
                      <AttendeeDetails
                        name={guest2.name}
                        checked={guest2.attending}
                        setChecked={(newValue) =>
                          setGuest2({ ...guest2, attending: newValue })
                        }
                        selected={guest2.choice}
                        setSelected={(newValue) =>
                          setGuest2({ ...guest2, choice: newValue })
                        }
                      />
                    )}
                  </AttendeeCheckboxWrapper>
                </>
              )}
              <ButtonWrapper>
                <Button disabled={!validate()} onClick={submitResponse}>
                  Send Response
                </Button>
              </ButtonWrapper>
            </>
          )}
        </FromWrapper>
      </ContentWrapper>
    </CenterWrapper>
  );
}

export default Invitation;
