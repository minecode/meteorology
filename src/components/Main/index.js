import React, { useEffect, useState, useRef } from 'react';
import Region from '../Region';
import { useSelector } from 'react-redux';
import {
	Wrapper,
	ContainerFluid,
	Container,
	Row,
	Column,
	Title,
	Search,
	Button,
	SubTitle,
} from '../../style';
import Tooltip from '@material-ui/core/Tooltip';
import Forecast from '../Forecast';
import Map from '../Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMapMarkerAlt,
	faSearch,
	faTemperatureHigh,
	faTemperatureLow,
	faCloudRain,
	faCalendarAlt,
	faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { createSelector } from 'reselect';
import { useDispatch } from 'react-redux';

import { CustomSlider, marks, getNearLocation, getCities } from '../../utils';
import { withStyles } from '@material-ui/core/styles';

import logo from '../../images/logo.svg';

export default function Main(props) {
	const [search, setSearch] = useState('');
	const [coords, setCoords] = useState(null);

	const inputEl = useRef(null);

	const dispatch = useDispatch();

	const nearLocation = useSelector((state) => {
		return state.ipma.nearLocation;
	});

	const forecast = useSelector((state) => {
		return state.ipma.forecast;
	});

	const local = useSelector((state) => {
		return state.ipma.local;
	});

	const index = useSelector((state) => {
		return state.ipma.mapDay;
	});

	const type = useSelector((state) => {
		return state.ipma.typeView;
	});

	const hoverForecast = useSelector((state) => {
		return state.ipma.hoverForecast;
	});

	const selectRegions = createSelector(
		(state) => state.ipma.regions,
		(_, search) => search,
		(regions, search) => {
			let temp = [];
			if (regions) {
				// eslint-disable-next-line
				regions.filter(function (el) {
					if (el.local.toLowerCase().includes(search.toLowerCase())) {
						temp.push(el);
					}
				});
			}
			return temp;
		}
	);

	const HtmlTooltip = withStyles((theme) => ({
		tooltip: {
			backgroundColor: '#f5f5f9',
			color: 'rgba(0, 0, 0, 0.87)',
			maxWidth: 400,
			border: '1px solid #dadde9',
			fontSize: 15,
		},
	}))(Tooltip);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoords(position.coords);
			},
			(err) => {
				setCoords('Blocked');
			}
		);
	}, []);

	useEffect(() => {
		if (coords && dispatch) {
			getNearLocation(dispatch, coords);
		}
	}, [coords, dispatch]);

	useEffect(() => {
		if (nearLocation && dispatch) {
			getCities(dispatch, nearLocation);
		}
	}, [nearLocation, dispatch]);

	const regions = useSelector((state) => selectRegions(state, search));

	return (
		<Wrapper>
			{forecast && (
				<ContainerFluid>
					<Container
						className={'m-0 p-0 mt-30'}
						style={{
							backgroundColor: 'transparent',
						}}
					>
						<Row className={'ai-c jc-c m-0 p-0'}>
							<img src={logo} width='250' alt='logo'></img>
						</Row>
						<Row className={'ai-fe jc-fe m-0 p-0'}>
							<HtmlTooltip
								placement='right'
								title={
									<React.Fragment style={{ fontSize: 20 }}>
										Este website foi desenvolvido no âmbito
										de um exercício com fins de
										recrutamento. Os dados usados podem ser
										acedidos através da{' '}
										<a
											href='https://api.ipma.pt/'
											target='_blank'
											rel='noopener noreferrer'
										>
											{' '}
											API{' '}
										</a>{' '}
										do IPMA.
									</React.Fragment>
								}
							>
								<Button
									style={{
										color: '#212121',
										fontSize: 30,
									}}
								>
									<FontAwesomeIcon icon={faInfoCircle} />
								</Button>
							</HtmlTooltip>
						</Row>
					</Container>
					<Container className={'mt-0'}>
						<Row>
							<Row
								className={'ph-20 m-10 br-25 ai-c jc-sb ta-l'}
								style={{
									backgroundColor: '#f1f1f1',
									width: '100%',
									maxHeight: 40,
									height: 40,
								}}
							>
								<Search
									type='text'
									ref={inputEl}
									name='Search'
									onChange={(event) => {
										setSearch(event.target.value);
									}}
								/>
								<Button
									className={'p-0 m-0'}
									style={{
										backgroundColor: '#f1f1f1',
										color: '#212121',
										border: 'none',
									}}
									onClick={() => {
										setSearch(inputEl.current.value);
									}}
								>
									<FontAwesomeIcon icon={faSearch} />
								</Button>
							</Row>
						</Row>

						<Row className={'ai-fs fw-w'}>
							{regions &&
								regions.map((region, i) => {
									return <Region key={i} region={region} />;
								})}
						</Row>
					</Container>
					<Container>
						<Row className={'jc-c'}>
							{local && (
								<Title>
									<FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
									{local}
								</Title>
							)}
						</Row>
						<Row className={'jc-c mb-20'}>
							<SubTitle>
								Previsões meteorológicas para os próximos 5 dias
							</SubTitle>
						</Row>
						<Row className={'fw-w ai-c jc-c ta-c'}>
							{forecast &&
								forecast.data.map((forecast, j) => {
									return (
										<Forecast
											key={j}
											id={j}
											pointedLocation={forecast}
											style={{
												zIndex:
													hoverForecast === j
														? j + 1
														: 0,
												MsTransform:
													hoverForecast === j
														? 'scale(1.1)'
														: 'scale(1.0)',
												MozTransform:
													hoverForecast === j
														? 'scale(1.1)'
														: 'scale(1.0)',
												transform:
													hoverForecast === j
														? 'scale(1.1)'
														: 'scale(1.0)',
												WebkitTransform:
													hoverForecast === j
														? 'scale(1.1)'
														: 'scale(1.0)',
												OTransform:
													hoverForecast === j
														? 'scale(1.1)'
														: 'scale(1.0)',

												transition: 'all .5s ease',
												WebkitTransition:
													'all .5s ease',
												MozTransition: 'all .5s ease',
												cursor: 'pointer',
											}}
										/>
									);
								})}
						</Row>
					</Container>
					<Container>
						<Row className={'jc-c'}>
							{type && type === 'tMax' && (
								<Title>
									<FontAwesomeIcon
										className={'mr-10'}
										style={{
											fontSize: 25,
										}}
										icon={faTemperatureHigh}
									/>
									Previsões de temperatura máxima para o
									território continental
								</Title>
							)}
							{type && type === 'tMin' && (
								<Title>
									<FontAwesomeIcon
										className={'mr-10'}
										style={{
											fontSize: 25,
										}}
										icon={faTemperatureLow}
									/>
									Previsões de temperatura mínima para o
									território continental
								</Title>
							)}
							{type && type === 'precipit' && (
								<Title>
									<FontAwesomeIcon
										className={'mr-10'}
										style={{
											fontSize: 25,
										}}
										icon={faCloudRain}
									/>
									Previsões de probabilidade de precipitação
									para o território continental
								</Title>
							)}
						</Row>
						<Row className={'mt-30 fw-w'}>
							<Column>
								<Map />
							</Column>
							<Column className={'ai-fs jc-c'}>
								<Row
									className={'ph-20 pv-20 m-10'}
									style={{
										width: '75%',
										flex: 'none',
									}}
								>
									<FontAwesomeIcon
										icon={faCalendarAlt}
										className={'mr-30'}
										style={{
											fontSize: 25,
											color: '#f1f1f1',
										}}
									/>{' '}
									<CustomSlider
										aria-label='pretto slider'
										defaultValue={index + 1}
										aria-labelledby='discrete-slider'
										marks={marks}
										step={1}
										min={1}
										max={5}
										onChange={(event, newValue) => {
											dispatch({
												type: 'SET_MAP_DAY',
												index: newValue - 1,
											});
										}}
									/>
								</Row>

								<Button
									className={'p-10 br-5 flex al-c'}
									style={{
										backgroundColor:
											type === 'tMax'
												? '#212544'
												: '#212552',
										borderWidth: '0.03em',
									}}
									onClick={() => {
										dispatch({
											type: 'SET_TYPE',
											typeView: 'tMax',
										});
									}}
								>
									<FontAwesomeIcon
										className={'mr-10'}
										style={{
											fontSize: 25,
										}}
										icon={faTemperatureHigh}
									/>
									Temperatura máxima
								</Button>
								<Button
									className={'p-10 br-5 flex ai-c'}
									style={{
										backgroundColor:
											type === 'tMin'
												? '#212544'
												: '#212552',
										borderWidth: '0.03em',
									}}
									onClick={() => {
										dispatch({
											type: 'SET_TYPE',
											typeView: 'tMin',
										});
									}}
								>
									<FontAwesomeIcon
										className={'mr-10'}
										style={{
											fontSize: 25,
										}}
										icon={faTemperatureLow}
									/>
									Temperatura mínima
								</Button>
								<Button
									className={'p-10 br-5 flex ai-c'}
									style={{
										backgroundColor:
											type === 'precipit'
												? '#212544'
												: '#212552',
										borderWidth: '0.03em',
									}}
									onClick={() => {
										dispatch({
											type: 'SET_TYPE',
											typeView: 'precipit',
										});
									}}
								>
									<FontAwesomeIcon
										className={'mr-10'}
										style={{
											fontSize: 25,
										}}
										icon={faCloudRain}
									/>
									Probabilidade de precipitação
								</Button>
							</Column>
						</Row>
					</Container>
					<Row className={'jc-fe ph-20'}>
						<h5>
							Created by{' '}
							<a
								href={'https://github.com/fabiohfab'}
								target='_blank'
								rel='noopener noreferrer'
							>
								Fábio Henriques
							</a>
						</h5>
					</Row>
				</ContainerFluid>
			)}
		</Wrapper>
	);
}
