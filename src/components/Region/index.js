import React, { useState } from 'react';
import { get } from '../../services/api';
import { useDispatch } from 'react-redux';
import { Button } from '../../style';

export default function Region(props) {
	const dispatch = useDispatch();

	function callForecast() {
		get(
			`http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${props.region.globalIdLocal}.json`,
			{}
		)
			.then((data) => {
				dispatch({
					type: 'SET_FORECAST',
					forecast: data,
				});
				dispatch({
					type: 'SET_LOCAL',
					local: props.region.local,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<div>
			<Button onClick={callForecast} style={{ width: '100%' }}>
				{props.region.local}{' '}
			</Button>
		</div>
	);
}
