import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Video from "../components/Video";
import {
	Container,
	Row,
	Col,
	Navbar,
	Dropdown,
	ProgressBar,
} from "react-bootstrap";

// const mainName = "stressed-out-original";
const maxAmount = 250;

export default function Stripes() {
	const [dataset, setDataset] = useState("stressed-out-original");
	const [loading, setLoading] = useState(0);
	const [allPosts, setAllPosts] = useState([]);
	const [videos, setVideos] = useState([]);
	const [filter, setFIlter] = useState("most-followed");

	useEffect(async () => {
		let hashesMatched = await d3.csv(
			process.env.PUBLIC_URL + `/assets/${dataset}-matched.csv`
		);
		let originalData = await d3.csv(
			process.env.PUBLIC_URL + `/assets/${dataset}-originaldata.csv`
		);
		let posts = originalData.map((d) => {
			const video_url = d.video_url;
			const match = hashesMatched.find((h) => h.video_url === video_url);
			const hash = match ? match.hash : undefined;
			return { hash: hash, ...d };
		});
		posts = posts.filter((d) => d.hash);
		await setAllPosts(posts);
	}, [dataset]);

	const loadFrames = async (posts) => {
		setLoading("progress");
		const loaded = [];
		for (let i = 0; i < posts.length; i++) {
			setLoading(i);
			const h = posts[i].hash;
			const spritesheet = await d3.json(
				process.env.PUBLIC_URL +
					`/assets/${dataset}-spritesheets-h128/${h}-1.json`
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
	};

	useEffect(() => {
		let filteredPosts;
		switch (filter) {
			case "most-followed":
				filteredPosts = allPosts
					.sort((a, b) => b.author_followers - a.author_followers)
					.slice(0, 250);
				loadFrames(filteredPosts);
				break;
			case "most-reproduced":
				filteredPosts = allPosts
					.sort((a, b) => b.plays - a.plays)
					.slice(0, maxAmount);
				loadFrames(filteredPosts);
				break;
		}
	}, [allPosts, filter]);

	return (
		<>
			<Navbar sticky="top" expand="lg" bg="light" variant="light">
				<Container fluid>
					<div className="d-flex align-items-center">
						Select a dataset
						<Dropdown onSelect={(eventKey, event) => setDataset(eventKey)}>
							<Dropdown.Toggle
								variant="success"
								id="dropdown-basic"
								disabled={loading !== "done"}
							>
								{dataset}
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item eventKey="stressed-out-original">
									Stressed out Original
								</Dropdown.Item>
								<Dropdown.Item eventKey="stressed-out-remixed">
									Stressed out Remixed
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
					<div className="d-flex align-items-center">
						Select a filter
						<Dropdown onSelect={(eventKey, event) => setFIlter(eventKey)}>
							<Dropdown.Toggle
								variant="success"
								id="dropdown-basic"
								disabled={loading !== "done"}
							>
								{filter}
							</Dropdown.Toggle>
	
							<Dropdown.Menu>
								<Dropdown.Item eventKey="most-followed">
									Most followed accounts
								</Dropdown.Item>
								<Dropdown.Item eventKey="most-reproduced">
									Most reproduced videos
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
					<div className="w-25">
						<ProgressBar
							max={maxAmount}
							now={videos.length}
							label={`${videos.length}`}
						/>
					</div>
				</Container>
			</Navbar>
			<Container fluid>
				<Row>
					<>
						{videos.map((v) => {
							return (
								<Col key={v.hash} xs={12} className={"mb-3 "}>
									<Video data={v} />
								</Col>
							);
						})}
					</>
				</Row>
			</Container>
		</>
	);
}
