import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { get } from '../services/api';

const months = [
	'Janeiro',
	'Fevereio',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
];

const weekDays = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sábado',
];

const locationCodes = {
	Aveiro: 1010500,
	Beja: 1020500,
	Braga: 1030300,
	Bragança: 1040200,
	'Castelo Branco': 1050200,
	Coimbra: 1060300,
	Évora: 1070500,
	Faro: 1080500,
	Guarda: 1090700,
	Leiria: 1100900,
	Lisboa: 1110600,
	Portalegre: 1121400,
	Porto: 1131200,
	Santarém: 1141600,
	Setúbal: 1151200,
	'Viana do Castelo': 1160900,
	'Vila Real': 1171400,
	Viseu: 1182300,
};

function toRad(Value) {
	return (Value * Math.PI) / 180;
}

function calcCrow(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	lat1 = toRad(lat1);
	lat2 = toRad(lat2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) *
			Math.sin(dLon / 2) *
			Math.cos(lat1) *
			Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
}

const CustomSlider = withStyles({
	root: {
		width: '75%',
	},
	markLabel: {
		color: '#a9a9a9',
	},
	markLabelActive: {
		color: '#f1f1f1',
	},
})(Slider);

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

const currentDate = new Date();

const marks = [
	{
		value: 1,
		label:
			currentDate.addDays(0).getDate() +
			' de ' +
			months[currentDate.addDays(0).getMonth()],
	},
	{
		value: 2,
		label:
			currentDate.addDays(1).getDate() +
			' de ' +
			months[currentDate.addDays(1).getMonth()],
	},
	{
		value: 3,
		label:
			currentDate.addDays(2).getDate() +
			' de ' +
			months[currentDate.addDays(2).getMonth()],
	},
	{
		value: 4,
		label:
			currentDate.addDays(3).getDate() +
			' de ' +
			months[currentDate.addDays(3).getMonth()],
	},
	{
		value: 5,
		label:
			currentDate.addDays(4).getDate() +
			' de ' +
			months[currentDate.addDays(4).getMonth()],
	},
];

