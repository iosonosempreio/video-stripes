import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Video from "../components/Video";
import { Container, Row, Col, Navbar } from "react-bootstrap";

const mainName = "stressed-out-remixed";

export default function Stripes() {
	const [loading, setLoading] = useState(0);
	const [videos, setVideos] = useState([]);
	useEffect(async () => {
		let hashesMatched = await d3.csv(
			process.env.PUBLIC_URL + `/assets/${mainName}-matched.csv`
		);
		let originalData = await d3.csv(
			process.env.PUBLIC_URL + `/assets/${mainName}-originaldata.csv`
		);
		let posts = originalData.map((d) => {
			const video_url = d.video_url;
			const hash = hashesMatched.find((h) => h.video_url === video_url).hash;
			return { hash: hash, ...d };
		});

		// posts = posts.slice(0, 50);

		const loaded = [];
		for (let i = 0; i < posts.length; i++) {
			setLoading(i);
			const h = posts[i].hash;
			const spritesheet = await d3.json(
				process.env.PUBLIC_URL +
					`/assets/${mainName}-spritesheets-h128/${h}-1.json`
			);
			posts[i] = {
				hash: h,
				postData: posts[i],
				...spritesheet,
			};
			loaded.push(posts[i]);
			await setVideos(loaded);
		}
		setLoading("done");
	}, []);
	return (
		<>
			<Navbar sticky="top" expand="lg" bg="light" variant="light">
				{loading !== "done" && <p>Loading... {videos.length}</p>}
				{loading === "done" && <p>Finishes laoding {videos.length} records.</p>}
			</Navbar>
			<Container fluid>
				<Row>
					<Col>
						<>
							{videos.map((v) => {
								return <Video key={v.hash} data={v} />;
							})}
						</>
					</Col>
				</Row>
			</Container>
		</>
	);
}
