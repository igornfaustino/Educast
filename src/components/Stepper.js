import React, { useState } from 'react';
import Stepper from 'react-stepper-horizontal';

function StepperComponent({ step }) {
	const [steps] = useState([{}, {}, {}, {}, {}, {}]);

	return (
		<div>
			<span>
				Passo {step + 1} de {steps.length}
			</span>
			<Stepper
				steps={steps}
				activeStep={step}
				size={10}
				barStyle="transparent"
				completeColor="#E0E0E0"
				circleFontColor="transparent"
				circleTop={5}
			/>
		</div>
	);
}

export default StepperComponent;
