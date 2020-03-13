import React, {useState} from "react";
import Stepper from "react-stepper-horizontal";

function StepperComponent({step, onButtonClick}) {
  const [steps] = useState([{}, {}, {}, {}, {}, {}])

  const nextButtonHandler = () => {
    step = step < steps.length - 1 ? step + 1 : steps.length - 1
    onButtonClick(step)
  };
  
  const previousButtonHandler = () => {
    step = step > 0 ? step - 1 : 0
    onButtonClick(step)
  };

  return (
    <div className="App">
      <div style={{ height: 100, width: 100 }}>
        <Stepper
          steps={steps}
          activeStep={step}
          size={10}
          barStyle="transparent"
          completeColor="#E0E0E0"
          circleFontColor="transparent"
        />
      </div>
      <div>
        <button type="button" onClick={previousButtonHandler}>Previous</button>
        <button type="button" onClick={nextButtonHandler}>Next</button>
      </div>
    </div>
  );
}

export default StepperComponent;