async function getNearLocation(dispatch, coords) {
	await get('distrits-islands.json', {})
		.then((data) => {
			dispatch({
				type: 'SET_REGIONS',
				regions: data.data,
			});
			if (coords !== 'Blocked') {
				let dist = null;
				let tempLocal = null;
				data.data.map((local) => {
					let temp = calcCrow(
						local.latitude,
						local.longitude,
						coords.latitude,
						coords.longitude
					);
					if (dist === null) {
						dist = temp;
						tempLocal = local;
					} else if (Math.abs(temp) < Math.abs(dist)) {
						dist = temp;
						tempLocal = local;
					}
				});
				dispatch({
					type: 'SET_NEAR_LOCATION',
					nearLocation: tempLocal,
				});
			} else {
				dispatch({
					type: 'SET_NEAR_LOCATION',
					nearLocation: data.data[0],
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

async function getCities(dispatch, nearLocation) {
	await get(
		`http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${nearLocation.globalIdLocal}.json`,
		{}
	)
		.then((data) => {
			dispatch({
				type: 'SET_FORECAST',
				forecast: data,
			});
			dispatch({
				type: 'SET_LOCAL',
				local: nearLocation.local,
			});
		})
		.catch((error) => {
			console.log(error);
		});
}

function getLocationName(event) {
	return event.target.attributes.name.value;
}

async function getLocationInfo(
	pointedLocation,
	setPointedLocation,
	dispatch,
	index,
	updateForecast = false
) {
	await get(
		`http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${locationCodes[pointedLocation]}.json`,
		{}
	)
		.then((data) => {
			setPointedLocation(data.data[index]);
			if (updateForecast) {
				dispatch({
					type: 'SET_FORECAST',
					forecast: data,
				});
				dispatch({
					type: 'SET_LOCAL',
					local: pointedLocation,
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

function handleChange(selectedNode, setPointedLocation, dispatch, index) {
	getLocationInfo(
		selectedNode.attributes.name.value,
		setPointedLocation,
		dispatch,
		index,
		true
	);
}

function handleLocationMouseOver(event, setPointedLocation, dispatch, index) {
	const pointedLocation = getLocationName(event);

	getLocationInfo(pointedLocation, setPointedLocation, dispatch, index);
}

function handleLocationMouseOut(setPointedLocation, setToolTipStyle) {
	setPointedLocation(null);
	setToolTipStyle({ display: 'none' });
}

function handleLocationMouseMove(event, setToolTipStyle) {
	const tooltipStyle = {
		display: 'block',
		top: event.clientY + 20,
		left: event.clientX - 140,
	};
	setToolTipStyle(tooltipStyle);
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function storeData(index, setTempMax, setTempMin, setProbabPrecipit) {
	const tempObjectPrecipit = {};
	const tempObjectMin = {};
	const tempObjectMax = {};
	await asyncForEach(Object.keys(locationCodes), async function (city) {
		const temp = await get(
			`http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${locationCodes[city]}.json`,
			{}
		)
			.then((data) => {
				let precipt_str = '';
				let min_str = '';
				let max_str = '';

				if (parseInt(data.data[index].precipitaProb) < 10) {
					precipt_str = 'svg-map__location svg-map__location--heat0';
				} else if (parseInt(data.data[index].precipitaProb) < 20) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_10';
				} else if (parseInt(data.data[index].precipitaProb) < 30) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_20';
				} else if (parseInt(data.data[index].precipitaProb) < 40) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_30';
				} else if (parseInt(data.data[index].precipitaProb) < 50) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_40';
				} else if (parseInt(data.data[index].precipitaProb) < 60) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_50';
				} else if (parseInt(data.data[index].precipitaProb) < 70) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_60';
				} else if (parseInt(data.data[index].precipitaProb) < 80) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_70';
				} else if (parseInt(data.data[index].precipitaProb) < 90) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_80';
				} else if (parseInt(data.data[index].precipitaProb) < 100) {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_90';
				} else {
					precipt_str =
						'svg-map__location svg-map__location--heat_blue_100';
				}

				if (parseInt(data.data[index].tMin) < -15) {
					min_str = 'svg-map__location svg-map__location--heat0';
				} else if (parseInt(data.data[index].tMin) < -12) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_10';
				} else if (parseInt(data.data[index].tMin) < -8) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_20';
				} else if (parseInt(data.data[index].tMin) < -3) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_30';
				} else if (parseInt(data.data[index].tMin) < 0) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_40';
				} else if (parseInt(data.data[index].tMin) < 3) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_50';
				} else if (parseInt(data.data[index].tMin) < 5) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_60';
				} else if (parseInt(data.data[index].tMin) < 8) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_70';
				} else if (parseInt(data.data[index].tMin) < 12) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_80';
				} else if (parseInt(data.data[index].tMin) < 15) {
					min_str =
						'svg-map__location svg-map__location--heat_blue_90';
				} else {
					min_str =
						'svg-map__location svg-map__location--heat_blue_100';
				}

				if (parseInt(data.data[index].tMax) < 5) {
					max_str = 'svg-map__location svg-map__location--heat0';
				} else if (parseInt(data.data[index].tMax) < 10) {
					max_str =
						'svg-map__location svg-map__location--heat_red_10';
				} else if (parseInt(data.data[index].tMax) < 15) {
					max_str =
						'svg-map__location svg-map__location--heat_red_20';
				} else if (parseInt(data.data[index].tMax) < 20) {
					max_str =
						'svg-map__location svg-map__location--heat_red_30';
				} else if (parseInt(data.data[index].tMax) < 22) {
					max_str =
						'svg-map__location svg-map__location--heat_red_40';
				} else if (parseInt(data.data[index].tMax) < 25) {
					max_str =
						'svg-map__location svg-map__location--heat_red_50';
				} else if (parseInt(data.data[index].tMax) < 28) {
					max_str =
						'svg-map__location svg-map__location--heat_red_60';
				} else if (parseInt(data.data[index].tMax) < 30) {
					max_str =
						'svg-map__location svg-map__location--heat_red_70';
				} else if (parseInt(data.data[index].tMax) < 32) {
					max_str =
						'svg-map__location svg-map__location--heat_red_80';
				} else if (parseInt(data.data[index].tMax) < 35) {
					max_str =
						'svg-map__location svg-map__location--heat_red_90';
				} else {
					max_str =
						'svg-map__location svg-map__location--heat_red_100';
				}

				return [precipt_str, min_str, max_str];
			})
			.catch((error) => {
				return 'svg-map__location svg-map__location--heat0';
			});
		tempObjectPrecipit[city] = temp[0];
		tempObjectMin[city] = temp[1];
		tempObjectMax[city] = temp[2];
	});
	setProbabPrecipit(tempObjectPrecipit);
	setTempMin(tempObjectMin);
	setTempMax(tempObjectMax);
}

export {
	months,
	weekDays,
	locationCodes,
	CustomSlider,
	marks,
	getNearLocation,
	getCities,
	handleChange,
	handleLocationMouseOver,
	handleLocationMouseOut,
	handleLocationMouseMove,
	storeData,
};
