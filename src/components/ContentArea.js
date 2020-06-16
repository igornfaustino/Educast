import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Documents from './Documents';
import VideoEditor from './Timeline/VideoEditor';
import Branding from './Branding/Branding';

function RouteContentArea({ timelineProps }) {
	return (
		<Switch>
			<Route
				exact
				path="/editor"
				component={() => <VideoEditor {...timelineProps} />}
			/>
			<Route exact path="/chapters" component={() => <div>Capitulos</div>} />
			<Route exact path="/documents" component={Documents} />
			<Route exact path="/branding" component={Branding} />
			<Route exact path="/subtitles" component={() => <div>Legendas</div>} />
			<Route path="*" component={() => <div>metadados</div>} />
		</Switch>
	);
}

export default RouteContentArea;
