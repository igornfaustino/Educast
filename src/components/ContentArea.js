import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Chapters from './Chapters/Chapters';
import VideoEditor from './Timeline/VideoEditor';
import Documents from './Documents';
import MetaData from './MetaData';

function RouteContentArea({ timelineProps }) {
	return (
		<Switch>
			<Route
				exact
				path="/editor"
				component={() => <VideoEditor {...timelineProps} />}
			/>
			<Route
				exact
				path="/chapters"
				component={() => <Chapters {...timelineProps} />}
			/>
			<Route exact path="/documents" component={Documents} />
			<Route exact path="/branding" component={() => <div>Branding</div>} />
			<Route exact path="/subtitles" component={() => <div>Legendas</div>} />
			<Route path="*" component={MetaData} />
		</Switch>
	);
}

export default RouteContentArea;
