import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Video from "../components/Video";
import { Container, Row, Col, Navbar } from "react-bootstrap";

const mainName = "stressed-out-remixed";

export default function Stripes() {
	const [loading, setLoading] = useState(0);
	const [hashes, setHashes] = useState([]);
	useEffect(async () => {
		let hashes = await d3.json(
			process.env.PUBLIC_URL + `/assets/${mainName}-hashes.json`
		);
		hashes = hashes.slice(0, 10);
		const loaded = [];
		for (let i = 0; i < hashes.length; i++) {
			setLoading(i);
			const h = hashes[i];
			const spritesheet = await d3.json(
				`/assets/${mainName}-spritesheets-h128/${h}-1.json`
			);
			hashes[i] = {
				hash: h,
				...spritesheet,
			};
			loaded.push(hashes[i]);
			setHashes(loaded);
		}
		console.log(hashes);
		setLoading("done");
	}, []);
	return (
		<>
			<Navbar sticky="top" expand="lg">
				{loading !== "done" && <p>Loading... {hashes.length}</p>}
				{loading === "done" && <p>Finishes laoding {hashes.length} records.</p>}
			</Navbar>
			<Container>
				<Row>
					<Col>
						{hashes.map((h) => {
							return <Video key={h.hash} data={h} />;
						})}
					</Col>
				</Row>
			</Container>
		</>
	);
}
