import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Documents from './Documents';
import VideoEditor from './VideoEditor';

function RouteContentArea() {
	return (
		<Switch>
			<Route exact path="/editor" component={VideoEditor} />
			<Route exact path="/chapters" component={() => <div>Capitulos</div>} />
			<Route exact path="/documents" component={Documents} />
			<Route exact path="/branding" component={() => <div>Branding</div>} />
			<Route exact path="/subtitles" component={() => <div>Legendas</div>} />
			<Route path="*" component={() => <div>metadados</div>} />
		</Switch>
	);
}

export default RouteContentArea;
