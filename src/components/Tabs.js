import React, { useState } from "react";
import StepperComponent from "./Stepper";
import { ButtonToggle, ButtonGroup } from "reactstrap";
import "./Tabs.css";
import { FaTags, FaBuffer, FaImage } from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import { IoIosFolderOpen } from "react-icons/io";
import { MdChat } from "react-icons/md";

function Tabs(props) {
  let [step, setStep] = useState(0);
  const [buttons, setButtons] = useState([
    {
      title: "Metadados",
      icon: <FaTags className="icon-btn-tab" size={20} />,
      active: true
    },
    {
      title: "Edição",
      icon: <FiScissors className="icon-btn-tab" size={20} />,
      active: false
    },
    {
      title: "Capítulos",
      icon: <FaBuffer className="icon-btn-tab" size={20} />,
      active: false
    },
    {
      title: "Documentos",
      icon: <IoIosFolderOpen className="icon-btn-tab" size={20} />,
      active: false
    },
    {
      title: "Branding",
      icon: <FaImage className="icon-btn-tab" size={20} />,
      active: false
    },
    {
      title: "Legendas",
      icon: <MdChat className="icon-btn-tab" size={20} />,
      active: false
    }
  ]);

  const onButtonClick = element => {
    const index = typeof(element) == 'object'
    ? buttons.findIndex(e => e.title === element.title)
    : element
    const title = buttons[index].title
    console.log(index)
    setStep(index);
    setButtons(
      buttons.map(b =>
        b.title === title
          ? { ...b, active: true }
          : { ...b, active: false }
      )
    );
  };

  return (
    <div className="container">
      <ButtonGroup>
        {buttons.map(element => {
          return (
            <ButtonToggle
              key={element.title}
              active={element.active}
              className="btn-tab"
              onClick={() => onButtonClick(element)}
            >
              {element.icon}
              <span>{element.title}</span>
            </ButtonToggle>
          );
        })}
      </ButtonGroup>
      <StepperComponent step={step} onButtonClick={onButtonClick} />
    </div>
  );
}

export default Tabs;
