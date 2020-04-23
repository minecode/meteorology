import React, { useState, useEffect } from 'react';
import Portugal from './portugal';
import { RadioSVGMap } from 'react-svg-map';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import Forecast from '../Forecast';
import { MapDiv, Column, Row } from '../../style';
import {
	handleChange,
	handleLocationMouseMove,
	handleLocationMouseOut,
	handleLocationMouseOver,
	storeData,
} from '../../utils';

export default function Map() {
	const [tooltipStyle, setToolTipStyle] = useState({ display: 'none' });
	const [pointedLocation, setPointedLocation] = useState(null);
	const [probabPrecipit, setProbabPrecipit] = useState(null);
	const [tempMin, setTempMin] = useState(null);
	const [tempMax, setTempMax] = useState(null);

	const dispatch = useDispatch();

	const index = useSelector((state) => {
		return state.ipma.mapDay;
	});

	const type = useSelector((state) => {
		return state.ipma.typeView;
	});

	useEffect(() => {
		storeData(index, setTempMax, setTempMin, setProbabPrecipit);
	}, [index]);

	return (
		<MapDiv>
			{probabPrecipit && tempMin && tempMax && (
				<Column style={{ alignItems: 'center' }}>
					<div className={'svg__block__map--pt'}>
						<RadioSVGMap
							map={Portugal}
							locationClassName={(el) => {
								if (type === 'precipit') {
									return probabPrecipit[el.name];
								} else if (type === 'tMin') {
									return tempMin[el.name];
								} else {
									return tempMax[el.name];
								}
							}}
							onLocationMouseOver={(event) => {
								handleLocationMouseOver(
									event,
									setPointedLocation,
									dispatch,
									index
								);
							}}
							onLocationMouseOut={() => {
								handleLocationMouseOut(
									setPointedLocation,
									setToolTipStyle
								);
							}}
							onLocationMouseMove={(event) => {
								handleLocationMouseMove(event, setToolTipStyle);
							}}
							onChange={(selectedNode) => {
								handleChange(
									selectedNode,
									setPointedLocation,
									dispatch,
									index
								);
							}}
						/>
						<div
							className='svg__block__map__tooltip'
							style={tooltipStyle}
						>
							{pointedLocation && (
								<Forecast
									pointedLocation={pointedLocation}
									style={{ backgroundColor: '#21255690' }}
									sm
								/>
							)}
						</div>
					</div>
					<div
						className={'br-5 mt-10'}
						style={{
							width: '75%',
							height: 10,
							background:
								type === 'tMax'
									? 'linear-gradient(to right, #f1f1f1, rgb(255, 11, 11), rgb(87, 0, 0))'
									: 'linear-gradient(to right, #f1f1f1, rgb(0, 89, 255), rgb(0, 26, 75))',
						}}
					>
						<Row>
							<Column
								className={'mt-10 p-0 ai-fs'}
								style={{
									color: '#f1f1f1',
								}}
							>
								{type === 'tMax' && '< 5º'}
								{type === 'tMin' && '< -15º'}
								{type === 'precipit' && '< 10%'}
							</Column>
							<Column
								className={'mt-10 p-0 ai-fe'}
								style={{
									color: '#f1f1f1',
								}}
							>
								{type === 'tMax' && '> 35º'}
								{type === 'tMin' && '> 15º'}
								{type === 'precipit' && '100%'}
							</Column>
						</Row>
					</div>
				</Column>
			)}
		</MapDiv>
	);
}
