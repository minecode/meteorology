import React, { useEffect, useState } from 'react';
import { Card, Row, Column } from '../../style';
import WheatherWinDirIcon from '../WheaterWinDirIcon';
import WheatherIcon from '../WheatherIcon';
import { WiStrongWind } from 'weather-icons-react';
import { WiRaindrop } from 'react-icons/wi';
import { useDispatch } from 'react-redux';
import { months, weekDays } from '../../utils';

export default function Forecast(props) {
	const { pointedLocation, style } = props;

	const [weekDay, setWeekDay] = useState(null);
	const [day, setDay] = useState(null);
	const [month, setMonth] = useState(null);

	const dispatch = useDispatch();

	useEffect(() => {
		if (pointedLocation) {
			const temp = new Date(pointedLocation.forecastDate);
			setDay(temp.getDate());
			setMonth(temp.getMonth());
			setWeekDay(weekDays[temp.getDay()]);
		}
	}, [pointedLocation]);

	if (pointedLocation) {
		return (
			<Card
				className={'ta-c p-20'}
				style={{
					...style,
				}}
				onMouseEnter={() => {
					dispatch({
						type: 'SET_HOVER_FORECAST',
						hover: props.id,
					});
				}}
				onMouseLeave={() => {
					dispatch({
						type: 'SET_HOVER_FORECAST',
						hover: null,
					});
				}}
			>
				<Row className={'m-0 p-0 ai-c'}>
					<Column
						className={'m-0 p-10 br-25 jc-c'}
						style={{
							backgroundColor: '#212544',
							height: 50,
						}}
					>
						{weekDay && weekDay} {day && day} de{' '}
						{month && months[month]}
					</Column>
				</Row>
				<Row className={'ai-c jc-sa mt-10'}>
					<Column className={'ai-c p-0'}>
						<WheatherIcon
							wheatherIcon={pointedLocation.idWeatherType}
						/>
					</Column>
				</Row>
				<Row className={'ai-c jc-sa'}>
					<Column className={'ai-c p-0'}>
						<Row
							className={'mt-10 mb-10'}
							style={{
								fontSize: 30,
								fontWeight: 100,
							}}
						>
							{pointedLocation.tMax}º C
						</Row>
						<Row
							className={'mt-10 mb-10'}
							style={{
								fontSize: 20,
								fontWeight: 100,
							}}
						>
							{pointedLocation.tMin}º C
						</Row>
					</Column>
				</Row>
				{!props.sm && (
					<div>
						<Row className={'ai-c jc-sa'}>
							<Column className={'ai-c p-0'}>
								<Row lassName={'ai-c '}>
									<WiStrongWind size={50} />
								</Row>
							</Column>
							<Column className={'ai-c p-0'}>
								<Row lassName={'ai-c '}>
									<WheatherWinDirIcon
										wheatherWinDir={
											pointedLocation.predWindDir
										}
									/>
									({pointedLocation.predWindDir})
								</Row>
							</Column>
						</Row>
						<Row className={'ai-c jc-sa'}>
							<Column className={'ai-c p-0'}>
								<Row lassName={'ai-c '}>
									<WiRaindrop size={65} />
								</Row>
							</Column>
							<Column className={'p-0'}>
								<Row>
									<div
										className={'ta-c'}
										style={{
											width: '100%',
											height: 20,
											borderRadius: 2,
											background: '#f1f1f180',
											color: '#212121',
										}}
									>
										<div
											style={{
												width: `${pointedLocation.precipitaProb}%`,
												height: 20,
												borderRadius: 2,
												background: '#f1f1f1',
												color: '#212121',
											}}
										>
											<div
												className={'pl-10'}
												style={{
													fontSize: 15,
													fontWeight: '100',
												}}
											>
												{pointedLocation.precipitaProb}%
											</div>
										</div>
									</div>
								</Row>
							</Column>
						</Row>
					</div>
				)}
			</Card>
		);
	} else {
		return <div></div>;
	}
}
