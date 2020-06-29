import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Documents from './Documents';
import VideoEditor from './Timeline/VideoEditor';
import Chapters from './Chapters/Chapters';
import Branding from './Branding/Branding';

function RouteContentArea({ timelineProps }) {
	return (
		<Switch>
			<Route
				exact
				path="/editor"
				component={() => <VideoEditor {...timelineProps} />}
			/>
			<Route exact path="/chapters" component={() => <Chapters {...timelineProps} />} />
			<Route exact path="/documents" component={Documents} />
			<Route
				exact
				path="/branding"
				component={() => <Branding {...timelineProps} />}
			/>
			<Route exact path="/subtitles" component={() => <div>Legendas</div>} />
			<Route path="*" component={() => <div>metadados</div>} />
		</Switch>
	);
}

export default RouteContentArea;
