import styled from 'styled-components';

const Button = styled.button`
	font-size: 1em;
	padding: 0.25em 1em;
	margin: 0.5em;
	border: none;
	background-color: transparent;
	color: #f1f1f1;
	cursor: pointer;
`;

const Title = styled.h1`
	color: #f1f1f1;
	padding: 5px;
	font-weight: 100;
`;

const SubTitle = styled.h3`
	color: #d8d8d8;
	padding: 5px;
	font-weight: 100;
	font-size: medium;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;

const ContainerFluid = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	background-color: #f1f1f1;
	padding: 1%;
`;

const Container = styled.div`
	flex: 1;
	border-width: 0.1em;
	border-color: #f1f1f1;
	border-style: solid;
	background-color: #212556;
	border-radius: 5px;
	padding: 25px;
	margin: 10px;
`;
const Row = styled.div`
	display: flex;
	flex: 1;
	flex-direction: row;
`;

const Column = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 20px;
`;

const Card = styled.div`
	background-color: #212544;
	border-width: 0.03em;
	border-color: #f1f1f1;
	border-style: solid;
	padding: 0.5em;
	border-radius: 2px;
	margin: 5px;
	color: #f1f1f1;
	width: 200px;
`;

const MapDiv = styled.article`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Search = styled.input`
	border: none;
	background-color: #f1f1f1;
	padding: 0.5em;
	width: 100%;
	margin: 5px;
	max-height: 40px;
	height: 40px;
`;

const District = styled.img`
	position: absolute;
`;

export {
	Button,
	Wrapper,
	ContainerFluid,
	Container,
	Row,
	Column,
	Card,
	Title,
	Search,
	District,
	SubTitle,
	MapDiv,
};
