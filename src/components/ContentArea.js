import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Chapters from './Chapters';

function RouteContentArea({ timelineProps }) {
	return (
		<Switch>
			<Route exact path="/editor" component={() => <div>editor</div>} />
			<Route exact path="/chapters" component={() => <Chapters {...timelineProps} />} />
			<Route exact path="/documents" component={() => <div>Documentos</div>} />
			<Route exact path="/branding" component={() => <div>Branding</div>} />
			<Route exact path="/subtitles" component={() => <div>Legendas</div>} />
			<Route path="*" component={() => <div>metadados</div>} />
		</Switch>
	);
}

export default RouteContentArea;
